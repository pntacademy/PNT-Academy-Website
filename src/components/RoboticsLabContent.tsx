"use client";
import { useState, useRef, useEffect, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Microchip, Radar, MonitorPlay, Cog, School, University, Star, Quote } from "lucide-react";
import Image from "next/image";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Float, ContactShadows, Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { getLiveGallery } from "@/lib/actions/db";

// Hook to detect mobile
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);
    return isMobile;
}

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
            <div className="relative w-full pb-20">
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
            
            <LabGallerySection />
        </>
    );
}

// -------------------------------------------------------------
// Interactive 3D Hardware Model Component — uses real GLB files
// -------------------------------------------------------------

// Auto-normalizing GLB model: synchronously centers and scales to fill the viewport
function GlbModel({ path, targetSize = 5 }: { path: string; targetSize?: number }) {
    const { scene } = useGLTF(path);
    const groupRef = useRef<THREE.Group>(null);

    // Clone, scale, and center the scene ONCE before it ever renders
    const clonedScene = useMemo(() => {
        const cloned = scene.clone(true);

        // Fix materials: ensure textures have proper color space
        cloned.traverse((child: any) => {
            if (child.isMesh && child.material) {
                const mats = Array.isArray(child.material) ? child.material : [child.material];
                mats.forEach((mat: any) => {
                    if (mat.map) {
                        mat.map.colorSpace = THREE.SRGBColorSpace;
                        mat.map.needsUpdate = true;
                    }
                    if (mat.emissiveMap) {
                        mat.emissiveMap.colorSpace = THREE.SRGBColorSpace;
                        mat.emissiveMap.needsUpdate = true;
                    }
                });
            }
        });

        // First pass: scale to target size
        const box = new THREE.Box3().setFromObject(cloned);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim > 0.0001) {
            cloned.scale.setScalar(targetSize / maxDim);
        }
        // Second pass: re-center AFTER scaling so the pivot is dead center
        const box2 = new THREE.Box3().setFromObject(cloned);
        const center = new THREE.Vector3();
        box2.getCenter(center);
        cloned.position.sub(center);
        return cloned;
    }, [scene, targetSize]);

    useFrame((_, delta) => {
        if (groupRef.current) groupRef.current.rotation.y += delta * 0.35;
    });

    return (
        <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
            <group ref={groupRef}>
                <primitive object={clonedScene} />
            </group>
        </Float>
    );
}

// Simple wrapper: receives the glb path directly
function HardwareModel({ path }: { path: string }) {
    return <GlbModel path={path} targetSize={4} />;
}

function PrinterModel() {
    return <GlbModel path="/models/3d_printer_2.0.glb" targetSize={6.0} />;
}

function WrenchModel() {
    return <GlbModel path="/models/toolkit_3D.glb" targetSize={7.0} />;
}

function HumanoidModel() {
    return <GlbModel path="/models/hr-os1_humanoid_robot_kit_-_endo_v1.0.glb" targetSize={9.0} />;
}

