"use client";

import { useState } from "react";

interface CopyButtonProps {
  text: string;
  label?: string;
  copiedLabel?: string;
}

export function CopyButton({
  text,
  label = "Copy checklist",
  copiedLabel = "Copied",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="no-print inline-flex min-h-[48px] items-center justify-center rounded-[8px] border-2 border-ink-border bg-surface px-4 text-[16px] font-semibold text-ink transition-colors hover:bg-marigold/30"
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
