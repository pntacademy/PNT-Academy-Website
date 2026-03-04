"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Define the available categories
const CATEGORIES = ["All", "Projects", "Workshop", "Industrial Visit", "Schools", "Lab Setup"];



interface GalleryProps {
    items: any[];
}

export default function Gallery({ items }: GalleryProps) {
    const [activeCategory, setActiveCategory] = useState("All");

    // Filter items based on the active tab
    const filteredItems = activeCategory === "All"
        ? items
        : items.filter(item => item.category === activeCategory);

    return (
        <section id="gallery" className="py-24 relative border-t border-slate-900/10 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/20 backdrop-blur-sm transition-colors duration-500">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">Our Activity Hub</h2>
                    <p className="text-slate-800 dark:text-slate-400 text-lg text-center max-w-2xl mx-auto transition-colors duration-500">
                        Explore our student prototypes, hands-on workshops, and immersive industrial visits.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center flex-wrap gap-3 mb-12">
                    {CATEGORIES.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 text-sm md:text-base ${activeCategory === category
                                ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                                : "bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Animated Grid Container */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-[400px]">
                    <AnimatePresence>
                        {filteredItems.map((item) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="aspect-square bg-slate-200 dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-white/5 overflow-hidden relative group shadow-md hover:shadow-2xl transition-all duration-300"
                            >
                                {/* Background Image */}
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                    <span className="text-blue-400 font-bold text-xs uppercase tracking-wider mb-1">{item.category}</span>
                                    <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State Fallback (if a category ever has 0 items) */}
                {filteredItems.length === 0 && (
                    <div className="w-full text-center py-20 text-slate-500 dark:text-slate-400">
                        <span className="text-4xl block mb-4">📸</span>
                        <p>No photos available in this category yet.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
