"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroAnimation({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<"logo" | "wipe" | "done">("logo");

    useEffect(() => {
        // Phase 1: Show full-screen PNT logo for 1.2s
        const t1 = setTimeout(() => setPhase("wipe"), 1200);
        // Phase 2: Curtain wipes away over 0.9s, then signal done
        const t2 = setTimeout(() => {
            setPhase("done");
            onComplete();
        }, 2200);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [onComplete]);

    return (
        <AnimatePresence>
            {phase !== "done" && (
                <motion.div
                    key="intro"
                    className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
                    exit={{ opacity: 0 }}
                >
                    {/* Deep background */}
                    <motion.div
                        className="absolute inset-0 bg-slate-950"
                        animate={phase === "wipe" ? { scaleY: 0, originY: 0 } : { scaleY: 1 }}
                        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
                    />

                    {/* Grid lines overlay */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage: `linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)`,
                            backgroundSize: "60px 60px"
                        }}
                    />

                    {/* Corner brackets */}
                    {[
                        "top-6 left-6 border-t border-l",
                        "top-6 right-6 border-t border-r",
                        "bottom-6 left-6 border-b border-l",
                        "bottom-6 right-6 border-b border-r"
                    ].map((cls, i) => (
                        <motion.div
                            key={i}
                            className={`absolute w-8 h-8 border-blue-500 ${cls}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                        />
                    ))}

                    {/* PNT logotype */}
                    <motion.div
                        className="relative z-10 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        {/* Word mark */}
                        <motion.div className="flex items-center justify-center gap-3 mb-4">
                            {["P", "N", "T"].map((letter, i) => (
                                <motion.span
                                    key={letter}
                                    className="text-7xl md:text-9xl font-black text-white leading-none tracking-[0.15em]"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.div>

                        <motion.div
                            className="flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                        >
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-blue-500" />
                            <p className="text-xs font-bold uppercase tracking-[0.4em] text-blue-400">
                                Academy
                            </p>
                            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-blue-500" />
                        </motion.div>

                        <p className="text-slate-500 text-xs tracking-widest uppercase mt-4">
                            Robotics &middot; AI &middot; Innovation
                        </p>
                    </motion.div>

                    {/* Loading bar at very bottom */}
                    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-slate-800">
                        <motion.div
                            className="h-full bg-gradient-to-r from-blue-600 to-purple-600"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 1.1, ease: "linear" }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
