"use client";

import Link from "next/link";
import { useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { LevelBadge } from "@/components/game/LevelBadge";
import { XPBar } from "@/components/game/XPBar";
import { Menu, X, Home, Map, BookOpen, User, Shield, Search } from "lucide-react";

interface NavbarClientProps {
    user: any; // Using any for simplicity as User type is complex to import here, but ideally should be typed
}

export function NavbarClient({ user }: NavbarClientProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleSignOut = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <nav className="w-full bg-slate-900 border-b-2 border-slate-700 p-4 sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="font-heading text-lg md:text-xl text-white hover:text-primary transition-colors flex items-center gap-2 z-50 relative">
                    <span className="text-primary">&lt;</span>
                    CODE_QUEST
                    <span className="text-primary">/&gt;</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex gap-8 items-center">
                    <Link href="/" className="font-mono text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <Home className="w-4 h-4" /> HQ
                    </Link>

                    {/* Courses Dropdown */}
                    <div className="relative group">
                        <button className="font-mono text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2 py-2">
                            <BookOpen className="w-4 h-4" /> COURSES
                        </button>
                        <div className="absolute top-full left-0 mt-0 w-48 bg-slate-900 border border-slate-700 rounded shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top pt-2 z-50">
                            <div className="flex flex-col">
                                <Link href="/dashboard" className="px-4 py-3 text-sm font-mono text-slate-300 hover:bg-slate-800 hover:text-primary transition-colors flex items-center gap-2">
                                    <Map className="w-4 h-4" /> MY COURSES
                                </Link>
                                <Link href="/courses" className="px-4 py-3 text-sm font-mono text-slate-300 hover:bg-slate-800 hover:text-primary transition-colors flex items-center gap-2 border-t border-slate-800">
                                    <Search className="w-4 h-4" /> BROWSE ALL
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link href="/about" className="font-mono text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> TUTORIAL
                    </Link>
                </div>

                {/* User / Login Section (Desktop) */}
                <div className="hidden md:flex items-center gap-6">
                    {user ? (
                        <>
                            <div className="flex flex-col w-40">
                                <XPBar xp={user.xp} showLabels={false} />
                                <span className="text-[10px] text-slate-500 font-mono text-right">{user.xp} XP</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="font-mono text-sm uppercase text-slate-300 truncate max-w-[100px]">
                                    {user.name}
                                </span>
                                <LevelBadge level={user.level} size="sm" />
                            </div>
                            {user.role === "admin" && (
                                <Link href="/admin">
                                    <GameButton size="sm" variant="danger" className="px-2"><Shield className="w-4 h-4" /></GameButton>
                                </Link>
                            )}
                            <button onClick={handleSignOut} className="text-slate-500 hover:text-red-400 transition-colors">
                                <span className="sr-only">Sign Out</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                            </button>
                        </>
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

                {/* Mobile Hamburger */}
                <button onClick={toggleMenu} className="md:hidden text-white z-50 relative p-2 focus:outline-none">
                    {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Mobile Sidebar / Drawer */}
            <div className={`fixed inset-0 bg-slate-950/95 backdrop-blur-sm z-40 transition-transform duration-300 md:hidden flex flex-col pt-24 px-6 gap-8 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

                {/* Mobile Links */}
                <div className="flex flex-col gap-6">
                    <Link href="/" onClick={toggleMenu} className="text-2xl font-heading text-white hover:text-primary border-b border-slate-800 pb-4 flex items-center gap-4">
                        <Home className="w-6 h-6 text-slate-500" /> HQ
                    </Link>
                    <h3 className="text-sm font-mono text-slate-500 uppercase mt-4">Courses</h3>
                    <Link href="/dashboard" onClick={toggleMenu} className="text-xl font-heading text-white hover:text-primary border-b border-slate-800 pb-4 flex items-center gap-4 pl-4">
                        <Map className="w-5 h-5 text-slate-500" /> MY COURSES
                    </Link>
                    <Link href="/courses" onClick={toggleMenu} className="text-xl font-heading text-white hover:text-primary border-b border-slate-800 pb-4 flex items-center gap-4 pl-4">
                        <Search className="w-5 h-5 text-slate-500" /> BROWSE ALL
                    </Link>
                    <Link href="/about" onClick={toggleMenu} className="text-2xl font-heading text-white hover:text-primary border-b border-slate-800 pb-4 flex items-center gap-4 mt-4">
                        <BookOpen className="w-6 h-6 text-slate-500" /> TUTORIAL
                    </Link>
                </div>

                {/* Mobile User Section */}
                {user ? (
                    <div className="bg-slate-900 p-4 rounded border border-slate-800">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="bg-slate-800 p-2 rounded-full">
                                <User className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <p className="font-bold text-white">{user.name}</p>
                                <p className="text-xs text-slate-500 font-mono">LEVEL {user.level}</p>
                            </div>
                            <div className="ml-auto">
                                <LevelBadge level={user.level} size="sm" />
                            </div>
                        </div>
                        <XPBar xp={user.xp} showLabels={true} />

                        {user.role === "admin" && (
                            <Link href="/admin" onClick={toggleMenu} className="mt-4 block">
                                <GameButton variant="danger" className="w-full">OP_MODE (ADMIN)</GameButton>
                            </Link>
                        )}

                        <button onClick={handleSignOut} className="mt-4 w-full py-2 bg-slate-800 text-slate-400 hover:bg-red-900/20 hover:text-red-400 rounded font-mono text-sm transition-colors flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                            SIGN OUT
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mt-auto mb-10">
                        <Link href="/login" onClick={toggleMenu}>
                            <GameButton variant="ghost" className="w-full">LOGIN</GameButton>
                        </Link>
                        <Link href="/register" onClick={toggleMenu}>
                            <GameButton className="w-full">REGISTER</GameButton>
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
