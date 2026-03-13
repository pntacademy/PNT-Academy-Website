import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

import ClientIntroWrapper from "@/components/ClientIntroWrapper";
import ClientAIChatbot from "@/components/ClientAIChatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PNT Academy | Robotics Training for Kids & Innovators",
    template: "%s | PNT Academy"
  },
  description: "Empowering the next generation of innovators with hands-on robotics, AI, and IoT training. Specialized programs for schools, colleges, and kids.",
  keywords: ["Robotics Training", "STEM Education", "AI for Kids", "IoT Workshops", "PNT Academy", "School Robotics Lab", "Electronics for Kids"],
  authors: [{ name: "PNT Academy" }],
  creator: "PNT Academy",
  publisher: "PNT Academy",
  metadataBase: new URL("https://pnt-academy.vercel.app"), // Replace with actual domain when secured
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PNT Academy | Robotics & STEM Education",
    description: "Shape the Future of Robotics. Hands-on training programs for students and institutions.",
    url: "https://pnt-academy.vercel.app",
    siteName: "PNT Academy",
    locale: "en_IN",
    type: "website",
    // images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "PNT Academy Robotics" }], // Add this when image is ready
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 min-h-screen selection:bg-blue-600 selection:text-white transition-colors duration-500`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {/* Client-only persistent layers */}
          <ClientAIChatbot />
          <ClientIntroWrapper />
          <PageLoader />

          {/* Server-rendered page content */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
