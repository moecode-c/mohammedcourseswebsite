
"use client";

import { Users, BookOpen, DollarSign } from "lucide-react";

interface AdminStatsProps {
    usersCount: number;
    coursesCount: number;
    pendingRequests: number;
    totalRevenue: number;
}

export function AdminStats({ usersCount, coursesCount, pendingRequests, totalRevenue }: AdminStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-blue-500/20 rounded text-blue-400">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-mono">TOTAL USERS</div>
                        <div className="text-2xl font-bold text-white">{usersCount}</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-green-500/20 rounded text-green-400">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-mono">ACTIVE MISSIONS</div>
                        <div className="text-2xl font-bold text-white">{coursesCount}</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-yellow-500/20 rounded text-yellow-400">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-mono">PENDING REQUESTS</div>
                        <div className="text-2xl font-bold text-white">{pendingRequests}</div>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-emerald-500/20 rounded text-emerald-400">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-mono">TOTAL REVENUE</div>
                        <div className="text-2xl font-bold text-white">{totalRevenue.toLocaleString()} EGP</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
