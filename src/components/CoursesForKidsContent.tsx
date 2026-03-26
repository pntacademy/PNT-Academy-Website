"use client";

import CampSeasonToggle from "@/components/CampSeasonToggle";
import { Monitor, Wrench, Brain, Clock, MessageSquare, ArrowRight, Sparkles, Star, Zap, Users, CheckCircle2, GraduationCap, Phone } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import RoboticsCurriculum from "./RoboticsCurriculum";
import AIPythonCurriculum from "./AIPythonCurriculum";

// ─── Reusable Course Card ─────────────────────────────────────────────
interface CourseCardProps {
    level: "Basic" | "Advanced";
    headerGradient: string;
    icon: React.ReactNode;
    iconBg: string;
    levelBadgeClass: string;
    tag: string;
    tagClass: string;
    title: string;
    description: string;
    audience: string;
    bullets: string[];
    bulletColor: string;
    ctaLabel: string;
    ctaGradient: string;
    note?: string;
}

function CourseCard({
    level,
    headerGradient,
    icon,
    iconBg,
    levelBadgeClass,
    tag,
    tagClass,
    title,
    description,
    audience,
    bullets,
    bulletColor,
    ctaLabel,
    ctaGradient,
    note,
}: CourseCardProps) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="group flex flex-col rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 ease-out bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60"
        >
            {/* ── Coloured Header Band ── */}
            <div className={`relative ${headerGradient} px-7 pt-8 pb-12`}>
                <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full mb-5 ${levelBadgeClass}`}>
                    {level === "Basic"
                        ? <Star className="w-3 h-3" />
                        : <Zap className="w-3 h-3" />
                    }
                    {level} Level
                </span>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${iconBg} shadow-lg mb-4`}>
                    {icon}
                </div>
                <h3 className="text-xl font-black text-white leading-snug">{title}</h3>
            </div>

            {/* ── Pull-up white body ── */}
            <div className="relative flex flex-col flex-grow px-7 pt-0 pb-7 -mt-5">
                <div className={`inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-xl text-xs font-bold mb-5 mt-2 border ${tagClass}`}>
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    {tag}
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-5">
                    {description}
                </p>

                <div className="flex items-center gap-3 mb-4">
                    <GraduationCap className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">What you'll learn</span>
                    <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
                </div>

                <ul className="space-y-3 mb-6 flex-grow">
                    {bullets.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-medium text-slate-700 dark:text-slate-200">
                            <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${bulletColor}`} />
                            {item}
                        </li>
                    ))}
                </ul>

                <div className="flex gap-1.5 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className={`w-3.5 h-3.5 ${bulletColor} opacity-${i < 3 ? "100" : "30"}`} />
                    ))}
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-1">{level === "Basic" ? "Beginner friendly" : "Prior basics needed"}</span>
                </div>

                {note && (
                    <p className="text-[11px] italic text-slate-400 dark:text-slate-500 mb-4">{note}</p>
                )}

                <Link
                    href="/contact"
                    className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-black text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 ${ctaGradient}`}
                >
                    {ctaLabel} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.div>
    );
}

