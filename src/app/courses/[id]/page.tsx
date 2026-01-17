import { Navbar } from "@/components/ui/Navbar";
import { CourseView } from "@/components/game/CourseView";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import mongoose from "mongoose";

async function getCourseData(id: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!mongoose.Types.ObjectId.isValid(id)) return null;

    await dbConnect();
    const course = await Course.findById(id).populate("sections").lean();
    if (!course) return null;

    let user = null;
    let hasFullAccess = false;
    let isAdmin = false;

    if (token) {
        const payload = verifyToken(token);
        if (payload) {
            user = await User.findById(payload.userId).lean();
            if (user) {
                if (payload.role === "admin") {
                    hasFullAccess = true;
                    isAdmin = true;
                } else {
                    const userObj = user as any;
                    if (userObj.unlockedCourses.map((id: any) => id.toString()).includes(course._id.toString())) {
                        hasFullAccess = true;
                    }
                }
            }
        }
    }

    // Filter sections
    const sections = (course.sections as any[]).map((section: any) => {
        const isLocked = !hasFullAccess && !course.isFree && !section.isFree;

        if (isAdmin) return { ...section, isLocked: false };

        if (isLocked) {
            return {
                _id: section._id.toString(),
                title: section.title,
                isFree: section.isFree,
                order: section.order,
                isLocked: true,
                // Omit content/video
            };
        }
        return {
            _id: section._id.toString(),
            title: section.title,
            isFree: section.isFree,
            order: section.order,
            content: section.content,
            videoUrl: section.videoUrl,
            isLocked: false,
        };
    });

    return {
        course: {
            ...course,
            _id: course._id.toString(),
            sections,
            isLocked: !hasFullAccess && !course.isFree
        },
        user: user ? { ...user, _id: (user as any)._id.toString(), completedSections: (user as any).completedSections.map((id: any) => id.toString()) } : null // sending minimal user data
    };
}

export default async function CoursePage(
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const data = await getCourseData(id);

    if (!data) {
        return (
            <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
                Course Not Found
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white">
            <Navbar />
            <CourseView course={data.course} user={data.user} />
        </main>
    );
}
