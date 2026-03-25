import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchoolsTrainingContent from "@/components/SchoolsTrainingContent";
import { getAdminSettings } from "@/lib/actions/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Programs & Bootcamps for Schools | PNT Academy",
  description: "Equip your school with the most advanced, practical robotics education. Discover our STEM robotics curriculum, hands-on workshops, and free AI bootcamps.",
  keywords: ["School Robotics Training", "STEM Curriculum", "AI Bootcamps for kids", "Robotics Workshop", "Technology Education for Schools"],
  alternates: {
    canonical: "/programs/schools",
  },
};

export default async function SchoolsProgramsPage() {
    const settings = await getAdminSettings();
    const bootcampLink = settings?.bootcampLink || "/bootcamp";

    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden transition-colors duration-500 bg-transparent selection:bg-blue-600 selection:text-white">
            <Navbar />
            
            {/* The Cinematic Hero & content logic is encapsulated here */}
            <SchoolsTrainingContent bootcampLink={bootcampLink} />
            
            <Footer />
        </main>
    );
}