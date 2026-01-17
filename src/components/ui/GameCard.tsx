import React from "react";

interface GameCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
}

const GameCard = React.forwardRef<HTMLDivElement, GameCardProps>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`bg-slate-900 border-2 border-slate-700 p-6 relative group hover:border-primary transition-colors ${className || ""}`}
                {...props}
            >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-2 h-2 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 w-2 h-2 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                {title && (
                    <h3 className="font-heading text-xl text-primary mb-4 border-b border-slate-800 pb-2">
                        {title}
                    </h3>
                )}
                {children}
            </div>
        );
    }
);
GameCard.displayName = "GameCard";

export { GameCard };
