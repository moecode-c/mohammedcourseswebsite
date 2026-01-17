import Link from "next/link";
import Image from "next/image";
import { GameButton } from "@/components/ui/GameButton";
import { GameCard } from "@/components/ui/GameCard";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { Gamepad2, Brain, Trophy, Ghost, Star } from "lucide-react";
import dbConnect from "@/lib/db";
import Course from "@/models/Course";

export default async function Home() {
  await dbConnect();
  const featuredCourses = await Course.find({ isFeatured: true }).lean();

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center">
      <Navbar />

      {/* Hero Section */}
      <section className="w-full min-h-[90vh] flex flex-col justify-center items-center text-center px-4 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 to-slate-950">

        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] opacity-10 pointer-events-none" />

        <div className="z-10 animate-fade-in-up">
          <div className="mb-4 inline-block px-4 py-1 rounded-full border border-primary/50 text-primary text-xs font-mono uppercase tracking-widest bg-primary/10">
            System Online v1.0
          </div>

          <h1 className="text-5xl md:text-7xl font-heading text-white mb-6 text-shadow-lg tracking-tight">
            Level Up Your <span className="text-primary animate-pulse">Skills</span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-mono">
            A gamified learning platform where code meets arcade. Complete quests, earn XP, and unlock your potential.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <GameButton size="lg" className="shadow-[0_0_20px_var(--color-primary)]">
                Press Start
              </GameButton>
            </Link>
            <Link href="/about">
              <GameButton variant="ghost" size="lg">
                Tutorial
              </GameButton>
            </Link>
          </div>
        </div>
      </section>


      {/* Featured Courses Section */}
      {
        featuredCourses.length > 0 && (
          <section className="w-full py-24 bg-slate-900 border-b border-slate-800">
            <div className="max-w-6xl mx-auto px-6">
              <div className="flex items-center gap-3 mb-10 justify-center">
                <Star className="w-8 h-8 text-yellow-500 animate-spin-slow" />
                <h2 className="text-3xl md:text-4xl font-heading text-white text-shadow-sm">FEATURED COURSES</h2>
                <Star className="w-8 h-8 text-yellow-500 animate-spin-slow" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCourses.map((course: any) => (
                  <Link href={`/courses/${course._id}`} key={String(course._id)}>
                    <GameCard className="h-full hover:scale-105 transition-transform duration-300">
                      <div className="relative w-full h-40 mb-4 overflow-hidden rounded border border-slate-700">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="font-heading text-xl text-primary mb-2 line-clamp-1">{course.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-2 mb-4 font-mono">{course.description}</p>

                      <div className="flex justify-between items-center mt-auto">
                        <span className={`text-xs px-2 py-1 rounded border ${course.difficulty === 'beginner' ? 'bg-green-500/10 text-green-500 border-green-500/50' :
                          course.difficulty === 'intermediate' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50' :
                            'bg-red-500/10 text-red-500 border-red-500/50'
                          }`}>
                          {course.difficulty.toUpperCase()}
                        </span>
                        <span className="font-bold text-white font-mono">
                          {course.isFree ? "FREE TO PLAY" : `${course.price} EGP`}
                        </span>
                      </div>
                    </GameCard>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      }

      <section className="w-full py-24 bg-slate-900 border-y border-slate-800 relative shadow-2xl z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Image Container with Glitch Effect Border */}
          <div className="relative group flex-shrink-0">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-75 blur group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative w-64 h-64 md:w-80 md:h-80 bg-slate-950 rounded border-2 border-slate-700 overflow-hidden">
              <Image // Changed img to Image
                src="/me.png"
                alt="Instructor Profile"
                width={320} // Added width
                height={320} // Added height
                className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none" />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <Ghost className="w-6 h-6 text-arcade animate-bounce" />
              <h2 className="text-3xl font-heading text-white">THE CREATOR</h2>
            </div>

            <div className="bg-slate-950 p-6 border-l-4 border-arcade shadow-lg relative overflow-hidden">
              {/* Scanline */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1 w-full animate-scan pointer-events-none" />

              <p className="text-slate-300 font-mono leading-relaxed mb-4">
                <span className="text-primary">&gt; Hello_World!</span> I am a Senior Full Stack Engineer with a passion for game systems.
                I built this platform to show you that learning doesn't have to be boring.
              </p>
              <p className="text-slate-300 font-mono leading-relaxed">
                Join me on this quest to master modern web technologies. We will tackle real-world challenges,
                defeat bugs, and level up your career.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 justify-center md:justify-start">
              <div className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-mono text-slate-400">XP: 99999</div>
              <div className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-mono text-slate-400">CLASS: WIZARD</div>
              <div className="px-3 py-1 bg-slate-800 rounded border border-slate-700 text-xs font-mono text-slate-400">GUILD: ADMIN</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-6xl py-24 px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <GameCard title="Quest Based">
          <Gamepad2 className="w-12 h-12 text-secondary mb-4" />
          <p className="text-slate-400 leading-relaxed">
            Treat every course like a new game. Conquer sections, defeat quizzes, and claim your victory.
          </p>
        </GameCard>

        <GameCard title="Earn Rewards">
          <Trophy className="w-12 h-12 text-arcade mb-4" />
          <p className="text-slate-400 leading-relaxed">
            Gain XP for every action. Level up your profile and show off your badges to the community.
          </p>
        </GameCard>

        <GameCard title="Master Skills">
          <Brain className="w-12 h-12 text-primary mb-4" />
          <p className="text-slate-400 leading-relaxed">
            Access premium content unlocked by your determination. Learn real-world tech in a fun way.
          </p>
        </GameCard>
      </section>

      <Footer />
    </main >
  );
}
