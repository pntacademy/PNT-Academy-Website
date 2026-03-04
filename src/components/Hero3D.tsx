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
                camera={{ position: [0, 2, 8], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
            >
                <Suspense fallback={null}>
                    {/* Lighting setup for a "cyber" or clean aesthetic */}
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    {/* Environment map adds realistic reflections onto the GLB (like metal parts) */}
                    <Environment preset="city" />

                    <AGV scale={4} position={[0, -1, 1]} />

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
