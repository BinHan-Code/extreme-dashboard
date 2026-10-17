import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import { LanguageProvider } from "@/context/LanguageContext";
import PageViewTracker from "@/components/PageViewTracker";
import SiteFooter from "@/components/SiteFooter";
import { LOCALES, isLocale, localeToLang, pageMetadata, siteUrl } from "@/lib/i18n";
import { translations } from "@/lib/translations";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const t = translations[localeToLang(lang)];
  return {
    metadataBase: new URL(siteUrl),
    ...pageMetadata(lang, "home", "/"),
    title: {
      default: t.meta_home_title,
      template: `%s | ${t.meta_site_name}`,
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
        <LanguageProvider lang={localeToLang(lang)}>
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
