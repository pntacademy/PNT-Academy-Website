"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, PresentationControls, Environment, useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";
import { Terminal, Lightbulb, Minimize2, Cpu, Maximize2, X, Power, BatteryCharging, Wifi } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// --- The OS Content (Used inside the 3D Macbook AND Fullscreen) ---
function InnerOS({ activeApp, setActiveApp, isMaximized, setIsMaximized, onShutDown, time }: any) {
    return (
        <div className="w-[1024px] h-[640px] bg-slate-900 rounded-lg flex flex-col scale-[0.31] origin-top bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center overflow-hidden relative shadow-[0_0_20px_rgba(255,255,255,0.2)] select-none">
            {/* Top Menu Bar */}
            <div className="h-7 bg-white/10 dark:bg-black/20 backdrop-blur-md px-4 flex items-center justify-between text-white text-[13px] border-b border-white/10 shadow-sm z-50">
                <div className="flex items-center gap-4 font-semibold tracking-wide">
                    <span className="font-bold flex items-center gap-2 cursor-pointer transition">
                        <Cpu className="w-3.5 h-3.5" /> PNT OS
                    </span>
                    <span className="cursor-pointer transition">File</span>
                    <span className="cursor-pointer transition">Edit</span>
                    <span className="cursor-pointer transition">View</span>
                    <span className="cursor-pointer transition">Help</span>
                </div>
                <div className="flex items-center gap-4">
                    <Wifi className="w-4 h-4 opacity-80" />
                    <BatteryCharging className="w-4 h-4 opacity-80" />
                    <span className="font-medium">{time}</span>
                </div>
            </div>

            {/* Desktop Area */}
            <div className="flex-1 relative p-4">
                {/* Desktop Icons */}
                <div className="flex flex-col gap-6 mt-4 w-24 z-10 relative">
                    <button onClick={() => setActiveApp("python")} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg flex items-center justify-center border border-white/20 group-hover:bg-blue-500 transition-colors">
                            <Terminal className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-white text-xs font-semibold drop-shadow-md bg-black/30 px-2 py-0.5 rounded">Python.app</span>
                    </button>
                    <button onClick={() => setActiveApp("arduino")} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg flex items-center justify-center border border-white/20 group-hover:bg-emerald-500 transition-colors">
                            <Cpu className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-white text-xs font-semibold drop-shadow-md bg-black/30 px-2 py-0.5 rounded">Arduino IDE</span>
                    </button>
                    <button onClick={() => setActiveApp("tinkercad")} className="group flex flex-col items-center gap-1 active:scale-95 transition-transform">
                        <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg flex items-center justify-center border border-white/20 group-hover:bg-amber-500 transition-colors">
                            <Lightbulb className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-white text-xs font-semibold drop-shadow-md bg-black/30 px-2 py-0.5 rounded">Tinkercad</span>
                    </button>
                </div>

                {/* Draggable Window Container (Only shown if activeApp) */}
                <AnimatePresence>
                    {activeApp && (
                        <motion.div
                            drag={!isMaximized}
                            dragMomentum={false}
                            initial={{ opacity: 0, scale: 0.9, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0, ...(isMaximized ? { top: 0, left: 0, width: "100%", height: "100%" } : { width: "80%", height: "80%", top: "10%", left: "10%" }) }}
                            exit={{ opacity: 0, scale: 0.9, y: 50 }}
                            transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                            className={`absolute bg-slate-900 rounded-xl shadow-2xl border border-white/20 overflow-hidden flex flex-col z-40 ${isMaximized ? 'rounded-none border-none' : ''}`}
                            style={isMaximized ? {} : { maxWidth: 1200, maxHeight: 800 }}
                        >
                            <div className="h-10 bg-slate-800 flex items-center px-4 justify-between shrink-0 cursor-grab active:cursor-grabbing border-b border-black/50">
                                <div className="flex gap-2 items-center w-24 pointer-events-auto">
                                    <button onClick={() => setActiveApp(null)} className="w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center group z-50 pointer-events-auto transition-transform hover:scale-110">
                                        <X className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-red-900 pointer-events-none" />
                                    </button>
                                    <button className="w-3.5 h-3.5 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center group pointer-events-none">
                                        <Minimize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-amber-900" />
                                    </button>
                                    <button onClick={() => setIsMaximized(!isMaximized)} className="w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-400 flex items-center justify-center group z-50 pointer-events-auto transition-transform hover:scale-110">
                                        <Maximize2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-green-900 pointer-events-none" />
                                    </button>
                                </div>
                                <div className="text-slate-300 text-sm font-semibold tracking-wide pointer-events-none flex-1 text-center select-none">
                                    {activeApp === "python" && "Terminal - Online Python"}
                                    {activeApp === "arduino" && "Arduino IDE Simulator"}
                                    {activeApp === "tinkercad" && "Autodesk Tinkercad"}
                                </div>
                                <div className="w-24" /> 
                            </div>
                            
                            <div className="flex-1 bg-white relative">
                                {activeApp === "python" && <iframe src="https://www.online-python.com/" className="w-full h-full border-none" title="Python IDE" />}
                                {activeApp === "arduino" && <iframe src="https://wokwi.com/arduino/new?template=blink" className="w-full h-full border-none" title="Arduino Simulator" />}
                                {activeApp === "tinkercad" && <iframe src="https://www.tinkercad.com/embed/7X8TqY7g5uG" className="w-full h-full border-none bg-slate-900" title="Tinkercad Simulator" />}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* macOS Dock */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 h-16 bg-white/10 dark:bg-black/30 backdrop-blur-2xl border border-white/20 rounded-3xl flex items-center justify-center gap-4 px-4 shadow-2xl z-50">
                <button onClick={() => setActiveApp("python")} className="group relative transition-transform hover:-translate-y-2 hover:scale-110">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg border border-white/20 flex items-center justify-center">
                        <Terminal className="w-6 h-6 text-white" />
                    </div>
                </button>
                <button onClick={() => setActiveApp("arduino")} className="group relative transition-transform hover:-translate-y-2 hover:scale-110">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg border border-white/20 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-white" />
                    </div>
                </button>
                <button onClick={() => setActiveApp("tinkercad")} className="group relative transition-transform hover:-translate-y-2 hover:scale-110">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg border border-white/20 flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                </button>
                <div className="w-px h-10 bg-white/20 mx-2" />
                <button onClick={onShutDown} className="group relative transition-transform hover:-translate-y-2 hover:scale-110">
                    <div className="w-12 h-12 bg-red-500/80 rounded-xl shadow-lg border border-red-400/50 flex items-center justify-center">
                        <Power className="w-6 h-6 text-white" />
                    </div>
                </button>
            </div>
        </div>
    );
}

// --- The Full-Screen OS (rendered via Portal on document.body) ---
function DesktopOS({ onShutDown }: { onShutDown: () => void }) {
    const [activeApp, setActiveApp] = useState<"python" | "arduino" | "tinkercad" | null>(null);
    const [isMaximized, setIsMaximized] = useState(false);
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="fixed inset-0 z-[1000] w-screen h-screen overflow-hidden font-sans select-none bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center"
        >
            {/* Top Menu Bar */}
            <div className="flex items-center justify-between px-4 py-1 bg-black/30 backdrop-blur-xl text-white text-xs z-50">
                <div className="flex items-center gap-3">
                    <span className="font-bold">PNT OS</span>
                    <span className="opacity-60">File</span>
                    <span className="opacity-60">Edit</span>
                    <span className="opacity-60">View</span>
                </div>
                <div className="flex items-center gap-3">
                    <Wifi className="w-3.5 h-3.5 opacity-70" />
                    <BatteryCharging className="w-3.5 h-3.5 opacity-70" />
                    <span className="opacity-80 font-medium">{time}</span>
                </div>
            </div>

            {/* Desktop Area */}
            <div className="flex-1 w-full h-[calc(100vh-60px)] relative">
                {/* App Windows */}
                <AnimatePresence>
                    {activeApp && (
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 30, scale: 0.9 }}
                            transition={{ type: "spring", damping: 20 }}
                            className={`absolute bg-slate-900/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl flex flex-col ${
                                isMaximized ? "inset-2" : "top-8 left-[10%] w-[80%] h-[75%]"
                            }`}
                        >
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setActiveApp(null)} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400" />
                                    <button className="w-3 h-3 rounded-full bg-yellow-500" />
                                    <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-green-500" />
                                </div>
                                <span className="text-white/70 text-xs font-medium capitalize">{activeApp} IDE</span>
                                <div />
                            </div>
                            <div className="flex-1 p-4 font-mono text-sm text-green-400 overflow-auto">
                                <p className="text-white/40">// Welcome to PNT {activeApp} IDE</p>
                                <p>{'>'} Ready to code...</p>
                                <p className="animate-pulse">█</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Dock */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl z-50">
                <button onClick={() => setActiveApp("python")} className="w-12 h-12 rounded-xl bg-gradient-to-b from-blue-400 to-blue-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Python">
                    <Terminal className="w-6 h-6 text-white" />
                </button>
                <button onClick={() => setActiveApp("arduino")} className="w-12 h-12 rounded-xl bg-gradient-to-b from-teal-400 to-teal-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Arduino">
                    <Cpu className="w-6 h-6 text-white" />
                </button>
                <button onClick={() => setActiveApp("tinkercad")} className="w-12 h-12 rounded-xl bg-gradient-to-b from-orange-400 to-orange-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Tinkercad">
                    <Lightbulb className="w-6 h-6 text-white" />
                </button>
                <div className="w-px h-8 bg-white/20 mx-1" />
                <button onClick={onShutDown} className="w-12 h-12 rounded-xl bg-gradient-to-b from-red-400 to-red-600 flex items-center justify-center hover:scale-110 transition-transform shadow-lg" title="Shutdown">
                    <Power className="w-6 h-6 text-white" />
                </button>
            </div>
        </motion.div>
    );
}

