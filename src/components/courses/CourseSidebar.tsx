"use client";

import { useState } from "react";
import { Filter, X, ChevronRight } from "lucide-react";

interface CourseSidebarProps {
    allLanguages: string[];
    selectedLanguage: string | null;
    setSelectedLanguage: (lang: string | null) => void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    isOpen: boolean;
    onClose: () => void;
}

export function CourseSidebar({
    allLanguages,
    selectedLanguage,
    setSelectedLanguage,
    searchQuery,
    setSearchQuery,
    isOpen,
    onClose
}: CourseSidebarProps) {
    return (
        <>
            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-[60] w-72 bg-slate-900 border-r border-slate-700 p-6 shadow-2xl transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-auto md:w-64 md:shadow-none md:border-r-0 md:bg-transparent md:p-0 overflow-y-auto
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <div className="flex justify-between items-center mb-8 md:hidden">
                    <h2 className="text-xl font-heading text-white">FILTERS</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="space-y-8">
                    {/* Search Section */}
                    <div>
                        <h3 className="text-sm font-mono text-slate-500 uppercase mb-4 flex items-center gap-2">
                            <Filter className="w-4 h-4" /> Search
                        </h3>
                        <input
                            type="text"
                            placeholder="Find a course..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-800 border-none rounded p-3 text-white text-sm focus:ring-1 focus:ring-primary outline-none font-mono placeholder:text-slate-600"
                        />
                    </div>

                    {/* Languages Section */}
                    <div>
                        <h3 className="text-sm font-mono text-slate-500 uppercase mb-4">Technologies</h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => setSelectedLanguage(null)}
                                className={`
                                    flex items-center justify-between w-full px-4 py-3 rounded text-sm font-mono transition-all border
                                    ${!selectedLanguage
                                        ? 'bg-primary/10 text-primary border-primary'
                                        : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                                    }
                                `}
                            >
                                <span>ALL</span>
                                {!selectedLanguage && <ChevronRight className="w-4 h-4" />}
                            </button>

                            {allLanguages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setSelectedLanguage(lang)}
                                    className={`
                                        flex items-center justify-between w-full px-4 py-3 rounded text-sm font-mono transition-all border
                                        ${selectedLanguage === lang
                                            ? 'bg-primary/10 text-primary border-primary'
                                            : 'bg-slate-800/50 text-slate-400 border-transparent hover:bg-slate-800 hover:text-white'
                                        }
                                    `}
                                >
                                    <span>{lang}</span>
                                    {selectedLanguage === lang && <ChevronRight className="w-4 h-4" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
