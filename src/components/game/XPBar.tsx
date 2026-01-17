"use client";

import { getLevelProgress } from "@/lib/gamification-utils";

interface XPBarProps {
    xp: number;
    className?: string;
    showLabels?: boolean;
}

export function XPBar({ xp, className = "", showLabels = true }: XPBarProps) {
    const { currentLevel, nextLevel, percentage, xpGainedInLevel, xpNeeded } = getLevelProgress(xp);

    return (
        <div className={`w-full ${className}`}>
            {showLabels && (
                <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                    <span>LVL {currentLevel}</span>
                    <span>{xpGainedInLevel} / {xpNeeded} XP</span>
                    <span>LVL {nextLevel}</span>
                </div>
            )}

            <div className="h-4 bg-slate-900 border border-slate-700 relative overflow-hidden rounded-sm">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[url('/grid-tiny.png')] opacity-20" />

                {/* Fill */}
                <div
                    className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000 ease-out relative"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Shine effect */}
                    <div className="absolute top-0 right-0 bottom-0 w-[1px] bg-white/50 shadow-[0_0_10px_white]" />
                </div>
            </div>
        </div>
    );
}
