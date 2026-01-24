import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { hashPassword, signToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
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

        const token = signToken({ userId: user._id as unknown as string, role: user.role });

        (await cookies()).set("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
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
        console.error("Register Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
