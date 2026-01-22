import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function POST(req: Request) {
    try {
        const { name, email, message, source } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await dbConnect();

        const created = await ContactMessage.create({
            name: String(name).trim(),
            email: String(email).trim(),
            message: String(message).trim(),
            source: source ? String(source).trim() : "tutorial",
        });

        return NextResponse.json({ success: true, message: created });
    } catch (error) {
        console.error("Message Create Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
