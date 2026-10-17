import type { Metadata } from "next";
import { pageMetadata } from "@/lib/i18n";

export async function generateMetadata({ params }: LayoutProps<"/[lang]/competitive">): Promise<Metadata> {
  const { lang } = await params;
  return pageMetadata(lang, "competitive", "/competitive");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
