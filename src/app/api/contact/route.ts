import { NextResponse } from "next/server";
import connectMongo from "@/lib/mongodb";
import Enquiry from "@/lib/models/Enquiry";

export async function POST(req: Request) {
    try {
        await connectMongo();
        const { name, email, phone, subject, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
        }

        await Enquiry.create({ name, email, phone, subject, message });
        return NextResponse.json({ success: true }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Failed to send enquiry." }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectMongo();
        const items = await Enquiry.find({}).sort({ createdAt: -1 }).lean();
        return NextResponse.json(JSON.parse(JSON.stringify(items)));
    } catch {
        return NextResponse.json({ error: "Failed to fetch enquiries." }, { status: 500 });
    }
}
