import Navbar from "@/components/Navbar";
import Link from "next/link";
import TypedText from "@/components/TypedText";
import HeroSection from "@/components/HeroSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PNT Academy | Premier Robotics & AI Training",
  description: "Join PNT Academy to master Robotics, AI, IoT, and STEM. We provide hands-on training for schools, colleges, and kids to build a future in automation.",
  alternates: {
    canonical: "/",
  },
};

import ClientLogos from "@/components/ClientLogos";
import InternshipLogos from "@/components/InternshipLogos";
import Gallery from "@/components/Gallery";
import ProgramsCircularUI from "@/components/ProgramsCircularUI";
import TestimonialsSlider from "@/components/TestimonialsSlider";
import BootcampCTA from "@/components/BootcampCTA";
import Footer from "@/components/Footer";
import AboutSlider from "@/components/AboutSlider";
import MobileARButton from "@/components/MobileARButton";
import { incrementLiveVisits, getAdminSettings } from "@/lib/actions/db";



// ISR: serve from cache instantly, silently refresh in background every 60s
export const revalidate = 60;

export default async function Home() {
  // No longer fetching heavyweight Base64 Base DB entries here!
  // This prevents the Vercel ISR payload from hitting the 19MB Limit.
  // The client components now fetch their own data directly.

  // Fire-and-forget — never block page render for a counter update
  incrementLiveVisits().catch(() => { });

  const settings = await getAdminSettings();
  const bootcampLink = settings?.bootcampLink || "https://forms.gle/";
  const roboticsChampionshipLink = settings?.roboticsChampionshipLink || "https://forms.gle/";

  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;

  return (
    <main className="relative min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500">
      <div className="relative">
        <Navbar />

        {/* Hero Section */}
        <section id="hero" className="relative h-screen flex items-center pt-20">
        <div className="container mx-auto px-4 sm:px-6 z-10 grid lg:grid-cols-2 gap-6 items-center h-full">
            {/* Text Content */}
            <div className="flex flex-col gap-4 lg:gap-6" style={{ pointerEvents: 'none' }}>
              
              {/* Robotics Championship Promotional Ribbon */}
              <div className="pointer-events-auto w-full max-w-full">
                <Link
                  href="/championship/individual"
                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm md:text-base text-white border border-blue-400/40 shadow-[0_0_20px_rgba(37,99,235,0.35)] hover:shadow-[0_0_35px_rgba(99,102,241,0.55)] transition-all duration-300 hover:scale-105 relative overflow-hidden group max-w-full"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #4f46e5 60%, #7c3aed 100%)' }}
                >
                  {/* Shimmer sweep */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  {/* Pulsing dot */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300" />
                  </span>
                  <span className="text-base leading-none">🏆</span>
                  <span className="font-black tracking-wide truncate">Robotics Championship {currentYear}-{nextYear} — Register!</span>
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/20 border border-white/30 text-xs group-hover:translate-x-1 transition-transform shrink-0">
                    →
                  </span>
                </Link>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg transition-colors duration-500">
                Position your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">School</span>
              </h1>
              <div className="flex items-center flex-wrap gap-2 md:gap-4">
                <span className="px-3 py-1 bg-gradient-to-r from-orange-400 to-red-500 text-white font-black text-sm md:text-base rounded-full shadow-lg transform -rotate-2">
                  #1 With PNT Academy
                </span>

              </div>
              <div className="pl-3 border-l-4 border-purple-500">
                <p className="text-base sm:text-lg text-slate-800 dark:text-slate-200 max-w-lg leading-relaxed drop-shadow-none dark:drop-shadow italic transition-colors duration-500">
                  "Through real-world projects and internships with the Indian Army and Navy."
                </p>
              </div>
              <p className="text-sm sm:text-base lg:text-lg text-slate-800 dark:text-slate-300 max-w-lg leading-relaxed drop-shadow-none dark:drop-shadow mt-1 transition-colors duration-500">
                Empowering the next generation of innovators with hands-on training in AI, Robotics, and automation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 pointer-events-auto">
                <a href="#programs" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] text-center">
                  Explore Programs
                </a>
                <a href="#about" className="px-8 py-4 bg-slate-200/50 dark:bg-white/10 hover:bg-slate-300/50 dark:hover:bg-white/20 text-slate-900 dark:text-white rounded-full font-semibold backdrop-blur-sm transition-all border border-slate-900/10 dark:border-white/10 text-center">
                  Learn More
                </a>
              </div>
            </div>

            {/* 3D Canvas Area — DESKTOP ONLY. Hidden on mobile and tablets to optimize DOM since AGV is disabled there. */}
            <div className="hidden lg:block lg:relative lg:inset-auto h-full w-full pointer-events-none lg:pointer-events-auto lg:col-start-2 z-0">
              <HeroSection />
            </div>

            {/* Mobile & Tablet stat badges — shown instead of the 3D canvas */}
            <div className="flex flex-col gap-3 lg:hidden mt-1 pointer-events-auto">
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "10,000+", sub: "Students" },
                  { label: "Since 2016", sub: "Founded" },
                  { label: "Shark Tank", sub: "Funded" },
                  { label: "PM Award", sub: "Received" },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl p-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur border border-white/40 dark:border-slate-700/50 shadow-sm text-center">
                    <div className="font-black text-blue-600 dark:text-blue-400 text-sm">{s.label}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.sub}</div>
                  </div>
                ))}
              </div>
              <MobileARButton />
            </div>
          </div>

          {/* Scroll Indicator — desktop only so it doesn't overlap the AR button on mobile */}
          <div className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-10 pointer-events-none">
            <div className="w-8 h-12 rounded-full border-2 border-slate-900/20 dark:border-white/30 flex justify-center p-2 transition-colors duration-500">
              <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24 md:py-32 relative border-t border-slate-900/10 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/20 backdrop-blur-sm transition-colors duration-500">
          <div className="container mx-auto px-4 max-w-7xl">

            {/* Section heading */}
            <div className="text-center mb-14">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-3">Who We Are</p>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight transition-colors duration-500">
                Building <TypedText />
              </h2>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-6" />
            </div>

            {/* Content grid — text narrow, slider wide */}
            <div className="grid md:grid-cols-[2fr_3fr] gap-10 xl:gap-16 items-center">

              {/* Text */}
              <div className="space-y-5 text-base md:text-lg leading-relaxed text-slate-600 dark:text-slate-300">
                <p>
                  Founded in 2016, PNT Academy has earned national recognition for its impactful work in robotics education and hands-on training. While our primary focus is on student-centric, project-based learning, our sister company, <strong className="text-slate-900 dark:text-white">PNT Robotics</strong>, has been appreciated by Hon&apos;ble Prime Minister Shri Narendra Modi and featured on Shark Tank India, where it secured investment from Peyush Bansal.
                </p>
                <p>
                  We specialize in delivering engaging, practical learning experiences, and have partnered with prestigious institutions such as the <strong className="text-slate-900 dark:text-white">Indian Navy, DRDO, and TATA Power</strong>. These collaborations enable us to offer students real-world exposure through internships, workshops, and industrial training programs.
                </p>
                <p>
                  At PNT Academy, our mission is to bridge the gap between classroom learning and real-world industry demands—empowering students with the future-ready skills needed to <strong className="text-slate-900 dark:text-white">innovate, build, and lead</strong> in tomorrow&apos;s world.
                </p>

              {/* Achievement Cards */}
              <div className="grid grid-cols-2 gap-3 pt-4">
                {[
                  { icon: "🏫", stat: "2016", label: "Est. Year", accent: "from-blue-500 to-cyan-400" },
                  { icon: "🦈", stat: "Funded", label: "Shark Tank India", accent: "from-indigo-500 to-blue-400" },
                  { icon: "🏛️", stat: "PM Modi", label: "Appreciation Award", accent: "from-orange-500 to-amber-400" },
                  { icon: "🎓", stat: "10,000+", label: "Students Trained", accent: "from-purple-500 to-pink-400" },
                ].map((card) => (
                  <div key={card.label} className="group relative rounded-2xl p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur border border-white dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                    {/* Gradient accent bar */}
                    <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${card.accent}`} />
                    <div className="text-2xl mb-1">{card.icon}</div>
                    <div className={`text-base font-black bg-gradient-to-r ${card.accent} bg-clip-text text-transparent`}>{card.stat}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-tight mt-0.5">{card.label}</div>
                  </div>
                ))}
              </div>
              </div>

              {/* Big slider */}
              <div className="w-full">
                <AboutSlider />
              </div>

            </div>
          </div>
        </section>


        {/* Programs Section with Animated Circular UI */}
        <section id="programs" className="py-32 relative border-t border-slate-900/10 dark:border-white/5 transition-colors duration-500 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white transition-colors duration-500 tracking-tight">What we offer</h2>
              <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-6" />
            </div>

            {/* Animated Circular Node Interface */}
            <ProgramsCircularUI />
          </div>
        </section>

        {/* Projects Gallery Section (Dynamic) */}
        <Gallery />

        {/* Testimonials Slider */}
        <TestimonialsSlider />

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
        <section id="clients" className="py-24 relative border-t border-slate-900/10 dark:border-white/5 transition-colors duration-500 bg-white/60 dark:bg-slate-950/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-16 text-slate-800 dark:text-white/90 transition-colors duration-500">Trusted by Innovative Schools</h2>
            <ClientLogos />
            <p className="text-xl font-medium text-slate-500 dark:text-slate-400 mt-12 transition-colors duration-500">
              ...and many more schools across the country.
            </p>
          </div>
        </section>

        {/* Call to Action */}
        <BootcampCTA bootcampLink={bootcampLink} />

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
