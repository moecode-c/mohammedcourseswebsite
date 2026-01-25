import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950">
            <div className="relative w-64 h-64 md:w-96 md:h-96">
                <Image
                    src="/gifs/dancing.gif"
                    alt="Loading..."
                    fill
                    className="object-contain"
                    unoptimized // GIFs often need this to animate correctly if not optimized by provider
                />
            </div>
            <p className="mt-4 text-xl font-heading text-primary animate-pulse">
                LOADING SYSTEM...
            </p>
        </div>
    );
}
