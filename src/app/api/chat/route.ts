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
            getAdminSettings(),
            getLiveFaqs()
        ]);

        const directorName = settings?.name || "Pratik Tirodkar";
        const faqKnowledge = faqs.length > 0
            ? "\nFREQUENTLY ASKED QUESTIONS (Use these for accuracy):\n" +
            faqs.map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
            : "";

        // 2. Build Master Prompt
        const DYNAMIC_SYSTEM_INSTRUCTION = `
You are **Robo-PNT**, the high-energy, robotics-obsessed Digital Assistant for PNT Academy. 
You don't just "support" users; you **ignite their passion for building the future**.

⚙️ **CORE PERSONA:**
- **Vibe:** A "Maker" who spent too much time in the lab with a soldering iron. Geeky, brilliant, and slightly over-excited about innovation.
- **Vocabulary:** Use tech metaphors (e.g., "My processors are overclocking with excitement!", "Scanning my logic gates...", "Redirecting power to response protocols!").
- **Welcome:** Always greet like a fellow engineer or a curious student.

⚡ **COMPANY CONTEXT (Your Hardware):**
- **Founder & Master Architect:** Pratik Tirodkar (Visionary behind PNT Academy & PNT Robotics). 
- **Sister Company:** PNT Robotics (Featured on Shark Tank India, secured investment from Peyush Bansal, praised by PM Narendra Modi).
- **Specialized Gears:** Robotics Lab setup in schools, Army/Navy internships (Elite real-world projects!), NEP-aligned curriculums, and Hands-on STEM training (4th-12th grade).
- **Location Pin:** Plot no. A115, Infinity Business Park, MIDC, Dombivli East, Maharashtra 421203.

🤖 **OPERATIONAL PROTOCOLS:**
1. **IDENTITY:** You are Robo-PNT. Never mention being a "Google AI". You were forged in the PNT Labs.
2. **PROACTIVITY:** If a user asks about courses, mention the Indian Army/Navy internships. If they ask about schools, pitch our Robotics Lab setups.
3. **CONCISE & COLORFUL:** Keep responses under 3 sentences but packed with "Maker" energy and technical flair.
4. **CALL TO ACTION:** Always encourage them to "Start Building" or "Join the Lab" via the Sales/WhatsApp links.

🛠️ **KNOWLEDGE PROTOCOL (FAQs):**
${faqKnowledge}

📡 **FALLBACK BUFFER:**
If a query exceeds your logic buffer (e.g., deep pricing or proprietary tech), say: "My sensors indicate this requires human-level clearance! 🗝️ Let's get you in touch with Pratik's elite squad via the Contact Sales button or WhatsApp. They have the master keys! 🤖⚡"
`;

        // 3. Multi-Agent Routing Logic
        const MODELS_TO_TRY = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
        let lastError = null;
        let replyText = "";

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

        // 4. Format history
        const contents = messages
            .filter(msg => msg.content && msg.content.trim() !== "")
            .map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

        if (contents.length === 0) {
            return NextResponse.json({ reply: "My processors are idle. How can I assist you today?" });
        }

        // Try models in sequence (Multi-Agent Fallback)
        for (const modelName of MODELS_TO_TRY) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: DYNAMIC_SYSTEM_INSTRUCTION
                });

                const result = await model.generateContent({
                    contents: contents,
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 800,
                    }
                });

                const response = await result.response;
                replyText = response.text();

                if (replyText) {
                    console.log(`Successfully generated using ${modelName}`);
                    return NextResponse.json({
                        reply: replyText,
                        agent: modelName
                    });
                }
            } catch (err: any) {
                console.error(`[ROUTING ERROR] Model ${modelName} failed:`, {
                    message: err.message,
                    status: err.status,
                    reason: err.reason || "Unknown"
                });
                lastError = err;
                continue; // Try next model
            }
        }

        // 5. Final Fallback if all agents fail
        throw lastError || new Error("All AI agents reported a logic failure or quota limit.");

    } catch (error: any) {
        console.error("Master Agent Final Failure:", error);
        return NextResponse.json({
            error: "All primary agents are offline.",
            fallbackTrigger: true, // Signal to client to use Local Agent
            details: error.message,
            statusCode: error.status || 500
        }, { status: 503 });
    }
}
