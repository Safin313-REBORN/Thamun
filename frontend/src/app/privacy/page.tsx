import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { DataDeleteControl } from "@/components/DataDeleteControl";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How THAMUN protects your privacy: zero transcript storage, minimal data collection, age notice, and instant data deletion.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink mx-auto max-w-2xl px-5 py-10 sm:px-8">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <p className="text-[16px] font-semibold text-civic-green uppercase">Privacy Policy</p>
      <h1 className="mt-2 font-serif text-[36px] leading-tight font-semibold">
        Your safety and privacy come first
      </h1>

      <div className="mt-6 space-y-5">
        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">Only necessary data & zero transcripts</h2>
          <p className="mt-2 text-[18px] text-muted">
            THAMUN never logs or stores what you type or say during practice calls. Inputs resembling a PIN, OTP, phone number, or card number are blocked in your browser before submission.
          </p>
        </section>

        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">Third-party SDKs & fonts</h2>
          <p className="mt-2 text-[18px] text-muted">
            We use zero third-party ad networks or behavioral tracking SDKs. Typography uses Fraunces and Hind Siliguri under the SIL Open Font License, and all illustrations are original SVGs.
          </p>
        </section>

        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">Age notice</h2>
          <p className="mt-2 text-[18px] text-muted">
            THAMUN is built for adults and families practising scam awareness. We do not knowingly collect personal data from children under 13 without parent or guardian consent.
          </p>
        </section>

        <section className="rounded-[12px] border-2 border-ink-border bg-surface p-5">
          <h2 className="font-serif text-[24px] font-semibold">Data deletion & emails</h2>
          <p className="mt-2 text-[18px] text-muted">
            You can clear all data stored on this device immediately below, or email{" "}
            <a href="mailto:hello@thamun.org" className="font-semibold text-civic-green underline underline-offset-4">
              hello@thamun.org
            </a>{" "}
            for any deletion request. Optional emails include a one-click unsubscribe link.
          </p>
          <DataDeleteControl />
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
