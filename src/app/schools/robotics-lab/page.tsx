"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function RoboticsLabPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Industrial Robotics Lab Setup"
                subtitle="FOR SCHOOLS & COLLEGES"
                description="Bridge the gap between academic learning and industry requirements with our permanently deployed, NEP 2020 aligned Robotics & Autonomous Systems Lab."
                colorFrom="from-blue-500"
                colorTo="to-indigo-600"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">Our Complete Setup Includes</h2>
                    <ul className="space-y-4 text-lg text-slate-600 dark:text-slate-400">
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 font-bold">✓</span>
                            <span><strong>Educational Robotic Arm:</strong> 4 DOF, customizable, pick and place automation, gesture control, object detection via OpenCV.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 font-bold">✓</span>
                            <span><strong>Industrial AGV:</strong> Line following, obstacle avoidance, RFID navigation, IoT-based control.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 font-bold">✓</span>
                            <span><strong>Robotic Hand:</strong> Multi-finger coordination, gesture-based control, and haptic feedback.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 font-bold">✓</span>
                            <span><strong>Industrial Drone & AMR:</strong> Aerial surveillance, obstacle avoidance, and ROS-based autonomous navigation.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-blue-500 font-bold">✓</span>
                            <span><strong>Faculty Enablement:</strong> Train-the-trainer certification and full access to hardware schematics and software repositories.</span>
                        </li>
                    </ul>
                </div>
            </section>
            <Footer />
        </main>
    );
}
