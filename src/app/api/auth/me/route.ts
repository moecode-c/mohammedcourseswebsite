import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        await dbConnect();
        const user = await User.findById(payload.userId);

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        // Update streak if needed
        const { updateStreak } = await import("@/lib/gamification");
        await updateStreak(user);

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                xp: user.xp,
                level: user.level,
                streak: user.streak,
            },
        });
    } catch (error) {
        console.error("Me Error:", error);
        return NextResponse.json({ user: null }, { status: 500 });
    }
}
