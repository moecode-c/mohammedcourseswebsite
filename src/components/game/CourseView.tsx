"use client";

import { useState } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { GameCard } from "@/components/ui/GameCard";
import { GameInput } from "@/components/ui/GameInput";
import { Lock, Play, CheckCircle, Smartphone, Award } from "lucide-react";
import { useRouter } from "next/navigation";
import { XPBar } from "@/components/game/XPBar";

interface CourseViewProps {
    course: any;
    user: any;
    hasPendingCertificate?: boolean;
}

export function CourseView({ course, user, hasPendingCertificate = false }: CourseViewProps) {
    const [currentSection, setCurrentSection] = useState(course.sections[0]);
    const [completedSections, setCompletedSections] = useState<string[]>(user.completedSections || []);
    const [showUnlockModal, setShowUnlockModal] = useState(false);
    const [xpGained, setXpGained] = useState<number | null>(null);

    // Payment Form State
    const [paymentForm, setPaymentForm] = useState({ fullName: "", phoneNumber: "", notes: "" });
    const [paymentStatus, setPaymentStatus] = useState("idle"); // idle, submitting, success, error

    const isCourseLocked = course.isLocked;

    // Check if all sections are completed for certificate eligibility
    const allSectionsCompleted = course.sections.every((s: any) => completedSections.includes(s._id));

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

    // Certificate Form State
    const [showCertificateModal, setShowCertificateModal] = useState(false);
    const [certForm, setCertForm] = useState({ fullName: "", phoneNumber: "" });
    const [certStatus, setCertStatus] = useState("idle");

    const submitCertificateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setCertStatus("submitting");
        try {
            const res = await fetch("/api/certificates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    courseId: course._id,
                    fullName: certForm.fullName,
                    phoneNumber: certForm.phoneNumber
                }),
            });

            if (res.ok) {
                setCertStatus("success");
                setTimeout(() => {
                    setShowCertificateModal(false);
                    setCertStatus("idle");
                }, 2000);
            } else {
                setCertStatus("error");
            }
        } catch (e) {
            setCertStatus("error");
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

                {/* Certificate Button */}
                {!isCourseLocked && (
                    <div className="p-4 border-t border-slate-800 mt-auto">
                        {!allSectionsCompleted ? (
                            <div className="w-full flex flex-col items-center justify-center gap-1 p-3 bg-slate-800/50 text-slate-500 border border-slate-700 rounded font-mono text-sm cursor-not-allowed">
                                <Award className="w-4 h-4" />
                                <span className="text-xs">Complete all sections to claim</span>
                            </div>
                        ) : hasPendingCertificate ? (
                            <div className="w-full flex items-center justify-center gap-2 p-3 bg-slate-800/50 text-slate-400 border border-slate-700 rounded font-mono text-sm cursor-not-allowed">
                                <Award className="w-4 h-4" /> CERTIFICATE PENDING
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowCertificateModal(true)}
                                className="w-full flex items-center justify-center gap-2 p-3 bg-yellow-500/10 text-yellow-500 border border-yellow-500/50 hover:bg-yellow-500/20 transition rounded font-mono text-sm"
                            >
                                <Award className="w-4 h-4" /> CLAIM CERTIFICATE
                            </button>
                        )}
                    </div>
                )}
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
                                        {/* Dynamic Content Based on Type */}
                                        {(() => {
                                            const type = currentSection.type || (currentSection.videoUrl ? "video" : currentSection.linkUrl ? "link" : "text");

                                            switch (type) {
                                                case "video":
                                                    return (
                                                        <>
                                                            {currentSection.videoUrl && (
                                                                <div className="aspect-video bg-black mb-6 rounded border-2 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden relative group select-none" onContextMenu={(e) => e.preventDefault()}>
                                                                    {/* Invisible overlay to prevent clicking through to YouTube */}
                                                                    <div className="absolute inset-0 z-10 pointer-events-none" />
                                                                    {(() => {
                                                                        let videoId = "";
                                                                        try {
                                                                            if (currentSection.videoUrl.includes("v=")) {
                                                                                videoId = currentSection.videoUrl.split("v=")[1].split("&")[0];
                                                                            } else if (currentSection.videoUrl.includes("youtu.be/")) {
                                                                                videoId = currentSection.videoUrl.split("youtu.be/")[1].split("?")[0];
                                                                            } else if (currentSection.videoUrl.includes("embed/")) {
                                                                                videoId = currentSection.videoUrl.split("embed/")[1].split("?")[0];
                                                                            }
                                                                        } catch (e) { }

                                                                        if (videoId) {
                                                                            return (
                                                                                <iframe
                                                                                    src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0`}
                                                                                    title={currentSection.title}
                                                                                    className="w-full h-full pointer-events-auto"
                                                                                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                                                    referrerPolicy="no-referrer"
                                                                                />
                                                                            );
                                                                        } else {
                                                                            return (
                                                                                <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                                                                                    Invalid Video Link
                                                                                </div>
                                                                            );
                                                                        }
                                                                    })()}
                                                                </div>
                                                            )}
                                                            <div className="prose prose-invert max-w-none text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                                                                {currentSection.content}
                                                            </div>
                                                        </>
                                                    );
                                                case "link":
                                                    return (
                                                        <div className="flex flex-col items-center justify-center p-12 border border-slate-800 bg-slate-900 rounded mb-6">
                                                            <h3 className="text-xl font-heading text-secondary mb-4">EXTERNAL RESOURCE</h3>
                                                            <p className="text-slate-400 mb-6 text-center max-w-md">{currentSection.content || "Access the external material for this stage."}</p>
                                                            <a
                                                                href={currentSection.linkUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-secondary/20 text-secondary border border-secondary px-6 py-3 rounded hover:bg-secondary/30 transition flex items-center gap-2 font-mono"
                                                            >
                                                                OPEN RESOURCE
                                                            </a>
                                                        </div>
                                                    );
                                                case "quiz":
                                                    return (
                                                        <div className="p-8 border border-slate-800 bg-slate-900 rounded text-center">
                                                            <h3 className="text-xl font-heading text-primary mb-4">QUIZ MODULE</h3>
                                                            <p className="text-slate-400">Quiz functionality is currently under development.</p>
                                                        </div>
                                                    );
                                                default: // text
                                                    return (
                                                        <div className="prose prose-invert max-w-none text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                                                            {currentSection.content}
                                                        </div>
                                                    );
                                            }
                                        })()}

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
                                <p className="text-sm">Please wait for admin approval. You will be contacted shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={submitUnlockRequest} className="space-y-4">
                                {/* Payment Instructions */}
                                <div className="bg-arcade/10 border border-arcade/50 rounded p-4 mb-4">
                                    <h4 className="font-heading text-arcade text-sm mb-2">📱 PAYMENT INSTRUCTIONS</h4>
                                    <ol className="text-xs text-slate-300 space-y-1 font-mono list-decimal list-inside">
                                        <li>Send <span className="text-white font-bold">{course.price || 0} EGP</span> via Instapay</li>
                                        <li>Take a screenshot of the transaction</li>
                                        <li>Send screenshot to WhatsApp: <span className="text-white font-bold">01022138836</span></li>
                                        <li>Fill the form below and submit</li>
                                    </ol>
                                </div>

                                <div className="bg-slate-800 p-4 rounded border border-slate-700 mb-4 flex items-center gap-4">
                                    <Smartphone className="w-8 h-8 text-arcade" />
                                    <div>
                                        <div className="text-xs text-slate-400">INSTAPAY / WHATSAPP</div>
                                        <div className="font-mono text-xl text-white">01022138836</div>
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

            {/* Certificate Modal */}
            {showCertificateModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <GameCard className="w-full max-w-lg bg-slate-900 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.1)]">
                        <Award className="w-12 h-12 text-yellow-500 mb-4 mx-auto" />
                        <h3 className="text-2xl font-heading text-yellow-500 mb-2 text-center">CLAIM YOUR CERTIFICATE</h3>
                        <p className="text-slate-400 text-sm mb-6 font-mono text-center">
                            Congratulations on completing the mission! Enter your details to receive your official certification.
                        </p>

                        {certStatus === "success" ? (
                            <div className="bg-yellow-500/10 border border-yellow-500 text-yellow-500 p-6 text-center">
                                <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                                <h4 className="font-heading text-xl">APPLICATION RECEIVED</h4>
                                <p className="text-sm">We will contact you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={submitCertificateRequest} className="space-y-4">
                                <GameInput
                                    label="Full Name (for Certificate)"
                                    required
                                    value={certForm.fullName}
                                    onChange={e => setCertForm({ ...certForm, fullName: e.target.value })}
                                />
                                <GameInput
                                    label="WhatsApp Number"
                                    required
                                    value={certForm.phoneNumber}
                                    placeholder="+20 1xx ..."
                                    onChange={e => setCertForm({ ...certForm, phoneNumber: e.target.value })}
                                />

                                <div className="flex gap-4 mt-6">
                                    <GameButton type="button" variant="ghost" className="flex-1" onClick={() => setShowCertificateModal(false)}>CANCEL</GameButton>
                                    <GameButton type="submit" className="flex-1 bg-yellow-600 hover:bg-yellow-500" disabled={certStatus === "submitting"}>
                                        {certStatus === "submitting" ? "TRANSMITTING..." : "SUBMIT APPLICATION"}
                                    </GameButton>
                                </div>
                                {certStatus === "error" && (
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
