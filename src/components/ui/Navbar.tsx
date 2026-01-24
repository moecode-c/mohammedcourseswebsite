import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { NavbarClient } from "./NavbarClient";

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload) return null;

    await dbConnect();
    const user = await User.findById(payload.userId);
    return user ? user.toJSON() : null;
}

export async function Navbar() {
    const user = await getUser();
    return <NavbarClient user={JSON.parse(JSON.stringify(user))} />;
}
