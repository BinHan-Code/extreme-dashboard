import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manager",
  robots: { index: false, follow: false },
  alternates: { canonical: null, languages: {} },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
