import React from "react";

interface GameInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

const GameInput = React.forwardRef<HTMLInputElement, GameInputProps>(
    ({ className, label, type, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-xs font-heading text-slate-400 mb-1 uppercase">
                        {label}
                    </label>
                )}
                <input
                    type={type}
                    className={`w-full bg-slate-950 border-2 border-slate-700 p-3 font-mono text-white focus:border-primary focus:outline-none focus:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all ${className || ""}`}
                    ref={ref}
                    {...props}
                />
            </div>
        );
    }
);
GameInput.displayName = "GameInput";

export { GameInput };
