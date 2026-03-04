"use client";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Shield, Bell, Key, User } from "lucide-react";

export default function AdminSettings() {
    return (
        <div className="space-y-8">
            <header className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-600 to-slate-900 dark:from-slate-200 dark:to-white tracking-tight">Portal Settings</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                        Manage your director account, security preferences, and dashboard configurations here.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Navigation */}
                <div className="space-y-2">
                    {[
                        { name: "My Account", icon: User, active: true },
                        { name: "Security & Passwords", icon: Shield, active: false },
                        { name: "Email Notifications", icon: Bell, active: false },
                        { name: "API Keys (Firebase)", icon: Key, active: false },
                        { name: "System Preferences", icon: SettingsIcon, active: false },
                    ].map((tab) => (
                        <button
                            key={tab.name}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab.active
                                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md"
                                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.name}
                        </button>
                    ))}
                </div>

                {/* Right Column - Content Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Director Profile</h3>

                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-black text-3xl shadow-lg border-4 border-white dark:border-slate-900">
                                A
                            </div>
                            <div>
                                <h4 className="font-bold text-lg text-slate-900 dark:text-white">Admin / Director</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm">director@pntacademy.com</p>
                                <button className="mt-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">Change Avatar</button>
                            </div>
                        </div>

                        <form className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">First Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Admin"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Name</label>
                                    <input
                                        type="text"
                                        defaultValue="Director"
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recovery Email (Optional)</label>
                                <input
                                    type="email"
                                    placeholder="Enter secondary email"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" className="px-5 py-2.5 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm">
                                    Cancel
                                </button>
                                <button type="button" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] transition-all active:scale-95 text-sm">
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
