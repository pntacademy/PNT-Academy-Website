"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, Sun, Moon, ShoppingCart, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function Navbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors duration-500">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 relative z-10 hover:opacity-80 transition-opacity">
                    {/* Logo container with explicit dimensions for Next/Image */}
                    <div className="relative w-32 h-12">
                        <Image
                            src="/logo.png"
                            alt="PNT Academy Logo"
                            fill
                            className="object-contain object-left dark:brightness-200 brightness-0 transition-all duration-500"
                            priority
                        />
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-5 text-sm font-medium tracking-wide">
                    {/* 1. Robotics LAB for Institute */}
                    <Link href="/schools/robotics-lab" className="text-slate-600 hover:text-cyan-500 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] dark:text-slate-300 dark:hover:text-cyan-400 transition-all py-2 whitespace-nowrap">
                        Robotics LAB <span className="hidden xl:inline">for Institute</span>
                    </Link>

                    {/* 2. Courses for Kids */}
                    <Link href="/programs/courses-for-kids" className="text-sm font-semibold text-slate-700 hover:text-cyan-500 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] dark:text-slate-300 dark:hover:text-cyan-400 transition-all">
                        Courses for <span className="hidden xl:inline">Kids</span>
                    </Link>

                    {/* 3. Training Programs for Schools */}
                    <Link href="/programs/schools" className="text-slate-600 hover:text-cyan-500 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] dark:text-slate-300 dark:hover:text-cyan-400 transition-all py-2 whitespace-nowrap">
                        Training <span className="hidden xl:inline">for Schools</span>
                    </Link>

                    {/* 4. Trainings for Colleges */}
                    <Link href="/programs/colleges" className="text-slate-600 hover:text-cyan-500 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] dark:text-slate-300 dark:hover:text-cyan-400 transition-all py-2 whitespace-nowrap">
                        Trainings <span className="hidden xl:inline">for Colleges</span>
                    </Link>

                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="ml-2 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.5)] transition-all"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}

                    <Link href="/payments" className="ml-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-cyan-500 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] dark:text-slate-300 dark:hover:text-cyan-400 transition-all">
                        Payments
                    </Link>
                    <Link href="/contact" className="ml-2 px-4 py-2 text-sm font-semibold text-slate-700 hover:text-cyan-500 hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] dark:text-slate-300 dark:hover:text-cyan-400 transition-all">
                        Contact
                    </Link>

                    <Link href="/lms" className="ml-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center gap-2 font-bold">
                        <span>LMS Portal</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                </nav>

                <button className="md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors p-2">
                    <Menu className="w-6 h-6" />
                </button>
            </div>
        </header>
    );
}