// Preload the Macbook model so it renders instantly
useGLTF.preload('/models/macbook_pro_13_inch_2020.glb');

// --- The Reliable Floating 3D Primitive ---
function ComputerModel({ onClick }: { onClick: () => void }) {
    const groupRef = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF('/models/macbook_pro_13_inch_2020.glb') as any;
    const { mixer, actions } = useAnimations(animations, groupRef);
    const animReady = useRef(false);

    useEffect(() => {
        // Start the animation and flag it for useFrame to hold at end
        if (actions && Object.keys(actions).length > 0) {
            const action = actions[Object.keys(actions)[0]];
            if (action) {
                action.reset();
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
                action.play();
                animReady.current = true;
            }
        }

        // Strip baked screen texture
        scene.traverse((child: any) => {
            if (child.isMesh && child.material) {
                const matName = child.material.name || '';
                if (matName.includes('Material.001') || child.name.includes('Object_16') || child.name.includes('screen') || child.name.includes('Screen')) {
                    child.material = new THREE.MeshBasicMaterial({ color: 0x111111 }); 
                }
            }
        });
    }, [scene, actions]);

    // Continuously force the animation to the very last frame so the lid stays OPEN
    useFrame(() => {
        if (animReady.current && mixer) {
            mixer.setTime(999);
        }

        // Centering (runs once effectively since values stabilize)
        if (groupRef.current && !groupRef.current.userData.centered) {
            groupRef.current.scale.setScalar(1);
            groupRef.current.position.set(0,0,0);
            groupRef.current.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(groupRef.current);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());
            
            const maxDim = Math.max(size.x, size.y, size.z);
            const scaleFact = 3.5 / maxDim; 
            
            groupRef.current.scale.setScalar(scaleFact);
            groupRef.current.position.x = -center.x * scaleFact;
            groupRef.current.position.y = -center.y * scaleFact; 
            groupRef.current.position.z = -center.z * scaleFact;
            groupRef.current.userData.centered = true;
        }
    });

    return (
        <group 
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            // Standard Isometric 3/4 layout
            rotation={[0, -0.4, 0]}
        >
            <group ref={groupRef}>
                <primitive object={scene} />
            </group>
        </group>
    );
}

