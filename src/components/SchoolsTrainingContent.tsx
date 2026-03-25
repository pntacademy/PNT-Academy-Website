"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { 
    ChevronRight, BookOpen, Users, Trophy, 
    ArrowRight, Star, GraduationCap, Cpu, Code, 
    Shield, BarChart, FileCheck, Zap, Rocket,
    Wrench, Globe, Brain, Lightbulb, Cog, ExternalLink
} from "lucide-react";
import { getLiveSchools } from "@/lib/actions/db";

// Videos are auto-fetched from /api/admin/videos (auto-detects /public/videos/)

// ── Rotating hero text phrases ──────────────────────────────────────
const ROTATING_WORDS = [
    "Robotics",
    "Artificial Intelligence",
    "Drone Technology",
    "Cyber Security",
    "3D Printing",
    "IoT & Smart Devices",
];

// ── Fallback school names ───────────────────────────────────────────
const STATIC_FALLBACK_SCHOOLS = [
    { id: '1', name: "THE RAJAS INTERNATIONAL SCHOOL", imageUrl: "" },
    { id: '2', name: "ORION ICSE", imageUrl: "" },
    { id: '3', name: "DSK SCHOOL", imageUrl: "" },
    { id: '4', name: "MRIS", imageUrl: "" },
    { id: '5', name: "BIRLA INSTITUTE OF TECHNOLOGY & SCIENCE, PILANI", imageUrl: "" },
    { id: '6', name: "Vishwashanti Gurukul School", imageUrl: "" },
    { id: '7', name: "Sloka International School", imageUrl: "" },
    { id: '8', name: "NES International School", imageUrl: "" },
    { id: '9', name: "C.B.M. HIGH SCHOOL", imageUrl: "" },
    { id: '10', name: "TCIS The Cambria International School", imageUrl: "" },
    { id: '11', name: "JIJAMATA CONVENT SCHOOL", imageUrl: "" },
];

