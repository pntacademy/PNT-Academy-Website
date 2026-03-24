"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Image as ImageIcon, Briefcase, GraduationCap, FileText, Settings, LogOut, Users, MessageSquare, Inbox, ThumbsDown, Ticket } from "lucide-react";
import { auth } from "@/lib/firebase/config";
import { signOut } from "firebase/auth";

const MENU_ITEMS = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Enquiries", href: "/admin/enquiries", icon: Inbox },
    { name: "Payment Tickets", href: "/admin/tickets", icon: Ticket },
    { name: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { name: "About Photos", href: "/admin/about", icon: Users },
    { name: "Partner Schools", href: "/admin/schools", icon: GraduationCap },
    { name: "Partners & Logos", href: "/admin/partners", icon: Briefcase },
    { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
    { name: "Internships", href: "/admin/internships", icon: Briefcase },
    { name: "FAQs", href: "/admin/faq", icon: MessageSquare },
    { name: "AI Feedback", href: "/admin/ai-feedback", icon: ThumbsDown },
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
        <aside className="w-60 bg-white dark:bg-[#050505] border-r border-slate-200 dark:border-white/10 flex flex-col min-h-screen sticky top-0 transition-colors duration-500 z-20">
            {/* Logo Area */}
            <div className="p-6 flex items-center justify-center">
                <Link href="/admin" className="block text-center hover:opacity-80 transition-opacity">
                    <div className="relative w-28 h-8 mx-auto -ml-2">
                        <Image
                            src="/logo.png"
                            alt="PNT Academy Logo"
                            fill
                            className="object-contain dark:invert-0 invert drop-shadow-sm brightness-100 dark:brightness-110 transition-all duration-500"
                        />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2 block">Admin Panel</span>
                </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4 px-3">Menu</div>
                
                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link key={item.name} href={item.href}>
                            <div
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group relative ${
                                    isActive
                                    ? "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-blue-600 rounded-r-md" />
                                )}
                                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors"}`} />
                                {item.name}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-1">
                <Link href="/" target="_blank" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    View Live Site
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
