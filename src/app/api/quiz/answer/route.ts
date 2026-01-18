import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Section from "@/models/Section";
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

        const { sectionId, questionIndex, selectedOptionIndex } = await req.json();

        if (!sectionId || questionIndex === undefined || selectedOptionIndex === undefined) {
            return NextResponse.json({ error: "Missing Parameters" }, { status: 400 });
        }

        await dbConnect();

        // Fetch User and Section
        const user = await User.findById(payload.userId);
        const section = await Section.findById(sectionId);

        if (!user || !section) {
            return NextResponse.json({ error: "Not Found" }, { status: 404 });
        }

        // Validate Question
        const questions = section.questions || [];
        const question = questions[questionIndex];

        if (!question) {
            return NextResponse.json({ error: "Question not found" }, { status: 404 });
        }

        // Check Answer
        const isCorrect = question.correctOptionIndex === selectedOptionIndex;
        const answerId = `${sectionId}-${questionIndex}`;
        const alreadyAnswered = user.answeredQuestions?.includes(answerId);

        let xpAwarded = 0;

        if (isCorrect) {
            if (!alreadyAnswered) {
                // Award XP
                const result = await awardXP(payload.userId, 10, `quiz-${answerId}`);
                xpAwarded = result.xpAwarded;

                // Mark as answered
                if (!user.answeredQuestions) user.answeredQuestions = [];
                user.answeredQuestions.push(answerId);
                await user.save();
            }
            // If already answered, we just confirm it's correct but 0 XP
        }

        return NextResponse.json({
            success: true,
            isCorrect,
            correctOptionIndex: question.correctOptionIndex,
            xpAwarded,
            alreadyAnswered
        });

    } catch (error) {
        console.error("Quiz Answer Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