// ─── Section Heading ──────────────────────────────────────────────────
function SectionHeading({ label, title, subtitle, color }: { label: string; title: string; subtitle: string; color: string }) {
    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 text-center max-w-3xl mx-auto"
        >
            <span className={`inline-block px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] uppercase tracking-widest font-black ${color} mb-4 shadow-sm`}>{label}</span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">{title}</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg">{subtitle}</p>
        </motion.div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────
export default function CoursesForKidsContent() {
    return (
        <section className="py-16 sm:py-20 container mx-auto px-4 sm:px-6 max-w-7xl">

            {/* ══════════════════════════════════════════════════════
                   UNIFIED ROBOTICS & HARDWARE CATEGORY
               ══════════════════════════════════════════════════════ */}
            <SectionHeading
                label="🌐 Available Online & Offline"
                title="Robotics & Hardware Labs"
                subtitle="From the comfort of your room or right here in our high-tech lab—choose your battle station and start engineering the robots of tomorrow."
                color="text-blue-600 dark:text-blue-400"
            />
            <div className="grid sm:grid-cols-2 max-w-4xl mx-auto gap-5 sm:gap-7 mb-20 sm:mb-32">
                <CourseCard
                    level="Basic"
                    headerGradient="bg-gradient-to-br from-sky-500 to-blue-600"
                    icon={<Wrench className="w-8 h-8 text-white" />}
                    iconBg="bg-white/20"
                    levelBadgeClass="bg-white/20 text-white border border-white/30"
                    tag="Online & Offline • Ages 8–12"
                    tagClass="bg-sky-50 dark:bg-sky-900/30 border-sky-200 dark:border-sky-700 text-sky-700 dark:text-sky-300"
                    title="Basic Robotics"
                    description="The perfect launchpad for young creators! Choose between our immersive interactive online coding simulator or get hands-on with live wiring and assembly in our state-of-the-art lab."
                    audience="Ages 8–12"
                    bullets={[
                        "Scratch logic & drag-and-drop",
                        "Arduino simulators & basic wiring",
                        "Tinkercad 3D modeling",
                        "Fun introductory challenges",
                    ]}
                    bulletColor="text-sky-500"
                    ctaLabel="Enquire Now"
                    ctaGradient="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
                />
                
                <CourseCard
                    level="Advanced"
                    headerGradient="bg-gradient-to-br from-indigo-500 to-purple-600"
                    icon={<Monitor className="w-8 h-8 text-white" />}
                    iconBg="bg-white/20"
                    levelBadgeClass="bg-white/20 text-white border border-white/30"
                    tag="Online & Offline • Ages 12–16"
                    tagClass="bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300"
                    title="Advanced Robotics"
                    description="Challenge accepted! Dive deep into text-based programming, conquer complex multi-sensor systems, and compete in advanced drone or simulation challenges."
                    audience="Ages 12–16"
                    bullets={[
                        "Python OOP & C++",
                        "Drone assembly & tuning",
                        "Multi-sensor hardware systems",
                        "Real-world AI & ML basics",
                    ]}
                    bulletColor="text-indigo-500"
                    ctaLabel="Enquire Now"
                    ctaGradient="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                />
            </div>

            {/* ─── Expandable Full Curriculum Accordion ─── */}
            <RoboticsCurriculum />

            <div className="my-24 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent max-w-lg mx-auto" />

            {/* ══════════════════════════════════════════════════════
                   AI & PYTHON CLASS
               ══════════════════════════════════════════════════════ */}
            <SectionHeading
                label="🤖 AI & Programming"
                title="AI & Software Programs"
                subtitle="From Python fundamentals to real AI projects — chatbots, image classifiers, and full automation pipelines."
                color="text-emerald-600 dark:text-emerald-400"
            />
            <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-7 mb-32">
                <CourseCard
                    level="Basic"
                    headerGradient="bg-gradient-to-br from-emerald-500 to-green-600"
                    icon={<Brain className="w-8 h-8 text-white" />}
                    iconBg="bg-white/20"
                    levelBadgeClass="bg-white/20 text-white border border-white/30"
                    tag="Best for ages 10–13"
                    tagClass="bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300"
                    title="AI & Python — Basic"
                    description="Your coding journey begins here! Learn Python from the ground up with fun, bite-sized projects that build real problem-solving confidence along the way."
                    audience="Ages 10–13"
                    bullets={[
                        "Python syntax, variables & loops",
                        "Functions & conditions",
                        "Basic data structures (lists, dicts)",
                        "Simple automation scripts",
                    ]}
                    bulletColor="text-emerald-500"
                    ctaLabel="Get Details"
                    ctaGradient="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                    note="* Detailed curriculum updating soon. Contact us for early access."
                />
                <CourseCard
                    level="Advanced"
                    headerGradient="bg-gradient-to-br from-teal-500 to-cyan-600"
                    icon={<Brain className="w-8 h-8 text-white" />}
                    iconBg="bg-white/20"
                    levelBadgeClass="bg-white/20 text-white border border-white/30"
                    tag="Best for ages 13–16"
                    tagClass="bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300"
                    title="AI & Python — Advanced"
                    description="Build the future! Train real machine learning models, create chatbots with NLP, develop image classifiers, and ship complete automation pipelines."
                    audience="Ages 13–16"
                    bullets={[
                        "Machine Learning models & concepts",
                        "Chatbot & NLP projects",
                        "Image classifier with TensorFlow",
                        "APIs & full automation pipelines",
                    ]}
                    bulletColor="text-teal-500"
                    ctaLabel="Get Details"
                    ctaGradient="bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                    note="* Detailed curriculum updating soon. Contact us for early access."
                />
            </div>

            {/* ── Visual AI & Python 30-Day Curriculum ──────────── */}
            <AIPythonCurriculum />

            {/* ─── Customized Courses ──────────────────────────── */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-24"
            >
                <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-3xl border border-amber-200 dark:border-amber-800/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-transparent dark:from-amber-900/20 dark:via-orange-900/10 dark:to-transparent pointer-events-none rounded-3xl" />
                    <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20 shrink-0">
                            <Clock className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">Customized Courses</h3>
                                <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10">
                                    48 HRS
                                </span>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 text-lg">
                                Need a tailored curriculum? We design custom 48-hour programs covering any combination of Robotics, AI, IoT, and Coding modules. Contact us to build your ideal learning path.
                            </p>
                        </div>
                        <Link href="/contact" className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all">
                            <MessageSquare className="w-4 h-4" /> Request Custom Course
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* ─── Summer / Winter Camp Toggle ─────────────────── */}
            <CampSeasonToggle />

            {/* ─── Bottom CTA ─────────────────── */}
            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-32 mb-10 text-center relative z-10"
            >
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                    Ready to Build the Future?
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                    Take the first step towards mastering robotics and AI. Secure a spot for your child in our upcoming batch or let's find the perfect program together.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                    <Link 
                        href="/contact" 
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg shadow-xl shadow-blue-600/30 hover:shadow-2xl hover:shadow-blue-600/40 hover:-translate-y-1 transition-all"
                    >
                        Enroll Now <ArrowRight className="w-5 h-5" />
                    </Link>
                    <Link 
                        href="/contact" 
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-5 rounded-2xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 font-bold text-lg hover:bg-slate-50 dark:hover:bg-slate-750 hover:-translate-y-1 transition-all shadow-md"
                    >
                        <Phone className="w-5 h-5" /> Talk to an Advisor
                    </Link>
                </div>
            </motion.div>

        </section>
    );
}
