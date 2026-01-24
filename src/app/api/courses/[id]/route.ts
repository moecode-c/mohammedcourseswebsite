import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import Section from "@/models/Section"; // Import to ensure model is registered
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

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
        const token = cookieStore.get("session_token")?.value;
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

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();

        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Check Admin Access
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!updatedCourse) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        revalidatePath("/courses", "page");
        revalidatePath(`/courses/${id}`, "page");
        revalidatePath("/dashboard", "page");

        return NextResponse.json({ course: updatedCourse });
    } catch (error) {
        console.error("Course Update Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload || payload.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const courseObjectId = new mongoose.Types.ObjectId(id);

        const sections = await Section.find({ courseId: courseObjectId }).select("_id").lean();
        const sectionIds = sections.map(s => s._id);

        const deletedCourse = await Course.findByIdAndDelete(courseObjectId);
        if (!deletedCourse) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        await Section.deleteMany({ courseId: courseObjectId });

        await User.updateMany(
            {},
            {
                $pull: {
                    unlockedCourses: courseObjectId,
                    completedCourses: courseObjectId,
                    ...(sectionIds.length ? { completedSections: { $in: sectionIds } } : {})
                }
            }
        );

        revalidatePath("/courses", "page");
        revalidatePath("/dashboard", "page");
        revalidatePath("/admin", "page");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Course Delete Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
