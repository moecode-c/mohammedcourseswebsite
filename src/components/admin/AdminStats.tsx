
"use client";

import { Users, BookOpen, DollarSign } from "lucide-react";

interface AdminStatsProps {
    usersCount: number;
    coursesCount: number;
    pendingRequests: number;
    totalRevenue: number;
    dailyRevenue: number;
    monthlyRevenue: number;
    bestSellingCourse: string;
}

export function AdminStats({ usersCount, coursesCount, pendingRequests, totalRevenue, dailyRevenue, monthlyRevenue, bestSellingCourse }: AdminStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
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

            {/* Daily Revenue */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-purple-500/20 rounded text-purple-400">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-mono">TODAY'S REVENUE</div>
                        <div className="text-2xl font-bold text-white">{dailyRevenue.toLocaleString()} EGP</div>
                    </div>
                </div>
            </div>

            {/* Monthly Revenue */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-pink-500/20 rounded text-pink-400">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-mono">THIS MONTH</div>
                        <div className="text-2xl font-bold text-white">{monthlyRevenue.toLocaleString()} EGP</div>
                    </div>
                </div>
            </div>

            {/* Total Revenue */}
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

            {/* Best Selling Course Card - Full Width or Extra */}
            <div className="md:col-span-2 lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded shadow-[0_0_20px_rgba(0,0,0,0.3)] flex justify-between items-center">
                <div>
                    <div className="text-xs text-slate-400 font-mono uppercase mb-1">Top Performing Course</div>
                    <div className="text-xl font-heading text-primary">{bestSellingCourse || "N/A"}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-400 font-mono">PENDING REQUESTS</div>
                    <div className="text-2xl font-bold text-white">{pendingRequests}</div>
                </div>
            </div>
        </div>
    );
}
