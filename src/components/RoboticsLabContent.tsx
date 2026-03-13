"use client";
import { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Microchip, Radar, MonitorPlay, Cog, School, University, Star, Quote } from "lucide-react";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Environment, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";

export default function RoboticsLabContent() {
    const [activeTab, setActiveTab] = useState<"schools" | "colleges">("schools");

    // Define tabs data for the new structure
    const tabs = [
        { id: "schools", label: "For Schools", icon: School },
        { id: "colleges", label: "For Colleges", icon: University },
    ];

    return (
        <>
            {/* --- Hero Section --- */}
            <div className="relative flex flex-col items-center justify-center text-center min-h-[420px] pt-32 pb-16 overflow-hidden bg-black">
                {/* Full lab photo */}
                <img
                    src="/images/robotics-lab/1.jpeg"
                    alt="Robotics Lab"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                {/* Just a subtle dark vignette at the bottom so text stays readable */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

                <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight text-white text-center leading-tight"
                    >
                        Industrial Robotics{" "}
                        <span className="text-cyan-300">Lab Setup</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                        className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 font-normal text-center"
                    >
                        Choose your institution type below to view our specialized curriculum and hardware configurations.
                    </motion.p>

                    {/* Tab switcher */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex justify-center"
                    >
                        <div className="inline-flex bg-white/10 backdrop-blur-xl border border-white/20 rounded-full p-1.5 relative shadow-lg">
                            {tabs.map((tab) => {
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as "schools" | "colleges")}
                                        className={`relative z-10 px-8 py-3 text-base font-bold rounded-full transition-all duration-300 ${
                                            isActive
                                                ? "text-blue-800"
                                                : "text-white/80 hover:text-white"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                );
                            })}

                            {/* Animated white active pill */}
                            <motion.div
                                className="absolute top-1.5 bottom-1.5 w-[calc(50%-0.375rem)] rounded-full bg-white shadow-md z-0"
                                initial={false}
                                animate={{ left: activeTab === "schools" ? "0.375rem" : "50%" }}
                                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>


            {/* Dynamic Content Rendering */}
            <div className="relative min-h-[800px] w-full pb-20">
                <AnimatePresence mode="wait">
                    {activeTab === "schools" ? (
                        <motion.div
                            key="schools"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.5 }}
                        >
                            <SchoolsContent />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="colleges"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.5 }}
                        >
                            <CollegesContent />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );
}

// -------------------------------------------------------------
// Interactive 3D Hardware Model Component — uses real GLB files
// -------------------------------------------------------------
const MODEL_MAP: Record<number, string> = {
    0: "/models/arduino_uno.glb",
    1: "/models/esp8266.glb",
    2: "/models/raspberry_pi.glb",
};

// Auto-normalizing GLB model: synchronously centers and scales to fill the viewport
function GlbModel({ path, targetSize = 5 }: { path: string; targetSize?: number }) {
    const { scene } = useGLTF(path);
    const groupRef = useRef<THREE.Group>(null);

    // Compute bounding box and scale it safely ONCE before it ever renders
    const scaledScene = useMemo(() => {
        const cloned = scene.clone(true);
        const box = new THREE.Box3().setFromObject(cloned);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0) {
            cloned.scale.setScalar(targetSize / maxDim);
        }
        return cloned;
    }, [scene, targetSize]);

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
    });

    return (
        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
            <group ref={groupRef}>
                <Center>
                    <primitive object={scaledScene} />
                </Center>
            </group>
        </Float>
    );
}

// Simple wrapper: receives the glb path directly
function HardwareModel({ path }: { path: string }) {
    return <GlbModel path={path} targetSize={4} />;
}

// -------------------------------------------------------------
// State 1: For Schools
// -------------------------------------------------------------
// Preload known GLB models so they start downloading immediately and don't stall the UI
useGLTF.preload("/models/arduino_uno.glb");
useGLTF.preload("/models/esp8266.glb");
useGLTF.preload("/models/raspberry_pi.glb");

// All hardware categories — each has a model file path (or null until GLB is added)
const HARDWARE_ITEMS = [
    {
        title: "Core Controllers",
        subtitle: "Arduino Uno / ESP8266 / Raspberry Pi",
        icon: Microchip,
        desc: "From basic logic to AI-grade computing — the heart of every project.",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        border: "border-blue-500",
        models: ["/models/arduino_uno.glb", "/models/esp8266.glb", "/models/raspberry_pi.glb"],
    },
    {
        title: "Smart Sensors",
        subtitle: "HC-SR04 Ultrasonic / PIR / IR / DHT11",
        icon: Radar,
        desc: "Real-world input — ultrasonic ranging, heat detection, gas sensing & more.",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500",
        models: [], // Add: hc-sr04_ultrasonic.glb, pir_sensor.glb, dht11.glb
    },
    {
        title: "Displays & Modules",
        subtitle: "16x2 LCD / OLED / Bluetooth HC-05 / GPS",
        icon: MonitorPlay,
        desc: "Human-machine interfaces and wireless communication modules.",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500",
        models: [], // Add: lcd_16x2.glb, oled_display.glb, hc05_bluetooth.glb
    },
    {
        title: "Motors & Actuators",
        subtitle: "SG90 Servo / 28BYJ Stepper / DC Gear Motor",
        icon: Cog,
        desc: "Physical movement — servo arms, wheel drives, pump mechanisms.",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500",
        models: [], // Add: sg90_servo.glb, stepper_motor.glb, dc_gear_motor.glb
    },
];

function SchoolsContent() {
    const [activeCat, setActiveCat] = useState(0);
    const [modelIdx, setModelIdx] = useState(0);

    const currentCategory = HARDWARE_ITEMS[activeCat];
    const availableModels = currentCategory.models;
    const currentModel = availableModels[modelIdx] ?? null;

    // Auto-slideshow: cycle through models in the active category every 3s
    useEffect(() => {
        if (availableModels.length <= 1) return;
        const t = setInterval(() => {
            setModelIdx(i => (i + 1) % availableModels.length);
        }, 3000);
        return () => clearInterval(t);
    }, [activeCat, availableModels.length]);

    // Reset modelIdx when category changes
    useEffect(() => { setModelIdx(0); }, [activeCat]);

    return (
        <div className="container mx-auto px-4 py-20 max-w-7xl">
            {/* Section 1: The Principle */}
            <section className="mb-24 text-center max-w-4xl mx-auto">
                <span className="text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase mb-4 block">The Principle</span>
                <h2 className="text-3xl md:text-5xl font-black mb-8 text-slate-900 dark:text-white">Empowering the Next Generation of Innovators</h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                    Our school labs are built on the core philosophy of hands-on learning and deep STEM integration.
                    We bridge the gap between textbook physics and real-world engineering, preparing students for the careers of tomorrow.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <span className="px-6 py-3 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" /> NEP 2020 Aligned
                    </span>
                    <span className="px-6 py-3 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" /> Hands-on STEM
                    </span>
                    <span className="px-6 py-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 rounded-xl font-bold flex items-center gap-2 shadow-sm">
                        <CheckCircle2 className="w-5 h-5" /> Project Based
                    </span>
                </div>
            </section>

            {/* Section 2: Electronics Lab with real GLB models */}
            <section className="mb-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-6">The Electronics Lab</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Select a category to explore the hardware in 3D.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-stretch">
                    {/* Left: Category cards */}
                    <div className="flex flex-col gap-4">
                        {HARDWARE_ITEMS.map((item, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveCat(i)}
                                onMouseEnter={() => setActiveCat(i)}
                                className={`text-left p-6 rounded-3xl border-2 transition-all duration-300 flex items-center gap-6 ${
                                    activeCat === i
                                        ? `bg-white dark:bg-slate-900 ${item.border} shadow-xl scale-105 z-10 relative`
                                        : "bg-slate-50 dark:bg-slate-800/40 border-transparent hover:bg-white dark:hover:bg-slate-800 hover:shadow-md hover:scale-[1.02]"
                                }`}
                            >
                                <div className={`w-16 h-16 shrink-0 rounded-2xl flex items-center justify-center ${item.iconBg} ${item.iconColor}`}>
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed truncate">{item.subtitle}</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Right: 3D Canvas — no container bg, floats seamlessly */}
                    <div className="h-[400px] lg:h-[600px] w-full relative flex items-center justify-center">
                        {/* Decorative background circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[60px] pointer-events-none" />
                        
                        {currentModel ? (
                            <>
                                <div className="absolute inset-0">
                                    <Canvas camera={{ position: [5, 4, 5], fov: 40 }}>
                                        <ambientLight intensity={1.2} />
                                        <directionalLight position={[5, 5, 5]} intensity={1.5} />
                                        <directionalLight position={[-5, -5, -5]} intensity={0.5} />
                                        <Environment preset="studio" />
                                        <Suspense fallback={null}>
                                            <HardwareModel path={currentModel} />
                                        </Suspense>
                                        <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={8} blur={2.5} far={5} />
                                        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
                                    </Canvas>
                                </div>
                                {/* Model label overlay */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none z-10">
                                    <div className="bg-slate-900/60 dark:bg-black/60 backdrop-blur-md border border-white/10 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-xl">
                                        {currentCategory.title} · {currentCategory.subtitle.split("/")[modelIdx]?.trim()}
                                    </div>
                                </div>
                                {/* Slideshow dots */}
                                {availableModels.length > 1 && (
                                    <div className="absolute top-4 right-4 flex gap-2 pointer-events-none z-10">
                                        {availableModels.map((_, i) => (
                                            <div key={i} className={`h-2 rounded-full transition-all ${i === modelIdx ? "w-6 bg-blue-500" : "w-2 bg-slate-300 dark:bg-white/30"}`} />
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            // Placeholder when no model available yet
                            <div className="flex flex-col items-center justify-center text-center p-10">
                                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-5">
                                    <currentCategory.icon className="w-10 h-10 text-white/30" />
                                </div>
                                <p className="text-white/50 font-semibold text-sm mb-1">3D Model Coming Soon</p>
                                <p className="text-white/25 text-xs">Drop the GLB file in <span className="font-mono">public/models/</span></p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Section 3: Other Lab Components (Grid Layout) */}
            <section>
                <h2 className="text-3xl md:text-4xl font-black mb-12 text-center">Complete Infrastructure</h2>
                <div className="grid md:grid-cols-2 gap-8">
                    {[
                        { title: "Rapid Prototyping", items: "3D Printers, PLA/ABS Filaments, Design Software" },
                        { title: "Mechanical & Tools", items: "Workstations, Calipers, Drilling Machines, Toolsets" },
                        { title: "Power & Safety", items: "Bench Power Supplies, Multimeters, Soldering Stations, Safety Gear" },
                        { title: "Lab Interiors", items: "Custom tables, ergonomic chairs, engaging vinyl wallpapers" },
                    ].map((comp, i) => (
                        <div key={i} className="flex flex-col md:flex-row bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg group">
                            {/* Modern Image Placeholder */}
                            <div className="w-full md:w-2/5 h-48 md:h-auto bg-slate-100 dark:bg-slate-800 relative overflow-hidden flex flex-col items-center justify-center shrink-0">
                                {/* Glassmorphism Skeleton Placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 backdrop-blur-md" />
                                <div className="w-16 h-16 bg-white/40 dark:bg-black/20 rounded-full animate-pulse flex items-center justify-center backdrop-blur-xl border border-white/50 dark:border-white/10 mb-2">
                                    <span className="text-2xl">📷</span>
                                </div>
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest relative z-10">Image Needed</span>
                            </div>
                            <div className="p-8 md:w-3/5 flex flex-col justify-center">
                                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{comp.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">{comp.items}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

// -------------------------------------------------------------
// State 2: For Colleges
// -------------------------------------------------------------
function CollegesContent() {
    const [liveTestimonials, setLiveTestimonials] = useState<any[] | null>(null);

    useEffect(() => {
        // Fetch only lab-page testimonials
        fetch("/api/admin/testimonials?page=lab")
            .then(r => r.json())
            .then(data => setLiveTestimonials(Array.isArray(data) ? data : []))
            .catch(() => setLiveTestimonials([]));
    }, []);

    const fallbackTestimonials = [
        { name: "Rahul S.", role: "Pillai College of Engg.", quote: "Working on the 6DOF robotic hand algorithms completely changed my perspective on ROS. The hands-on exposure is unmatched." },
        { name: "Ananya M.", role: "Manipal Academy", quote: "The AGV trolley project we built here helped me crack my core technical interview instantly. This lab is transformative." },
        { name: "Vikram K.", role: "Bharati Vidyapeeth", quote: "Bridging mechanical design with computer vision inside a real lab setting is a privilege very few engineering students get." },
    ];

    const testimonialsToShow = (liveTestimonials && liveTestimonials.length > 0) ? liveTestimonials : fallbackTestimonials;

    return (
        <div className="container mx-auto px-4 py-20 max-w-7xl">
            {/* Hero/Intro */}
            <section className="mb-24 text-center max-w-4xl mx-auto">
                <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase mb-4 block">Higher Education</span>
                <h2 className="text-3xl md:text-5xl font-black mb-8 text-slate-900 dark:text-white">Research-Enabled Industrial Automation Lab</h2>

                {/* Highlighted Warning Stat */}
                <div className="bg-red-50 dark:bg-red-900/10 border-2 border-red-200 dark:border-red-900/30 rounded-2xl p-6 mb-10 inline-block shadow-sm transform hover:scale-105 transition-transform">
                    <p className="text-red-800 dark:text-red-400 font-bold text-lg md:text-xl flex items-center justify-center gap-3">
                        <span className="text-2xl animate-pulse">⚠️</span>
                        NASSCOM data shows only 10% of engineering grads are employable in core robotics.
                    </p>
                </div>

                <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-6 font-medium">
                    Our mission is to bridge the massive gap between theoretical university curriculums and the harsh demands of the manufacturing, defense, and automation industries.
                </p>
            </section>

            {/* The Opportunity/Solution (Process Flow) */}
            <section className="mb-32">
                <h2 className="text-3xl font-black mb-16 text-center">The Solution Pathway</h2>
                <div className="grid md:grid-cols-4 gap-6 relative">
                    {/* Connecting line for desktop */}
                    <div className="hidden md:block absolute top-[40px] left-[10%] w-[80%] h-1 bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-800 dark:to-indigo-800 z-0" />

                    {[
                        { step: "01", title: "Permanent Lab Setup", desc: "Industrial-grade AGVs and robotic arms installed permanently on campus." },
                        { step: "02", title: "Curriculum Integration", desc: "Syllabus mapping across mechanical, electrical, and CS departments." },
                        { step: "03", title: "Faculty Enablement", desc: "Intensive Train-the-Trainer programs for definitive professorial ownership." },
                        { step: "04", title: "Industry Exposure", desc: "Exclusive live projects & partnerships with Indian Navy, DRDO, TATA Power." },
                    ].map((step, i) => (
                        <div key={i} className="relative z-10 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center group hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full flex items-center justify-center font-black text-3xl mb-8 shadow-lg shadow-blue-500/30 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                {step.step}
                            </div>
                            <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Lab Tiering UI */}
            <section className="mb-32">
                <h2 className="text-3xl md:text-4xl font-black mb-16 text-center">Tiered Infrastructure Models</h2>
                <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Basic Tier */}
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-10 md:p-14 rounded-[3rem] border border-slate-200 dark:border-slate-800 relative overflow-hidden group hover:shadow-xl transition-shadow">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-bl-[100px] transition-transform group-hover:scale-110" />
                        <h3 className="text-4xl font-black mb-4">Basic Level</h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-10 text-xl font-medium">Foundational Automation & Educational Robotics</p>
                        <ul className="space-y-6 font-medium text-slate-700 dark:text-slate-300 text-lg">
                            <li className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-blue-500 shrink-0" /> Educational Robotic Arms (Desktop scale)</li>
                            <li className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-blue-500 shrink-0" /> Introductory ROS setups & simulations</li>
                            <li className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-blue-500 shrink-0" /> Controller-based IoT workstations</li>
                            <li className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-blue-500 shrink-0" /> Vision basics & payload balancing concepts</li>
                        </ul>
                    </div>
                    {/* Advanced Tier */}
                    <div className="bg-white dark:bg-slate-900 p-10 md:p-14 rounded-[3rem] border-2 border-indigo-500 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-sm font-bold px-6 py-2 rounded-bl-3xl uppercase tracking-widest shadow-md z-10">Recommended</div>
                        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-colors duration-700 pointer-events-none" />

                        <h3 className="text-4xl font-black mb-4 relative z-10">Advance Level</h3>
                        <p className="text-indigo-600 dark:text-indigo-400 mb-10 text-xl font-bold relative z-10">Industrial-Grade Automation Systems</p>
                        <ul className="space-y-6 font-bold text-slate-800 dark:text-slate-200 text-lg relative z-10">
                            <li className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-indigo-500 shrink-0" /> Industrial-Grade AGVs (Fully customizable)</li>
                            <li className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-indigo-500 shrink-0" /> 6-Axis Industrial Robotic Arms</li>
                            <li className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-indigo-500 shrink-0" /> Advanced Autonomous Drones & UAVs</li>
                            <li className="flex items-start gap-4"><CheckCircle2 className="w-7 h-7 text-indigo-500 shrink-0" /> High-DOF Robotic Hands & Grippers</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Testimonials — LIVE from Admin Panel (Lab page) */}
            <section>
                <div className="text-center mb-16">
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase mb-3 block text-sm">Student Voices</span>
                    <h2 className="text-3xl md:text-4xl font-black mb-4">Trusted by Future Engineers</h2>
                    <p className="text-slate-500 dark:text-slate-400">Engineering students executing real-world industry mandates.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonialsToShow.map((test: any, i: number) => {
                        const initial = test.name?.charAt(0) || "?";
                        return (
                            <div
                                key={test._id || i}
                                className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col"
                            >
                                {/* Large photo / GIF area */}
                                <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30">
                                    {test.imageUrl ? (
                                        <img
                                            src={test.imageUrl}
                                            alt={test.name}
                                            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-black text-5xl shadow-xl">
                                                {initial}
                                            </div>
                                        </div>
                                    )}
                                    {/* Name + role tag at bottom of photo */}
                                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                                        <h4 className="font-bold text-white text-lg leading-tight">{test.name}</h4>
                                        <p className="text-indigo-300 text-xs font-semibold mt-0.5">{test.role}</p>
                                    </div>
                                </div>

                                {/* Quote area */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex text-amber-400 mb-4 gap-0.5">
                                        {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                    </div>
                                    <blockquote className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic flex-1">
                                        &ldquo;{test.quote}&rdquo;
                                    </blockquote>
                                    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <Quote className="w-4 h-4 text-indigo-300" />
                                            <span className="text-xs text-slate-400 font-medium">PNT Academy Lab Alumni</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

