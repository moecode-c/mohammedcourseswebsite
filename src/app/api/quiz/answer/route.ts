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

        // Use a more robust check for already answered
        const answeredQuestions = user.answeredQuestions || [];
        const alreadyAnswered = answeredQuestions.some(id => String(id) === String(answerId));

        console.log(`[QUIZ] Processing answer for user ${user.email}`);
        console.log(`[QUIZ] Section: ${sectionId}, Question: ${questionIndex}, AnswerId: ${answerId}`);
        console.log(`[QUIZ] User answeredQuestions before:`, answeredQuestions);
        console.log(`[QUIZ] alreadyAnswered: ${alreadyAnswered}, isCorrect: ${isCorrect}`);

        let xpAwarded = 0;

        if (isCorrect) {
            if (!alreadyAnswered) {
                // Award XP - pass the user object to avoid overwriting
                const result = await awardXP(user, 10, `quiz-${answerId}`);
                xpAwarded = result?.xpAwarded || 0;

                // Mark as answered using atomic operators for absolute safety
                await User.updateOne(
                    { _id: user._id },
                    { $addToSet: { answeredQuestions: answerId } }
                );

                console.log(`[QUIZ] Atomic update: added ${answerId} to user ${user.email}`);
            } else {
                console.log(`[QUIZ] XP already awarded previously.`);
            }
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
