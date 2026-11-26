"use client";

import { useState } from "react";
import Link from "next/link";
import { sendChatMessage, type Language } from "@/lib/api";
import { checkSensitiveInput } from "@/lib/inputGuard";

interface ChatTurn {
  id: string;
  role: "user" | "bot";
  text: string;
  link?: string | null;
  linkLabel?: string | null;
}

const QUICK_PROMPTS: Record<Language, string[]> = {
  en: ["How does THAMUN work?", "Someone is asking for my OTP", "Do you save my data?"],
  bn: ["থামুন কিভাবে কাজ করে?", "কেউ আমার পিন চাচ্ছে", "তথ্য কি সেভ হয়?"],
};

export function HelpChatbot() {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("bn");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([
    {
      id: "welcome",
      role: "bot",
      text: "নমস্কার / Hello! আমি থামুন সহায়ক। অনুশীলন, প্রতারণার কৌশল বা প্রাইভেসি নিয়ে প্রশ্ন করুন।",
    },
  ]);

  async function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const guard = checkSensitiveInput(trimmed);
    if (!guard.ok) {
      setError(
        language === "bn"
          ? "নিরাপত্তার জন্য পিন, ওটিপি, ফোন বা কার্ড নম্বর লিখবেন না।"
          : "For your safety, do not enter a PIN, OTP, phone, or card number."
      );
      return;
    }

    setError(null);
    setLoading(true);
    setTurns((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: trimmed }]);
    setInput("");

    try {
      const res = await sendChatMessage({ message: trimmed, language });
      setTurns((prev) => [
        ...prev,
        {
          id: `b-${Date.now()}`,
          role: "bot",
          text: res.reply,
          link: res.suggested_link,
          linkLabel: res.suggested_label,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Helper is unavailable right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="no-print fixed bottom-20 right-5 z-40">
      {open && (
        <section
          aria-label="THAMUN Helper Chat"
          className="mb-3 flex w-[340px] max-w-[calc(100vw-2.5rem)] flex-col rounded-[12px] border-2 border-ink-border bg-paper text-ink"
        >
          <header className="flex items-center justify-between border-b-2 border-ink-border bg-civic-green px-4 py-3 text-white rounded-t-[10px]">
            <span className="font-semibold text-[17px]">THAMUN Helper</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLanguage((l) => (l === "bn" ? "en" : "bn"))}
                className="min-h-[36px] rounded-[6px] border border-white/60 px-2 text-[14px] font-semibold"
              >
                {language === "bn" ? "EN" : "বাংলা"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close helper chat"
                className="min-h-[36px] min-w-[36px] rounded-[6px] border border-white/60 px-2 text-[14px] font-semibold"
              >
                ✕
              </button>
            </div>
          </header>

          <div className="max-h-[280px] overflow-y-auto p-3 space-y-3" aria-live="polite">
            {turns.map((turn) => (
              <div
                key={turn.id}
                className={`rounded-[8px] p-3 text-[16px] ${
                  turn.role === "bot"
                    ? "border-2 border-ink-border bg-surface text-ink"
                    : "ml-6 bg-civic-green text-white"
                }`}
              >
                <p>{turn.text}</p>
                {turn.link && turn.linkLabel && (
                  <Link
                    href={turn.link}
                    onClick={() => setOpen(false)}
                    className="mt-2 inline-block font-semibold text-civic-green underline underline-offset-4"
                  >
                    {turn.linkLabel} →
                  </Link>
                )}
              </div>
            ))}
            {loading && (
              <p className="text-[15px] font-semibold text-muted" aria-busy="true">
                Thinking...
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 border-t-2 border-ink-border px-3 py-2 bg-surface">
            {QUICK_PROMPTS[language].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => ask(q)}
                className="rounded-[6px] border border-ink-border bg-paper px-2.5 py-1 text-[13px] font-semibold hover:bg-marigold/30"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
            className="border-t-2 border-ink-border p-3 space-y-2"
          >
            {error && (
              <p role="alert" className="rounded-[6px] bg-vermilion px-2.5 py-1.5 text-[14px] font-semibold text-white">
                {error}
              </p>
            )}
            <div className="flex gap-2">
              <label htmlFor="helper-chat-input" className="sr-only">
                Ask THAMUN Helper
              </label>
              <input
                id="helper-chat-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={language === "bn" ? "প্রশ্ন লিখুন..." : "Ask a question..."}
                maxLength={400}
                className="flex-1 min-h-[44px] rounded-[8px] border-2 border-ink-border bg-surface px-3 text-[16px]"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="min-h-[44px] rounded-[8px] border-2 border-ink-border bg-civic-green px-3 text-[15px] font-semibold text-white disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="min-h-[48px] rounded-[8px] border-2 border-ink-border bg-civic-green px-4 text-[16px] font-semibold text-white hover:opacity-95"
      >
        {open ? "Close Helper" : "Ask Helper"}
      </button>
    </div>
  );
}
