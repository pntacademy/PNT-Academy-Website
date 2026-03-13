"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Trash2, MessageSquareQuote } from "lucide-react";
import TestimonialManager from "@/components/admin/TestimonialManager";

export default function AdminTestimonials() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch("/api/admin/testimonials");
            const data = await res.json();
            setItems(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this testimonial?")) return;

        try {
            const res = await fetch(`/api/admin/testimonials?id=${id}`, { method: "DELETE" });
            if (res.ok) {
                setItems(items.filter((item) => item._id !== id));
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-8">
            <header className="mb-6">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Testimonials</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-lg">
                    Manage the student and partner quotes displayed on the Home page and College Research Lab.
                </p>
            </header>

            {/* Upload Module */}
            <TestimonialManager />

            {/* Testimonials Grid */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Live Testimonials</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {isLoading ? (
                        <div className="col-span-full py-12 flex justify-center text-slate-400">
                            <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : items.length === 0 ? (
                        <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                            <MessageSquareQuote className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                            <p className="text-slate-500">No testimonials published yet.</p>
                        </div>
                    ) : (
                        items.map((item, i) => (
                            <motion.div
                                key={item._id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="group relative bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm flex flex-col p-6 hover:shadow-md transition-all"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 relative rounded-full overflow-hidden shrink-0 border-2 border-slate-100 dark:border-slate-700">
                                        <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 dark:text-white font-bold text-sm tracking-wide">{item.name}</h4>
                                        <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{item.role}</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 text-sm italic leading-relaxed line-clamp-4">
                                    "{item.quote}"
                                </p>

                                <button
                                    onClick={() => handleDelete(item._id)}
                                    className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 -translate-y-2 group-hover:translate-y-0 transition-all shadow-md"
                                    title="Delete Testimonial"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
