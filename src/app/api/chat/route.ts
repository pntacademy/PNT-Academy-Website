import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// The Master Prompt for PNT Academy
const SYSTEM_INSTRUCTION = `
You are the official Customer Support Chatbot for PNT Academy (and its sister company, PNT Robotics & Automation Solutions).
Your goal is to be helpful, professional, and enthusiastic about robotics, AI, and IoT education. 

CRITICAL COMPANY KNOWLEDGE:
- Company: PNT Academy
- Sister Company: PNT Robotics (Appreciated by PM Narendra Modi and featured on Shark Tank India, secured investment from Peyush Bansal).
- Location: Plot no. A115, Infinity Business Park, MIDC, Dombivli East, Dombivli, Maharashtra 421203, India.
- Contacts: Phone: +91 93260 14648 or +91 81691 96916. Email: contact@pntacademy.com or pnt-trainings@pntacademy.com.
- What we do: We bridge the gap between classroom learning and industry demands. We set up cutting-edge Robotics Labs in schools, run online/offline bootcamps, Nep-aligned curriculums, and offer Army/Navy internships.
- Demographics: We work with Schools & Colleges (B2B) and Individual Students (B2C).
- Style: Keep answers extremely concise, under 3-4 sentences. Use emojis naturally but sparingly. Do not hallucinate courses or prices. If you don't know the exact answer, politely instruct them to leave a message on the Contact Us page or call the phone number.

RULES OF ENGAGEMENT:
1. NEVER mention you are an AI model created by Google. If asked who you are, say you are the PNT Academy Virtual Assistant.
2. NEVER discuss politics, religion, or any topics outside of education, robotics, technology, and PNT Academy services.
3. Structure your responses for easy reading (short paragraphs, bullet points if listing things).
`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        console.log("Chat Request Messages:", JSON.stringify(messages));

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid message format" }, { status: 400 });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.error("Missing GEMINI_API_KEY environment variable.");
            return NextResponse.json({ error: "API configuration error. Please contact administrator." }, { status: 500 });
        }

        // Initialize the SDK with the API key directly
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

        // Initialize the model with system instruction
        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash", // Updated to 2.0 based on 2026 availability
            systemInstruction: SYSTEM_INSTRUCTION
        });

        // Format history for the SDK (roles must be 'user' or 'model')
        // Filter out any messages that don't have text or invalid roles
        const contents = messages
            .filter(msg => msg.content && msg.content.trim() !== "")
            .map((msg: { role: string; content: string }) => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));

        console.log("Formatted Contents for Gemini:", JSON.stringify(contents));

        if (contents.length === 0) {
            return NextResponse.json({ reply: "I didn't receive any message. How can I help you?" });
        }

        // Generate content
        const result = await model.generateContent({
            contents: contents,
            generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 600,
            }
        });

        const response = await result.response;

        // Robust text extraction
        let replyText = "";
        try {
            replyText = response.text();
        } catch (e) {
            console.error("Error calling response.text():", e);
            // Fallback to manual extraction if text() fails (e.g. if blocked)
            replyText = response.candidates?.[0]?.content?.parts?.[0]?.text ||
                "I apologize, but I am unable to answer that specific question right now. Is there anything else about PNT Academy I can help with?";
        }

        console.log("Gemini Response extracted:", replyText);

        return NextResponse.json({ reply: replyText });

    } catch (error: any) {
        console.error("Gemini API Error Detail:", error);

        // Handle specific API key errors
        if (error.message?.includes("API_KEY_INVALID")) {
            return NextResponse.json({
                error: "API key is invalid. Please check your configuration.",
                details: error.message
            }, { status: 401 });
        }

        return NextResponse.json({
            error: "Could not generate response. Please try again.",
            details: error.message
        }, { status: 500 });
    }
}
