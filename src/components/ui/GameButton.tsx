import React from "react";
import { cn } from "@/lib/utils";

interface GameButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost";
    size?: "sm" | "md" | "lg";
}

// Utility to handle class merging if we created it, otherwise minimal implementation
// Assuming user might not have lib/utils generic 'cn' yet, I'll provide a local version or use clsx directly if passed
// effectively, I'll assume standard setup or just use template literals for now if I cant read lib/utils.
// But I installed clsx and tailwind-merge. I should create lib/utils first? 
// I'll inline the logic or create lib/utils in this turn too.

const GameButton = React.forwardRef<HTMLButtonElement, GameButtonProps>(
    ({ className, variant = "primary", size = "md", ...props }, ref) => {

        const baseStyles = "font-heading uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none border-2";

        const variants = {
            primary: "bg-primary text-black border-primary hover:bg-black hover:text-primary hover:shadow-[0_0_15px_var(--color-primary)]",
            secondary: "bg-secondary text-black border-secondary hover:bg-black hover:text-secondary hover:shadow-[0_0_15px_var(--color-secondary)]",
            danger: "bg-red-600 text-white border-red-600 hover:bg-red-700",
            ghost: "bg-transparent text-primary border-transparent hover:bg-primary/10",
        };

        const sizes = {
            sm: "text-xs px-3 py-1",
            md: "text-base px-6 py-2",
            lg: "text-lg px-8 py-3",
        };

        return (
            <button
                ref={ref}
                className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className || ""}`}
                {...props}
            />
        );
    }
);
GameButton.displayName = "GameButton";

export { GameButton };
