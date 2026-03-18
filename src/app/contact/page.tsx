import { getLiveFaqs, getAdminSettings } from "@/lib/actions/db";
import ContactClient from "@/components/ContactClient";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | PNT Academy Support",
  description: "Get in touch with PNT Academy. Reach out for training enquries, school lab setups, curriculum details, or general support.",
  alternates: {
    canonical: "/contact",
  },
};

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function ContactPage() {
    const [faqs, settings] = await Promise.all([
        getLiveFaqs(),
        getAdminSettings()
    ]);

    return (
        <>
            <ContactClient faqs={faqs} settings={settings} />
            <Footer />
        </>
    );
}
