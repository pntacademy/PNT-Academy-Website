import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import PageLoader from "@/components/PageLoader";
import ClientIntroWrapper from "@/components/ClientIntroWrapper";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PNT Academy | Robotics Training",
  description: "Shape the Future of Robotics. Training programs for students 4th to 12th grade.",
  openGraph: {
    title: "PNT Academy",
    description: "Shape the Future of Robotics. Training programs for students 4th to 12th grade.",
    url: "https://pnt-academy.vercel.app",
    siteName: "PNT Academy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PNT Academy",
    description: "Shape the Future of Robotics.",
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
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ClientIntroWrapper />
          <PageLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