// ── ALL 15+ Workshop Modules ─────────────────────────────────────────
const WORKSHOP_MODULES = [
    { title: "Intro to Robotics", icon: Cpu, desc: "Hands-on chassis building, motor control, and sensor basics.", backDesc: "Students build their first moving robot from scratch using Arduino-compatible kits. Covers DC motors, servo motors, ultrasonic sensors, and basic obstacle avoidance.", age: "Ages 8-14", duration: "8 Sessions" },
    { title: "Arduino Programming", icon: Code, desc: "C++ fundamentals and sensor integration with hardware.", backDesc: "Deep dive into C++ for embedded systems. Students learn digital/analog I/O, PWM, interrupts, and serial communication. Projects include automated plant watering.", age: "Ages 10-16", duration: "12 Sessions" },
    { title: "IoT & Smart Devices", icon: Globe, desc: "Connected devices, smart environments, and cloud telemetry.", backDesc: "Build WiFi-connected devices with ESP32 boards. Create smart home dashboards, weather stations, and real-time monitoring systems using MQTT.", age: "Ages 12-16", duration: "10 Sessions" },
    { title: "Drone Engineering", icon: Rocket, desc: "Flight mechanics, propeller balancing, and autonomous navigation.", backDesc: "From ground up: aerodynamics, motor configurations, flight controllers, and PID tuning. Assemble a quadcopter and program autonomous waypoint missions.", age: "Ages 12-16", duration: "12 Sessions" },
    { title: "AI Image Recognition", icon: Brain, desc: "Training models to recognize objects using Python & OpenCV.", backDesc: "Introduction to computer vision and machine learning. Train classifiers, build face detection systems, and create object recognition apps.", age: "Ages 13-17", duration: "10 Sessions" },
    { title: "Cyber Security Basics", icon: Shield, desc: "Network fundamentals, encryption, & ethical hacking principles.", backDesc: "Learn about firewalls, VPNs, password security, and common vulnerabilities. Practice penetration testing in a safe sandbox environment.", age: "Ages 13-17", duration: "8 Sessions" },
    { title: "Game Development", icon: Trophy, desc: "Logic, loops, and math through building interactive 2D games.", backDesc: "Start with Scratch, progress to Python Pygame. Design levels, implement physics, and learn event-driven programming through game creation.", age: "Ages 8-15", duration: "10 Sessions" },
    { title: "Renewable Energy Tech", icon: Lightbulb, desc: "Solar panels, wind turbines, and sustainability engineering.", backDesc: "Hands-on with solar cells, mini wind turbines, and energy storage. Analyze efficiency, build hybrid systems, and learn sustainable engineering.", age: "Ages 10-16", duration: "8 Sessions" },
    { title: "3D Design & Printing", icon: Cog, desc: "CAD fundamentals and translating digital models to physical objects.", backDesc: "Using Tinkercad and Fusion360, design functional objects and print them on FDM 3D printers. Covers tolerances and iterative design.", age: "Ages 10-16", duration: "10 Sessions" },
    { title: "Python for AI", icon: Code, desc: "Data structures, algorithms, and building simple AI applications.", backDesc: "Comprehensive Python course: data types, functions, OOP, NumPy and Pandas. Build chatbots, recommendation engines, and sentiment analyzers.", age: "Ages 13-17", duration: "14 Sessions" },
    { title: "App Development", icon: Globe, desc: "Building mobile apps using MIT App Inventor and React Native.", backDesc: "From wireframes to published apps. UI/UX design, state management, API integration. Final project: a school utility app.", age: "Ages 13-17", duration: "12 Sessions" },
    { title: "Data Science Intro", icon: BarChart, desc: "Collecting, cleaning, and visualizing data for insights.", backDesc: "Using Python, Google Sheets, and Tableau. Work with real datasets, create visualizations, and present data-driven stories.", age: "Ages 14-17", duration: "10 Sessions" },
    { title: "Advanced Robotics", icon: Wrench, desc: "Multi-sensor integration, PID control, and maze-solving.", backDesc: "Advanced algorithms for line following, wall following, and shortest path navigation. Compete in timed maze-solving challenges.", age: "Ages 13-17", duration: "12 Sessions" },
    { title: "Space Tech & Satellites", icon: Star, desc: "Satellite communication, GPS, and building CanSat payloads.", backDesc: "Understand orbital mechanics, radio communication, and payload design. Build a CanSat that collects atmospheric data.", age: "Ages 14-17", duration: "10 Sessions" },
    { title: "Electronics Fundamentals", icon: Zap, desc: "Circuit design, soldering, breadboarding, and components.", backDesc: "Master resistors, capacitors, transistors, and ICs. Read schematics, use multimeters, solder components, and build functional circuits.", age: "Ages 10-16", duration: "8 Sessions" },
];

// ── Impact Statistics ────────────────────────────────────────────────
const STATS = [
    { value: 100, suffix: "+", label: "Schools Partnered" },
    { value: 25000, suffix: "+", label: "Students Trained" },
    { value: 15, suffix: "+", label: "Workshop Modules" },
    { value: 50, suffix: "+", label: "Certified Trainers" },
];

// ── Core Programs ────────────────────────────────────────────────────
const CORE_PROGRAMS = [
    { title: "Robotics Lab Setup", icon: Cpu, desc: "We design, equip, and set up complete STEM robotics labs with professional-grade kits, workbenches, and tools.", color: "from-blue-500 to-cyan-500" },
    { title: "AI & Coding Curriculum", icon: Code, desc: "Structured year-long AI, Python, and computational thinking courses aligned with NEP 2020 framework.", color: "from-purple-500 to-pink-500" },
    { title: "Teacher Training", icon: GraduationCap, desc: "Intensive 40-hour hands-on certification programs that upskill your educators to teach robotics and AI.", color: "from-orange-500 to-red-500" },
    { title: "Hackathons & Competitions", icon: Trophy, desc: "We prepare students for national-level hackathons, tech fests, and robotics olympiads with dedicated mentorship.", color: "from-green-500 to-emerald-500" },
];

