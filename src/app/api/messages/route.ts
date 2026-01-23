import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ContactMessage from "@/models/ContactMessage";

export async function POST(req: Request) {
    try {
        const { name, phone, message, source } = await req.json();

        if (!name || !phone || !message) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        await dbConnect();

        const created = await ContactMessage.create({
            name: String(name).trim(),
            phone: String(phone).trim(),
            message: String(message).trim(),
            source: source ? String(source).trim() : "tutorial",
        });

        return NextResponse.json({ success: true, message: created });
    } catch (error: any) {
        console.error("Message Create Error details:", {
            message: error.message,
            stack: error.stack,
            errors: error.errors
        });
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
