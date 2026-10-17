import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import PageViewTracker from "@/components/PageViewTracker";
import SiteFooter from "@/components/SiteFooter";

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
    default: "Bin Han · Extreme Networks Solutions Toolkit",
    template: "%s · Bin Han",
  },
  description: "A personal project by Dr. Bin Han: Extreme Networks product catalog, competitive comparisons and a Fabric Connect AI assistant. Not an official Extreme Networks website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
        <LanguageProvider>
          <ThemeProvider>
            <PageViewTracker />
            <Navbar />
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
            <SiteFooter />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
