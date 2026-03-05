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
                            className="object-contain object-left dark:invert-0 invert transition-all duration-500"
                            priority
                        />
                    </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-5 text-sm font-medium tracking-wide">
                    {/* Lab for Schools Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-2">
                            Lab for Schools <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                            <Link href="/schools/robotics-lab" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Robotics Lab</Link>
                            <Link href="/schools/composite-skill-lab" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Composite Skill Lab</Link>
                        </div>
                    </div>

                    {/* Courses for Kids Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-2">
                            Courses for Kids <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                            <Link href="/courses/online" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Online Classes</Link>
                            <Link href="/courses/offline-bootcamps" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Offline Bootcamps</Link>
                        </div>
                    </div>

                    <Link href="/championship" className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-2">
                        <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 dark:from-green-300 dark:to-green-500 italic">NEW</span> Championship
                    </Link>

                    <Link href="/workshop" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-2">Workshop</Link>

                    <Link href="/kit" className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-2">Kit</Link>

                    {/* Curriculum Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-2">
                            Curriculum <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                            <Link href="/curriculum/nep-aligned" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">NEP Aligned</Link>
                            <Link href="/curriculum/cbse-icse-ib" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">CBSE / ICSE / IB</Link>
                        </div>
                    </div>

                    {/* Summer Camp & Internship Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-1 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors py-2">
                            Summer Camp & Internship <ChevronDown className="w-3 h-3" />
                        </button>
                        <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col py-2 z-50">
                            <Link href="/programs/summer-camp" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Summer Camp</Link>
                            <Link href="/programs/army-navy-internship" className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Army & Navy Internship</Link>
                        </div>
                    </div>

                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="ml-2 p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}

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
