import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Section from "@/models/Section"; // Import to ensure model is registered
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const course = await Course.findById(id).populate("sections").lean();

        if (!course) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        // Check User Access
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        let hasFullAccess = false;
        let isAdmin = false;

        if (course.isFree) {
            hasFullAccess = true;
        } else if (token) {
            const payload = verifyToken(token);
            if (payload) {
                if (payload.role === "admin") {
                    hasFullAccess = true;
                    isAdmin = true;
                } else {
                    // Check if user unlocked this course
                    const user = await User.findById(payload.userId).select("unlockedCourses");
                    if (user && user.unlockedCourses.includes(course._id)) {
                        hasFullAccess = true;
                    }
                }
            }
        }

        // Process sections to hide content if locked
        const sections = course.sections.map((section: any) => {
            const isLocked = !hasFullAccess && !section.isFree;

            if (isAdmin) return section; // Admins see everything

            if (isLocked) {
                return {
                    _id: section._id,
                    title: section.title,
                    isFree: section.isFree,
                    order: section.order,
                    isLocked: true,
                    // Omit content, videoUrl, quiz, pdfUrl
                };
            }
            return {
                ...section,
                isLocked: false,
            };
        });

        return NextResponse.json({
            course: {
                ...course,
                sections,
                isLocked: !hasFullAccess && !course.isFree, // Course level lock status for UI
            },
        });
    } catch (error) {
        console.error("Course Detail Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
