import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import Section from "@/models/Section";
import Course from "@/models/Course";
import { verifyToken } from "@/lib/auth";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        // 1. Verify Admin
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = verifyToken(token);
        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 2. Update Section
        const updatedSection = await Section.findByIdAndUpdate(id, body, { new: true });

        if (!updatedSection) {
            return NextResponse.json({ error: "Section not found" }, { status: 404 });
        }

        return NextResponse.json({ section: updatedSection });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        // 1. Verify Admin
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const payload = verifyToken(token);
        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // 2. Remove Section
        const deletedSection = await Section.findByIdAndDelete(id);
        if (!deletedSection) return NextResponse.json({ error: "Section not found" }, { status: 404 });

        // 3. Remove reference from Course
        await Course.updateMany(
            { sections: id },
            { $pull: { sections: id } }
        );

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}
