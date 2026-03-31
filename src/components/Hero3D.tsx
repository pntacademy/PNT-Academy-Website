"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense, useState, useEffect } from "react";
import { AGV } from "./AGV";
import Script from "next/script";

export default function Hero3D() {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useEffect(() => {
        const check = () => setIsMobile(window.matchMedia("(max-width: 1024px)").matches);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Don't render anything until we know the screen size (prevents flash)
    if (isMobile === null) return null;

    // Skip the heavy 3D canvas entirely on mobile/tablet — huge perf win
    if (isMobile) return null;

    return (
        <div className="absolute inset-0 z-0 h-full w-full mobile-safe-canvas">
            {/* Load Google's Model Viewer for seamless AR cross-platform without downloads */}
            <Script type="module" src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js" strategy="lazyOnload" />

            <Canvas
                shadows
                camera={{ position: [0, 2, 10], fov: 45 }}
                gl={{ alpha: true, antialias: true, toneMappingExposure: 0.9 }}
                frameloop="always"
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 10, 10]} castShadow intensity={1.2} />
                    <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={0.8} />
                    <pointLight position={[-10, -10, -10]} intensity={0.3} />
                    <Environment preset="night" />

                    <AGV scale={6} position={[0, 0, 0]} />

                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        minPolarAngle={Math.PI / 3}
                        maxPolarAngle={Math.PI / 1.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
}
