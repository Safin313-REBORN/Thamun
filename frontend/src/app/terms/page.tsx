import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service & Refund Policy",
  description:
    "Terms of Service, free access commitment (no fees or charges), and educational limits for THAMUN.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-paper text-ink mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms & Refunds" }]} />
      <p className="text-[16px] font-semibold text-civic-green uppercase">Terms of Service</p>
      <h1 className="mt-2 font-serif text-[36px] leading-tight font-semibold">
        Plain-language terms & limits
      </h1>

      <div className="mt-6 space-y-5">
        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">Educational purpose</h2>
          <p className="mt-2 text-[18px] text-muted">
            THAMUN uses the fictional wallet TakaPay to help you rehearse scam-call tactics. It is an educational tool and does not replace official banking, legal, or police support.
          </p>
        </section>

        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">Pricing & refund policy</h2>
          <p className="mt-2 text-[18px] text-muted">
            THAMUN is 100% free to use with no subscriptions, paid tiers, or hidden fees. Because no payments are collected, no refunds apply.
          </p>
        </section>

        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">Project details</h2>
          <p className="mt-2 text-[18px] text-muted">
            Operated by the THAMUN Civic Safety Project (STEM2Connect AI Hackathon 2026). Contact:{" "}
            <a href="mailto:hello@thamun.org" className="font-semibold text-civic-green underline underline-offset-4">
              hello@thamun.org
            </a>
            .
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
