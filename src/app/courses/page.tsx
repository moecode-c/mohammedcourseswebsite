import { Navbar } from "@/components/ui/Navbar";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";
import CoursesClient from "./CoursesClient";

async function getCourses() {
    await dbConnect();
    const courses = await Course.find({}).populate("sections").sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(courses));
}

export default async function CoursesPage() {
    const courses = await getCourses();

    return (
        <main className="min-h-screen bg-slate-950 text-white pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-10">
                <header className="mb-12">
                    <h1 className="text-4xl font-heading mb-4 text-shadow text-center md:text-left">ALL COURSES</h1>
                    <p className="font-mono text-slate-400 text-center md:text-left">Explore our library of knowledge. Hack the planet.</p>
                </header>

                <CoursesClient courses={courses} />
            </div>
        </main>
    );
}
