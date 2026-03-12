"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function RoboticsLabPage() {
    const [activeTab, setActiveTab] = useState<"schools" | "colleges">("schools");

    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Industrial Robotics Lab Setup"
                subtitle="FOR SCHOOLS & COLLEGES"
                description="Bridge the gap between academic learning and industry requirements with our permanently deployed, NEP 2020 aligned Robotics & Autonomous Systems Lab."
                colorFrom="from-blue-500"
                colorTo="to-indigo-600"
            />

            <section className="py-20 container mx-auto px-4 max-w-6xl">
                <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black mb-6">Complete Lab Proposal</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-10">
                            Review our comprehensive, research-enabled industrial automation lab structure designed specifically for next-generation institutes.
                        </p>

                        {/* Interactive Toggle */}
                        <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-full p-1.5 shadow-inner">
                            <button
                                onClick={() => setActiveTab("schools")}
                                className={`px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${activeTab === "schools" ? "bg-blue-600 text-white shadow-md transform scale-105" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                            >
                                For Schools
                            </button>
                            <button
                                onClick={() => setActiveTab("colleges")}
                                className={`px-8 py-3 rounded-full font-bold text-sm md:text-base transition-all duration-300 ${activeTab === "colleges" ? "bg-indigo-600 text-white shadow-md transform scale-105" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
                            >
                                For Colleges / Diploma
                            </button>
                        </div>
                    </div>

                    {/* Dynamic Rendering Based on Toggle */}
                    {activeTab === "schools" ? (
                        <div key="schools" className="flex flex-col gap-12 items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {Array.from({ length: 21 }, (_, i) => i + 1).map((num) => (
                                <div key={`school-${num}`} className="w-full relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 transition-transform hover:scale-[1.01]">
                                    <img
                                        src={`/images/robotics-lab/${num}.jpg`}
                                        alt={`Robotics Lab Proposal Slide ${num}`}
                                        className="w-full h-auto object-cover bg-slate-100 dark:bg-slate-800"
                                        loading={num < 3 ? "eager" : "lazy"}
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div key="colleges" className="flex flex-col items-center justify-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-6">
                                <span className="text-4xl">🎓</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-4 text-center">College Level Pitch Deck</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-center max-w-md">
                                The high-end Industrial Automation pitch deck for Engineering & Diploma colleges is being finalized. Please check back soon!
                            </p>
                        </div>
                    )}
                </div>
            </section>
            <Footer />
        </main>
    );
}
