"use client";

import { useState, useEffect } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { CheckCircle, XCircle } from "lucide-react";

interface CertificateRequest {
    _id: string;
    userId: { name: string; email: string };
    courseId: { title: string };
    fullName: string;
    phoneNumber: string;
    status: "pending" | "approved" | "rejected";
    createdAt: string;
}

export function AdminCertificates() {
    const [requests, setRequests] = useState<CertificateRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const res = await fetch("/api/admin/certificates");
            if (res.ok) {
                const data = await res.json();
                setRequests(data.requests);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id: string, status: "approved" | "rejected") => {
        try {
            const res = await fetch(`/api/admin/certificates/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (res.ok) {
                setRequests(requests.map(r => r._id === id ? { ...r, status } : r));
            }
        } catch (e) { console.error(e); }
    };

    const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

    const filteredRequests = requests.filter(req => filter === "all" ? true : req.status === filter);

    if (loading) return <div className="text-slate-500 font-mono animate-pulse">Loading certificates...</div>;

    if (requests.length === 0) return (
        <div className="text-slate-600 font-mono border border-slate-800 p-8 text-center rounded">
            No certificate requests found.
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex gap-2 pb-4 border-b border-slate-800 overflow-x-auto">
                {["all", "pending", "approved", "rejected"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f as any)}
                        className={`px-4 py-1 rounded text-sm font-mono uppercase transition-colors ${filter === f
                                ? "bg-primary text-slate-900 font-bold"
                                : "bg-slate-900 text-slate-500 hover:text-white"
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {filteredRequests.map((req) => (
                <div key={req._id} className="bg-slate-900 border border-slate-700 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-grow">
                        <div className="flex gap-2 mb-1">
                            <span className={`text-xs font-mono px-2 rounded ${req.status === 'approved' ? 'bg-green-500/20 text-green-500' :
                                req.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                                    'bg-yellow-500/20 text-yellow-500'
                                }`}>
                                STATUS: {req.status.toUpperCase()}
                            </span>
                            <span className="text-xs font-mono bg-primary/20 text-primary px-2 rounded">USER: {req.userId?.name}</span>
                        </div>
                        <div className="text-white font-bold text-lg">{req.fullName}</div>
                        <div className="font-mono text-sm text-slate-400">
                            Applied for: <span className="text-secondary">{req.courseId?.title}</span>
                        </div>
                        <div className="text-sm text-slate-500 mt-1 flex items-center gap-2">
                            PHONE: <span className="text-white select-all">{req.phoneNumber}</span>
                        </div>
                    </div>

                    {req.status === "pending" && (
                        <div className="flex gap-2">
                            <GameButton size="sm" variant="danger" onClick={() => handleAction(req._id, "rejected")}>REJECT</GameButton>
                            <GameButton size="sm" variant="primary" onClick={() => handleAction(req._id, "approved")}>APPROVE</GameButton>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
