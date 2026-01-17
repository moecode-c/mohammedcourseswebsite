import { Navbar } from "@/components/ui/Navbar";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import Link from "next/link";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import User from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { Lock, Play, Zap } from "lucide-react";

async function getData() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return { courses: [], user: null };
    const payload = verifyToken(token);
    if (!payload) return { courses: [], user: null };

    await dbConnect();
    // Fetch user to know unlocked courses
    const user = await User.findById(payload.userId);
    // Fetch all courses
    // In a real app, maybe pagination or filtering
    const courses = await Course.find({}).sort({ order: 1, createdAt: 1 }).lean();

    return {
        courses: JSON.parse(JSON.stringify(courses)),
        user: user ? JSON.parse(JSON.stringify(user)) : null
    };
}

export default async function DashboardPage() {
    const { courses, user } = await getData();

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
                <Link href="/login"><GameButton>Please Login</GameButton></Link>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-950 text-white pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <header className="mb-12">
                    <h1 className="text-4xl font-heading mb-4 text-shadow">Mission Select</h1>
                    <p className="font-mono text-slate-400">Select a stage to begin your training.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course: any) => {
                        const isUnlocked = course.isFree || user.unlockedCourses.includes(course._id) || user.role === "admin";

                        return (
                            <div key={course._id} className="relative group">
                                <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                                <GameCard className="h-full flex flex-col relative z-10 bg-slate-900/90 backdrop-blur">
                                    <div className="aspect-video bg-slate-800 mb-4 rounded border border-slate-700 overflow-hidden relative">
                                        {/* Placeholder or specific image */}
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-600 font-mono text-xs">
                                            [NO_SIGNAL]
                                        </div>
                                        {course.thumbnail && (
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                                        )}

                                        {!isUnlocked && (
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                                                <Lock className="w-12 h-12 text-slate-400" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-heading text-lg text-primary">{course.title}</h3>
                                        {course.isFree ? (
                                            <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded font-mono">FREE</span>
                                        ) : (
                                            <span className="text-xs bg-arcade/20 text-arcade px-2 py-1 rounded font-mono">PAID</span>
                                        )}
                                    </div>

                                    <p className="text-slate-400 text-sm font-mono flex-grow mb-6 line-clamp-3">
                                        {course.description}
                                    </p>

                                    <div className="mt-auto">
                                        <Link href={`/courses/${course._id}`}>
                                            <GameButton
                                                className="w-full"
                                                variant={isUnlocked ? "primary" : "secondary"}
                                            >
                                                {isUnlocked ? (
                                                    <span className="flex items-center justify-center gap-2"><Play className="w-4 h-4" /> START MISSION</span>
                                                ) : (
                                                    <span className="flex items-center justify-center gap-2"><Lock className="w-4 h-4" /> UNLOCK</span>
                                                )}
                                            </GameButton>
                                        </Link>
                                    </div>
                                </GameCard>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
