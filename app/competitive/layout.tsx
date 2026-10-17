import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Competitive Intelligence",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
