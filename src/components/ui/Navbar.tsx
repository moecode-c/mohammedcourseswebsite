import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import { LevelBadge } from "@/components/game/LevelBadge";
import { XPBar } from "@/components/game/XPBar";
import { GameButton } from "@/components/ui/GameButton";

async function getUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const payload = verifyToken(token);
    if (!payload) return null;

    await dbConnect();
    const user = await User.findById(payload.userId);
    return user ? user.toJSON() : null;
}

export async function Navbar() {
    const user = await getUser();

    return (
        <nav className="w-full bg-slate-900 border-b-2 border-slate-700 p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link href="/" className="font-heading text-lg md:text-xl text-white hover:text-primary transition-colors">
                    &lt;CODE_QUEST /&gt;
                </Link>

                {user ? (
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex flex-col w-48">
                            {/* XP Bar */}
                            <XPBar xp={user.xp} showLabels={true} />
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="hidden md:block font-mono text-sm uppercase text-slate-300">
                                {user.name}
                            </span>
                            <LevelBadge level={user.level} size="sm" />
                        </div>

                        <div className="hidden md:flex gap-2">
                            {user.role === "admin" && (
                                <Link href="/admin">
                                    <GameButton size="sm" variant="danger">OP_MODE</GameButton>
                                </Link>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Link href="/login">
                            <GameButton size="sm" variant="ghost">Login</GameButton>
                        </Link>
                        <Link href="/register">
                            <GameButton size="sm">Register</GameButton>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
