import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AccessRequest from "@/models/AccessRequest";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import User from "@/models/User"; // Ensure populated
import Course from "@/models/Course"; // Ensure populated

export async function GET(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await dbConnect();

        const requests = await AccessRequest.find({ status: "pending" })
            .populate("userId", "name email")
            .populate("courseId", "title price")
            .sort({ createdAt: 1 });

        return NextResponse.json({ requests });
    } catch (error) {
        console.error("Admin Requests List Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
