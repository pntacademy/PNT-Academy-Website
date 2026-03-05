"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function CompositeSkillLabPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Composite Skill Lab"
                subtitle="INNOVATION SPACES"
                description="Comprehensive multi-disciplinary innovation centers combining 3D Printing, IoT, AR/VR, and core mechanical automation."
                colorFrom="from-purple-500"
                colorTo="to-pink-600"
            />

            <section className="py-20 container mx-auto px-4 max-w-5xl">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                    <h2 className="text-3xl font-bold mb-6">Empowering Future Innovators</h2>
                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                        The Composite Skill Lab is designed to provide schools a unified playground for modern technologies. Beyond just robotics, students gain hands-on experience in 3D prototyping, Smart Farming (IoT), Artificial Intelligence, and Cybersecurity basics.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">3D Printing</h3>
                            <p className="text-slate-600 dark:text-slate-400">Turn computer designs into real 3D objects by building them layer by layer.</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                            <h3 className="text-xl font-bold mb-3 text-purple-600 dark:text-purple-400">Smart IoT</h3>
                            <p className="text-slate-600 dark:text-slate-400">Connect everyday objects using electronics and software to collect and share data smartly.</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
}
