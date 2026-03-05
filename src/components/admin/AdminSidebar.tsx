"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Image as ImageIcon, Briefcase, GraduationCap, FileText, Settings, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

const MENU_ITEMS = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "Partner Schools", href: "/admin/schools", icon: GraduationCap },
    { name: "Internships", href: "/admin/internships", icon: Briefcase },
    { name: "News & Blog", href: "/admin/blog", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        if (auth) {
            await signOut(auth);
        }
        router.push("/admin/login");
    };

    return (
        <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-white/10 flex flex-col min-h-screen sticky top-0 transition-colors duration-500">
            {/* Logo Area */}
            <div className="p-6 border-b border-slate-200 dark:border-white/10 flex items-center justify-center">
                <Link href="/admin" className="block text-center hover:opacity-80 transition-opacity">
                    <div className="relative w-28 h-10 mx-auto">
                        <Image
                            src="/logo.png"
                            alt="PNT Academy Logo"
                            fill
                            className="object-contain dark:invert-0 invert drop-shadow-md brightness-100 dark:brightness-110 transition-all duration-500"
                        />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2 block">Admin Panel</span>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} href={item.href}>
                            <motion.div
                                whileHover={{ scale: 1.02, x: 5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-500 dark:text-slate-400"}`} />
                                {item.name}
                            </motion.div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 dark:border-white/10 space-y-2">
                <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    View Live Site
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
