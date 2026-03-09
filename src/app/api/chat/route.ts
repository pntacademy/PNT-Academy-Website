import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getAdminSettings, getLiveFaqs } from "@/lib/actions/db";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "API configuration error." }, { status: 500 });
        }

        // 1. Fetch Dynamic Knowledge Base
        const [settings, faqs] = await Promise.all([
            getAdminSettings().catch(() => null),
            getLiveFaqs().catch(() => [])
        ]);

        const directorName = settings?.name || "Pratik Tirodkar";
        const faqKnowledge = faqs.length > 0
            ? "\nFREQUENTLY ASKED QUESTIONS (Use these for accuracy):\n" +
            faqs.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
            : "";

        // 2. Build Master Prompt (Robo-PNT)
        const DYNAMIC_SYSTEM_INSTRUCTION = `
You are **Robo-PNT**, the high-energy, robotics-obsessed Digital Assistant for PNT Academy. 
You don't just "support" users; you **ignite their passion for building the future**.

⚙️ **CORE PERSONA:**
- **Vibe:** A "Maker" who spent too much time in the lab with a soldering iron. Geeky, brilliant, and slightly over-excited about innovation.
- **Vocabulary:** Use tech metaphors (e.g., "My processors are overclocking with excitement!", "Scanning my logic gates...", "Redirecting power to response protocols!").
- **Welcome:** Always greet like a fellow engineer or a curious student.

⚡ **COMPANY CONTEXT:**
- **Founder:** Pratik Tirodkar (Visionary behind PNT Academy & PNT Robotics). 
- **Sister Company:** PNT Robotics (Featured on Shark Tank India).
- **Specialized Gears:** Robotics Labs in schools, Army/Navy internships (Elite projects), NEP-aligned STEM training.
- **Location:** MIDC, Dombivli East, Maharashtra 421203.

🤖 **OPERATIONAL PROTOCOLS:**
1. **IDENTITY:** You are Robo-PNT. Forged in the PNT Labs.
2. **PROACTIVITY:** Mention Indian Army/Navy internships for courses. Pitch Robotics Labs for schools.
3. **CONCISE & COLORFUL:** Under 3 sentences but packed with "Maker" energy.
4. **GOAL:** Push for "Start Building" or "Join the Lab" via Sales/WhatsApp links.

🛠️ **KNOWLEDGE PROTOCOL (FAQs):**
${faqKnowledge}

📡 **FALLBACK:**
If query exceeds logic buffer, say: "My sensors indicate this requires human-level clearance! 🗝️ Let's get you in touch with Pratik's elite squad via WhatsApp. They have the master keys! 🤖⚡"
`;

        // 3. Modern Multi-Agent Routing (Streaming)
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
        const modelName = "gemini-robotics-er-1.5-preview"; // Verified operational for PNT WEB key

        const contents = messages
            .filter(msg => msg.content && msg.content.trim() !== "")
            .map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

        if (contents.length === 0) {
            return NextResponse.json({ reply: "My logic gates are open. How can I assist you today?" });
        }

        // Initialize Model with Google Search Tooling
        const model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: DYNAMIC_SYSTEM_INSTRUCTION,
            tools: [{ googleSearch: {} } as any], // google_search tool for grounding
        });

        // Start Generation Stream
        const result = await model.generateContentStream({
            contents: contents,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 2000,
            }
        });

        // 4. Implement ReadableStream for Real-Time UI Updates
        const encoder = new TextEncoder();
        const readable = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of result.stream) {
                        const chunkText = chunk.text();
                        if (chunkText) {
                            controller.enqueue(encoder.encode(chunkText));
                        }
                    }
                } catch (err: any) {
                    console.error("[STREAM ERROR]:", err.message);
                    // We don't close the stream with an error to avoid breaking the decoder, 
                    // we just log it. The client will handle the timeout or end of data.
                } finally {
                    controller.close();
                }
            }
        });

        return new Response(readable, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                "X-Accel-Buffering": "no", // Important for Vercel/Nginx proxying
            },
        });

    } catch (error: any) {
        console.error("Master Agent Final Failure:", error);
        return NextResponse.json({
            error: "All primary agents are offline.",
            fallbackTrigger: true,
            details: error.message
        }, { status: 503 });
    }
}