// ── Learning Journey Steps ───────────────────────────────────────────
const JOURNEY_STEPS = [
    { step: "01", title: "Needs Assessment & Consultation", desc: "Our team evaluates your school's infrastructure, student demographics, and curriculum goals to find the best-fit program." },
    { step: "02", title: "Customized Program Design", desc: "We design a tailored, semester-wide program covering robotics kits, software licenses, lab layout, and session schedules." },
    { step: "03", title: "Educator Certification Training", desc: "Your teachers undergo our intensive 40-hour hands-on training program. They receive certification upon completion." },
    { step: "04", title: "Student Workshops & Rollout", desc: "Workshops begin with students receiving real hardware kits. Each session is project-based with take-home assignments." },
    { step: "05", title: "Continuous Support & Review", desc: "Dedicated technical support, quarterly assessment reports, parent feedback sessions, and curriculum upgrades." },
];

// ── Why Choose Us ────────────────────────────────────────────────────
const WHY_CHOOSE = [
    { title: "NEP 2020 Aligned", desc: "Our curriculum is fully aligned with India's National Education Policy for experiential and skill-based learning.", icon: FileCheck },
    { title: "Shark Tank Featured", desc: "PNT Academy was recognized and featured on Shark Tank India for our innovative approach to tech education.", icon: Star },
    { title: "Real Hardware Kits", desc: "No simulations. Students work with actual Arduino boards, sensors, drones, and 3D printers in every session.", icon: Wrench },
    { title: "End-to-End Support", desc: "From lab setup to teacher training to student assessments — we handle the entire tech education lifecycle.", icon: Users },
    { title: "Proven Track Record", desc: "With 100+ schools and 25,000+ students trained, our programs deliver measurable learning outcomes.", icon: Trophy },
    { title: "Government Recognized", desc: "Registered under Startup India and recognized by MSME for contributions to STEM education nationwide.", icon: Shield },
];

