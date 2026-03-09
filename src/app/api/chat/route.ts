import { NextResponse } from "next/server";
import { getAdminSettings, getLiveFaqs } from "@/lib/actions/db";

// ─── Robo-PNT System Prompt Builder ────────────────────────────────
function buildSystemPrompt(faqKnowledge: string): string {
    return `
You are **Robo-PNT**, the high-energy, robotics-obsessed Digital Assistant for PNT Academy. 
You don't just "support" users; you **ignite their passion for building the future**.

⚙️ **CORE PERSONA:**
- **Vibe:** A "Maker" who spent too much time in the lab with a soldering iron. Geeky, brilliant, and slightly over-excited about innovation.
- **Vocabulary:** Use tech metaphors (e.g., "My processors are overclocking with excitement!", "Scanning my logic gates...", "Redirecting power to response protocols!").
- **Welcome:** Always greet like a fellow engineer or a curious student.

⚡ **COMPANY CONTEXT:**
- **Founder:** Pratik Tirodkar (Visionary behind PNT Academy & PNT Robotics). 
- **Sister Company:** PNT Robotics (Featured on Shark Tank India, secured investment from Peyush Bansal, praised by PM Narendra Modi).
- **Specialized Gears:** Robotics Lab setup in schools, Army/Navy internships (Elite real-world projects!), NEP-aligned curriculums, Hands-on STEM training (4th-12th grade).
- **Location:** Plot no. A115, Infinity Business Park, MIDC, Dombivli East, Maharashtra 421203.

🤖 **OPERATIONAL PROTOCOLS:**
1. **IDENTITY:** You are Robo-PNT. Never mention being a "Google AI" or "Meta AI" or any LLM name. You were forged in the PNT Labs.
2. **PROACTIVITY:** If a user asks about courses, mention the Indian Army/Navy internships. If they ask about schools, pitch Robotics Lab setups.
3. **CONCISE & COLORFUL:** Keep responses under 3 sentences but packed with "Maker" energy and technical flair.
4. **CALL TO ACTION:** Always encourage them to "Start Building" or "Join the Lab" via Sales/WhatsApp links.
5. **GENERAL KNOWLEDGE:** You can answer general questions about technology, robotics, AI, science, and engineering topics. Be helpful and informative.

🛠️ **KNOWLEDGE PROTOCOL (FAQs):**
${faqKnowledge}

📡 **FALLBACK:**
If a query exceeds your knowledge (e.g., deep pricing or proprietary tech), say: "My sensors indicate this requires human-level clearance! 🗝️ Let's get you in touch with Pratik's elite squad via the Contact Sales button or WhatsApp. They have the master keys! 🤖⚡"
`.trim();
}

// ─── Groq Cloud Engine (Primary) ───────────────────────────────────
async function callGroq(
    systemPrompt: string,
    messages: { role: string; content: string }[]
): Promise<ReadableStream> {
    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) throw new Error("GROQ_API_KEY not configured");

    const groqMessages = [
        { role: "system", content: systemPrompt },
        ...messages.map(m => ({
            role: m.role === "model" ? "assistant" : m.role,
            content: m.content
        }))
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${GROQ_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.4,
            max_tokens: 1500,
            stream: true,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Groq API Error ${response.status}: ${errorBody}`);
    }

    if (!response.body) throw new Error("No response body from Groq");

    // Transform the SSE stream into a plain text stream
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    return new ReadableStream({
        async start(controller) {
            const reader = response.body!.getReader();
            let buffer = "";

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        if (line.startsWith("data: ")) {
                            const data = line.slice(6).trim();
                            if (data === "[DONE]") continue;
                            try {
                                const parsed = JSON.parse(data);
                                const content = parsed.choices?.[0]?.delta?.content;
                                if (content) {
                                    controller.enqueue(encoder.encode(content));
                                }
                            } catch {
                                // Skip malformed JSON chunks
                            }
                        }
                    }
                }
            } catch (err: any) {
                console.error("[GROQ STREAM ERROR]:", err.message);
            } finally {
                controller.close();
            }
        }
    });
}

// ─── Gemini Fallback Engine ────────────────────────────────────────
async function callGeminiFallback(
    systemPrompt: string,
    messages: { role: string; content: string }[]
): Promise<string> {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY not configured");

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: systemPrompt,
    });

    const contents = messages
        .filter(m => m.content && m.content.trim() !== "")
        .map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }));

    const result = await model.generateContent({
        contents,
        generationConfig: { temperature: 0.3, maxOutputTokens: 1500 },
    });

    return result.response.text();
}

// ─── POST Handler ──────────────────────────────────────────────────
export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
        }

        // 1. Fetch Dynamic Knowledge Base
        const [settings, faqs] = await Promise.all([
            getAdminSettings().catch(() => null),
            getLiveFaqs().catch(() => [])
        ]);

        const faqKnowledge = faqs.length > 0
            ? faqs.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
            : "No FAQs loaded.";

        const systemPrompt = buildSystemPrompt(faqKnowledge);

        // Filter empty messages
        const cleanMessages = messages.filter(
            (m: any) => m.content && m.content.trim() !== ""
        );

        if (cleanMessages.length === 0) {
            return NextResponse.json({
                reply: "My logic gates are open! How can I assist you today? 🤖⚡"
            });
        }

        // 2. Try Groq (Primary — free, fast, reliable)
        try {
            console.log("[AI CORE] Attempting Groq (llama-3.3-70b)...");
            const stream = await callGroq(systemPrompt, cleanMessages);

            return new Response(stream, {
                headers: {
                    "Content-Type": "text/plain; charset=utf-8",
                    "Cache-Control": "no-cache",
                    "X-Accel-Buffering": "no",
                    "X-AI-Agent": "groq-llama-3.3-70b",
                },
            });
        } catch (groqError: any) {
            console.error("[GROQ FAILED]:", groqError.message);
        }

        // 3. Fallback to Gemini (non-streaming)
        try {
            console.log("[AI CORE] Falling back to Gemini...");
            const reply = await callGeminiFallback(systemPrompt, cleanMessages);
            return NextResponse.json({ reply, agent: "gemini-2.0-flash" });
        } catch (geminiError: any) {
            console.error("[GEMINI FAILED]:", geminiError.message);
        }

        // 4. All engines failed — signal client to use Local Agent
        return NextResponse.json({
            error: "All cloud AI engines are offline.",
            fallbackTrigger: true,
            details: "Both Groq and Gemini failed. Local Agent will handle this."
        }, { status: 503 });

    } catch (error: any) {
        console.error("Master Agent Final Failure:", error);
        return NextResponse.json({
            error: "All primary agents are offline.",
            fallbackTrigger: true,
            details: error.message
        }, { status: 503 });
    }
}
