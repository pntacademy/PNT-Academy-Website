"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero3D from "@/components/Hero3D";
import NetworkBackground from "@/components/NetworkBackground";
import ClientLogos from "@/components/ClientLogos";
import InternshipLogos from "@/components/InternshipLogos";
import Gallery from "@/components/Gallery";
import NewsletterTeaser from "@/components/NewsletterTeaser";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"students" | "schools">("students");

  return (
    <main className="min-h-screen relative text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">
      <NetworkBackground />
      <Navbar />

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 z-10 grid md:grid-cols-2 gap-8 items-center h-full">
          {/* Text Content */}
          <div className="flex flex-col gap-6" style={{ pointerEvents: 'none' }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg transition-colors duration-500">
              Position your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">School</span>
            </h1>
            <div className="flex items-center flex-wrap gap-2 md:gap-4">
              <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-black text-sm md:text-base rounded-full shadow-lg transform -rotate-2">
                #1
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-300 drop-shadow-sm dark:drop-shadow-md transition-colors duration-500">
                #PNT Academy
              </h2>
            </div>
            <div className="pl-4 border-l-4 border-purple-500">
              <p className="text-xl text-slate-800 dark:text-slate-200 max-w-lg leading-relaxed drop-shadow-none dark:drop-shadow italic transition-colors duration-500">
                "Through real-world projects and internships with the Indian Army and Navy."
              </p>
            </div>
            <p className="text-lg text-slate-800 dark:text-slate-300 max-w-lg leading-relaxed drop-shadow-none dark:drop-shadow mt-2 transition-colors duration-500">
              Empowering the next generation of innovators with hands-on training in AI, Robotics, and automation.
            </p>
            <div className="flex gap-4 mt-4 pointer-events-auto">
              <a href="#programs" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                Explore Programs
              </a>
              <a href="#about" className="px-8 py-4 bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-full font-semibold backdrop-blur-sm transition-all border border-slate-900/10 dark:border-white/10">
                Learn More
              </a>
            </div>
          </div>

          {/* 3D Canvas Area (Pointer events auto to allow OrbitControls & Clicks) */}
          <div className="h-[60vh] md:h-full relative pointer-events-auto">
            <Hero3D />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 pointer-events-none">
          <div className="w-8 h-12 rounded-full border-2 border-slate-900/20 dark:border-white/30 flex justify-center p-2 transition-colors duration-500">
            <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-32 relative border-t border-slate-900/10 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/20 backdrop-blur-sm transition-colors duration-500">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-slate-900 dark:text-white transition-colors duration-500">Who We Are</h2>
          <p className="text-xl text-slate-800 dark:text-slate-300 leading-relaxed transition-colors duration-500">
            We are dedicated to bridging the gap between traditional education and future technologies.
            By bringing advanced robotics directly into classrooms and providing hands-on training,
            we empower the next generation to build, code, and innovate the world of tomorrow.
          </p>
        </div>
      </section>

      {/* Programs Section with Animated Tabs */}
      <section id="programs" className="py-32 relative border-t border-slate-900/10 dark:border-white/5 transition-colors duration-500">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900 dark:text-white transition-colors duration-500">Our Training Tracks</h2>
            <p className="text-slate-800 dark:text-slate-400 max-w-2xl mx-auto text-lg mb-10 transition-colors duration-500">
              Select a track below to explore our tailored robotics programs for individual learners or entire school districts.
            </p>

            {/* Tab Toggles */}
            <div className="flex justify-center flex-wrap gap-4 mb-16">
              <button
                onClick={() => setActiveTab("students")}
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 text-lg ${activeTab === "students" ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"}`}
              >
                For Students
              </button>
              <button
                onClick={() => setActiveTab("schools")}
                className={`px-8 py-4 rounded-full font-semibold transition-all duration-300 text-lg ${activeTab === "schools" ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)]" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"}`}
              >
                For Schools
              </button>
            </div>
          </div>

          {/* Animated Tab Content Container */}
          <div className="max-w-4xl mx-auto min-h-[450px]">
            <AnimatePresence mode="wait">
              {activeTab === "students" ? (
                <motion.div
                  key="students"
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-blue-500/20 shadow-xl transition-colors duration-500"
                >
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-600/20 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500">
                    <span className="text-3xl">🚀</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">Student Programs (4th-12th)</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-6 text-lg transition-colors duration-500">Hands-on Robotics & AI Bootcamps</p>
                  <p className="text-slate-800 dark:text-slate-300 mb-8 leading-relaxed text-lg transition-colors duration-500">
                    Dive hands-first into the world of robotics. Build real machines, code microcontrollers, and learn the physics of flight.
                  </p>

                  {/* Cards Grid replacing list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Courses for Kids</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Tailored 4th-12th grade learning.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">💻</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Live Online Classes</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Learn from anywhere, anytime.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">⚓</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Elite Internships</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Indian Army & Navy projects.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">🤖</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">AI & Robotics</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Master the technologies of tomorrow.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-blue-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4 md:col-span-2">
                      <span className="text-2xl">👨‍👩‍👧</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Options for Students & Parents</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Flexible weekend workshops and parent-child bootcamps.</p>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold transition-all text-lg shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:-translate-y-1">
                    Enroll as a Student Now
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="schools"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="p-8 md:p-12 rounded-3xl bg-white dark:bg-slate-900 border border-purple-500/20 shadow-xl transition-colors duration-500"
                >
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-600/20 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500">
                    <span className="text-3xl">🏫</span>
                  </div>
                  <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white transition-colors duration-500">School Partnerships</h3>
                  <p className="text-purple-600 dark:text-purple-400 font-medium mb-6 text-lg transition-colors duration-500">Bring the Future to Your Classrooms</p>
                  <p className="text-slate-800 dark:text-slate-300 mb-8 leading-relaxed text-lg transition-colors duration-500">
                    Equip your school with practical robotics kits, comprehensive curriculum, and educator training to confidently teach modern technologies.
                  </p>

                  {/* Cards Grid replacing list */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">🏫</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Lab for Schools</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Robotics & Composite Skills.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">🎓</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Courses for Kids</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Online & Offline Bootcamps.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">🏆</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Championship</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">National Level Competitions.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">🛠️</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Workshop</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Hands-on practical training.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">📦</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Kit</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Proprietary educational hardware.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">🏕️</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Summer Camp & Internship</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">Army/Navy projects & fun learning.</p>
                      </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-white/10 hover:border-purple-500/50 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all flex items-start gap-4">
                      <span className="text-2xl">📚</span>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors duration-500">Curriculum</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors duration-500">NEP, CBSE, ICSE, IB aligned.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="flex-1 py-5 rounded-xl border-2 border-purple-500/30 text-purple-600 dark:text-white hover:bg-purple-50 dark:hover:bg-purple-600/20 font-semibold transition-all text-lg shadow-lg">
                      Request Partnership Guide
                    </button>
                    <button className="flex-1 py-5 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white font-bold transition-all text-lg shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:-translate-y-1">
                      Book Free Demo Bootcamp
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Projects Gallery Section (Dynamic) */}
      <Gallery />

      {/* Newsletter / Blog Teaser Section */}
      <NewsletterTeaser />

      {/* Internships Section */}
      <section id="internships" className="py-24 relative border-t border-slate-900/10 dark:border-white/5 transition-colors duration-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-white/90 transition-colors duration-500">Internships based on real-world projects</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-16 max-w-2xl mx-auto transition-colors duration-500">
            We provide hands-on internship experience working on technologies utilized by our elite clients.
          </p>
          <InternshipLogos />
        </div>
      </section>

      {/* Clients Section */}
      <section id="clients" className="py-24 relative border-t border-slate-900/10 dark:border-white/5 transition-colors duration-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-16 text-slate-800 dark:text-white/90 transition-colors duration-500">Trusted by Innovative Schools</h2>
          <ClientLogos />
          <p className="text-xl font-medium text-slate-500 dark:text-slate-400 mt-12 transition-colors duration-500">
            ...and many more schools across the country.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900/10 dark:border-white/10 bg-slate-100 dark:bg-slate-950 text-center text-slate-800 dark:text-slate-500 transition-colors duration-500">
        <p>© 2026 PNT Academy. All rights reserved.</p>
      </footer>
    </main>
  );
}
