"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function ChampionshipPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Skill Tank Championship"
                subtitle="NATIONAL LEVEL INNOVATION"
                description="PNT Academy’s in-house Robotics & Innovation competition, providing students exposure to national-level events and top technical institutes like IIT Bombay."
                colorFrom="from-yellow-400"
                colorTo="to-amber-500"
                actionText="Register Your Team"
                actionLink="#register"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="flex flex-col md:flex-row gap-12">
                        <div className="flex-1">
                            <h2 className="text-3xl font-bold mb-6">The Ultimate Tech Showdown</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                                Students present their working models and explain the idea, implementation, and real-world application, followed by a live demonstration and interaction with our expert panel of judges.
                            </p>
                            <div className="my-8 space-y-4">
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-1">Funding & Prizes</h3>
                                    <p className="text-slate-600 dark:text-slate-300">Funding up to ₹20,000 for winning prototypes and national certification.</p>
                                </div>
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <h3 className="font-bold text-amber-600 dark:text-amber-400 mb-1">Pan India Participation</h3>
                                    <p className="text-slate-600 dark:text-slate-300">Compete against students from over 500+ schools across Tier 1, 2, and 3 cities.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 text-sm p-8 text-center border-4 border-dashed border-slate-300 dark:border-slate-700">
                                [Insert Previous Championship Winner Photo or Trophy Image]
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