// ═══════════════════════════════════════════════════════════════════════
// COUNT-UP NUMBER COMPONENT (on-load only, no hover)
// ═══════════════════════════════════════════════════════════════════════
function CountUpNumber({ value, suffix }: { value: number; suffix: string }) {
    const [displayValue, setDisplayValue] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: true });
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (isInView && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 2200;
            const steps = 60;
            const stepTime = Math.floor(duration / steps);
            const increment = value / steps;
            let current = 0;
            let stepCount = 0;

            const timer = setInterval(() => {
                stepCount++;
                // Easing: accelerate then decelerate
                const progress = stepCount / steps;
                const easedProgress = progress < 0.5 
                    ? 2 * progress * progress 
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                current = Math.floor(easedProgress * value);
                
                if (stepCount >= steps) {
                    setDisplayValue(value);
                    clearInterval(timer);
                } else {
                    setDisplayValue(current);
                }
            }, stepTime);
            return () => clearInterval(timer);
        }
    }, [isInView, value]);

    return (
        <div ref={ref} className="text-3xl md:text-5xl font-black text-white tabular-nums">
            {displayValue.toLocaleString()}{suffix}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// SEAMLESS VIDEO BACKGROUND (auto-fetches from API, crossfade 0.5s)
// ═══════════════════════════════════════════════════════════════════════
function SeamlessVideoHero() {
    const [videoUrls, setVideoUrls] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    // Auto-fetch video list from the API (picks up any file in /public/videos/)
    useEffect(() => {
        fetch("/api/admin/videos")
            .then((res) => res.json())
            .then((data: any[]) => {
                if (data && data.length > 0) {
                    setVideoUrls(data.map((v) => {
                        let url = v.url;
                        const trims = [];
                        if (v.startTime > 0) trims.push(`so_${v.startTime}`);
                        if (v.endTime > 0) trims.push(`eo_${v.endTime}`);
                        
                        if (trims.length > 0 && url.includes("/upload/")) {
                            url = url.replace("/upload/", `/upload/${trims.join(",")}/`);
                        }
                        return url;
                    }));
                } else {
                    // Fallback in case API fails
                    setVideoUrls(["/videos/Students_Build_Robots_Cinematic_Montage.mp4"]);
                }
            })
            .catch(() => {
                setVideoUrls(["/videos/Students_Build_Robots_Cinematic_Montage.mp4"]);
            });
    }, []);

    const handleVideoEnd = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % (videoUrls.length || 1));
    }, [videoUrls.length]);

    useEffect(() => {
        if (videoUrls.length === 0) return;
        const currentVideo = videoRefs.current[currentIndex];
        if (currentVideo) {
            currentVideo.currentTime = 0;
            currentVideo.play().catch(() => {});
        }
    }, [currentIndex, videoUrls]);

    if (videoUrls.length === 0) return null;

    return (
        <div className="absolute inset-0 w-full h-full z-0 hidden md:block">
            {videoUrls.map((src, i) => (
                <video
                    key={src}
                    ref={(el) => { videoRefs.current[i] = el; }}
                    muted
                    playsInline
                    onEnded={handleVideoEnd}
                    src={src}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out"
                    style={{ opacity: currentIndex === i ? 1 : 0 }}
                />
            ))}
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// ROTATING TEXT ANIMATION (full-width, no clipping)
// ═══════════════════════════════════════════════════════════════════════
function RotatingText() {
    const [currentWord, setCurrentWord] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentWord((prev) => (prev + 1) % ROTATING_WORDS.length);
        }, 2500);
        return () => clearInterval(timer);
    }, []);

    return (
        <span className="block w-full h-[1.2em] relative overflow-hidden">
            <AnimatePresence mode="wait">
                <motion.span
                    key={currentWord}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute inset-x-0 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
                >
                    {ROTATING_WORDS[currentWord]}
                </motion.span>
            </AnimatePresence>
        </span>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════
export default function SchoolsTrainingContent({ bootcampLink = "/bootcamp" }: { bootcampLink?: string }) {
    const [liveSchools, setLiveSchools] = useState<any[]>([]);
    const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const schools = await getLiveSchools();
                if (schools && schools.length > 0) {
                    setLiveSchools(schools);
                } else {
                    setLiveSchools(STATIC_FALLBACK_SCHOOLS);
                }
            } catch (err) {
                console.error("Failed to load schools:", err);
                setLiveSchools(STATIC_FALLBACK_SCHOOLS);
            }
        };
        fetchSchools();
    }, []);

    const marqueeRow1 = [...liveSchools, ...liveSchools, ...liveSchools];
    const marqueeRow2 = [...liveSchools.slice().reverse(), ...liveSchools.slice().reverse(), ...liveSchools.slice().reverse()];

    return (
        <div className="w-full flex flex-col pt-20 relative z-10">

            {/* ═══════════════════════════════════════════════════════════
                SECTION 0: CINEMATIC SEAMLESS VIDEO HERO
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Desktop: Seamless multi-video crossfade */}
                <SeamlessVideoHero />
                
                {/* Mobile: Gradient fallback */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50/90 via-white/70 to-purple-50/90 dark:from-slate-900/90 dark:via-blue-950/70 dark:to-purple-950/90 block md:hidden z-0" />

                {/* Overlay */}
                <div className="absolute inset-0 z-[1] bg-white/50 dark:bg-slate-900/70 backdrop-blur-[3px]"></div>

                {/* Floating particles */}
                <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
                    {[...Array(6)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 rounded-full bg-blue-500/30 dark:bg-blue-400/20"
                            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                            animate={{ y: [0, -30, 0], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 3 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                        />
                    ))}
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8 xl:px-0 flex flex-col items-center justify-center text-center py-20 md:py-32">
                    
                    {/* Clickable Bootcamp Ribbon */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Link 
                            href={bootcampLink} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-red-500/90 dark:bg-red-600/90 backdrop-blur-xl border border-red-400/50 mb-10 shadow-[0_0_30px_rgba(239,68,68,0.3)] hover:shadow-[0_0_50px_rgba(239,68,68,0.5)] hover:scale-105 transition-all cursor-pointer group"
                        >
                            <span className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                            </span>
                            <span className="text-white text-sm md:text-base font-bold tracking-wide">
                                🚀 Free AI & Robotics Bootcamp — Register Now!
                            </span>
                            <ExternalLink className="w-4 h-4 text-white group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white leading-[1.15] tracking-tight mb-6 w-full max-w-4xl"
                    >
                        <span className="block">Learn</span>
                        <RotatingText />
                        <span className="block">at Your School</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="max-w-3xl text-lg md:text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed mb-10"
                    >
                        Delivering hands-on workshops, real-world projects, and industry exposure to prepare your students for the careers of tomorrow.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <button className="px-10 py-5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 group text-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(59,130,246,0.4)] mx-auto">
                            Partner with Us
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 1: IMPACT STATS (COUNT-UP ON LOAD)
            ═══════════════════════════════════════════════════════════ */}
            <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-purple-600 relative z-10 overflow-hidden">
                <motion.div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
                <motion.div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 5, repeat: Infinity }} />
                
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0 grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
                    {STATS.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                            className="flex flex-col items-center"
                        >
                            <CountUpNumber value={stat.value} suffix={stat.suffix} />
                            <div className="text-blue-100 text-sm md:text-base font-medium mt-2">{stat.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2: DUAL-RAIL LOGO TICKER
            ═══════════════════════════════════════════════════════════ */}
            <section className="w-full py-16 bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm relative z-10 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0 mb-8">
                    <h3 className="text-center text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2">
                        TRUSTED BY 100+ SCHOOLS ACROSS INDIA
                    </h3>
                    <p className="text-center text-slate-600 dark:text-slate-400 text-sm">
                        From Pune to Delhi, our programs are transforming classrooms into innovation hubs.
                    </p>
                </div>

                {/* Rail 1: Left to Right */}
                <div className="w-full overflow-hidden relative mb-4">
                    <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                    <motion.div 
                        className="flex gap-8 items-center whitespace-nowrap min-w-max"
                        animate={{ x: [0, -1200] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 35 }}
                    >
                        {marqueeRow1.map((school, i) => (
                            <LogoPill key={`r1-${i}`} school={school} />
                        ))}
                    </motion.div>
                </div>

                {/* Rail 2: Right to Left */}
                <div className="w-full overflow-hidden relative">
                    <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
                    <motion.div 
                        className="flex gap-8 items-center whitespace-nowrap min-w-max"
                        animate={{ x: [-1200, 0] }}
                        transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
                    >
                        {marqueeRow2.map((school, i) => (
                            <LogoPill key={`r2-${i}`} school={school} />
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3: CORE PROGRAMS
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">OUR OFFERINGS</motion.p>
                        <motion.h2 initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Comprehensive Tech Curriculums</motion.h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Equip your institution with structured programs from foundational hardware to advanced AI.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {CORE_PROGRAMS.map((core, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-slate-200 dark:border-slate-700 p-8 rounded-2xl hover:border-blue-500/50 hover:shadow-xl transition-shadow group"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${core.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                                    <core.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{core.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{core.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4: WHY PNT ACADEMY
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <p className="text-purple-600 dark:text-purple-400 font-bold uppercase tracking-widest text-sm mb-3">WHY PNT ACADEMY?</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">What Makes Us Different</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">We don&apos;t just teach — we transform your school into a centre of tech innovation.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {WHY_CHOOSE.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 hover:border-purple-500/40 hover:shadow-lg transition-all"
                            >
                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-4">
                                    <item.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 5: 15+ WORKSHOP MODULES (3D FLIP CARDS)
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-transparent relative z-10">
                <div className="max-w-7xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <p className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest text-sm mb-3">FULL CURRICULUM</p>
                            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">15+ Practical Workshop Modules</h2>
                            <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl">Hover or tap to reveal full details about each module.</p>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-2 hover:gap-4 transition-all pb-2 border-b border-blue-600/30 shrink-0">
                            Download Full Curriculum <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {WORKSHOP_MODULES.map((module, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (i % 6) * 0.08 }}
                                className="relative h-72 w-full group cursor-pointer"
                                style={{ perspective: "1200px" }}
                                onMouseEnter={() => setFlippedIndex(i)}
                                onMouseLeave={() => setFlippedIndex(null)}
                                onClick={() => setFlippedIndex(flippedIndex === i ? null : i)}
                            >
                                <motion.div
                                    animate={{ rotateY: flippedIndex === i ? 180 : 0 }}
                                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 22 }}
                                    className="w-full h-full relative"
                                    style={{ transformStyle: "preserve-3d" }}
                                >
                                    {/* FRONT */}
                                    <div 
                                        className="absolute w-full h-full bg-white/70 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-2xl p-7 flex flex-col justify-between shadow-md group-hover:shadow-xl transition-shadow"
                                        style={{ backfaceVisibility: "hidden" }}
                                    >
                                        <div>
                                            <div className="flex items-center gap-4 mb-5">
                                                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-md shrink-0">
                                                    <module.icon className="w-7 h-7 text-white" />
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{module.title}</h3>
                                            </div>
                                            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{module.desc}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700/50 mt-auto">
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{module.age}</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 group-hover:text-blue-500 transition-colors">
                                                Flip for details <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform"/>
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* BACK */}
                                    <div 
                                        className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-7 flex flex-col justify-between shadow-lg"
                                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                    >
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-3">{module.title}</h3>
                                            <p className="text-blue-100 text-sm leading-relaxed">{module.backDesc}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t border-white/20 mt-auto">
                                            <span className="text-xs font-bold text-white/80">⏱ {module.duration}</span>
                                            <span className="text-xs font-bold text-white/80">👤 {module.age}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 6: LEARNING JOURNEY TIMELINE
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-slate-50/50 dark:bg-slate-900/30 backdrop-blur-sm relative z-10">
                <div className="max-w-4xl mx-auto px-4 md:px-8 xl:px-0">
                    <div className="text-center mb-16">
                        <p className="text-green-600 dark:text-green-400 font-bold uppercase tracking-widest text-sm mb-3">HOW IT WORKS</p>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">Implementation Journey</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-xl mx-auto mt-4">A structured, step-by-step process from initial consultation to continuous student engagement.</p>
                    </div>
                    
                    <div className="relative border-l-2 border-blue-200 dark:border-slate-700 ml-6 md:ml-12 pl-8 md:pl-16 space-y-14">
                        {JOURNEY_STEPS.map((step, i) => (
                            <motion.div 
                                key={i} 
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="relative group"
                            >
                                <motion.div 
                                    whileHover={{ scale: 1.15, rotate: 360 }}
                                    transition={{ type: "spring", stiffness: 200 }}
                                    className="absolute -left-[45px] md:-left-[77px] top-0 w-12 h-12 bg-white dark:bg-slate-900 border-[3px] border-blue-500 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                >
                                    {step.step}
                                </motion.div>
                                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2">{step.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 7: FINAL CTA
            ═══════════════════════════════════════════════════════════ */}
            <section className="py-24 w-full bg-transparent relative z-10">
                <div className="max-w-4xl mx-auto px-4 md:px-8 xl:px-0 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-12 md:p-20 shadow-2xl relative overflow-hidden"
                    >
                        <motion.div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" animate={{ scale: [1, 1.3, 1], x: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity }} />
                        <motion.div className="absolute bottom-10 left-10 w-24 h-24 bg-purple-300/10 rounded-full blur-2xl" animate={{ scale: [1.3, 1, 1.3], y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }} />

                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight relative z-10">Ready to Transform Your School?</h2>
                        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed relative z-10">
                            Join the 100+ schools that have already future-proofed their students. Get a free consultation and customized program proposal.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link href="/contact" className="px-10 py-5 rounded-xl font-bold text-blue-700 bg-white hover:bg-blue-50 transition-all shadow-lg flex items-center justify-center gap-2 group text-lg hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(255,255,255,0.3)]">
                                Schedule a Free Consultation
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="tel:+919326014648" className="px-10 py-5 rounded-xl font-bold text-white bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30 transition-all flex items-center justify-center gap-2 text-lg hover:-translate-y-1">
                                📞 Call Us Now
                            </a>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════
// LOGO PILL COMPONENT
// ═══════════════════════════════════════════════════════════════════════
function LogoPill({ school }: { school: any }) {
    if (school.imageUrl) {
        return (
            <div className="relative h-14 w-36 md:h-16 md:w-44 shrink-0 hover:scale-110 transition-transform">
                <Image src={school.imageUrl} alt={school.name || "School Logo"} fill className="object-contain" />
            </div>
        );
    }
    return (
        <div className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 rounded-full text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm shrink-0 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all">
            {school.name}
        </div>
    );
}
