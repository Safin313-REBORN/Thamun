"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ConfirmModal } from "@/components/ConfirmModal";
import { CopyButton } from "@/components/CopyButton";
import { PracticeBanner } from "@/components/PracticeBanner";
import {
  classifyReply,
  fetchScenario,
  type ClassifyResponse,
  type Language,
  type Scenario,
} from "@/lib/api";
import { checkSensitiveInput } from "@/lib/inputGuard";

type Phase = "loading" | "ringing" | "call" | "debrief" | "error";

interface TranscriptEntry {
  id: string;
  speaker: "caller" | "user";
  text: string;
  assessment?: ClassifyResponse;
}

function formatTimer(seconds: number): string {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function PracticePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const prefersReducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("loading");
  const [language, setLanguage] = useState<Language>("bn");
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [currentStepId, setCurrentStepId] = useState<string>("");
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [replyText, setReplyText] = useState("");
  const [guardError, setGuardError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [shakeEntryId, setShakeEntryId] = useState<string | null>(null);
  const [confirmEndOpen, setConfirmEndOpen] = useState(false);

  useEffect(() => {
    let active = true;
    fetchScenario(id)
      .then((data) => {
        if (!active) return;
        setScenario(data);
        setCurrentStepId(data.root_step_id);
        setPhase("ringing");
      })
      .catch((err) => {
        if (!active) return;
        setApiError(err instanceof Error ? err.message : "Failed to load scenario.");
        setPhase("error");
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (phase !== "call") return;
    const timer = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(timer);
  }, [phase]);

  function startCall() {
    if (!scenario) return;
    const rootStep = scenario.steps[scenario.root_step_id];
    const line = language === "bn" ? rootStep.caller_line_bn : rootStep.caller_line_en;
    setTranscript([{ id: "caller-0", speaker: "caller", text: line }]);
    setElapsedSeconds(0);
    setPhase("call");
  }

  async function handleSendReply(e: React.FormEvent) {
    e.preventDefault();
    if (!scenario || !replyText.trim() || submitting) return;

    const trimmed = replyText.trim();
    const guard = checkSensitiveInput(trimmed);
    if (!guard.ok) {
      setGuardError(
        language === "bn"
          ? "নিরাপত্তার জন্য পিন, ওটিপি, ফোন বা কার্ড নম্বর লিখবেন না।"
          : "For your safety, do not type anything resembling a PIN, OTP, phone, or card number."
      );
      return;
    }

    setGuardError(null);
    setApiError(null);
    setSubmitting(true);

    const userEntryId = `user-${Date.now()}`;
    setTranscript((prev) => [...prev, { id: userEntryId, speaker: "user", text: trimmed }]);
    setReplyText("");

    try {
      const result = await classifyReply({
        scenario_id: scenario.id,
        step_id: currentStepId,
        user_reply: trimmed,
        language,
      });

      setTranscript((prev) =>
        prev.map((item) => (item.id === userEntryId ? { ...item, assessment: result } : item))
      );

      if (result.label === "risky" || result.label === "compromised") {
        setShakeEntryId(userEntryId);
      }

      const nextStep = scenario.steps[result.next_step_id];
      if (nextStep) {
        const nextLine = language === "bn" ? nextStep.caller_line_bn : nextStep.caller_line_en;
        setTranscript((prev) => [
          ...prev,
          { id: `caller-${Date.now()}`, speaker: "caller", text: nextLine },
        ]);
        setCurrentStepId(nextStep.id);
        if (nextStep.is_terminal) {
          setPhase("debrief");
        }
      }
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Could not check reply.");
    } finally {
      setSubmitting(false);
    }
  }

  function endCallNow() {
    setPhase("debrief");
  }

  if (phase === "loading") {
    return (
      <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 gap-4">
        <div
          className="h-10 w-10 rounded-full border-4 border-ink-border border-t-civic-green animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
        <p className="text-[20px] font-semibold" aria-busy="true">
          Loading practice call...
        </p>
      </main>
    );
  }

  if (phase === "error" || !scenario) {
    return (
      <main className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-serif text-[32px] font-semibold">Could not load call</h1>
        <p className="mt-2 text-muted">{apiError || "Scenario unavailable."}</p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-[8px] border-2 border-ink bg-civic-green px-6 font-semibold text-surface"
        >
          Back to Home
        </Link>
      </main>
    );
  }

  if (phase === "ringing") {
    return (
      <main className="min-h-screen bg-ink text-surface flex flex-col justify-between max-w-md mx-auto border-x-2 border-ink">
        <PracticeBanner dark />

        <div className="flex flex-col items-center px-6 py-8 text-center">
          <div className="mb-6 flex gap-2" role="group" aria-label="Language">
            {(["bn", "en"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`min-h-[48px] px-4 rounded-[8px] border-2 font-semibold ${
                  language === lang
                    ? "bg-marigold text-ink border-marigold"
                    : "bg-transparent text-paper border-paper/40"
                }`}
              >
                {lang === "bn" ? "বাংলা" : "English"}
              </button>
            ))}
          </div>

          <div className="relative flex h-[240px] w-[240px] items-center justify-center" aria-hidden="true">
            {[0, 1, 2].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border-2 border-marigold/60"
                style={{ width: 120 + ring * 55, height: 120 + ring * 55 }}
                animate={
                  prefersReducedMotion
                    ? undefined
                    : { scale: [1, 1.06, 1], opacity: [0.4, 0.85, 0.4] }
                }
                transition={{ duration: 1.6, repeat: Infinity, delay: ring * 0.25 }}
              />
            ))}
            <div className="flex h-[96px] w-[96px] items-center justify-center rounded-full bg-civic-green border-2 border-marigold font-serif text-[28px] font-semibold">
              TP
            </div>
          </div>

          <h1 className="mt-6 font-serif text-[32px] font-semibold">
            {language === "bn" ? scenario.title_bn : scenario.title_en}
          </h1>
          <p className="mt-1 text-paper/80">
            {language === "bn" ? scenario.caller_role_bn : scenario.caller_role_en}
          </p>
        </div>

        <div className="space-y-3 px-6 pb-8">
          <button
            type="button"
            onClick={startCall}
            className="w-full min-h-[56px] rounded-[8px] border-2 border-ink bg-civic-green text-[18px] font-semibold text-surface"
          >
            {language === "bn" ? "কল ধরুন (Answer)" : "Answer"}
          </button>
          <Link
            href="/"
            className="flex w-full min-h-[56px] items-center justify-center rounded-[8px] border-2 border-ink bg-vermilion text-[18px] font-semibold text-surface"
          >
            {language === "bn" ? "এখন না (Not now)" : "Not now"}
          </Link>
        </div>
      </main>
    );
  }

  if (phase === "debrief") {
    const userAssessments = transcript.filter((t) => t.speaker === "user" && t.assessment);
    const hasCompromised = userAssessments.some((t) => t.assessment?.label === "compromised");
    const headline = hasCompromised
      ? language === "bn"
        ? "সতর্কতা: কোড শেয়ার করা ঝুঁকিপূর্ণ"
        : "Watch out: you agreed to share a code"
      : language === "bn"
      ? "সময়মতো কল কেটেছেন"
      : "You hung up in time";

    return (
      <main className="min-h-screen bg-paper text-ink max-w-md mx-auto border-x-2 border-ink flex flex-col justify-between">
        <div>
          <PracticeBanner />
          <div className="px-6 py-6">
            <p className="text-[22px] font-semibold text-civic-green">থামুন</p>
            <h1 className="mt-2 font-serif text-[34px] leading-tight font-semibold">{headline}</h1>

            {userAssessments.length === 0 ? (
              <div className="mt-6 rounded-[12px] border-2 border-ink bg-surface p-4">
                <p className="font-semibold">
                  {language === "bn"
                    ? "আপনি কোনো উত্তর না দিয়েই কল শেষ করেছেন—এটাই সবচেয়ে নিরাপদ।"
                    : "You ended the call before replying—hanging up immediately is always safe."}
                </p>
              </div>
            ) : (
              <ol className="mt-6 space-y-5 border-l-2 border-ink pl-5">
                {userAssessments.map((entry) => {
                  const a = entry.assessment!;
                  const badgeColor =
                    a.label === "safe"
                      ? "bg-civic-green text-surface"
                      : a.label === "risky"
                      ? "bg-marigold text-ink"
                      : "bg-vermilion text-surface";
                  return (
                    <li key={entry.id} className="relative">
                      <span
                        className={`inline-block rounded-[6px] border-2 border-ink px-3 py-0.5 text-[15px] font-semibold uppercase ${badgeColor}`}
                      >
                        {a.label}
                      </span>
                      <p className="mt-1 text-[16px] text-muted">Tactic: {a.tactic}</p>
                      <p className="mt-1 text-[18px]">{a.reason}</p>
                    </li>
                  );
                })}
              </ol>
            )}

            <div className="mt-6 rounded-[12px] border-2 border-ink-border bg-marigold p-4 text-[#17201D]">
              <p className="font-semibold text-[18px]">
                {language === "bn"
                  ? "পরের বার: কোড বা পিন চাইলে সাথে সাথে কল কেটে দিন।"
                  : "Next time: hang up at the first request for a code or PIN."}
              </p>
            </div>
            <div className="mt-4">
              <CopyButton
                text={`THAMUN Debrief: ${headline}. Next time: hang up at the first request for a code or PIN.`}
                label={language === "bn" ? "সারাংশ কপি করুন" : "Copy debrief"}
                copiedLabel={language === "bn" ? "কপি হয়েছে" : "Copied!"}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3 px-6 pb-8">
          <button
            type="button"
            onClick={() => {
              setTranscript([]);
              setCurrentStepId(scenario.root_step_id);
              setPhase("ringing");
            }}
            className="w-full min-h-[56px] rounded-[8px] border-2 border-ink bg-civic-green text-[18px] font-semibold text-surface"
          >
            {language === "bn" ? "আবার অনুশীলন করুন" : "Practise again"}
          </button>
          <Link
            href="/"
            className="flex w-full min-h-[56px] items-center justify-center rounded-[8px] border-2 border-ink bg-paper text-[18px] font-semibold text-ink"
          >
            {language === "bn" ? "হোম" : "Home"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper text-ink max-w-md mx-auto border-x-2 border-ink flex flex-col justify-between">
      <div>
        <PracticeBanner timerText={formatTimer(elapsedSeconds)} />
        <header className="px-6 pt-4 pb-2 flex items-center justify-between">
          <h1 className="font-serif text-[28px] font-semibold">
            {language === "bn" ? scenario.title_bn : scenario.title_en}
          </h1>
          <button
            type="button"
            onClick={() => setLanguage((l) => (l === "bn" ? "en" : "bn"))}
            className="min-h-[48px] px-3 rounded-[8px] border-2 border-ink bg-surface text-[15px] font-semibold"
          >
            {language === "bn" ? "EN" : "বাংলা"}
          </button>
        </header>

        <div className="px-6 py-3 space-y-4" aria-live="polite">
          {transcript.map((entry) => {
            const isCaller = entry.speaker === "caller";
            const isShaking = shakeEntryId === entry.id && !prefersReducedMotion;
            return (
              <motion.div
                key={entry.id}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
                animate={
                  isShaking
                    ? { opacity: 1, y: 0, x: [0, -6, 6, -4, 4, 0] }
                    : { opacity: 1, y: 0 }
                }
                transition={{ duration: 0.22 }}
                className={`rounded-[12px] p-4 ${
                  isCaller
                    ? "mr-8 border-2 border-ink bg-surface text-ink"
                    : "ml-8 bg-civic-green text-surface"
                }`}
              >
                <p className={`text-[13px] font-semibold ${isCaller ? "text-muted" : "text-marigold"}`}>
                  {isCaller ? "Caller" : "You"}
                </p>
                <p className="mt-1 text-[18px]">{entry.text}</p>
                {entry.assessment && (
                  <p className="mt-2 border-t border-paper/30 pt-2 text-[14px] font-semibold text-marigold">
                    [{entry.assessment.label.toUpperCase()}] {entry.assessment.reason}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSendReply} className="px-6 pb-6 pt-3 space-y-3 border-t-2 border-ink bg-paper">
        {guardError && (
          <div role="alert" className="rounded-[8px] border-2 border-ink bg-vermilion px-3 py-2 text-[15px] font-semibold text-surface">
            {guardError}
          </div>
        )}
        {apiError && (
          <div role="alert" className="rounded-[8px] border-2 border-ink bg-marigold px-3 py-2 text-[15px] font-semibold text-ink">
            {apiError}
          </div>
        )}

        <label htmlFor="reply-input" className="sr-only">
          Your reply
        </label>
        <input
          id="reply-input"
          type="text"
          value={replyText}
          onChange={(e) => {
            setReplyText(e.target.value);
            if (guardError) setGuardError(null);
          }}
          placeholder={language === "bn" ? "আপনার উত্তর লিখুন..." : "Type your reply..."}
          maxLength={500}
          className="w-full min-h-[56px] rounded-[8px] border-2 border-ink bg-surface px-4 text-[18px] text-ink placeholder:text-muted"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !replyText.trim()}
            aria-busy={submitting}
            className="flex-1 min-h-[56px] rounded-[8px] border-2 border-ink bg-civic-green px-4 text-[18px] font-semibold text-surface disabled:opacity-50"
          >
            {submitting ? "Checking..." : language === "bn" ? "পাঠান" : "Send reply"}
          </button>
          <button
            type="button"
            onClick={() => setConfirmEndOpen(true)}
            className="min-h-[56px] min-w-[116px] rounded-[8px] border-2 border-ink-border bg-vermilion px-4 text-[18px] font-semibold text-white hover:opacity-95"
          >
            {language === "bn" ? "কল কাটুন" : "End call"}
          </button>
        </div>
      </form>
      <ConfirmModal
        open={confirmEndOpen}
        title={language === "bn" ? "কল শেষ করবেন?" : "End practice call?"}
        description={
          language === "bn"
            ? "এখন কল কাটলে আপনি সরাসরি আপনার বিশ্লেষণ দেখতে পারবেন।"
            : "Ending now will take you straight to your debrief summary."
        }
        confirmLabel={language === "bn" ? "হ্যাঁ, কল কাটুন" : "Yes, end call"}
        cancelLabel={language === "bn" ? "চালিয়ে যান" : "Keep practising"}
        onConfirm={() => {
          setConfirmEndOpen(false);
          endCallNow();
        }}
        onCancel={() => setConfirmEndOpen(false)}
      />
    </main>
  );
}
