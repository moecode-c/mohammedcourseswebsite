import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { GameButton } from "@/components/ui/GameButton";
import Link from "next/link";
import Image from "next/image";
import { Code, Cpu, Database, Globe, Rocket, Terminal, User, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col">
            <Navbar />

            {/* Hero Section */}
            <section className="relative w-full py-20 px-6 overflow-hidden flex flex-col items-center text-center">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 z-0" />
                <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.png')] opacity-10 pointer-events-none z-0" />

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
                        {/* @ts-ignore */}
                        <model-viewer
                            src="/3dmodels/dualshock_ps1.glb"
                            alt="Retro Controller 3D Model"
                            auto-rotate
                            camera-controls
                            style={{ width: '100%', height: '100%', backgroundColor: '#0f172a' }}
                            shadow-intensity="1"
                        >
                            {/* @ts-ignore */}
                        </model-viewer>
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

            {/* Tech Stack Grid */}
            <section className="w-full bg-slate-900 py-24 border-y border-slate-800">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-heading text-white mb-4">WEAPONRY OF CHOICE</h2>
                        <p className="text-slate-400 font-mono">The tools we use to build the future.</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Globe, label: "Next.js", color: "text-white" },
                            { icon: Database, label: "MongoDB", color: "text-green-500" },
                            { icon: Code, label: "TypeScript", color: "text-blue-500" },
                            { icon: Zap, label: "Tailwind", color: "text-cyan-400" },
                            { icon: Rocket, label: "Node.js", color: "text-green-600" },
                            { icon: Cpu, label: "React", color: "text-blue-400" },
                            { icon: Terminal, label: "Linux", color: "text-yellow-500" },
                            { icon: User, label: "UX/UI", color: "text-purple-500" },
                        ].map((tech, idx) => (
                            <div key={idx} className="bg-slate-950 p-6 rounded border border-slate-800 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform duration-300 hover:border-slate-600 group">
                                <tech.icon className={`w-12 h-12 ${tech.color} group-hover:animate-pulse`} />
                                <span className="font-heading text-lg text-slate-300">{tech.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-24 text-center px-6">
                <h2 className="text-4xl font-heading text-white mb-8">READY TO START YOUR REQUEST?</h2>
                <Link href="/dashboard">
                    <GameButton size="lg" className="px-12 py-6 text-xl animate-pulse">
                        INITIALIZE SEQUENCE
                    </GameButton>
                </Link>
            </section>

            <Footer />
        </main>
    );
}
