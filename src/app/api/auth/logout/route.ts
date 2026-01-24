import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    const cookieStore = await cookies();
    // Force expiration with specific matching attributes
    cookieStore.set("session_token", "", {
        expires: new Date(0),
        path: "/",
        secure: false,
        sameSite: "lax",
        httpOnly: true
    });

    return NextResponse.json({ success: true });
}
