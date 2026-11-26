import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Cookie & Storage Policy",
  description:
    "How THAMUN uses essential browser storage without advertising or cross-site tracking cookies.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-paper text-ink mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Cookie Policy" }]} />
      <p className="text-[16px] font-semibold text-civic-green uppercase">Cookie Policy</p>
      <h1 className="mt-2 font-serif text-[36px] leading-tight font-semibold">
        Essential storage only
      </h1>

      <div className="mt-6 space-y-5">
        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">What we store in your browser</h2>
          <ul className="mt-2 list-disc pl-6 space-y-2 text-[18px] text-muted">
            <li>Theme preference (light or dark mode).</li>
            <li>Cookie banner acknowledgement so we do not ask repeatedly.</li>
            <li>Your optional trusted contact on this device for the Pause screen.</li>
          </ul>
        </section>

        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">What we never use</h2>
          <p className="mt-2 text-[18px] text-muted">
            We do not use advertising cookies, third-party retargeting pixels, or session replay trackers.
          </p>
        </section>
      </div>

      <Link
        href="/"
        className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-[8px] border-2 border-ink-border bg-civic-green px-6 font-semibold text-white"
      >
        Back to Home
      </Link>
    </main>
  );
}
