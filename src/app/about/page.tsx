import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { GameButton } from "@/components/ui/GameButton";
import Link from "next/link";
import { Cpu, Terminal } from "lucide-react";
import ModelViewerWrapper from "@/components/ui/ModelViewerWrapper";
import { ContactSection } from "@/components/ui/ContactSection";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full py-20 px-6 overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 z-0" />

                <div className="z-10 animate-fade-in-up max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono uppercase tracking-widest mb-6">
                        <Terminal className="w-4 h-4" />
                        <span>System Architect</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-heading mb-6 text-shadow-lg">
                        BEHIND THE <span className="text-primary">URL</span>
                    </h1>

                    <p className="text-xl text-slate-400 font-mono leading-relaxed max-w-2xl mx-auto mb-10">
                        "I don't just teach code. I teach you how to think like an engineer, solve problems like a hacker, and build systems that scale."
                    </p>
                </div>
            </section>

            {/* The Creator Section */}
            <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="relative group animate-fade-in-up h-[400px]">
                    <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-xl opacity-75 blur-lg group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative h-full bg-slate-900 rounded-xl border border-slate-700 overflow-hidden shadow-2xl flex items-center justify-center">
                        <ModelViewerWrapper
                            src="/3dmodels/dualshock_ps1.glb"
                            alt="Retro Controller 3D Model"
                            style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}
                            cameraOrbit="0deg 45deg 105%"
                        />
                    </div>
                </div>

                <div className="space-y-8 animate-fade-in-up nav-delay-100">
                    <div>
                        <h2 className="text-3xl font-heading text-white mb-4 flex items-center gap-3">
                            <Cpu className="w-8 h-8 text-secondary" />
                            THE MISSION
                        </h2>
                        <div className="h-1 w-20 bg-secondary mb-6" />
                        <p className="text-slate-400 leading-relaxed font-mono">
                            The traditional education system is broken. It's too slow, too theoretical, and disconnected from the real world.
                            <br /><br />
                            My mission is to bridge the gap between "Hello World" and deployment. I built <strong>Code Quest</strong> to turn the grueling process of learning into an addictive game. Here, you don't just watch videos—you earn XP, complete missions, and build a portfolio that gets you hired.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded hover:border-primary/50 transition-colors">
                            <h4 className="text-2xl font-bold text-primary mb-1">5+</h4>
                            <p className="text-xs text-slate-500 uppercase font-mono">Years Exp.</p>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded hover:border-primary/50 transition-colors">
                            <h4 className="text-2xl font-bold text-secondary mb-1">100+</h4>
                            <p className="text-xs text-slate-500 uppercase font-mono">Projects Built</p>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded hover:border-primary/50 transition-colors">
                            <h4 className="text-2xl font-bold text-arcade mb-1">1K+</h4>
                            <p className="text-xs text-slate-500 uppercase font-mono">Students</p>
                        </div>
                        <div className="p-4 bg-slate-900 border border-slate-800 rounded hover:border-primary/50 transition-colors">
                            <h4 className="text-2xl font-bold text-green-500 mb-1">∞</h4>
                            <p className="text-xs text-slate-500 uppercase font-mono">Lines of Code</p>
                        </div>
                    </div>
                </div>
            </section>

            <ContactSection
                source="tutorial"
                title="CONTACT ME"
                subtitle="Got a question about the tutorial? Send a message and I will get back to you."
            />

            <section className="py-24 text-center px-6 flex flex-col items-center">
                <h2 className="text-4xl font-heading text-white mb-8">READY TO START YOUR REQUEST?</h2>
                <Link href="/dashboard" className="mb-8">
                    <GameButton size="lg" className="px-12 py-6 text-xl animate-pulse">
                        INITIALIZE SEQUENCE
                    </GameButton>
                </Link>

                <img src="/gifs/sitting.gif" alt="Relaxing" className="w-64 h-auto opacity-80" />
            </section>

            <Footer />
        </main>
    );
}
