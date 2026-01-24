"use client";

import { useMemo } from "react";
import { calculateLevel, xpForLevel, xpForNextLevel, getLevelProgress } from "@/lib/gamification-utils";
import { Trophy, Lock, Star, CheckCircle } from "lucide-react";
import { GameCard } from "@/components/ui/GameCard";

interface LevelPathProps {
    xp: number;
    className?: string;
}

export function LevelPath({ xp, className = "" }: LevelPathProps) {
    const currentLevel = calculateLevel(xp);
    const progress = getLevelProgress(xp);

    // Calculate the range of 5 levels (1-5, 6-10, etc.)
    const rangeStart = Math.floor((currentLevel - 1) / 5) * 5 + 1;
    const rangeEnd = rangeStart + 4;

    // Generate the levels for the current view
    const levels = useMemo(() => {
        return Array.from({ length: 5 }, (_, i) => {
            const level = rangeStart + i;
            const xpRequirement = xpForLevel(level);
            const xpNext = xpForNextLevel(level);

            // Status relative to user's current level
            let status: "completed" | "current" | "locked" = "locked";
            if (currentLevel > level) status = "completed";
            else if (currentLevel === level) status = "current";

            return {
                level,
                xpRequirement,
                xpNext,
                status
            };
        });
    }, [currentLevel, rangeStart]);

    return (
        <GameCard className={`w-full p-6 ${className} bg-slate-900/50 backdrop-blur`}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-heading text-slate-300 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    LEVEL PATH
                </h3>
                <span className="text-xs font-mono text-slate-500">
                    LEVELS {rangeStart} - {rangeEnd}
                </span>
            </div>

            <div className="relative mt-8 mb-4">
                {/* Connecting Line Background */}
                <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-800 -translate-y-1/2 rounded-full" />

                {/* Connecting Line Progress */}
                <div
                    className="absolute top-1/2 left-0 h-2 bg-primary/30 -translate-y-1/2 rounded-full transition-all duration-1000"
                    style={{
                        width: `${((Math.min(currentLevel, rangeEnd) - rangeStart) / 4) * 100}%`
                    }}
                />

                {/* Nodes */}
                <div className="relative flex justify-between z-10">
                    {levels.map((lvl, index) => {
                        const isCurrent = lvl.status === "current";
                        const isCompleted = lvl.status === "completed";
                        const isLocked = lvl.status === "locked";

                        return (
                            <div key={lvl.level} className="flex flex-col items-center group">
                                {/* Node Visual */}
                                <div
                                    className={`
                                        w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 relative
                                        ${isCompleted ? 'bg-primary border-primary text-black shadow-[0_0_15px_var(--color-primary)]' : ''}
                                        ${isCurrent ? 'bg-slate-900 border-primary text-primary shadow-[0_0_20px_var(--color-primary)] scale-110' : ''}
                                        ${isLocked ? 'bg-slate-950 border-slate-700 text-slate-700' : ''}
                                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-6 h-6" />
                                    ) : isCurrent ? (
                                        <span className="font-heading text-lg animate-pulse">{lvl.level}</span>
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}

                                    {/* Current Level Pulse Ring */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-20" />
                                    )}
                                </div>

                                {/* Label */}
                                <div className="mt-3 text-center">
                                    <div
                                        className={`font-mono text-sm font-bold ${isCurrent ? 'text-primary' : isCompleted ? 'text-slate-300' : 'text-slate-600'}`}
                                    >
                                        LVL {lvl.level}
                                    </div>
                                    <div className="text-[10px] font-mono text-slate-500 mt-1">
                                        {lvl.xpRequirement} XP
                                    </div>
                                </div>

                                {/* Progress Tooltip for Current Level */}
                                {isCurrent && (
                                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-1 rounded border border-primary/50 whitespace-nowrap shadow-lg">
                                        <div className="font-bold text-primary mb-1">{progress.xpGainedInLevel} / {progress.xpNeeded} XP</div>
                                        <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary" style={{ width: `${progress.percentage}%` }} />
                                        </div>
                                        <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 border-r border-b border-primary/50 rotate-45" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 text-center">
                <p className="text-xs text-slate-400 font-mono">
                    Gain XP by completing missions to unlock the next level!
                </p>
            </div>
        </GameCard>
    );
}
