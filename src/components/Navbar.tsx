"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Preview content for each nav item ───────────────────────────────────────
const NAV_ITEMS = [
    {
        label: "Robotics LAB",
        sublabel: "for Institute",
        href: "/schools/robotics-lab",
        icon: "🤖",
        preview: {
            headline: "Research-Enabled Industrial Automation Labs",
            blocks: [
                { icon: "⚙️", title: "AGV Training", desc: "Basic & Advanced Automated Guided Vehicle workshops" },
                { icon: "🦾", title: "Robotics Arm", desc: "6-DOF arm programming from zero to expert" },
                { icon: "🚁", title: "Drone Workshop", desc: "Build, fly & code autonomous drones" },
                { icon: "🏛️", title: "Navy & DRDO", desc: "Real-world defense internship projects" },
            ],
        },
    },
    {
        label: "Courses for Kids",
        sublabel: undefined,
        href: "/programs/courses-for-kids",
        icon: "🎓",
        preview: {
            headline: "Fun, Hands-on Learning for Grades 4–12",
            blocks: [
                { icon: "🤖", title: "Online Robotics", desc: "Live classes with kit delivery to your door" },
                { icon: "🐍", title: "Python & AI", desc: "Beginner-friendly coding and machine learning" },
                { icon: "☀️", title: "Summer Camp", desc: "5-day intensive with project showcase" },
                { icon: "❄️", title: "Winter Camp", desc: "Holiday coding & robotics bootcamp" },
            ],
        },
    },
    {
        label: "Training",
        sublabel: "for Schools",
        href: "/programs/schools",
        icon: "🏫",
        preview: {
            headline: "NEP 2020 Aligned STEM Curriculum",
            blocks: [
                { icon: "🛠️", title: "2-Day Workshop", desc: "Hands-on kits, groups of 5 students" },
                { icon: "📅", title: "1-Year Curriculum", desc: "Project-based bridging classroom & industry" },
                { icon: "⚓", title: "Navy Internship", desc: "'Kavach' — 1-month online defense challenge" },
                { icon: "💡", title: "Free Bootcamp", desc: "5-day AI & Robotics with digital certs" },
            ],
        },
    },
    {
        label: "Trainings",
        sublabel: "for Colleges",
        href: "/programs/colleges",
        icon: "🎯",
        preview: {
            headline: "Elite Industrial Training for College Students",
            blocks: [
                { icon: "🏭", title: "ROS Training", desc: "Robot Operating System — Basic to Advanced" },
                { icon: "🦿", title: "Robotics Hand", desc: "Biomechanical hand design & control" },
                { icon: "⚡", title: "Tata Power", desc: "Real internship at Tata Power plant" },
                { icon: "🔬", title: "DRDO Projects", desc: "Research internships with DRDO scientists" },
            ],
        },
    },
];

const SIMPLE_LINKS = [
    { label: "Payments", href: "/payments" },
    { label: "Contact", href: "/contact" },
];

// ─── Main NavLink ─────────────────────────────────────────
function NavLink({ item, isActive }: { item: typeof NAV_ITEMS[0]; isActive: boolean }) {
    return (
        <div className="relative">
            <Link
                href={item.href}
                className={`relative z-10 flex items-center gap-1 px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 whitespace-nowrap
                    ${isActive
                        ? "text-cyan-600 dark:text-cyan-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-cyan-500 dark:hover:text-cyan-400"
                    }`}
            >
                {/* Sliding pill background */}
                {isActive && (
                    <motion.span
                        layoutId="activeTab"
                        className="absolute inset-0 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-cyan-200 dark:ring-cyan-500/30 -z-10"
                        transition={{ type: "spring", stiffness: 280, damping: 28, mass: 0.8 }}
                    />
                )}
                {/* Pulsing glow halo behind active tab */}
                {isActive && (
                    <motion.span
                        layoutId="activeGlow"
                        className="absolute inset-0 rounded-xl -z-20 blur-md"
                        animate={{
                            boxShadow: [
                                "0 0 12px 4px rgba(6,182,212,0.35)",
                                "0 0 22px 8px rgba(99,102,241,0.35)",
                                "0 0 12px 4px rgba(6,182,212,0.35)",
                            ],
                        }}
                        transition={{
                            boxShadow: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
                            layout: { type: "spring", stiffness: 280, damping: 28, mass: 0.8 },
                        }}
                    />
                )}
                <span className="hidden sm:inline">{item.icon}</span>
                {item.label}
                {item.sublabel && <span className="hidden xl:inline text-slate-400 dark:text-slate-500 font-normal">&nbsp;{item.sublabel}</span>}
            </Link>
        </div>
    );
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
    const { theme, setTheme } = useTheme();
        const [mounted, setMounted] = useState(false);
        const pathname = usePathname();
    
        useEffect(() => { setMounted(true); }, []);

    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors duration-500">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 relative z-10 hover:opacity-80 transition-opacity">
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

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
                    {NAV_ITEMS.map((item) => (
                        <NavLink key={item.href} item={item} isActive={isActive(item.href)} />
                    ))}

                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

                    {SIMPLE_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200
                                ${isActive(link.href)
                                    ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-[0_4px_16px_rgba(6,182,212,0.25)] -translate-y-0.5 ring-1 ring-cyan-200 dark:ring-cyan-500/30"
                                    : "text-slate-600 dark:text-slate-300 hover:text-cyan-500 hover:bg-slate-100 dark:hover:bg-white/5"
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

                    {/* Dark Mode Toggle */}
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                        </button>
                    )}

                    {/* LMS CTA */}
                    <Link
                        href="/lms"
                        className="ml-1 px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.35)] hover:shadow-[0_6px_25px_rgba(139,92,246,0.5)] hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2 font-bold text-sm transition-all"
                    >
                        LMS Portal
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                </nav>

                {/* Mobile Controls */}
                <div className="lg:hidden flex items-center gap-2">
                    {mounted && (
                        <button
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all shadow-sm"
                            aria-label="Toggle Dark Mode"
                        >
                            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                        </button>
                    )}
                </div>
            </div>

        </header>
    );
}
