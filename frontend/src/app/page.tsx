import Link from "next/link";
import { CopyButton } from "@/components/CopyButton";
import { FaqAccordion } from "@/components/FaqAccordion";

const SAFETY_CHECKLIST_TEXT = `THAMUN — Three questions for a real call:
1. Are they rushing you?
2. Are they asking for a code or PIN?
3. Did they ask you to keep it secret?
Any yes means: hang up and call someone you trust.`;

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
        {/* Hero */}
        <section className="grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-16">
          <div>
            <h1 className="font-serif text-[44px] leading-[1.08] font-semibold sm:text-[64px] lg:text-[72px]">
              Meet the scam
              <br />
              before it meets you.
            </h1>
            <p className="mt-6 text-[24px] sm:text-[30px] font-semibold text-civic-green">
              প্রতারণার কল আসার আগেই অনুশীলন করুন।
            </p>
            <p className="mt-4 max-w-[620px] text-[18px] sm:text-[20px] text-muted">
              Practise pressure calls in Bangla or English, see what worked on you, and learn one safer move. No real money, PIN or account.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/practice/takapay-support"
                className="inline-flex min-h-[56px] min-w-[240px] items-center justify-center rounded-[8px] border-2 border-ink-border bg-civic-green px-6 text-[18px] font-semibold text-white transition-transform hover:opacity-95 active:translate-y-[1px]"
              >
                Start practising
              </Link>
              <Link
                href="/pause"
                className="inline-flex min-h-[56px] min-w-[240px] items-center justify-center rounded-[8px] border-2 border-ink-border bg-vermilion px-6 text-[18px] font-semibold text-white transition-transform hover:opacity-95 active:translate-y-[1px]"
              >
                I am on a call now
              </Link>
            </div>
          </div>

          {/* Civic-poster ringing phone illustration */}
          <div className="flex justify-center" aria-hidden="true">
            <svg
              viewBox="0 0 320 320"
              className="h-[260px] w-[260px] sm:h-[340px] sm:w-[340px]"
              fill="none"
            >
              <circle cx="160" cy="160" r="144" stroke="#0F5C4A" strokeWidth="3" strokeDasharray="8 8" />
              <circle cx="160" cy="160" r="112" stroke="#E4492F" strokeWidth="2" />
              <rect x="104" y="54" width="112" height="212" rx="16" fill="#FFFDF8" stroke="#17201D" strokeWidth="4" />
              <rect x="116" y="70" width="88" height="132" rx="6" fill="#0F5C4A" />
              <circle cx="160" cy="112" r="18" fill="#F2B134" />
              <rect x="134" y="142" width="52" height="8" rx="4" fill="#FFFDF8" />
              <rect x="144" y="158" width="32" height="6" rx="3" fill="#F4EFE6" />
              <circle cx="136" cy="222" r="5" fill="#17201D" />
              <circle cx="160" cy="222" r="5" fill="#17201D" />
              <circle cx="184" cy="222" r="5" fill="#17201D" />
              <circle cx="136" cy="242" r="5" fill="#17201D" />
              <circle cx="160" cy="242" r="5" fill="#17201D" />
              <circle cx="184" cy="242" r="5" fill="#17201D" />
            </svg>
          </div>
        </section>
      </div>

      {/* How one practice round works */}
      <section id="how-it-works" className="bg-civic-green py-14 text-white">
        <div className="mx-auto max-w-[1280px] px-5 sm:px-10">
          <h2 className="font-serif text-[32px] sm:text-[44px] font-semibold">
            How one practice round works
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              {
                num: "1",
                title: "The phone rings",
                body: "A pretend caller from TakaPay, a made-up wallet.",
              },
              {
                num: "2",
                title: "You answer your way",
                body: "Type or speak. The coach reads each reply.",
              },
              {
                num: "3",
                title: "See your reaction",
                body: "Which tactic worked, and what to do next time.",
              },
            ].map((item) => (
              <div key={item.num} className="border-t-2 border-marigold pt-5">
                <p className="font-serif text-[56px] leading-none font-semibold text-marigold">
                  {item.num}
                </p>
                <h3 className="mt-3 text-[24px] font-semibold">{item.title}</h3>
                <p className="mt-2 text-[18px] text-white/90">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Three questions */}
      <section className="mx-auto max-w-[1280px] px-5 py-14 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-serif text-[32px] sm:text-[40px] font-semibold">
            Three questions for a real call
          </h2>
          <CopyButton text={SAFETY_CHECKLIST_TEXT} label="Copy 3 questions" copiedLabel="Copied!" />
        </div>
        <div className="mt-6 grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-start">
          <ul className="space-y-2 text-[22px] sm:text-[26px] font-semibold">
            <li>Are they rushing you?</li>
            <li>Are they asking for a code or PIN?</li>
            <li>Did they ask you to keep it secret?</li>
          </ul>
          <p className="text-[20px] text-muted">
            Any yes means: hang up, then call someone you trust or the official number on your card or app.
          </p>
        </div>
      </section>

      <FaqAccordion />

      <footer className="border-t-2 border-ink-border bg-surface py-8 text-[16px] text-muted">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between sm:px-10">
          <div>
            <p className="font-semibold text-ink">© 2026 THAMUN (থামুন)</p>
            <p>Fictional wallet TakaPay. Zero transcript storage. Last updated: 26 Nov 2026.</p>
          </div>
          <nav aria-label="Footer" className="flex flex-wrap gap-5 font-semibold text-ink">
            <Link href="/#how-it-works" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              How it works
            </Link>
            <Link href="/practice/takapay-support" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              Practice
            </Link>
            <Link href="/pause" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              Pause
            </Link>
            <Link href="/privacy" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              Privacy
            </Link>
            <Link href="/terms" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              Terms & Refunds
            </Link>
            <Link href="/cookies" className="min-h-[44px] inline-flex items-center hover:underline underline-offset-4">
              Cookies
            </Link>
            <a href="mailto:hello@thamun.org" className="min-h-[44px] inline-flex items-center text-civic-green hover:underline underline-offset-4">
              hello@thamun.org
            </a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
