import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fabric Connect Guide",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
