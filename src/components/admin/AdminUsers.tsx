
"use client";

import { useState, useEffect } from "react";
import { GameButton } from "@/components/ui/GameButton";
import { Trash2, User as UserIcon } from "lucide-react";

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to initialize deletion protocol for this user?")) return;

        try {
            const res = await fetch("/api/admin/users", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });
            if (res.ok) {
                setUsers(users.filter(u => u._id !== id));
            }
        } catch (e) {
            console.error(e);
            alert("Deletion failed");
        }
    };

    const [searchQuery, setSearchQuery] = useState("");

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-slate-500 font-mono animate-pulse">Scanning User Database...</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-heading text-slate-200">USER DATABASE [{filteredUsers.length}]</h2>
                <input
                    type="text"
                    placeholder="Search agents..."
                    className="bg-slate-900 border border-slate-700 p-2 rounded text-white min-w-[250px] focus:outline-none focus:border-primary"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filteredUsers.map((user) => (
                    <div key={user._id} className="bg-slate-900 border border-slate-800 p-4 rounded flex items-center justify-between group hover:border-slate-600 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                                <UserIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="font-bold text-white flex items-center gap-2">
                                    {user.name}
                                    <span className={`text-[10px] px-2 py-0.5 rounded border ${user.role === 'admin' ? 'border-red-500 text-red-500' : 'border-slate-600 text-slate-500'}`}>
                                        {user.role.toUpperCase()}
                                    </span>
                                </div>
                                <div className="text-xs text-slate-500 font-mono">{user.email}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-xs text-slate-600 font-mono hidden md:block">
                                JOINED: {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                            {user.role !== "admin" && (
                                <button
                                    onClick={() => handleDelete(user._id)}
                                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                    title="Delete User"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
