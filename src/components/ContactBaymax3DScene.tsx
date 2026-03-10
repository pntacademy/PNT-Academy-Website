"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";
import { Suspense, useRef, useState, useCallback, useMemo } from "react";
import * as THREE from "three";

/**
 * Robo-PNT — Interactive robot with rigid mechanical motion.
 * 
 * Behaviors:
 * - Tracks cursor with stiff, servo-like head tilt
 * - Gentle mechanical breathing (piston-like)
 * - Click → sharp wave (whole-body rock) + speech bubble
 * - Hover → eyes light up (rim glow)
 * - Subtle idle rocking like a robot on wheels
 */
function RoboPNTModel() {
    const groupRef = useRef<THREE.Group>(null);
    const { scene } = useGLTF("/models/robo-pnt.glb");
    const [waving, setWaving] = useState(false);
    const [hovered, setHovered] = useState(false);
    const waveTime = useRef(0);

    // Apply metallic materials and get refs to parts
    const parts = useMemo(() => {
        const p: Record<string, THREE.Object3D> = {};
        scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
                if (mat) {
                    // Make it shiny metallic Blue-Black
                    if (mat.name.includes("Body") || mat.name.includes("Joint") || mat.name.includes("Dark")) {
                        mat.color = new THREE.Color("#0a0f1d"); // Deep blue-black
                        mat.metalness = 0.95;
                        mat.roughness = 0.05; // Very shiny
                        mat.envMapIntensity = 2.5;
                    } else if (mat.name.includes("Accent")) {
                        mat.color = new THREE.Color("#4facfe"); // Electric blue accents
                        mat.metalness = 0.8;
                        mat.roughness = 0.2;
                        mat.envMapIntensity = 2.0;
                    } else if (mat.name.includes("Eye")) {
                        mat.color = new THREE.Color("#ffffff");
                        mat.emissive = new THREE.Color("#4facfe");
                        mat.emissiveIntensity = 3.0;
                    }
                }
            }
            if (child.name) p[child.name] = child;
        });
        return p;
    }, [scene]);

    const handleClick = useCallback(() => {
        if (!waving) {
            setWaving(true);
            waveTime.current = 0;
        }
    }, [waving]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime();
        const g = groupRef.current;

        // 1. Mouse Tracking - ONLY HEAD TILTS
        if (parts["Head"]) {
            const head = parts["Head"];
            const targetRotY = state.pointer.x * 0.5;
            const targetRotX = -state.pointer.y * 0.3;
            // The head is modeled pointing up/forward, adjust rotation accordingly
            head.rotation.y = THREE.MathUtils.lerp(head.rotation.y, targetRotY, 0.1);
            head.rotation.x = THREE.MathUtils.lerp(head.rotation.x, targetRotX, 0.1);
        }

        // 2. Breathing - Body pulses
        const breathe = Math.sin(t * 2) * 0.02;
        g.position.y = 0 + breathe;

        // 3. Idle Arms
        if (parts["Arm_Left"] && !waving) {
            parts["Arm_Left"].rotation.x = Math.sin(t * 1.5) * 0.1;
        }
        if (parts["Arm_Right"] && !waving) {
            parts["Arm_Right"].rotation.x = Math.sin(t * 1.5 + Math.PI) * 0.1;
        }

        // 4. Wave & Spin Animation
        if (waving) {
            waveTime.current += delta;
            const wt = waveTime.current;

            // 360 Spin logic
            if (wt < 2.0) {
                // Smooth ease-in-out rotation for a full 360 (Math.PI * 2)
                const spinProgress = Math.min(wt / 1.5, 1.0); // finishes spin in 1.5s
                const ease = 1 - Math.pow(1 - spinProgress, 3); // cubic ease out
                g.rotation.y = ease * Math.PI * 2;
            } else {
                g.rotation.y = 0; // reset
            }

            // Arm waving logic
            if (parts["Arm_Right"]) {
                const arm = parts["Arm_Right"];
                if (wt < 2.0) {
                    const decay = Math.max(0, 1 - wt / 2.0);
                    // Swing arm up and wave
                    arm.rotation.x = THREE.MathUtils.lerp(arm.rotation.x, -2.5, 0.2); // Lift arm
                    arm.rotation.z = Math.sin(wt * Math.PI * 4) * 0.8 * decay; // Wave hand
                } else {
                    setWaving(false);
                    arm.rotation.x = THREE.MathUtils.lerp(arm.rotation.x, 0, 0.1);
                    arm.rotation.z = THREE.MathUtils.lerp(arm.rotation.z, 0, 0.1);
                }
            }
        } else {
            // Keep rotation stable when not waving
            g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, 0, 0.1);
        }

        const baseScale = hovered ? 1.05 : 1.0;
        g.scale.setScalar(baseScale);
    });

    return (
        <group
            ref={groupRef}
            position={[0, 0, 0]}
            onClick={handleClick}
            onPointerOver={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
            onPointerOut={() => { setHovered(false); document.body.style.cursor = "auto"; }}
        >
            <primitive object={scene} />
            {hovered && (
                <pointLight position={[0, 1.5, 2]} intensity={5} color="#4facfe" distance={5} />
            )}
        </group>
    );
}

