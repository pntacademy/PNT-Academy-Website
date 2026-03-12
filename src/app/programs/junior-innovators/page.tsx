import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";

export default function JuniorInnovatorsPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-slate-50 dark:bg-slate-950">
            <Navbar />
            <PageHeader
                title="Junior Innovators Program"
                subtitle="FOR GRADES 4 TO 12"
                description="Ignite young minds with hands-on robotics, AI, and coding projects. Our curriculum focuses on practical application, logical thinking, and early exposure to future technologies."
                colorFrom="from-orange-500"
                colorTo="to-red-600"
            />

            <section className="py-20 container mx-auto px-4 max-w-6xl">
                {/* Class Types */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">💻</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Online Robotics & Coding</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Interactive 1-on-1 and group classes focusing on logic building, block coding, Python, and simulation-based robotics.</p>
                        <ul className="space-y-3 font-medium text-slate-700 dark:text-slate-300">
                            <li>✓ Scratch & Block-based logic</li>
                            <li>✓ Python for Kids</li>
                            <li>✓ Tinkercad 3D Design & Circuits</li>
                            <li>✓ AI & Machine Learning Basics</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <span className="text-3xl">🤖</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Offline Robotics Lab Access</h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">Hands-on hardware assembly, sensor integration, and physical robot programming at our state-of-the-art facilities.</p>
                        <ul className="space-y-3 font-medium text-slate-700 dark:text-slate-300">
                            <li>✓ Arduino & Breadboarding</li>
                            <li>✓ Line Follower & Obstacle Avoidance Bots</li>
                            <li>✓ Drone/RC Assembly</li>
                            <li>✓ 3D Printer Operating</li>
                        </ul>
                    </div>
                </div>

                {/* STEM Kits Display Placeholder */}
                <div className="text-center mb-20">
                    <h2 className="text-3xl font-bold mb-12">Hands-on STEM Kits</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {['Basic Electronics Kit', 'Arduino Starter Kit', 'Advanced Robotics Kit'].map((kit, i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg group cursor-pointer aspect-square flex items-center justify-center relative">
                                {/* Placeholder for actual kit image */}
                                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800/50 flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                    <span className="text-6xl mb-4 opacity-50">📦</span>
                                    <p className="text-slate-500 dark:text-slate-400 font-medium">Image Coming Soon</p>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <h4 className="text-white font-bold text-xl">{kit}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </section>
            <Footer />
        </main>
    );
}
