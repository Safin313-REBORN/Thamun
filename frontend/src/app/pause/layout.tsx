import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pause & Check",
  description:
    "On a suspicious call right now? Check three quick warning signs and call a trusted contact.",
  alternates: { canonical: "/pause" },
};

export default function PauseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
