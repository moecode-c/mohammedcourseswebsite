"use client";

import Link from "next/link";
import { useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { LevelBadge } from "@/components/game/LevelBadge";
import { XPBar } from "@/components/game/XPBar";
import { Menu, X, Home, Map, BookOpen, User, Shield } from "lucide-react";

interface NavbarClientProps {
    user: any; // Using any for simplicity as User type is complex to import here, but ideally should be typed
}

export function NavbarClient({ user }: NavbarClientProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

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
                    <Link href="/dashboard" className="font-mono text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                        <Map className="w-4 h-4" /> MISSIONS
                    </Link>
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
                    <Link href="/dashboard" onClick={toggleMenu} className="text-2xl font-heading text-white hover:text-primary border-b border-slate-800 pb-4 flex items-center gap-4">
                        <Map className="w-6 h-6 text-slate-500" /> MISSIONS
                    </Link>
                    <Link href="/about" onClick={toggleMenu} className="text-2xl font-heading text-white hover:text-primary border-b border-slate-800 pb-4 flex items-center gap-4">
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
