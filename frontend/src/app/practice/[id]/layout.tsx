import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practice Call",
  description:
    "Rehearse a fictional TakaPay pressure call in Bangla or English with instant coaching.",
  alternates: { canonical: "/practice/takapay-support" },
};

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