function FloatingParticles() {
    const particlesRef = useRef<THREE.Points>(null);
    const count = 40;

    const positions = useMemo(() => {
        const arr = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            arr[i * 3] = (Math.random() - 0.5) * 10;
            arr[i * 3 + 1] = Math.random() * 5 - 2;
            arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        return arr;
    }, []);

    useFrame((state) => {
        if (!particlesRef.current) return;
        particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial size={0.03} color="#818cf8" transparent opacity={0.4} sizeAttenuation />
        </points>
    );
}

useGLTF.preload("/models/robo-pnt.glb");

export default function ContactBaymax3DScene() {
    const [clickCount, setClickCount] = useState(0);

    const messages = [
        "👋 Hey! I'm Robo-PNT!",
        "🤖 Built by PNT Academy",
        "💬 Try the chatbot below!",
        "🚀 We teach Robotics & AI!",
        "🎓 Courses for Grades 4-12",
        "🤝 Fill the form to connect!",
    ];

    return (
        <div className="h-full w-full relative">
            <Canvas
                camera={{ position: [0, 0.4, 7], fov: 45 }}
                gl={{ alpha: true, antialias: true, toneMappingExposure: 1.2 }}
                onClick={() => setClickCount(c => c + 1)}
            >
                <Suspense fallback={null}>
                    {/* Studio lighting for metallic finish */}
                    <ambientLight intensity={0.3} />
                    <directionalLight position={[4, 8, 3]} intensity={1.8} color="#e0e7ff" />
                    <directionalLight position={[-4, 3, -2]} intensity={0.5} color="#c084fc" />
                    <spotLight position={[0, 10, 5]} angle={0.2} penumbra={1} intensity={1.2} />
                    <pointLight position={[-3, -1, 3]} intensity={0.4} color="#60a5fa" />
                    <Environment preset="night" />

                    <RoboPNTModel />
                    <FloatingParticles />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 1.8}
                    />
                </Suspense>
            </Canvas>

            {clickCount > 0 && (
                <div
                    key={clickCount}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-2xl px-5 py-2.5 shadow-xl border border-violet-200/50 dark:border-violet-500/30 text-sm font-medium text-slate-700 dark:text-slate-200 z-10"
                    style={{ animation: "popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                >
                    {messages[(clickCount - 1) % messages.length]}
                </div>
            )}

            <style jsx>{`
                @keyframes popIn {
                    0% { opacity: 0; transform: translate(-50%, 6px) scale(0.95); }
                    100% { opacity: 1; transform: translate(-50%, 0) scale(1); }
                }
            `}</style>
        </div>
    );
}
