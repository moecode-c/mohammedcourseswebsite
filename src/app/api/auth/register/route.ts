import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

        // Check rate limit for registration to prevent spam
        const limitStatus = rateLimit.check(ip);
        if (limitStatus.limited) {
            const remainingMinutes = Math.ceil((limitStatus.resetTime - Date.now()) / 60000);
            return NextResponse.json(
                { error: "Too many registration attempts. Please try again in " + remainingMinutes + " minutes." },
                { status: 429 }
            );
        }

        await dbConnect();
        const { name, email, password, phone, role } = await req.json();

        if (!name || !email || !password || !phone) {
            return NextResponse.json(
                { error: "Missing required fields (Name, Email, Password, and Phone are required)" },
                { status: 400 }
            );
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 400 }
            );
        }

        const hashedPassword = await hashPassword(password);

        // Default to student unless specifically creating admin (should be protected in prod)
        // For this prototype, we'll allow role passing but you might want to restrict it
        const userRole = role === "admin" ? "admin" : "student";

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: userRole,
        });

        // Clear rate limit on success (optional, but good for genuine users)
        rateLimit.clear(ip);

        const token = signToken({ userId: user._id as unknown as string, role: user.role });

        (await cookies()).set("session_token", token, {
            httpOnly: true,
            secure: false, // Changed to false to allow login on local network (HTTP)
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: "/",
        });

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                xp: user.xp,
                level: user.level,
            },
        });
    } catch (error) {
        // Increment rate limit on error to prevent bruteforce/spam
        const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
        rateLimit.increment(ip);

        console.error("Register Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
