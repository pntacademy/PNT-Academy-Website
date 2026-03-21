import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CoursesForKidsHero from "@/components/CoursesForKidsHero";
import CoursesForKidsContent from "@/components/CoursesForKidsContent";

export default function CoursesForKidsPage() {
    return (
        <main className="min-h-screen text-slate-900 dark:text-slate-50 overflow-x-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
            <Navbar />

            <CoursesForKidsHero />

            <div id="programs">
                <CoursesForKidsContent />
            </div>

            <Footer />
        </main>
    );
}
