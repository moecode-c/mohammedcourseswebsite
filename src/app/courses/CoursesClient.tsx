"use client";

import { useState } from "react";
import Link from "next/link";
import { GameCard } from "@/components/ui/GameCard";
import { GameButton } from "@/components/ui/GameButton";
import { Search, Filter, Play, Tag } from "lucide-react";

interface CoursesClientProps {
    courses: any[];
}

export default function CoursesClient({ courses }: CoursesClientProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

    // Get all unique languages
    const allLanguages = Array.from(new Set(courses.flatMap(c => c.languages || [])));

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLang = selectedLanguage ? course.languages?.includes(selectedLanguage) : true;

        return matchesSearch && matchesLang;
    });

    return (
        <div>
            {/* Search & Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 bg-slate-900/50 p-4 rounded border border-slate-800">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        className="w-full bg-slate-800 border-none rounded pl-10 pr-4 py-2 text-white focus:ring-1 focus:ring-primary outline-none font-mono"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 flex-wrap items-center">
                    <Filter className="w-5 h-5 text-slate-500 hidden md:block" />
                    <button
                        onClick={() => setSelectedLanguage(null)}
                        className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${!selectedLanguage ? 'bg-primary text-black border-primary' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                    >
                        ALL
                    </button>
                    {allLanguages.map(lang => (
                        <button
                            key={lang as string}
                            onClick={() => setSelectedLanguage(lang as string)}
                            className={`px-3 py-1 rounded text-xs font-mono transition-colors border ${selectedLanguage === lang ? 'bg-primary text-black border-primary' : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-500'}`}
                        >
                            {lang as string}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course: any) => (
                        <div key={course._id} className="group relative h-full">
                            <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                            <GameCard className="h-full flex flex-col relative z-10 bg-slate-900/90 backdrop-blur">
                                <Link href={`/courses/${course._id}`} className="block">
                                    <div className="aspect-video bg-slate-800 mb-4 rounded border border-slate-700 overflow-hidden relative">
                                        {course.thumbnail && (
                                            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                                        )}
                                    </div>
                                </Link>

                                <div className="flex flex-col flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-heading text-lg text-primary group-hover:text-white transition-colors">
                                            <Link href={`/courses/${course._id}`}>{course.title}</Link>
                                        </h3>
                                        {course.isFree ? (
                                            <span className="text-sm font-bold bg-primary/20 text-primary px-3 py-1 rounded font-mono">FREE PLAY</span>
                                        ) : (
                                            <span className="text-xl font-bold font-heading text-arcade">{course.price} EGP</span>
                                        )}
                                    </div>

                                    <p className="text-slate-400 text-sm font-mono mb-4 line-clamp-3 flex-grow">
                                        {course.description}
                                    </p>

                                    {course.languages && course.languages.length > 0 && (
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            {course.languages.map((lang: string) => (
                                                <span key={lang} className="text-[10px] flex items-center gap-1 bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                                                    <Tag className="w-3 h-3" /> {lang}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="mt-auto">
                                        <Link href={`/courses/${course._id}`}>
                                            <GameButton className="w-full" variant="secondary">
                                                DETAILS <Play className="w-3 h-3 ml-2" />
                                            </GameButton>
                                        </Link>
                                    </div>
                                </div>
                            </GameCard>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center border border-dashed border-slate-800 rounded bg-slate-900/30">
                        <Search className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                        <h3 className="text-xl font-heading text-slate-500 mb-2">No Courses Found</h3>
                        <p className="text-slate-500 font-mono">Try adjusting your search filters.</p>
                        <button
                            onClick={() => { setSearchQuery(""); setSelectedLanguage(null) }}
                            className="mt-4 text-primary hover:underline font-mono text-sm"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
