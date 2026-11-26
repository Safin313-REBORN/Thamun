"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-6 text-center">
      <p className="text-[16px] font-semibold text-vermilion uppercase">Error</p>
      <h1 className="mt-2 font-serif text-[36px] font-semibold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted">
        Please try again or return to the home page.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="min-h-[48px] rounded-[8px] border-2 border-ink bg-civic-green px-6 font-semibold text-surface"
        >
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center justify-center rounded-[8px] border-2 border-ink bg-surface px-6 font-semibold text-ink"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
