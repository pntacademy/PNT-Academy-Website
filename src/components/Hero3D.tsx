"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { AGV } from "./AGV";

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

                    {/* Smaller AGV on mobile so it fits without overflow */}
                    <AGV
                        scale={isMobile ? 4.5 : 6}
                        position={isMobile ? [0, -0.5, 0] : [0, 0, 0]}
                    />

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
        </div>
    );
}
