"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import { AGV } from "./AGV";

export default function Hero3D() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full">
            <Canvas
                shadows
                camera={{ position: [0, 2, 10], fov: 45 }}
                gl={{ alpha: true, antialias: true, toneMappingExposure: 0.9 }}
            >
                <Suspense fallback={null}>
                    {/* Lighting setup for a dark, high-contrast aesthetic */}
                    <ambientLight intensity={0.4} />
                    <directionalLight position={[10, 10, 10]} castShadow intensity={1.2} />
                    <spotLight position={[-10, 10, 10]} angle={0.2} penumbra={1} intensity={0.8} />
                    <pointLight position={[-10, -10, -10]} intensity={0.3} />

                    {/* Environment map adds realistic reflections onto the GLB (like metal parts) */}
                    <Environment preset="night" />

                    {/* Adjusted scale strictly to fit within borders while maintaining prominent size */}
                    <AGV scale={4.3} position={[0, 0, 0]} />

                    {/* Let the user rotate the camera slightly, but restrict dramatic zooms/pans */}
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
