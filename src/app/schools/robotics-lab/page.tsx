import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoboticsLabContent from "@/components/RoboticsLabContent";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "School Robotics Lab Setup | PNT Academy",
  description: "Bring the future of education to your school with PNT Academy's end-to-end Robotics Lab setups. Learn 3D printing, IoT, robotics, and humanoid tech.",
  alternates: {
    canonical: "/schools/robotics-lab",
  },
};

function LabLoader() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-black">
            <div className="relative w-24 h-24">
                <div className="absolute inset-0 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-4 border-cyan-500/20 border-b-cyan-500 rounded-full animate-spin direction-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <h3 className="mt-6 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300 animate-pulse">Initializing Lab Environment...</h3>
        </div>
    );
}

export default function RoboticsLabPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">
            <Navbar />
            <Suspense fallback={<LabLoader />}>
                <RoboticsLabContent />
            </Suspense>
            <Footer />
        </main>
    );
}
