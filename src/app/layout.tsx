import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

import ClientIntroWrapper from "@/components/ClientIntroWrapper";
import ClientAIChatbot from "@/components/ClientAIChatbot";
import ClientOnly from "@/components/ClientOnly";
import NetworkBackground from "@/components/NetworkBackground";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MobileBottomNav from "@/components/MobileBottomNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  applicationName: "PNT Academy",
  title: {
    default: "PNT Academy | Robotics Training for Kids & Innovators",
    template: "%s | PNT Academy"
  },
  description: "Empowering the next generation of innovators with hands-on robotics, AI, and IoT training. Specialized programs for schools, colleges, and kids.",
  keywords: ["Robotics Training", "STEM Education", "AI for Kids", "IoT Workshops", "PNT Academy", "School Robotics Lab", "Electronics for Kids"],
  authors: [{ name: "PNT Academy" }],
  creator: "PNT Academy",
  publisher: "PNT Academy",
  metadataBase: new URL("https://pntacademy.com"),
  alternates: { canonical: "/" },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PNT Academy",
  },
  openGraph: {
    title: "PNT Academy | Robotics & STEM Education",
    description: "Shape the Future of Robotics. Hands-on training programs for students and institutions.",
    url: "https://pntacademy.com",
    siteName: "PNT Academy",
    locale: "en_IN",
    type: "website",
    images: [{ url: "https://pntacademy.com/opengraph-image", width: 1200, height: 630, alt: "PNT Academy Robotics" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PNT Academy | Robotics & STEM",
    description: "Shape the Future of Robotics with PNT Academy's hands-on programs.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "PNT Academy",
  "url": "https://pntacademy.com",
  "logo": "https://pntacademy.com/apple-icon.png",
  "description": "Empowering the next generation of innovators with hands-on robotics, AI, and IoT training.",
  "sameAs": [
    "https://instagram.com/pntacademy",
    "https://linkedin.com/company/pntacademy",
    "https://youtube.com/@pntacademy"
  ],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Plot no. A115, Infinity Business Park, MIDC",
    "addressLocality": "Dombivli East",
    "addressRegion": "Maharashtra",
    "postalCode": "421203",
    "addressCountry": "IN"
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 min-h-screen selection:bg-blue-600 selection:text-white transition-colors duration-500`}
      >
        {/* Google Analytics — loaded after page is interactive, zero render-blocking */}
        <GoogleAnalytics />

        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Global animated background */}
          <ClientOnly>
            <div className="fixed inset-0 z-0 pointer-events-none">
              <NetworkBackground />
            </div>
          </ClientOnly>

          <ClientAIChatbot />
          <ClientIntroWrapper />
          <PageLoader />

          <div className="relative z-10 pb-32 md:pb-0">
            {children}
          </div>

          {/* Mobile Tab Bar */}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  );
}
