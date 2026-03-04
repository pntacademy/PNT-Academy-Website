"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function AdminTopbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/10 flex items-center justify-end px-8 z-10 sticky top-0 transition-colors duration-500">
            <div className="flex items-center gap-4">

                {/* Theme Toggle */}
                {mounted && (
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                        aria-label="Toggle Dark Mode"
                    >
                        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                    </button>
                )}

                {/* Vertical Divider */}
                <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2"></div>

                {/* System Status */}
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300 hidden sm:inline-block">System Online</span>

                {/* Admin Avatar */}
                <div className="h-8 w-8 ml-2 sm:ml-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md border border-white/20">
                    A
                </div>
            </div>
        </header>
    );
}
