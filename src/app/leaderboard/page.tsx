import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { GameCard } from "@/components/ui/GameCard";
import { LevelBadge } from "@/components/game/LevelBadge";
import { Trophy, Medal, Crown } from "lucide-react";

async function getLeaderboard() {
    await dbConnect();
    const users = await User.find({ role: { $ne: "admin" } }) // Exclude admins
        .sort({ xp: -1 }) // Sort by XP descending
        .limit(50) // Top 50
        .select("name xp level streak")
        .lean();
    return JSON.parse(JSON.stringify(users));
}

export default async function LeaderboardPage() {
    const users = await getLeaderboard();

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Navbar />

            <section className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-heading text-primary mb-4 text-shadow-lg flex items-center justify-center gap-4">
                        <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
                        LEADERBOARD
                        <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
                    </h1>
                    <p className="font-mono text-slate-400 mb-6">Top players claiming their victory.</p>
                    <img src="/gifs/music.gif" alt="Music Dance" className="w-48 h-auto mx-auto opacity-80" />
                </div>

                <div className="space-y-4">
                    {users.map((user: any, index: number) => {
                        let rankIcon;
                        let rankClass = "bg-slate-900 border-slate-800";
                        let textClass = "text-slate-300";

                        if (index === 0) {
                            rankIcon = <Crown className="w-6 h-6 text-yellow-400" />;
                            rankClass = "bg-yellow-900/10 border-yellow-500/50";
                            textClass = "text-yellow-400 font-bold";
                        } else if (index === 1) {
                            rankIcon = <Medal className="w-6 h-6 text-slate-300" />; // Silver
                            rankClass = "bg-slate-800/50 border-slate-400/50";
                            textClass = "text-slate-100 font-bold";
                        } else if (index === 2) {
                            rankIcon = <Medal className="w-6 h-6 text-orange-500" />; // Bronze
                            rankClass = "bg-orange-900/10 border-orange-500/50";
                            textClass = "text-orange-400 font-bold";
                        }

                        return (
                            <div key={user._id} className={`p-4 rounded border flex items-center gap-4 transition-transform hover:scale-[1.01] ${rankClass}`}>
                                <div className="w-12 text-center font-heading text-xl text-slate-500 flex justify-center">
                                    {rankIcon || `#${index + 1}`}
                                </div>
                                <div className="flex-1">
                                    <div className={`font-mono text-lg ${textClass}`}>{user.name}</div>
                                    <div className="text-xs text-slate-500 font-mono flex gap-4">
                                        <span>Streak: {user.streak?.count || 0} 🔥</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="text-xl font-heading text-primary">{user.xp.toLocaleString()} XP</div>
                                        <div className="text-xs text-slate-500 font-mono">Total Score</div>
                                    </div>
                                    <LevelBadge level={user.level} size="md" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <Footer />
        </main>
    );
}
