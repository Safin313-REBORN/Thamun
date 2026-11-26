import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-paper text-ink flex flex-col items-center justify-center p-6 text-center">
      <p className="text-[16px] font-semibold text-vermilion uppercase">404</p>
      <h1 className="mt-2 font-serif text-[40px] font-semibold">Page not found</h1>
      <p className="mt-2 max-w-md text-muted">
        This page does not exist. Return home to practise a call or use Pause.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-[8px] border-2 border-ink bg-civic-green px-6 font-semibold text-surface"
      >
        Back to Home
      </Link>
    </main>
  );
}