// --- Main Export ---
export default function InteractiveTerminal() {
    const [mounted, setMounted] = useState(false);
    const [webglFailed, setWebglFailed] = useState(false);
    
    // Logic Flow for the Cinematic Transition:
    // 1. isTransitioning triggers the initial fade-to-black blackout.
    // 2. Once blackout finishes, we trigger osActive (renders DesktopOS) and clear the blackout.
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [osActive, setOsActive] = useState(false);

    useEffect(() => setMounted(true), []);

    const handleMacbookClick = () => {
        if (!osActive && !isTransitioning) {
            setIsTransitioning(true);
            // Reliable: after the blackout animation (600ms), show OS and clear blackout
            setTimeout(() => {
                setOsActive(true);
                setIsTransitioning(false);
            }, 700);
        }
    };

    const handleShutDown = () => {
        setOsActive(false);
    }

    if (!mounted) return (
        <div className="w-full h-full flex flex-col space-y-4 items-center justify-center animate-pulse bg-slate-100 dark:bg-slate-800/50 rounded-[3rem]">
            <Cpu className="w-8 h-8 text-slate-400" />
            <span className="text-slate-500 font-mono text-sm uppercase tracking-widest">Loading Hardware...</span>
        </div>
    );

    // Graceful Fallback: If WebGL crashes, show a clean clickable gradient instead of a broken icon
    const GracefulFallback = () => (
        <div 
            onClick={handleMacbookClick}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-950 border border-slate-700/50 shadow-2xl hover:shadow-indigo-500/20 hover:border-indigo-500/30 transition-all duration-500 group"
        >
            <div className="relative">
                <Cpu className="w-16 h-16 text-indigo-400 group-hover:text-indigo-300 transition-colors mb-4" />
                <div className="absolute inset-0 blur-xl bg-indigo-500/20 group-hover:bg-indigo-400/30 transition-all" />
            </div>
            <span className="text-slate-300 font-bold text-lg group-hover:text-white transition-colors">PNT OS</span>
            <span className="text-slate-500 text-sm mt-1 group-hover:text-slate-400 transition-colors">Click to Launch</span>
        </div>
    );

    return (
        <>
            {/* Portal: Render OS + Blackout directly on document.body to escape stacking contexts */}
            {createPortal(
                <>
                    {/* Phase 2: Fullscreen OS */}
                    <AnimatePresence>
                        {osActive && <DesktopOS onShutDown={handleShutDown} />}
                    </AnimatePresence>

                    {/* Phase 1: Cinematic Blackout */}
                    <AnimatePresence>
                        {isTransitioning && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6, ease: "easeInOut" }}
                                className="fixed inset-0 z-[900] bg-black pointer-events-none"
                            />
                        )}
                    </AnimatePresence>
                </>,
                document.body
            )}

            {/* Phase 0: The Base Interactive Model OR Graceful Fallback */}
            {webglFailed ? (
                <GracefulFallback />
            ) : (
                <Canvas 
                    camera={{ position: [0, 0, 5], fov: 45 }} 
                    className={osActive || isTransitioning ? "opacity-0 pointer-events-none transition-opacity duration-300" : "opacity-100 transition-opacity duration-1000"}
                    onCreated={(state) => {
                        // Catch WebGL context loss and gracefully degrade
                        const canvas = state.gl.domElement;
                        canvas.addEventListener('webglcontextlost', (e) => {
                            e.preventDefault();
                            setWebglFailed(true);
                        });
                    }}
                >
                    <Suspense fallback={null}>
                        <ambientLight intensity={1.5} />
                        <spotLight position={[10, 20, 10]} angle={0.5} penumbra={1} intensity={2.5} castShadow />

                        <PresentationControls global snap={true} rotation={[0, 0, 0]} polar={[-0.1, 0.2]} azimuth={[-0.5, 0.5]}>
                            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
                                <ComputerModel onClick={handleMacbookClick} />
                            </Float>
                        </PresentationControls>
                        
                        <Environment preset="city" />
                    </Suspense>
                </Canvas>
            )}
        </>
    );
}
