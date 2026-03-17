"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Lightbulb, GraduationCap, Phone } from "lucide-react";

export default function MobileBottomNav() {
    const pathname = usePathname();

    const NAV_ITEMS = [
        { label: "Home", href: "/", icon: <Home className="w-5 h-5 mb-1" /> },
        { label: "Robotics LAB", href: "/schools/robotics-lab", icon: <Lightbulb className="w-5 h-5 mb-1" /> },
        { label: "Colleges", href: "/programs/colleges", icon: <GraduationCap className="w-5 h-5 mb-1" /> },
        { label: "Contact", href: "/contact", icon: <Phone className="w-5 h-5 mb-1" /> },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-white/10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe transition-colors duration-500">
            <nav className="flex items-center justify-around px-2 h-16">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-all duration-200 ${
                                isActive 
                                    ? "text-blue-600 dark:text-cyan-400" 
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                            <div className={`relative px-4 py-1 rounded-full transition-all duration-300 ${isActive ? "bg-blue-50 dark:bg-cyan-500/10" : ""}`}>
                                {item.icon}
                            </div>
                            <span className="mt-0.5">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            {/* Safe area spacing for modern phones (like iPhones with home indicator) */}
            <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
    );
}
