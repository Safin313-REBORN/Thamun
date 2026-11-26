"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "Is TakaPay a real mobile wallet?",
    a: "No. TakaPay is a completely fictional wallet created for safe practice. We never use real bank or mobile-money brands.",
  },
  {
    q: "Do you store what I type or say?",
    a: "Never. Inputs resembling PINs, OTPs, phone numbers, or card numbers are blocked in your browser, and transcripts are never logged or saved.",
  },
  {
    q: "Can I practise in Bangla?",
    a: "Yes. Every practice call supports both Bangla and English, and works with text input on any phone.",
  },
  {
    q: "What if I am on a real suspicious call right now?",
    a: "Tap 'I am on a call now' (or the Pause button) to check the three warning signs and call a trusted family member.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="mx-auto max-w-[1280px] px-5 py-12 sm:px-10 border-t-2 border-ink-border">
      <h2 className="font-serif text-[32px] sm:text-[40px] font-semibold">
        Common questions
      </h2>
      <div className="mt-6 space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={item.q}
              className="rounded-[12px] border-2 border-ink-border bg-surface"
            >
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="flex w-full min-h-[56px] items-center justify-between px-5 py-4 text-left text-[19px] font-semibold hover:bg-marigold/15 transition-colors"
              >
                <span>{item.q}</span>
                <span className="ml-4 font-serif text-[24px] leading-none" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <div className="border-t-2 border-ink-border px-5 py-4 text-[18px] text-muted">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
