import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { awardXP } from "@/lib/gamification";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const payload = verifyToken(token);
        if (!payload) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { sectionId, courseId } = await req.json();

        if (!sectionId || !courseId) {
            return NextResponse.json({ error: "Missing IDs" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Check if already completed
        if (user.completedSections.includes(new mongoose.Types.ObjectId(sectionId))) {
            return NextResponse.json({ message: "Already completed" }, { status: 200 });
        }

        // Mark completed
        user.completedSections.push(new mongoose.Types.ObjectId(sectionId));

        // Award XP
        const xpResult = await awardXP(payload.userId, 50, `completed-section-${sectionId}`);

        // Check if course is fully completed
        const course = await mongoose.models.Course.findById(courseId).populate("sections");
        let courseCompleted = false;

        if (course && course.sections) {
            const allSectionIds = course.sections.map((s: any) => s._id.toString());
            // We just pushed the current section, so we check if all are now in the user's list
            // Re-fetch user or check against the modified array. The user object is modifying in memory.
            const userCompletedIds = user.completedSections.map((id: any) => id.toString());

            const allDone = allSectionIds.every((id: string) => userCompletedIds.includes(id));

            if (allDone) {
                if (!user.completedCourses.includes(courseId)) {
                    user.completedCourses.push(courseId);
                    await awardXP(payload.userId, 500, `completed-course-${courseId}`); // Bonus XP for course completion
                    courseCompleted = true;
                }
            }
        }

        await user.save();

        return NextResponse.json({ success: true, xpResult, courseCompleted });
    } catch (error) {
        console.error("Complete Section Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
