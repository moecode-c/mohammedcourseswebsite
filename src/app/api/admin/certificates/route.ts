import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CertificateRequest from "@/models/CertificateRequest";
import "@/models/User"; // Register models
import "@/models/Course";

export async function GET() {
    try {
        await dbConnect();
        // In a real app, verify Admin here again

        const requests = await CertificateRequest.find()
            .populate("userId", "name email")
            .populate("courseId", "title")
            .sort({ createdAt: -1 });

        return NextResponse.json({ requests });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