function PrinterLabSection() {
    const isMobile = useIsMobile();
    return (
        <section className="mb-24">
            <div className="text-center mb-12">
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs font-black uppercase tracking-widest mb-4">🖨️ Lab 2</span>
                <h2 className="text-3xl md:text-5xl font-black mb-4">3D Printer Lab</h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">From digital blueprints to physical reality — students design, slice, and print their own inventions.</p>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 items-center">
                {/* Interactive 3D Printer Visual */}
                <div className="flex flex-col gap-6">
                    <div className="relative flex items-center justify-center h-[500px] cursor-grab active:cursor-grabbing">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-[80px] -z-10" />

                        <div className="absolute inset-0 mobile-safe-canvas">
                            <Canvas 
                                shadows 
                                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
                                camera={{ position: [10, 4, 10], fov: 40 }}
                            >
                                <ambientLight intensity={0.4} />
                                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                                <directionalLight position={[-10, -10, -5]} intensity={0.4} />
                                <Environment preset="studio" />
                                <Suspense fallback={null}>
                                    <PrinterModel />
                                </Suspense>
                                {!isMobile && <OrbitControls makeDefault autoRotate autoRotateSpeed={1} enableZoom={false} />}
                            </Canvas>
                        </div>


                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none">
                            <span className="bg-orange-500/90 backdrop-blur text-white text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                👆 Drag to rotate
                            </span>
                        </div>
                    </div>
                </div>

                {/* Feature cards */}
                <div className="flex flex-col gap-4">
                    {[
                        { icon: "🎨", title: "CAD Design Training", desc: "Students learn Tinkercad & Fusion 360 to design custom 3D models from scratch." },
                        { icon: "🔧", title: "FDM & Resin Printers", desc: "Exposure to both FDM (PLA/ABS) and Resin printers for different material properties." },
                        { icon: "⚙️", title: "Slicing & Settings", desc: "Learn layer height, infill, supports, and print speed optimization with Cura/PrusaSlicer." },
                        { icon: "🏆", title: "Project-Based Output", desc: "Students print drone frames, robot parts, and custom enclosures for their projects." },
                    ].map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center text-2xl">{f.icon}</div>
                            <div>
                                <h4 className="font-bold text-slate-800 dark:text-white mb-0.5">{f.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// -------------------------------------------------------------
// State 1: For Schools
// -------------------------------------------------------------
// Preload known GLB models so they start downloading immediately and don't stall the UI
// Only preload smaller files to avoid blocking bandwidth
useGLTF.preload("/models/arduino_uno.glb");       // 1.2 MB
useGLTF.preload("/models/esp8266.glb");            // 0.3 MB
useGLTF.preload("/models/pir_sensor.glb");         // 0.1 MB
useGLTF.preload("/models/MQ2_sensor.glb");         // 1.1 MB
useGLTF.preload("/models/bo_battery_operated_motor.glb"); // 0.3 MB

// All hardware categories — each has its model file paths
const HARDWARE_ITEMS = [
    {
        title: "Core Controllers",
        subtitle: "Arduino Uno / ESP8266 / Raspberry Pi",
        icon: Microchip,
        desc: "From basic logic to AI-grade computing — the heart of every project.",
        iconBg: "bg-blue-100 dark:bg-blue-900/30",
        iconColor: "text-blue-600 dark:text-blue-400",
        models: ["/models/arduino_uno.glb", "/models/esp8266.glb", "/models/raspberry_pi_1k.glb"],
    },
    {
        title: "Smart Sensors",
        subtitle: "PIR Motion / MQ-2 Gas / DHT11 Temp",
        icon: Radar,
        desc: "Real-world input — motion detection, gas sensing, temperature & humidity monitoring.",
        iconBg: "bg-purple-100 dark:bg-purple-900/30",
        iconColor: "text-purple-600 dark:text-purple-400",
        border: "border-purple-500",
        models: ["/models/pir_sensor.glb", "/models/MQ2_sensor.glb", "/models/DHT11_sensor_compressed.glb"],
    },
    {
        title: "Displays & Modules",
        subtitle: "16x2 LCD / OLED 128x64",
        icon: MonitorPlay,
        desc: "Human-machine interfaces for interactive visual output and data display.",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
        iconColor: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500",
        models: ["/models/display_lcd_16x2_compressed.glb", "/models/display_oled_128x64.glb"],
    },
    {
        title: "Motors & Actuators",
        subtitle: "SG90 Servo / Stepper Motor / BO Motor",
        icon: Cog,
        desc: "Physical movement — servo arms, wheel drives, stepper precision.",
        iconBg: "bg-orange-100 dark:bg-orange-900/30",
        iconColor: "text-orange-600 dark:text-orange-400",
        border: "border-orange-500",
        models: ["/models/bo_battery_operated_motor.glb", "/models/servomotor_sg90_compressed.glb", "/models/aula_28_-_motor_de_passo_compressed.glb"],
    },
];

function SchoolsContent() {
    const isMobile = useIsMobile();
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
                    <div className="h-[400px] lg:h-[600px] w-full relative flex items-center justify-center mobile-safe-canvas">
                        {/* Decorative background circle */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 dark:bg-blue-400/5 rounded-full blur-[60px] pointer-events-none" />
                        
                        {currentModel ? (
                            <>
                                <div className="absolute inset-0">
                                    <Canvas camera={{ position: [5, 4, 5], fov: 40 }}>
                                        <ambientLight intensity={0.4} />
                                        <directionalLight position={[5, 8, 5]} intensity={1.0} />
                                        <directionalLight position={[-3, -2, -4]} intensity={0.3} />
                                        <Environment preset="warehouse" />
                                        <Suspense fallback={null}>
                                            <HardwareModel path={currentModel} />
                                        </Suspense>
                                        <ContactShadows position={[0, -2.5, 0]} opacity={0.3} scale={8} blur={2.5} far={5} />
                                        {!isMobile && <OrbitControls makeDefault target={[0, 0, 0]} enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />}
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


            {/* ===== 3D PRINTER LAB ===== */}
            <PrinterLabSection />

            {/* ===== MECHANICAL LAB ===== */}
            <section className="mb-24">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-black uppercase tracking-widest mb-4">🔩 Lab 3</span>
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Mechanical Lab</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">Hands-on engineering fundamentals — where students get real exposure to tools, materials, and mechanical systems.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Cards on the Left */}
                    <div className="grid sm:grid-cols-2 gap-5 order-2 lg:order-1">
                        {[
                            { icon: "🔩", title: "Precision Tools", desc: "Vernier calipers, micrometers, and measuring instruments for accurate fabrication.", color: "from-slate-100 to-slate-50 dark:from-slate-800 dark:to-slate-900", border: "border-slate-200 dark:border-slate-700" },
                        { icon: "🪛", title: "Workstations", desc: "Professional grade workbenches with vises, clamps, and full hand toolsets.", color: "from-blue-50 to-slate-50 dark:from-blue-900/20 dark:to-slate-900", border: "border-blue-100 dark:border-blue-800/30" },
                        { icon: "⚡", title: "Power Tools", desc: "Drilling machines, angle grinders, and bench grinders for material shaping.", color: "from-yellow-50 to-slate-50 dark:from-yellow-900/20 dark:to-slate-900", border: "border-yellow-100 dark:border-yellow-800/30" },
                        { icon: "🏗️", title: "Structural Assembly", desc: "Aluminium extrusion systems, fasteners, and frame construction kits.", color: "from-emerald-50 to-slate-50 dark:from-emerald-900/20 dark:to-slate-900", border: "border-emerald-100 dark:border-emerald-800/30" },
                        { icon: "⚙️", title: "Gear & Drive Systems", desc: "Gears, pulleys, belts, and chain drives for understanding mechanical advantage.", color: "from-purple-50 to-slate-50 dark:from-purple-900/20 dark:to-slate-900", border: "border-purple-100 dark:border-purple-800/30" },
                        { icon: "🛡️", title: "Safety Training", desc: "PPE, machine guarding, safe operating procedures, and lab safety protocols.", color: "from-red-50 to-slate-50 dark:from-red-900/20 dark:to-slate-900", border: "border-red-100 dark:border-red-800/30" },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                className={`bg-gradient-to-br ${item.color} rounded-2xl border ${item.border} p-6 hover:-translate-y-1 hover:shadow-lg transition-all`}>
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h4 className="font-bold text-slate-800 dark:text-white text-lg mb-2">{item.title}</h4>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Interactive 3D Wrench Visual on the Right */}
                    <div className="relative flex items-center justify-center h-[450px] cursor-grab active:cursor-grabbing order-1 lg:order-2">
                        {/* Soft Glow Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[80px] -z-10" />

                        <div className="absolute inset-0 mobile-safe-canvas">
                            <Canvas 
                                shadows
                                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
                                camera={{ position: [8, 6, 15], fov: 35 }}
                            >
                                <ambientLight intensity={0.4} />
                                <spotLight position={[10, 10, 10]} intensity={1.5} angle={0.2} castShadow />
                                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                                <directionalLight position={[-10, -10, -5]} intensity={0.4} />
                                <Environment preset="warehouse" />
                                <Suspense fallback={null}>
                                    <WrenchModel />
                                </Suspense>
                                <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                                {!isMobile && <OrbitControls makeDefault autoRotate autoRotateSpeed={1.5} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 2} />}
                            </Canvas>
                        </div>

                        {/* Interactive label */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
                            <span className="bg-blue-500/90 backdrop-blur text-white text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                👆 Drag to rotate
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HUMANOID ROBOT LAB ===== */}
            <section className="mb-8">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 text-xs font-black uppercase tracking-widest mb-4">🤖 Lab 4</span>
                    <h2 className="text-3xl md:text-5xl font-black mb-4">Humanoid Robot Lab</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">The future of robotics is human-shaped. Students program, interact with, and study full bipedal humanoid platforms.</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-10 items-center">
                    {/* Interactive 3D Humanoid Robot Visual */}
                    <div className="relative flex items-center justify-center h-[500px] cursor-grab active:cursor-grabbing lg:order-2">
                        {/* Soft Glow Behind */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-[80px] -z-10" />

                        <div className="absolute inset-0 mobile-safe-canvas">
                            <Canvas 
                                shadows
                                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
                                camera={{ position: [0, 4, 22], fov: 35 }}
                            >
                                <ambientLight intensity={0.5} />
                                <spotLight position={[5, 15, 10]} intensity={2} angle={0.3} castShadow />
                                <directionalLight position={[10, 10, 5]} intensity={1.2} />
                                <directionalLight position={[-10, -10, -5]} intensity={0.4} />
                                <Environment preset="studio" />
                                <Suspense fallback={null}>
                                    <HumanoidModel />
                                </Suspense>
                                <ContactShadows position={[0, -3.5, 0]} opacity={0.5} scale={15} blur={2.5} far={6} />
                                {!isMobile && <OrbitControls makeDefault autoRotate autoRotateSpeed={1} minPolarAngle={0} maxPolarAngle={Math.PI / 2 + 0.1} />}
                            </Canvas>
                        </div>

                        {/* Interactive label */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none hidden md:block">
                            <span className="bg-cyan-500/90 backdrop-blur text-white text-xs font-black px-4 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                                👆 Drag to inspect ED-U 01
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-5 lg:order-1">
                        <div className="p-6 bg-gradient-to-br from-cyan-50 to-slate-50 dark:from-cyan-900/20 dark:to-slate-900 rounded-2xl border border-cyan-100 dark:border-cyan-800/30">
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">What Students Learn</h3>
                            <ul className="space-y-3">
                                {[
                                    "Bipedal locomotion & balance control",
                                    "Voice and gesture interaction programming",
                                    "Facial recognition & emotion detection",
                                    "Sensor fusion: LiDAR, depth camera, IMU",
                                    "Real-time navigation in dynamic environments",
                                    "Human-Robot Interaction design & ethics",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xs font-black shrink-0">✓</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200 dark:border-amber-800/30">
                            <p className="text-amber-700 dark:text-amber-400 text-sm font-semibold">
                                🚀 <strong>Coming in 2025–26:</strong> PNT's in-house ED-U 01 humanoid platform, developed in partnership with Indian defense research labs. Institutions can pre-register for early access.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}


// -------------------------------------------------------------
// State 2: For Colleges — Full PDF Content
// -------------------------------------------------------------

// Product data for the solution grid & detail sections
const PRODUCTS = [
    {
        icon: "🦾", name: "Educational Robotic Arm", specs: "4 DOF | 3D Printed | Customizable Components",
        tagline: "Unlike plug-and-play labs, our robots are fully open — enabling circuit-level customization, DOF expansion, and multi-robot integration.",
        features: ["Demonstration of pick and place automation", "Demonstration of gesture-controlled robotic arm", "Sensor Feedback Integration with robot arm", "Path Planning and Motion Control", "Object Detection using OpenCV", "Object Sorting by Colour & by Size", "Programming for Industrial Applications", "Integration with IoT for Remote Control", "AI integration with robot arm"],
        image: "/images/robotics-lab/8.jpeg",
    },
    {
        icon: "🏭", name: "Industrial Robotic Arm", specs: "4–6 Axis Articulated | Payload: 1–2 kg | Repeatability: ±0.1 mm",
        tagline: "Industrial-grade precision for real-world manufacturing simulation.",
        features: ["Forward & inverse kinematics programming", "Pick-and-place task execution", "Tool path planning for repetitive tasks", "Payload testing and accuracy calibration"],
        image: "/images/robotics-lab/9.jpeg",
    },
    {
        icon: "🚗", name: "Industrial AGV", specs: "Industrial-grade | Custom-design capabilities | Smart factory integration",
        tagline: "Automated guided vehicles for smart warehouse and factory floor applications.",
        features: ["Line following AGV demonstration", "Obstacle avoidance demonstration", "RFID-based navigation system", "Automated goods transportation", "Speed and acceleration control", "Wireless & IoT-based Control", "Path planning via custom algorithms", "Battery and Power Optimization", "Integration of external sensors"],
        image: "/images/robotics-lab/10.jpeg",
    },
    {
        icon: "✋", name: "Robotic Hand", specs: "Multi-finger | Customizable Parts | Gesture-Controlled Interface",
        tagline: "Advanced dexterous manipulation and prosthetic hand research platform.",
        features: ["Finger movement coordination", "Feedback mechanism demonstration", "EMG-based hand control", "Gesture-based hand control", "Prosthetic Hand Demonstration", "Haptic Feedback System", "AI-Based control of hand", "AI-based gesture control", "Integration with Wearable Tech", "Remote-controlled hand movement"],
        image: "/images/robotics-lab/11.jpeg",
    },
    {
        icon: "🚁", name: "Industrial Drone", specs: "Programmable | Custom Control Options | AI-Integrated",
        tagline: "Programmable aerial platforms for surveillance, delivery, and inspection.",
        features: ["API usage and calibration", "Sensor data collection and usage", "Takeoff and landing automation", "Obstacle avoidance using object detection", "Warehouse automation using barcodes/QR codes", "Aerial Photography and Surveillance", "Face tracking with drone flight", "AI-based object detection from aerial view", "AI Surveillance drone with intruder detection", "PC application development to control drone"],
        image: "/images/robotics-lab/12.jpeg",
    },
    {
        icon: "🤖", name: "Industrial AMR", specs: "Differential / Mecanum wheel drive | ROS-based | LiDAR optional",
        tagline: "Addressing real-world challenges in logistics and defense deployment scenarios.",
        features: ["Hardware interfacing and integration of sensors and actuators with ROS", "Odometry sensor data and teleoperation control for AMRs", "Mapping indoor environments using LiDAR sensors", "Autonomous navigation with parameter tuning"],
        image: "/images/robotics-lab/13.jpeg",
        extraSpecs: ["Onboard microcontroller / SBC (Raspberry Pi / equivalent)", "Li-ion battery: 2–3 hours operational time", "Sensors: Ultrasonic, IR, IMU, optional LiDAR", "Supports ROS-based & block-based programming"],
    },
];

const HIRING_COMPANIES = [
    "ABB Mobile Robotics", "Fanuc India", "Tata Elxsi", "Bosch India", "Larsen & Toubro (L&T)",
    "Siemens India", "GreyOrange Robotics", "KUKA Robotics India", "Honeywell Automation", "Schneider Electric India",
    "PNT Robotics", "Mitsubishi Electric India", "Wipro Engineering", "Cognizant Technology Solutions",
    "Indian Oil Corporation (IOCL)", "Bluebotics India", "Industrial Robotics", "Heavy-Duty AGVs",
    "Collaborative Robotics", "General-Purpose Robotics",
];

function CollegesContent() {
    const [liveTestimonials, setLiveTestimonials] = useState<any[] | null>(null);
    const [labPartners, setLabPartners] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/admin/testimonials?page=lab")
            .then(r => r.json())
            .then(data => setLiveTestimonials(Array.isArray(data) ? data : []))
            .catch(() => setLiveTestimonials([]));
        fetch("/api/admin/lab-partners")
            .then(r => r.json())
            .then(data => setLabPartners(Array.isArray(data) ? data : []))
            .catch(() => setLabPartners([]));
    }, []);

    const fallbackTestimonials = [
        { name: "Gaurav Mishra", role: "Pillai College of Engineering", quote: "Completed a 6-month internship, contributed to building a robotic arm, and am now an AI & Robotics Engineer working on innovative projects." },
        { name: "Dewang Kanekar", role: "Bharati Vidyapeeth", quote: "Completed an Industrial Robotics Internship Program and am now an intern at PNT Robotics, working on robotic hands and trolley robots." },
        { name: "Ishanya", role: "Manipal Academy of Higher Education, Dubai Campus", quote: "I conducted filament color change tests, dynamic analysis, and researched braking mechanisms for high-RPM flywheels. Additionally, I assembled parts for an Autonomous Navigation machine, experimented with bearings, tested Arduino Nano modules, and used tools like angle grinders and drilling machines." },
    ];

    const testimonialsToShow = (liveTestimonials && liveTestimonials.length > 0) ? liveTestimonials : fallbackTestimonials;

    return (
        <div className="bg-gradient-to-b from-white to-slate-50 dark:from-[#0A0A0F] dark:to-[#0A0A0F] text-slate-900 dark:text-white">

            {/* ===== SECTION 2: PROBLEM STATEMENT ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="inline-block bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-5 border border-red-200 dark:border-red-500/30">⚠ The Crisis</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4 text-slate-900 dark:text-white">The Problem Statement</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        {[
                            { stat: "10%", text: "of Indian engineering graduates are employable in robotics-related fields", source: "NASSCOM", color: "red", bg: "from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/20", border: "border-red-200 dark:border-red-500/20", statColor: "text-red-500 dark:text-red-400" },
                            { stat: "0%", text: "Theoretical-heavy curriculums fail to provide hands-on experience and industry-ready skills", source: "Industry Report", color: "orange", bg: "from-orange-50 to-amber-50 dark:from-orange-950/40 dark:to-amber-950/20", border: "border-orange-200 dark:border-orange-500/20", statColor: "text-orange-500 dark:text-orange-400" },
                            { stat: "3×", text: "India highly lags behind China and Japan in adoption of AMR, AGVs, and Robotic Arms", source: "Global Index", color: "rose", bg: "from-rose-50 to-red-50 dark:from-rose-950/40 dark:to-red-950/20", border: "border-rose-200 dark:border-rose-500/20", statColor: "text-rose-500 dark:text-rose-400" },
                        ].map((card, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
                                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                                className={`bg-gradient-to-br ${card.bg} border ${card.border} rounded-3xl p-8 text-center shadow-lg shadow-slate-200/60 dark:shadow-none hover:shadow-xl transition-all duration-300 cursor-default`}>
                                <span className={`text-6xl md:text-7xl font-black ${card.statColor} block mb-4 leading-none`}>{card.stat}</span>
                                <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed mb-5">{card.text}</p>
                                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/60 dark:bg-white/10 ${card.statColor}`}>Source: {card.source}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* China comparison */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:bg-gradient-to-r dark:from-cyan-950/30 dark:to-blue-950/30 backdrop-blur-xl shadow-xl shadow-cyan-100/60 dark:shadow-none border border-cyan-200 dark:border-cyan-500/20 rounded-3xl p-8 md:p-10 max-w-4xl mx-auto">
                        <h3 className="text-xl font-bold text-cyan-600 dark:text-cyan-400 mb-5 flex items-center gap-2">🇨🇳 The Global Benchmark</h3>
                        <ul className="space-y-4 text-slate-700 dark:text-slate-300 leading-relaxed">
                            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0 mt-1" /> China&apos;s &ldquo;Made in China 2025&rdquo; initiative produces 150,000+ robotics graduates annually who seamlessly integrate into the workforce.</li>
                            <li className="flex items-start gap-3"><CheckCircle2 className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0 mt-1" /> Colleges in China partner with robotics manufacturers to offer students live project experience and internships.</li>
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* ===== SECTION 3: THE OPPORTUNITY — Animated Timeline ===== */}
            <section className="py-28 px-4 bg-gradient-to-b from-slate-50 via-blue-50/40 to-slate-50 dark:from-[#0A0A0F] dark:via-[#0F172A] dark:to-[#0A0A0F] overflow-hidden relative">
                {/* Background decorative orbs */}
                <div className="absolute top-10 left-1/4 w-80 h-80 bg-blue-400/10 dark:bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-400/10 dark:bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

                <div className="container mx-auto max-w-5xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-20">
                        <span className="inline-block bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold tracking-widest uppercase text-xs px-4 py-2 rounded-full mb-5 border border-blue-200 dark:border-blue-500/30">The Opportunity</span>
                        <h2 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 dark:from-white dark:via-blue-300 dark:to-indigo-400 bg-clip-text text-transparent">A Transformative Vision</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-3xl mx-auto leading-relaxed">PNT Academy proposes a permanently deployed, industry-aligned Robotics &amp; Autonomous Systems Lab — designed to bridge curriculum gaps, enhance employability, and fuel innovation.</p>
                    </motion.div>

                    {/* Animated Roadmap Steps */}
                    <div className="relative">
                        {/* Vertical connecting line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-300 via-indigo-400 to-purple-400 dark:from-blue-700 dark:via-indigo-700 dark:to-purple-700 -translate-x-1/2" />

                        <div className="space-y-10">
                            {[
                                { num: "01", icon: "🏭", title: "Permanent Industrial Robotics Lab Setup", desc: "Industry-grade robotics hardware installed on-campus permanently — not rented or borrowed.", color: "blue", bg: "from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/30", border: "border-blue-200 dark:border-blue-700/50", numBg: "bg-blue-600" },
                                { num: "02", icon: "📚", title: "Curriculum-Integrated Learning Model", desc: "Mapped to university syllabi so every lab session enriches the student's coursework.", color: "indigo", bg: "from-indigo-50 to-violet-50 dark:from-indigo-950/50 dark:to-violet-950/30", border: "border-indigo-200 dark:border-indigo-700/50", numBg: "bg-indigo-600" },
                                { num: "03", icon: "👩‍🏫", title: "Faculty Enablement & Ownership", desc: "Faculty training, certification, and ongoing support so the lab thrives independently.", color: "violet", bg: "from-violet-50 to-purple-50 dark:from-violet-950/50 dark:to-purple-950/30", border: "border-violet-200 dark:border-violet-700/50", numBg: "bg-violet-600" },
                                { num: "04", icon: "🎓", title: "Student Skill Development & Industry Exposure", desc: "Real internships, placement drives, and industry connect — bridging education to employment.", color: "purple", bg: "from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/30", border: "border-purple-200 dark:border-purple-700/50", numBg: "bg-purple-600" },
                                { num: "05", icon: "💡", title: "Innovation, Research & IIC Enablement", desc: "IEEE papers, patents, robotics competitions, and IIC-backed innovation projects.", color: "pink", bg: "from-pink-50 to-rose-50 dark:from-pink-950/50 dark:to-rose-950/30", border: "border-pink-200 dark:border-pink-700/50", numBg: "bg-pink-600" },
                            ].map((step, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12, duration: 0.55, type: "spring", stiffness: 80 }}
                                    className={`flex items-center gap-6 md:gap-10 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                                >
                                    {/* Card */}
                                    <div className={`flex-1 bg-gradient-to-br ${step.bg} border ${step.border} rounded-2xl p-6 md:p-8 shadow-lg shadow-slate-200/50 dark:shadow-none hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}>
                                        <div className="flex items-center gap-4 mb-3">
                                            <span className="text-3xl">{step.icon}</span>
                                            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight">{step.title}</h3>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                    {/* Step Number Bubble — center column */}
                                    <div className={`shrink-0 w-14 h-14 ${step.numBg} rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg z-10`}>
                                        {step.num}
                                    </div>
                                    {/* Spacer to balance the other side */}
                                    <div className="flex-1 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* ===== SECTION 4: OUR SOLUTION — 3x2 Product Grid ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">Our Solution</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Industry-Aligned Lab Equipment</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">That&apos;s where we come in — with an industry-aligned Robotics & Autonomous Systems Lab within the institution.</p>
                    </motion.div>

                    <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
                        {PRODUCTS.map((p, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="min-w-[80vw] md:min-w-0 snap-center shrink-0 mr-4 md:mr-0 last:mr-0 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-8 text-center group hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 cursor-pointer">
                                <span className="text-5xl block mb-4">{p.icon}</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{p.name}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{p.specs}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 5: HOW IT WORKS ===== */}
            <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0A0A0F] dark:to-[#111827]">
                <div className="container mx-auto max-w-4xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-violet-400 font-bold tracking-widest uppercase text-sm mb-4 block">How It Works</span>
                        <h2 className="text-4xl md:text-5xl font-black mb-4">Deploy Any Package At Your Institution</h2>
                    </motion.div>

                    <div className="space-y-6">
                        {[
                            { icon: "🕐", title: "Free 30-hour hands-on training", desc: "Comprehensive hands-on training for students and faculty included with every deployment." },
                            { icon: "🏗️", title: "Industrial Exposure", desc: "Real-world applications in logistics, smart warehouses, and supply chain automation." },
                            { icon: "🎖️", title: "Defense Internships", desc: "Internship opportunities on Indian Navy & Indian Army projects with PNT Robotics." },
                            { icon: "📜", title: "Letter of Recommendation", desc: "LOR provided to selected outstanding students." },
                            { icon: "🏆", title: "Robotics Competitions", desc: "Entry into national and international robotics competitions." },
                        ].map((item, i) => (
                            <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="flex items-start gap-6 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 hover:border-violet-500/30 transition-all">
                                <span className="text-3xl shrink-0">{item.icon}</span>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 6: VALUE PROPOSITION ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-emerald-400 font-bold tracking-widest uppercase text-sm mb-4 block">Why PNT</span>
                        <h2 className="text-4xl md:text-5xl font-black">Value Proposition</h2>
                    </motion.div>

                    <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0 scrollbar-hide">
                        {[
                            { icon: "🔧", title: "Modular Design", points: ["Add or replace microcontrollers/SBCs", "Integrate additional sensors, drivers, communication modules", "Increase degrees of freedom in robotic arms", "Redesign power distribution, control logic, and feedback loops"] },
                            { icon: "🖨️", title: "3D Printed & Customizable", points: ["Parts of robotic arm, AGV, or AMR are 3D printed", "CAD files and tutorials provided", "Students can experiment with different designs", "Encourages reverse engineering & system-level thinking"] },
                            { icon: "💻", title: "Open-Source Software", points: ["Robotic Arm + AMR integration", "AGV + Robotic Hand coordination", "Custom hybrid robotic systems for research projects", "Full coding flexibility — no black-box controllers"] },
                            { icon: "🔬", title: "Research & IIC Enablement", points: ["Encourages reverse engineering", "System-level thinking", "Innovation beyond predefined experiments", "IEEE / Scopus paper guidance"] },
                        ].map((pillar, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
                                className="min-w-[85vw] md:min-w-0 snap-center shrink-0 mr-4 md:mr-0 last:mr-0 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-8 hover:border-emerald-500/30 transition-all">
                                <span className="text-4xl block mb-4">{pillar.icon}</span>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{pillar.title}</h3>
                                <ul className="space-y-2">
                                    {pillar.points.map((pt, j) => (
                                        <li key={j} className="flex items-start gap-2 text-slate-500 dark:text-slate-400 text-sm"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />{pt}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ===== SECTIONS 8-13: PRODUCT DETAIL CARDS ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl space-y-24">
                    {PRODUCTS.map((p, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                            className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} gap-8 md:gap-12 items-center`}>
                            {/* Image */}
                            <div className="w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 dark:shadow-none bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-slate-200 dark:border-slate-800 relative">
                                <img src={p.image} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                {/* Gradient placeholder in case image doesn't load */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <span className="text-7xl opacity-20">{p.icon}</span>
                                </div>
                            </div>
                            {/* Content */}
                            <div className="w-full md:w-1/2">
                                <span className="text-4xl block mb-3">{p.icon}</span>
                                <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">{p.name}</h3>
                                <span className="inline-block bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 text-xs font-bold px-4 py-1.5 rounded-full mb-4">{p.specs}</span>
                                <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{p.tagline}</p>
                                {p.extraSpecs && (
                                    <div className="bg-slate-50/80 dark:bg-slate-900/50 shadow-inner rounded-xl p-4 mb-6 border border-slate-200/60 dark:border-slate-800">
                                        {p.extraSpecs.map((s, j) => <p key={j} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2 mb-1"><span className="text-cyan-400">•</span>{s}</p>)}
                                    </div>
                                )}
                                <ul className="space-y-2">
                                    {p.features.map((f, j) => (
                                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />{f}</li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ===== SECTION 14: COLLEGE BENEFITS ===== */}
            <section className="py-24 px-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0A0A0F] dark:to-[#111827]">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black">College Benefits</h2>
                    </motion.div>

                    <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:px-0 snap-x snap-mandatory md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
                        {[
                            { icon: "🎓", title: "Academic Benefits", points: ["Supports NEP 2020 experiential & skill-based learning", "Branch-aligned curriculum integration"] },
                            { icon: "💡", title: "Innovation & Entrepreneurship", points: ["Innovation challenges & hackathons", "Prototype development", "Student startups support"] },
                            { icon: "👩‍🏫", title: "Faculty Development", points: ["FDPs (paid/sponsored)", "Train-the-trainer certification", "Access to hardware schematics, software repositories, experiment manuals", "Joint mentoring model (PNT + faculty)"] },
                            { icon: "💼", title: "Revenue & Research", points: ["Certification programs for external students", "Industry workshops & bootcamps", "Sponsored final-year projects", "Capstone & minor project themes", "IEEE / Scopus paper guidance", "Prototype-to-patent pathway", "Support for innovation grants & competitions"] },
                        ].map((b, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.5 }}
                                className="min-w-[80vw] md:min-w-0 snap-center shrink-0 mr-4 md:mr-0 last:mr-0 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all">
                                <span className="text-3xl block mb-3">{b.icon}</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">{b.title}</h3>
                                <ul className="space-y-2">
                                    {b.points.map((pt, j) => <li key={j} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2"><span className="text-blue-400">✓</span>{pt}</li>)}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 15: BRANCH ALIGNMENT ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <h2 className="text-4xl md:text-5xl font-black mb-8">Branch Alignment & Curriculum</h2>
                        <div className="flex flex-wrap justify-center gap-3 mb-10">
                            {["Mechanical", "Mechatronics", "Electrical", "E&TC", "AI-ML", "Robotics"].map((b, i) => (
                                <span key={i} className="px-5 py-2.5 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-full text-sm font-bold text-blue-300">{b}</span>
                            ))}
                        </div>
                        <div className="flex flex-wrap justify-center gap-3">
                            {["Robotics & Automation", "Control Systems", "Mechatronics", "Embedded Systems", "ROS & Autonomous Systems"].map((t, i) => (
                                <span key={i} className="px-5 py-2.5 bg-white dark:bg-white/5 shadow-md shadow-slate-200/50 dark:shadow-none border border-slate-200/80 dark:border-white/10 rounded-full text-xs font-bold tracking-wide text-slate-700 dark:text-slate-300">{t}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ===== SECTION 16: OUR CLIENTS ===== */}
            <section className="py-24 px-4 bg-slate-50 dark:bg-slate-800/40">
                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <h2 className="text-4xl md:text-5xl font-black mb-12">Our Clients</h2>
                        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:px-0 scrollbar-hide">
                            {(labPartners.filter(p => p.category === 'client').length > 0
                                ? labPartners.filter(p => p.category === 'client')
                                : [{name:'Client 1', imageUrl:''},{name:'Client 2', imageUrl:''},{name:'Client 3', imageUrl:''},{name:'Client 4', imageUrl:''}]
                            ).map((c: any, i: number) => (
                                <motion.div key={c._id || i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.4 }}
                                    className="min-w-[60vw] md:min-w-0 snap-center shrink-0 mr-4 md:mr-0 last:mr-0 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-blue-500/40 transition-all">
                                    {c.imageUrl ? (
                                        <img src={c.imageUrl} alt={c.name} className="h-16 w-auto object-contain" />
                                    ) : (
                                        <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-2xl">🏢</div>
                                    )}
                                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{c.name}</span>
                                </motion.div>
                            ))}
                        </div>
                        <p className="text-slate-500 text-sm mt-6">Trusted by leading institutions across India</p>
                    </motion.div>
                </div>
            </section>

            {/* ===== SECTION 17: COMPANIES HIRING — MARQUEE ===== */}
            <section className="py-24 px-4 overflow-hidden">
                <div className="container mx-auto max-w-6xl text-center">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <h2 className="text-4xl md:text-5xl font-black mb-12">Companies Hiring for AGV & Robotic Arm</h2>
                    </motion.div>
                    {/* Infinite marquee */}
                    <div className="relative overflow-hidden py-4">
                        <div className="flex gap-6 animate-[marquee_30s_linear_infinite]" style={{ width: 'max-content' }}>
                            {[...HIRING_COMPANIES, ...HIRING_COMPANIES].map((c, i) => (
                                <span key={i} className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm dark:shadow-none rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-300 transition-all">{c}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SECTION 18: TOP INDUSTRY ASSOCIATIONS ===== */}
            <section className="py-24 px-4 bg-slate-50 dark:bg-slate-800/40">
                <div className="container mx-auto max-w-5xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black">Our Top Industry Associations</h2>
                    </motion.div>
                    <div className="flex overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pb-0 md:px-0 scrollbar-hide">
                        {(labPartners.filter(p => p.category === 'industry').length > 0
                            ? labPartners.filter(p => p.category === 'industry')
                            : [{name:'Indian Army', imageUrl:''},{name:'TATA Power', imageUrl:''},{name:'Wockhardt', imageUrl:''},{name:'Unilever UK', imageUrl:''}]
                        ).map((a: any, i: number) => (
                            <motion.div key={a._id || i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="min-w-[65vw] md:min-w-0 snap-center shrink-0 mr-4 md:mr-0 last:mr-0 bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-2xl p-8 text-center hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all">
                                {a.imageUrl ? (
                                    <img src={a.imageUrl} alt={a.name} className="h-16 w-auto mx-auto object-contain mb-4" />
                                ) : (
                                    <div className="h-16 w-16 mx-auto rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-3xl mb-4">🏭</div>
                                )}
                                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{a.name}</h3>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 19: STUDENT TESTIMONIALS ===== */}
            <section className="py-24 px-4">
                <div className="container mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
                        <span className="text-indigo-400 font-bold tracking-widest uppercase text-sm mb-4 block">Student Voices</span>
                        <h2 className="text-4xl md:text-5xl font-black">Student Testimonials</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonialsToShow.map((test: any, i: number) => {
                            const initial = test.name?.charAt(0) || "?";
                            return (
                                <motion.div key={test._id || i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.5 }}
                                    className="bg-white dark:bg-slate-900/60 backdrop-blur-xl shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden hover:border-indigo-500/30 transition-all group flex flex-col">
                                    {/* Photo */}
                                    <div className="relative h-56 w-full overflow-hidden bg-gradient-to-br from-indigo-900/40 to-blue-900/40">
                                        {test.imageUrl ? (
                                            <img src={test.imageUrl} alt={test.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400 to-blue-600 flex items-center justify-center text-white font-black text-4xl">{initial}</div>
                                            </div>
                                        )}
                                        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white to-transparent dark:from-[#0A0A0F] dark:to-transparent p-5">
                                            <h4 className="font-bold text-slate-900 dark:text-white text-lg">{test.name}</h4>
                                            <p className="text-indigo-600 dark:text-indigo-300 text-xs font-semibold">{test.role}</p>
                                        </div>
                                    </div>
                                    {/* Quote */}
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex text-amber-400 mb-3 gap-0.5">
                                            {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <blockquote className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic flex-1">&ldquo;{test.quote}&rdquo;</blockquote>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ===== SECTION 20: CONCLUSION CTA ===== */}
            <section className="py-32 px-4 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-[#0A0A0F] dark:via-[#0F172A] dark:to-[#0A0A0F] text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08)_0%,transparent_70%)]" />
                <div className="container mx-auto max-w-3xl relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                        <h2 className="text-4xl md:text-6xl font-black mb-6">Join the Automation Revolution</h2>
                        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed mb-4">PNT Academy invites your institution to be a part of this transformative journey in automation education. Together, let us shape the future of education and innovation.</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm mb-10">Join hands with PNT Academy to revolutionize your institution&apos;s approach to learning and empower the next generation of automation leaders.</p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="/contact" className="px-10 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all">Contact Us</a>
                            <a href="#" className="px-10 py-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/20 shadow-lg shadow-slate-200/50 dark:shadow-none text-slate-900 dark:text-white font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all">Download Brochure</a>
                        </div>
                    </motion.div>
                </div>
            </section>


        </div>
    );
}

// -------------------------------------------------------------
// Shared Lab Gallery Component
// -------------------------------------------------------------
function LabGallerySection() {
    const [images, setImages] = useState<any[]>([]);

    useEffect(() => {
        getLiveGallery().then(data => {
            // Filter to show primarily "Lab Setup" photos
            const labPhotos = data.filter((item: any) => item.category === "Lab Setup" || item.category === "Projects");
            if (labPhotos.length > 0) {
                setImages(labPhotos);
            } else {
                // Fallback to recent 8 images if no specific lab setup category exists yet
                setImages(data.slice(0, 8));
            }
        }).catch(console.error);
    }, []);

    if (!images || images.length === 0) return null;

    return (
        <section className="py-24 px-4 bg-slate-50 dark:bg-black text-slate-900 dark:text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1)_0%,transparent_70%)]" />
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16">
                    <span className="text-blue-600 dark:text-cyan-400 font-bold tracking-widest uppercase text-sm mb-4 block">Deployment Gallery</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-4">Labs in Action</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">A glimpse into our state-of-the-art robotics & automation labs deployed across premier institutions.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.slice(0, 12).map((img, i) => (
                        <motion.div 
                            key={i} 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            whileInView={{ opacity: 1, scale: 1 }} 
                            viewport={{ once: true }} 
                            transition={{ delay: i * 0.05 }}
                            className="aspect-square rounded-2xl overflow-hidden relative group shadow-xl shadow-slate-200/50 dark:shadow-2xl dark:shadow-black/50 border border-slate-200 dark:border-white/10"
                        >
                            <Image src={img.imageUrl} alt={img.title || "Lab Photo"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                                <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider mb-1">{img.category}</span>
                                <h3 className="text-white font-semibold text-sm line-clamp-2">{img.title}</h3>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
