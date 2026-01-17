import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Section from "@/models/Section";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid Course ID" }, { status: 400 });
        }

        const body = await req.json();
        const { title, content, type, videoUrl, linkUrl, isFree, order } = body;

        if (!title) {
            return NextResponse.json({ error: "Title is required" }, { status: 400 });
        }

        // Validation based on type
        if (type === "text" && !content) return NextResponse.json({ error: "Content required for text" }, { status: 400 });
        if (type === "video" && !videoUrl) return NextResponse.json({ error: "Video URL required" }, { status: 400 });
        if (type === "link" && !linkUrl) return NextResponse.json({ error: "Link URL required" }, { status: 400 });

        await dbConnect();

        // Create Section
        const section = await Section.create({
            courseId: id,
            title,
            content: content || "",
            type: type || "text",
            videoUrl,
            linkUrl,
            isFree: isFree || false,
            order: order || 1, // Default order, ideally should fetch max order + 1
        });

        // Add to Course
        await Course.findByIdAndUpdate(id, {
            $push: { sections: section._id }
        });

        return NextResponse.json({ success: true, section });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
