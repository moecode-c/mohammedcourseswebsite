"use client";

interface LevelBadgeProps {
    level: number;
    size?: "sm" | "md" | "lg";
}

export function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-12 h-12 text-lg",
        lg: "w-16 h-16 text-2xl",
    };

    return (
        <div className={`relative flex items-center justify-center font-heading text-black font-bold z-10 ${sizeClasses[size]}`}>
            {/* Hexagon Shape CSS (using clip-path or multiple divs) - using a simple rotated square for now or SVG */}
            <div className="absolute inset-0 bg-primary rotate-45 border-2 border-white shadow-[0_0_10px_var(--color-primary)] animate-pulse-slow" />
            <div className="relative z-10">
                {level}
            </div>
        </div>
    );
}
