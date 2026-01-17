"use client";

import { useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { GameCard } from "@/components/ui/GameCard";
import { GameInput } from "@/components/ui/GameInput";
import { Lock, Play, CheckCircle, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import { XPBar } from "@/components/game/XPBar";

interface CourseViewProps {
    course: any;
    user: any;
}

export function CourseView({ course, user }: CourseViewProps) {
    const [currentSection, setCurrentSection] = useState(course.sections[0]);
    const [completedSections, setCompletedSections] = useState<string[]>(user.completedSections || []);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [xpGained, setXpGained] = useState<number | null>(null);

    // Payment Form State
    const [paymentForm, setPaymentForm] = useState({ fullName: "", phoneNumber: "", notes: "" });
    const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, submitting, success, error

    const isCourseLocked = course.isLocked;

    const handleComplete = async (sectionId: string) => {
        if (completedSections.includes(sectionId)) return;

        try {
            const res = await fetch("/api/progress/complete-section", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sectionId, courseId: course._id }),
            });
            const data = await res.json();

            if (data.success) {
                setCompletedSections([...completedSections, sectionId]);
                // Show XP Toast
                if (data.xpResult.xpAwarded > 0) {
                    setXpGained(data.xpResult.xpAwarded);
                    setTimeout(() => setXpGained(null), 3000);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const submitUnlockRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setPaymentStatus("submitting");
        try {
            const res = await fetch(`/api/courses/${course._id}/unlock`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: paymentForm.fullName,
                    phoneNumber: paymentForm.phoneNumber,
                    transactionNotes: paymentForm.notes
                }),
            });

            if (res.ok) {
                setPaymentStatus("success");
                setTimeout(() => {
                    setShowUnlockModal(false);
                    setPaymentStatus("idle");
                }, 2000);
            } else {
                setPaymentStatus("error");
            }
        } catch (e) {
            setPaymentStatus("error");
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-80px)]">
            {/* Sidebar: Sections List */}
            <div className="w-full lg:w-1/4 bg-slate-900 border-r border-slate-700 overflow-y-auto h-[50vh] lg:h-auto">
                <div className="p-4 border-b border-slate-700 font-heading text-lg">
                    STAGES
                </div>
                <div className="flex flex-col">
                    {course.sections.map((section: any, index: number) => {
                        const isCompleted = completedSections.includes(section._id);
                        const isActive = currentSection?._id === section._id;
                        const isLocked = section.isLocked;

                        return (
                            <button
                                key={section._id}
                                disabled={isLocked}
                                onClick={() => setCurrentSection(section)}
                                className={`p-4 text-left border-b border-slate-800 transition-colors flex items-center justify-between
                            ${isActive ? "bg-primary/20 text-primary border-l-4 border-l-primary" : "text-slate-400 hover:bg-slate-800"}
                            ${isLocked ? "opacity-50 cursor-not-allowed" : ""}
                        `}
                            >
                                <div className="flex flex-col">
                                    <span className="text-xs font-mono mb-1">STAGE {index + 1}</span>
                                    <span className="font-bold text-sm">{section.title}</span>
                                </div>
                                <div>
                                    {isLocked ? <Lock className="w-4 h-4" /> : isCompleted ? <CheckCircle className="w-4 h-4 text-primary" /> : null}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full lg:w-3/4 p-6 relative">

                {/* XP Toast */}
                {xpGained && (
                    <div className="absolute top-10 right-10 animate-bounce bg-primary text-black font-heading px-4 py-2 rounded shadow-[0_0_20px_var(--color-primary)] z-50">
                        +{xpGained} XP
                    </div>
                )}

                {isCourseLocked && !course.sections.some((s: any) => !s.isLocked) ? (
                    // Entire Course Locked View (if specific logic needed, though we usually show free sections)
                    <div className="h-full flex flex-col items-center justify-center text-center">
                        <Lock className="w-20 h-20 text-slate-600 mb-6" />
                        <h2 className="text-3xl font-heading mb-4">ACCESS DENIED</h2>
                        <p className="max-w-md text-slate-400 mb-8">This mission requires clearance level: PAID. Please submit a request to unlock.</p>
                        <GameButton size="lg" onClick={() => setShowUnlockModal(true)}>REQUEST ACCESS</GameButton>
                    </div>
                ) : (
                    <>
                        {currentSection ? (
                            <div className="h-full flex flex-col">
                                <header className="mb-6 border-b border-slate-700 pb-4">
                                    <h2 className="text-3xl font-heading text-primary text-shadow">{currentSection.title}</h2>
                                </header>

                                {currentSection.isLocked ? (
                                    <div className="flex-grow flex flex-col items-center justify-center bg-black/30 border border-slate-700 rounded p-8">
                                        <Lock className="w-16 h-16 text-arcade mb-4" />
                                        <h3 className="text-2xl font-heading text-arcade mb-2">RESTRICTED AREA</h3>
                                        <p className="text-slate-400 mb-6 text-center">To access this stage, you must unlock the full course.</p>
                                        <GameButton variant="secondary" onClick={() => setShowUnlockModal(true)}>
                                            UNLOCK NOW
                                        </GameButton>
                                    </div>
                                ) : (
                                    <div className="flex-grow">
                                        {/* Video Player Placeholder */}
                                        {currentSection.videoUrl && (
                                            <div className="aspect-video bg-black mb-6 rounded border-2 border-slate-800 flex items-center justify-center relative overflow-hidden group">
                                                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
                                                {/* If real youtube, embed here. For now text. */}
                                                <p className="font-mono text-primary animate-pulse">[VIDEO FEED LINKED: {currentSection.videoUrl}]</p>
                                            </div>
                                        )}

                                        <div className="prose prose-invert max-w-none text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                                            {currentSection.content}
                                        </div>

                                        <div className="mt-12 pt-6 border-t border-slate-700 flex justify-end">
                                            <GameButton
                                                size="lg"
                                                onClick={() => handleComplete(currentSection._id)}
                                                disabled={completedSections.includes(currentSection._id)}
                                                className={completedSections.includes(currentSection._id) ? "opacity-50" : ""}
                                            >
                                                {completedSections.includes(currentSection._id) ? "MISSION COMPLETED" : "MARK COMPLETE (+50 XP)"}
                                            </GameButton>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-500 font-mono">
                                Select a stage to begin...
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Unlock Modal */}
            {showUnlockModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GameCard className="w-full max-w-lg bg-slate-900 border-primary shadow-[0_0_50px_rgba(57,255,20,0.1)]">
                        <h3 className="text-2xl font-heading text-primary mb-2">UNLOCK ACCESS</h3>
                        <p className="text-slate-400 text-sm mb-6 font-mono">
                            To unlock this mission pack, please transfer the fee via Instapay and submit your details below. An admin will verify your clearance.
                        </p>

                        {paymentStatus === "success" ? (
                            <div className="bg-green-500/10 border border-green-500 text-green-500 p-6 text-center">
                                <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                                <h4 className="font-heading text-xl">REQUEST SENT</h4>
                                <p className="text-sm">Please wait for admin approval.</p>
                            </div>
                        ) : (
                            <form onSubmit={submitUnlockRequest} className="space-y-4">
                                <div className="bg-slate-800 p-4 rounded border border-slate-700 mb-4 flex items-center gap-4">
                                    <Smartphone className="w-8 h-8 text-arcade" />
                                    <div>
                                        <div className="text-xs text-slate-400">INSTAPAY NUMBER</div>
                                        <div className="font-mono text-xl text-white">0123 456 7890</div>
                                    </div>
                                </div>

                                <GameInput
                                    label="Your Full Name"
                                    required
                                    value={paymentForm.fullName}
                                    onChange={e => setPaymentForm({ ...paymentForm, fullName: e.target.value })}
                                />
                                <GameInput
                                    label="WhatsApp Number"
                                    required
                                    value={paymentForm.phoneNumber}
                                    placeholder="+20 1xx ..."
                                    onChange={e => setPaymentForm({ ...paymentForm, phoneNumber: e.target.value })}
                                />
                                <GameInput
                                    label="Transaction Ref / Notes"
                                    value={paymentForm.notes}
                                    onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                />

                                <div className="flex gap-4 mt-6">
                                    <GameButton type="button" variant="ghost" className="flex-1" onClick={() => setShowUnlockModal(false)}>CANCEL</GameButton>
                                    <GameButton type="submit" className="flex-1" disabled={paymentStatus === "submitting"}>
                                        {paymentStatus === "submitting" ? "TRANSMITTING..." : "SUBMIT REQUEST"}
                                    </GameButton>
                                </div>
                                {paymentStatus === "error" && (
                                    <p className="text-red-500 text-xs text-center mt-2">Transmission failed. Try again.</p>
                                )}
                            </form>
                        )}
                    </GameCard>
                </div>
            )}

        </div>
    );
}
