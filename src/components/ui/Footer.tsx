import Link from "next/link";
import { Github, Twitter, Youtube, Trophy, Home, BookOpen, LogIn } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full bg-slate-950 border-t border-slate-800 pt-10 pb-6">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                {/* Brand */}
                <div>
                    <div className="font-heading text-xl text-white mb-4">&lt;CODE_QUEST /&gt;</div>
                    <p className="text-slate-400 text-lg max-w-xs">
                        Level up your development skills in a gamified environment. Master the code, claim the victory.
                    </p>
                </div>

                {/* Links with Icons */}
                <div>
                    <h4 className="font-heading text-primary text-sm mb-4">NAVIGATION</h4>
                    <ul className="space-y-3 text-lg text-slate-400">
                        <li>
                            <Link href="/" className="hover:text-white transition-colors flex items-center gap-2">
                                <Home className="w-5 h-5" /> Home Base
                            </Link>
                        </li>
                        <li>
                            <Link href="/courses" className="hover:text-white transition-colors flex items-center gap-2">
                                <BookOpen className="w-5 h-5" /> Course List
                            </Link>
                        </li>
                        <li>
                            <Link href="/leaderboard" className="hover:text-white transition-colors flex items-center gap-2">
                                <Trophy className="w-5 h-5 text-yellow-500" /> Leaderboard
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="hover:text-white transition-colors flex items-center gap-2">
                                <LogIn className="w-5 h-5" /> Login / Register
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Socials */}
                <div>
                    <h4 className="font-heading text-secondary text-sm mb-4">COMMUNITY</h4>
                    <div className="flex gap-4">
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Github className="w-8 h-8" /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter className="w-8 h-8" /></a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors"><Youtube className="w-8 h-8" /></a>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-slate-600 border-t border-slate-900 pt-6">
                © 2026 CODE_QUEST SYSTEM. ALL RIGHTS RESERVED.
            </div>
        </footer>
    );
}
