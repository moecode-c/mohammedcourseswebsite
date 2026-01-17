"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GameButton } from "@/components/ui/GameButton";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ArrowLeft, ChevronUp, ChevronDown, Edit, Trash2, Save, Plus } from "lucide-react";

interface Section {
    _id: string;
    title: string;
    type: string;
    content?: string;
    videoUrl?: string;
    linkUrl?: string;
    isFree: boolean;
}

interface Course {
    _id: string;
    title: string;
    difficulty: string;
    description: string;
    price: number;
    isFree: boolean;
    isFeatured: boolean;
    thumbnail: string;
    languages: string[];
    sections: Section[];
}

export default function EditCoursePage() {
    const params = useParams();
    const router = useRouter();
    const courseId = params?.id as string;

    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Add Section State
    const [newSection, setNewSection] = useState({ title: "", content: "", type: "text", videoUrl: "", linkUrl: "", isFree: false });

    // Edit Section State
    const [editingSection, setEditingSection] = useState<Section | null>(null);
    const [editForm, setEditForm] = useState({ title: "", content: "", videoUrl: "", linkUrl: "", type: "text", isFree: false });

    // Language Input Buffer
    const [languageInput, setLanguageInput] = useState("");

    useEffect(() => {
        if (courseId) {
            fetchCourse();
        }
    }, [courseId]);

    useEffect(() => {
        if (course) {
            setLanguageInput(course.languages?.join(", ") || "");
        }
    }, [course]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/courses/${courseId}`); // Modified API to support grabbing single course if needed, or filter form list
            // Actually existing /api/courses returns all. We might need a single get.
            // If /api/courses/[id] exists for PUT, maybe it supports GET? 
            // Let's assume we might need to fetch all and find, OR user the existing GET endpoint if I made one.
            // Checking existing code... PUT exists. GET might not. 
            // I'll try GET /api/courses/[id]. If not, I'll filter from /api/courses.

            let data;
            const resSingle = await fetch(`/api/courses/${courseId}`);
            if (resSingle.ok) {
                const json = await resSingle.json();
                setCourse(json.course);
            } else {
                // Fallback if specific GET not implemented
                const resAll = await fetch("/api/courses");
                if (resAll.ok) {
                    const json = await resAll.json();
                    const found = json.courses.find((c: any) => c._id === courseId);
                    setCourse(found || null);
                }
            }
            setLoading(false);
        } catch (e) {
            console.error(e);
            setLoading(false);
        }
    };

    const handleUpdateCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!course) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/courses/${courseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: course.title,
                    description: course.description,
                    price: course.isFree ? 0 : course.price,
                    isFree: course.isFree,
                    isFeatured: course.isFeatured,
                    difficulty: course.difficulty,
                    thumbnail: course.thumbnail,

                    languages: languageInput.split(",").map(s => s.trim()).filter(Boolean)
                }),
            });
            if (res.ok) {
                alert("Course Updated Successfully!");
            } else {
                alert("Update Failed");
            }
        } catch (e) { console.error(e); alert("Error updating course"); }
        setSaving(false);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !course) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                setCourse({ ...course, thumbnail: data.url });
            }
        } catch (err) { alert("Upload failed"); }
    };

    const handleAddSection = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/courses/${courseId}/sections`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSection)
            });

            if (res.ok) {
                alert("Section Added!");
                setNewSection({ title: "", content: "", type: "text", videoUrl: "", linkUrl: "", isFree: false });
                fetchCourse(); // Refresh
            } else {
                alert("Failed to add section");
            }
        } catch (e) { console.error(e); }
    };

    const handleReorderSection = async (idx: number, direction: 'up' | 'down') => {
        if (!course) return;
        if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === course.sections.length - 1)) return;

        const newSections = [...course.sections];
        const sectionToMove = newSections[idx];
        newSections.splice(idx, 1);
        newSections.splice(direction === 'up' ? idx - 1 : idx + 1, 0, sectionToMove);

        // Optimistic
        setCourse({ ...course, sections: newSections });

        try {
            const sectionIds = newSections.map((s) => s._id);
            await fetch(`/api/courses/${course._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sections: sectionIds }),
            });
        } catch (e) { fetchCourse(); }
    };

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm("Delete this section permanently?")) return;
        try {
            await fetch(`/api/sections/${sectionId}`, { method: "DELETE" });
            fetchCourse();
        } catch (e) { console.error(e); }
    };

    /* Edit Section Logic */
    const openEditSection = (section: Section) => {
        setEditingSection(section);
        setEditForm({
            title: section.title,
            content: section.content || "",
            videoUrl: section.videoUrl || "",
            linkUrl: section.linkUrl || "",
            type: section.type || "text",
            isFree: section.isFree
        });
    };

    const handleUpdateSection = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSection) return;
        try {
            const res = await fetch(`/api/sections/${editingSection._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editForm),
            });
            if (res.ok) {
                alert("Section updated!");
                setEditingSection(null);
                fetchCourse();
            }
        } catch (e) { alert("Failed to update section"); }
    };

    if (loading) return <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">Loading Course Data...</div>;
    if (!course) return <div className="bg-slate-950 min-h-screen text-white flex items-center justify-center">Course Not Found</div>;

    return (
        <main className="min-h-screen bg-slate-950 text-white flex flex-col lg:flex-row">
            {/* Reuse Sidebar for Visual Consistency, though navigation might act purely as links */}
            <AdminSidebar currentView="courses" setCurrentView={(view) => { if (view !== 'courses') router.push('/admin'); }} />

            <div className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-screen">
                <header className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-800">
                    <GameButton variant="ghost" size="sm" onClick={() => router.push('/admin')}>
                        <ArrowLeft className="w-5 h-5" /> BACK
                    </GameButton>
                    <div>
                        <h1 className="text-2xl font-heading text-primary">EDITING: {course.title}</h1>
                        <p className="text-slate-500 font-mono text-xs uppercase">ID: {course._id}</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* LEFT COLUMN: Course Details */}
                    <div className="xl:col-span-1 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Edit className="w-4 h-4 text-primary" /> COURSE DETAILS
                            </h3>
                            <form onSubmit={handleUpdateCourse} className="space-y-4">
                                <div>
                                    <label className="text-xs text-slate-500 font-mono mb-1 block">TITLE</label>
                                    <input className="w-full bg-slate-950 border border-slate-700 p-2 text-white" value={course.title} onChange={e => setCourse({ ...course, title: e.target.value })} required />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500 font-mono mb-1 block">DIFFICULTY</label>
                                    <select className="w-full bg-slate-950 border border-slate-700 p-2 text-white" value={course.difficulty} onChange={e => setCourse({ ...course, difficulty: e.target.value })}>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500 font-mono mb-1 block">LANGUAGES (Comma Separated)</label>
                                    <input
                                        className="w-full bg-slate-950 border border-slate-700 p-2 text-white"
                                        placeholder="e.g. JavaScript, React, Node.js"
                                        value={languageInput}
                                        onChange={e => setLanguageInput(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500 font-mono mb-1 block">DESCRIPTION</label>
                                    <textarea className="w-full bg-slate-950 border border-slate-700 p-2 text-white h-32" value={course.description} onChange={e => setCourse({ ...course, description: e.target.value })} required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-slate-500 font-mono mb-1 block">PRICE (EGP)</label>
                                        <input
                                            type="number"
                                            className="w-full bg-slate-950 border border-slate-700 p-2 text-white disabled:opacity-50"
                                            value={course.isFree ? 0 : course.price}
                                            onChange={e => setCourse({ ...course, price: Number(e.target.value) })}
                                            disabled={course.isFree}
                                        />
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <label className="flex items-center gap-2 text-white cursor-pointer p-2 border border-slate-700 rounded bg-slate-950 hover:bg-slate-800">
                                            <input type="checkbox" checked={course.isFree} onChange={e => setCourse({ ...course, isFree: e.target.checked, price: e.target.checked ? 0 : course.price })} />
                                            <span className="text-sm">Free Access</span>
                                        </label>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500 font-mono mb-1 block">THUMBNAIL</label>
                                    <div className="flex items-center gap-2">
                                        <input type="file" onChange={handleImageUpload} className="text-xs text-slate-400" />
                                        {course.thumbnail && <img src={course.thumbnail} alt="Thumb" className="w-10 h-10 object-cover rounded border border-slate-700" />}
                                    </div>
                                </div>

                                <label className="flex items-center gap-2 text-white cursor-pointer">
                                    <input type="checkbox" checked={course.isFeatured} onChange={e => setCourse({ ...course, isFeatured: e.target.checked })} />
                                    <span className="text-sm">Featured Course</span>
                                </label>

                                <GameButton type="submit" disabled={saving} className="w-full">
                                    {saving ? "SAVING..." : "SAVE CHANGES"}
                                </GameButton>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Section Management */}
                    <div className="xl:col-span-2 space-y-6">
                        <div className="bg-slate-900 border border-slate-800 p-6 rounded">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center justify-between">
                                <span className="flex items-center gap-2"><ArrowLeft className="w-4 h-4 rotate-180 text-secondary" /> CURRICULUM ({course.sections.length})</span>
                                <span className="text-xs font-mono text-slate-500">DRAG & DROP ENABLED (Sort Buttons)</span>
                            </h3>

                            <div className="space-y-2 mb-8">
                                {course.sections.map((section, idx) => (
                                    <div key={section._id} className="bg-slate-950 border border-slate-800 p-4 flex justify-between items-center rounded group hover:border-slate-600 transition">
                                        <div className="flex items-center gap-4">
                                            <span className="font-mono text-slate-600 text-sm">#{idx + 1}</span>
                                            <div>
                                                <div className="font-bold text-white">{section.title}</div>
                                                <div className="text-xs text-slate-500 uppercase">{section.type} {section.isFree && "• FREE PREVIEW"}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleReorderSection(idx, 'up')} disabled={idx === 0} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-20"><ChevronUp className="w-4 h-4" /></button>
                                            <button onClick={() => handleReorderSection(idx, 'down')} disabled={idx === course.sections.length - 1} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white disabled:opacity-20"><ChevronDown className="w-4 h-4" /></button>
                                            <div className="w-px h-6 bg-slate-800 mx-2"></div>
                                            <button onClick={() => openEditSection(section)} className="p-2 hover:bg-sky-900/30 rounded text-sky-400"><Edit className="w-4 h-4" /></button>
                                            <button onClick={() => handleDeleteSection(section._id)} className="p-2 hover:bg-red-900/30 rounded text-red-400"><Trash2 className="w-4 h-4" /></button>
                                        </div>
                                    </div>
                                ))}
                                {course.sections.length === 0 && <div className="text-center py-8 text-slate-600 italic">No stages defined yet. Add one below.</div>}
                            </div>

                            <div className="border-t border-slate-800 pt-6">
                                <h4 className="text-md font-heading text-secondary mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> ADD NEW STAGE</h4>
                                <form onSubmit={handleAddSection} className="bg-slate-950 p-4 rounded border border-slate-800/50">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <input placeholder="Stage Title" className="w-full bg-slate-900 border border-slate-700 p-2 text-white" value={newSection.title} onChange={e => setNewSection({ ...newSection, title: e.target.value })} required />
                                        <select className="w-full bg-slate-900 border border-slate-700 p-2 text-white" value={newSection.type} onChange={e => setNewSection({ ...newSection, type: e.target.value })}>
                                            <option value="text">Text / Article</option>
                                            <option value="video">Video Embed</option>
                                            <option value="link">External Resource</option>
                                            <option value="quiz">Quiz</option>
                                        </select>
                                    </div>

                                    {newSection.type === "text" && <textarea placeholder="Content (Markdown)" className="w-full bg-slate-900 border border-slate-700 p-2 text-white h-24 mb-4" value={newSection.content} onChange={e => setNewSection({ ...newSection, content: e.target.value })} />}
                                    {newSection.type === "video" && <input placeholder="YouTube Embed URL" className="w-full bg-slate-900 border border-slate-700 p-2 text-white mb-4" value={newSection.videoUrl} onChange={e => setNewSection({ ...newSection, videoUrl: e.target.value })} />}
                                    {newSection.type === "link" && <input placeholder="https://..." className="w-full bg-slate-900 border border-slate-700 p-2 text-white mb-4" value={newSection.linkUrl} onChange={e => setNewSection({ ...newSection, linkUrl: e.target.value })} />}

                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 text-white cursor-pointer">
                                            <input type="checkbox" checked={newSection.isFree} onChange={e => setNewSection({ ...newSection, isFree: e.target.checked })} />
                                            <span className="text-sm text-slate-400">Public Preview</span>
                                        </label>
                                        <GameButton type="submit" size="sm">ADD STAGE</GameButton>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Edit Section Modal */}
                {editingSection && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-primary/20 p-6 rounded w-full max-w-2xl shadow-2xl">
                            <h3 className="text-xl font-heading text-white mb-4 border-b border-slate-800 pb-2">EDITING: {editingSection.title}</h3>
                            <form onSubmit={handleUpdateSection} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <input placeholder="Title" className="w-full bg-slate-950 border border-slate-700 p-2 text-white" value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} required />
                                    <select className="w-full bg-slate-950 border border-slate-700 p-2 text-white" value={editForm.type} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
                                        <option value="text">Text</option>
                                        <option value="video">Video</option>
                                        <option value="link">Link</option>
                                        <option value="quiz">Quiz</option>
                                    </select>
                                </div>

                                {editForm.type === "text" && <textarea className="w-full bg-slate-950 border border-slate-700 p-2 text-white h-48 font-mono text-sm" value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />}
                                {editForm.type === "video" && (
                                    <>
                                        <input placeholder="Video URL" className="w-full bg-slate-950 border border-slate-700 p-2 text-white" value={editForm.videoUrl} onChange={e => setEditForm({ ...editForm, videoUrl: e.target.value })} />
                                        <textarea placeholder="Description" className="w-full bg-slate-950 border border-slate-700 p-2 text-white h-24" value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />
                                    </>
                                )}
                                {editForm.type === "link" && (
                                    <>
                                        <input placeholder="External Link" className="w-full bg-slate-950 border border-slate-700 p-2 text-white" value={editForm.linkUrl} onChange={e => setEditForm({ ...editForm, linkUrl: e.target.value })} />
                                        <textarea placeholder="Description" className="w-full bg-slate-950 border border-slate-700 p-2 text-white h-24" value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} />
                                    </>
                                )}

                                <div className="flex justify-between items-center pt-4">
                                    <label className="flex items-center gap-2 text-white cursor-pointer">
                                        <input type="checkbox" checked={editForm.isFree} onChange={e => setEditForm({ ...editForm, isFree: e.target.checked })} />
                                        Free Preview
                                    </label>
                                    <div className="flex gap-2">
                                        <GameButton type="button" variant="ghost" onClick={() => setEditingSection(null)}>CANCEL</GameButton>
                                        <GameButton type="submit">SAVE UPDATES</GameButton>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
