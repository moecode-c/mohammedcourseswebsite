"use client";

import { useState, useEffect } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Request {
    _id: string;
    userId: { _id: string; name: string; email: string };
    courseId: { _id: string; title: string; price: number };
    status: string;
    paymentDetails: { fullName: string; phoneNumber: string; transactionNotes: string };
    createdAt: string;
}

interface Course {
    _id: string;
    title: string;
    sections: string[];
}

export default function AdminDashboard() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateCourse, setShowCreateCourse] = useState(false);
    const [showCourses, setShowCourses] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [newCourse, setNewCourse] = useState({ title: "", description: "", price: 0, isFree: false, thumbnail: "", difficulty: "beginner" });
    const [newSection, setNewSection] = useState({ title: "", content: "", videoUrl: "", isFree: false });

    const router = useRouter();

    useEffect(() => {
        fetchRequests();
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await fetch("/api/courses");
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/requests");
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests);
            } else {
                // Handle error or redirect if unauthorized
                router.push("/login");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: "approved" | "rejected") => {
        try {
            const res = await fetch(`/api/admin/requests/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setRequests(requests.filter(r => r._id !== id));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCreateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/courses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newCourse)
            });
            if (res.ok) {
                alert("Course Created!");
                setShowCreateCourse(false);
                setNewCourse({ title: "", description: "", price: 0, isFree: false, thumbnail: "", difficulty: "beginner" });
                fetchCourses();
            }
        } catch (e) {
            alert("Error creating course");
        }
    };

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId) return;

        try {
            const res = await fetch(`/api/courses/${selectedCourseId}/sections`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSection)
            });

            if (res.ok) {
                alert("Section Added!");
                setNewSection({ title: "", content: "", videoUrl: "", isFree: false });
                setSelectedCourseId(null);
            } else {
                alert("Failed to add section");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <main className="min-h-screen bg-slate-950 p-6 text-white min-w-full">
            <header className="max-w-7xl mx-auto mb-10 flex justify-between items-center">
                <h1 className="text-3xl font-heading text-red-500">ADMINISTRATOR CONTROL</h1>
                <GameButton variant="ghost" onClick={() => router.push("/dashboard")}>EXIT TO DASHBOARD</GameButton>
            </header>

            <div className="max-w-7xl mx-auto mb-12 space-y-8">
                {/* Course Actions */}
                <section>
                    <div className="flex gap-4 mb-6">
                        <GameButton onClick={() => setShowCreateCourse(!showCreateCourse)}>
                            {showCreateCourse ? "CANCEL CREATE" : "+ CREATE NEW COURSE"}
                        </GameButton>
                        <GameButton variant="secondary" onClick={() => setShowCourses(!showCourses)}>
                            {showCourses ? "HIDE COURSES" : "MANAGE COURSES"}
                        </GameButton>
                    </div>

                    {showCreateCourse && (
                        <div className="bg-slate-900 border border-primary/50 p-6 rounded shadow-[0_0_20px_rgba(57,255,20,0.1)] mb-8 animate-fade-in-up">
                            <h3 className="text-lg font-heading text-primary mb-4">DEPLOY NEW MISSION</h3>
                            <form onSubmit={handleCreateCourse} className="space-y-4 max-w-2xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        placeholder="Mission Title"
                                        className="bg-slate-950 border border-slate-700 p-2 text-white w-full"
                                        value={newCourse.title}
                                        onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                                        required
                                    />
                                    <select
                                        className="bg-slate-950 border border-slate-700 p-2 text-white w-full"
                                        value={newCourse.difficulty}
                                        onChange={e => setNewCourse({ ...newCourse, difficulty: e.target.value })}
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Briefing (Description)"
                                    className="bg-slate-950 border border-slate-700 p-2 text-white w-full h-24"
                                    value={newCourse.description}
                                    onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                                    required
                                />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                    <input
                                        type="number"
                                        placeholder="Price (EGP)"
                                        className="bg-slate-950 border border-slate-700 p-2 text-white w-full"
                                        value={newCourse.price}
                                        onChange={e => setNewCourse({ ...newCourse, price: Number(e.target.value) })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Thumbnail URL"
                                        className="bg-slate-950 border border-slate-700 p-2 text-white w-full"
                                        value={newCourse.thumbnail}
                                        onChange={e => setNewCourse({ ...newCourse, thumbnail: e.target.value })}
                                    />
                                    <label className="flex items-center gap-2 text-white cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={newCourse.isFree}
                                            onChange={e => setNewCourse({ ...newCourse, isFree: e.target.checked })}
                                        />
                                        Free Access
                                    </label>
                                </div>
                                <GameButton type="submit">INITIALIZE COURSE</GameButton>
                            </form>
                        </div>
                    )}

                    {showCourses && (
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded mb-8 animate-fade-in-up">
                            <h3 className="text-lg font-heading text-secondary mb-4">ACTIVE MISSIONS (COURSES)</h3>
                            <div className="grid gap-4">
                                {courses.map(course => (
                                    <div key={course._id} className="border border-slate-700 p-4 bg-slate-950 rounded">
                                        <div className="flex justify-between items-center mb-4">
                                            <h4 className="font-bold text-lg">{course.title}</h4>
                                            <GameButton size="sm" onClick={() => setSelectedCourseId(selectedCourseId === course._id ? null : course._id)}>
                                                {selectedCourseId === course._id ? "CLOSE" : "+ ADD SECTION"}
                                            </GameButton>
                                        </div>

                                        {selectedCourseId === course._id && (
                                            <form onSubmit={handleAddSection} className="bg-slate-900 p-4 border-t border-slate-800 mt-4 animate-fade-in-up">
                                                <h5 className="font-mono text-sm text-primary mb-3">NEW STAGE PARAMETERS</h5>
                                                <div className="space-y-3">
                                                    <input
                                                        placeholder="Stage Title"
                                                        className="w-full bg-slate-950 border border-slate-700 p-2 text-white"
                                                        value={newSection.title}
                                                        onChange={e => setNewSection({ ...newSection, title: e.target.value })}
                                                        required
                                                    />
                                                    <textarea
                                                        placeholder="Content (Markdown supported)"
                                                        className="w-full bg-slate-950 border border-slate-700 p-2 text-white h-24"
                                                        value={newSection.content}
                                                        onChange={e => setNewSection({ ...newSection, content: e.target.value })}
                                                        required
                                                    />
                                                    <input
                                                        placeholder="Video Embed URL (YouTube)"
                                                        className="w-full bg-slate-950 border border-slate-700 p-2 text-white"
                                                        value={newSection.videoUrl}
                                                        onChange={e => setNewSection({ ...newSection, videoUrl: e.target.value })}
                                                    />
                                                    <label className="flex items-center gap-2 text-white cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={newSection.isFree}
                                                            onChange={e => setNewSection({ ...newSection, isFree: e.target.checked })}
                                                        />
                                                        Free Preview Section
                                                    </label>
                                                    <GameButton type="submit" size="sm">UPLOAD TO SERVER</GameButton>
                                                </div>
                                            </form>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-mono mb-4 text-slate-400">PENDING ACCESS REQUESTS [{requests.length}]</h2>

                    {loading ? (
                        <div className="text-slate-500 font-mono animate-pulse">Scanning network...</div>
                    ) : requests.length === 0 ? (
                        <div className="text-slate-600 font-mono border border-slate-800 p-8 text-center rounded">
                            No pending requests. System nominal.
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {requests.map((req) => (
                                <div key={req._id} className="bg-slate-900 border border-slate-700 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex-grow">
                                        <div className="flex gap-2 mb-1">
                                            <span className="text-xs font-mono bg-primary/20 text-primary px-2 rounded">USER: {req.userId?.name}</span>
                                            <span className="text-xs font-mono bg-secondary/20 text-secondary px-2 rounded">COURSE: {req.courseId?.title}</span>
                                        </div>
                                        <div className="font-mono text-sm text-slate-300">
                                            <span className="text-slate-500">PAYMENT FROM:</span> {req.paymentDetails.fullName} <span className="text-slate-600">|</span> {req.paymentDetails.phoneNumber}
                                        </div>
                                        {req.paymentDetails.transactionNotes && (
                                            <div className="text-xs text-slate-500 mt-1 italic">
                                                "{req.paymentDetails.transactionNotes}"
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <GameButton
                                            size="sm"
                                            variant="danger"
                                            onClick={() => handleAction(req._id, "rejected")}
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </GameButton>
                                        <GameButton
                                            size="sm"
                                            variant="primary"
                                            onClick={() => handleAction(req._id, "approved")}
                                        >
                                            <CheckCircle className="w-4 h-4" /> APPROVE
                                        </GameButton>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
