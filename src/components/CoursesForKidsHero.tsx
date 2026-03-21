"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import dynamic from "next/dynamic";
import NetworkBackground from "./NetworkBackground";

const InteractiveTerminal = dynamic(() => import("./InteractiveTerminal"), { ssr: false });

export default function CoursesForKidsHero() {
    return (
        <section className="relative pt-32 pb-24 flex flex-col justify-center overflow-hidden min-h-[90vh]">
            {/* Network Background */}
            <div className="absolute inset-0 -z-10 opacity-100 transition-opacity duration-1000">
                <NetworkBackground />
            </div>

            <div className="container mx-auto px-4 max-w-7xl relative z-10 grid gap-12 items-center lg:grid-cols-2">
                
                {/* Left Content Area */}
                <div className="max-w-2xl pt-10 lg:pt-0 z-20 order-first">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm mb-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span className="text-xs font-bold uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                            Grades 4 through 12
                        </span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-black leading-[1.1] tracking-tight mb-8 transition-colors text-5xl md:text-6xl lg:text-7xl text-slate-900 dark:text-white"
                    >
                        Ignite Their Future with <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">Robotics & Code</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="leading-relaxed mb-10 transition-colors text-lg md:text-xl text-slate-600 dark:text-slate-400"
                    >
                        Transform screen time into innovation time. From drag-and-drop programming to assembling physical robots and training AI models, we give young innovators the tools to build tomorrow.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="#programs"
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 md:px-8 md:py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black md:text-lg shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:-translate-y-1 hover:shadow-2xl transition-all"
                        >
                            Explore Programs <ArrowRight className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-750 hover:-translate-y-1 transition-all shadow-sm"
                        >
                            Talk to an Advisor
                        </Link>
                    </motion.div>
                </div>

                {/* Right Interactive 3D / WebGL Area */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative w-full flex items-center justify-center aspect-square lg:aspect-auto lg:h-[600px] p-3"
                >
                    {/* Glowing Aura for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-indigo-900/10 to-transparent rounded-[3rem] blur-3xl -z-10 animate-pulse" />
                    
                    {/* Free-floating Macbook without the rigid border cutout */}
                    <div className="absolute inset-0 z-10 w-full h-full">
                        <InteractiveTerminal />
                    </div>
                </motion.div>

            </div>

            {/* Scroll Indication */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-400"
            >
                <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to Explore</span>
                <ChevronDown className="w-5 h-5 animate-bounce" />
            </motion.div>
        </section>
    );
}
