"use client";

interface PracticeBannerProps {
  timerText?: string;
  dark?: boolean;
}

export function PracticeBanner({ timerText, dark = false }: PracticeBannerProps) {
  return (
    <div
      role="status"
      aria-label="Practice mode"
      className={`flex items-center justify-between border-b-2 border-ink px-4 py-2 text-[16px] font-semibold tracking-wide ${
        dark ? "bg-ink text-marigold border-paper/30" : "bg-surface text-vermilion"
      }`}
    >
      <span>PRACTICE{timerText ? `  •  ${timerText}` : ""}</span>
      <span className={dark ? "text-paper/80 text-sm" : "text-muted text-sm"}>
        TakaPay (fictional)
      </span>
    </div>
  );
}
