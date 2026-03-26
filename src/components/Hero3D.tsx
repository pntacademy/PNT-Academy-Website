"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { AGV } from "./AGV";
import { Box } from "lucide-react";

export default function Hero3D() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return (
        <div className="absolute inset-0 z-0 h-full w-full mobile-safe-canvas">
            <Canvas
                shadows
                camera={{
                    position: isMobile ? [0, 3, 12] : [0, 2, 10],
                    fov: isMobile ? 40 : 45,
                }}
                gl={{ alpha: true, antialias: !isMobile, toneMappingExposure: 0.9 }}
                frameloop={isMobile ? "demand" : "always"}
                dpr={isMobile ? [1, 1.5] : [1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 10, 10]} castShadow intensity={1.2} />
                    <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={0.8} />
                    <pointLight position={[-10, -10, -10]} intensity={0.3} />
                    <Environment preset="night" />

                    {/* Hide AGV on mobile to improve performance and prevent rendering bugs, rely on the AR button instead */}
                    {!isMobile && (
                        <AGV
                            scale={6}
                            position={[0, 0, 0]}
                        />
                    )}

                    {!isMobile && (
                        <OrbitControls
                            enableZoom={false}
                            enablePan={false}
                            minPolarAngle={Math.PI / 3}
                            maxPolarAngle={Math.PI / 1.5}
                        />
                    )}
                </Suspense>
            </Canvas>

            {/* AR Overlay Button */}
            <div className="absolute bottom-6 right-6 z-10 flex flex-col items-end gap-2">
                <a
                    rel="ar"
                    href="/model.glb"
                    onClick={(e) => {
                        if (typeof window !== "undefined" && /android/i.test(navigator.userAgent)) {
                            e.preventDefault();
                            const modelUrl = new URL("/model.glb", window.location.origin).toString();
                            window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${modelUrl}&mode=ar_only#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=https://developers.google.com/ar;end;`;
                        }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/90 hover:bg-indigo-500 backdrop-blur-md text-white rounded-full text-sm font-semibold shadow-xl border border-white/10 transition-all hover:scale-105 active:scale-95 group pointer-events-auto"
                >
                    <Box className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>View in AR</span>
                </a>
            </div>
        </div>
    );
}
