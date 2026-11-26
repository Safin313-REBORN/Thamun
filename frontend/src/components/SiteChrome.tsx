"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpChatbot } from "@/components/HelpChatbot";
import { captureUtmParams } from "@/lib/utm";

const SEARCH_INDEX = [
  { title: "Start practice: TakaPay Support", href: "/practice/takapay-support", keywords: "takapay support otp pin scam call practice" },
  { title: "Pause: I am on a call now", href: "/pause", keywords: "pause help emergency trusted contact rushing code secret" },
  { title: "How one practice round works", href: "/#how-it-works", keywords: "how it works steps ring answer reaction" },
  { title: "Common questions (FAQ)", href: "/#faq", keywords: "faq privacy bangla takapay transcripts" },
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPracticeRoute = pathname?.startsWith("/practice/");

  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [cookieDismissed, setCookieDismissed] = useState(true);

  useEffect(() => {
    captureUtmParams();

    try {
      const savedTheme = localStorage.getItem("thamun_theme");
      const isDark = savedTheme === "dark";
      setDark(isDark);
      document.documentElement.classList.toggle("dark", isDark);

      const consent = localStorage.getItem("thamun_cookie_ok");
      setCookieDismissed(consent === "1");
    } catch {
      // Ignore storage errors
    }
  }, []);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? Math.min(100, Math.round((window.scrollY / total) * 100)) : 0;
      setScrollProgress(pct);
      setShowTop(window.scrollY > 360);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("thamun_theme", next ? "dark" : "light");
    } catch {
      // Ignore
    }
  }

  function dismissCookie() {
    setCookieDismissed(true);
    try {
      localStorage.setItem("thamun_cookie_ok", "1");
    } catch {
      // Ignore
    }
  }

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return SEARCH_INDEX.filter(
      (item) =>
        item.title.toLowerCase().includes(q) || item.keywords.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="no-print fixed top-0 left-0 z-50 h-[3px] bg-marigold transition-[width] duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Sticky header (hidden on immersive practice route to keep focus) */}
      {!isPracticeRoute && (
        <header className="no-print sticky top-0 z-40 border-b-2 border-ink-border bg-paper/95 backdrop-blur-sm">
          <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-5 py-3 sm:px-10">
            <Link href="/" className="text-[22px] sm:text-[26px] font-semibold tracking-tight">
              থামুন <span className="ml-1 font-serif">Thamun</span>
            </Link>

            {/* Desktop nav + search + dark toggle */}
            <div className="hidden md:flex items-center gap-4">
              <div className="relative">
                <label htmlFor="site-search" className="sr-only">
                  Search site
                </label>
                <input
                  id="site-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="min-h-[44px] w-[190px] rounded-[8px] border-2 border-ink-border bg-surface px-3 text-[16px] text-ink placeholder:text-muted"
                />
                {searchResults.length > 0 && (
                  <ul className="absolute right-0 mt-1 w-[280px] rounded-[8px] border-2 border-ink-border bg-surface p-2 shadow-none z-50">
                    {searchResults.map((res) => (
                      <li key={res.href}>
                        <Link
                          href={res.href}
                          onClick={() => setSearchQuery("")}
                          className="block rounded-[6px] px-3 py-2 text-[16px] font-semibold hover:bg-marigold/25"
                        >
                          {res.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <nav aria-label="Primary" className="flex items-center gap-4 text-[17px] font-semibold">
                <Link href="/#how-it-works" className="min-h-[44px] inline-flex items-center px-2 hover:underline underline-offset-4">
                  How it works
                </Link>
                <Link href="/practice/takapay-support" className="min-h-[44px] inline-flex items-center px-2 hover:underline underline-offset-4">
                  Practice
                </Link>
                <Link href="/pause" className="min-h-[44px] inline-flex items-center px-2 text-vermilion hover:underline underline-offset-4">
                  Pause
                </Link>
              </nav>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="min-h-[44px] rounded-[8px] border-2 border-ink-border bg-surface px-3 text-[15px] font-semibold hover:bg-marigold/20"
              >
                {dark ? "Light" : "Dark"}
              </button>
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                className="min-h-[48px] rounded-[8px] border-2 border-ink-border bg-surface px-3 text-[15px] font-semibold"
              >
                {dark ? "Light" : "Dark"}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-label="Toggle menu"
                className="min-h-[48px] min-w-[48px] rounded-[8px] border-2 border-ink-border bg-surface px-3 text-[16px] font-semibold"
              >
                {menuOpen ? "Close" : "Menu"}
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          {menuOpen && (
            <div className="md:hidden border-t-2 border-ink-border bg-paper px-5 py-4 space-y-3">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scenarios or help..."
                aria-label="Search site"
                className="w-full min-h-[48px] rounded-[8px] border-2 border-ink-border bg-surface px-3 text-[17px]"
              />
              {searchResults.length > 0 && (
                <ul className="rounded-[8px] border-2 border-ink-border bg-surface p-2">
                  {searchResults.map((res) => (
                    <li key={res.href}>
                      <Link
                        href={res.href}
                        onClick={() => {
                          setSearchQuery("");
                          setMenuOpen(false);
                        }}
                        className="block px-3 py-2 font-semibold"
                      >
                        {res.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <nav aria-label="Mobile" className="flex flex-col gap-2 text-[18px] font-semibold">
                <Link href="/#how-it-works" onClick={() => setMenuOpen(false)} className="min-h-[48px] flex items-center">
                  How it works
                </Link>
                <Link href="/practice/takapay-support" onClick={() => setMenuOpen(false)} className="min-h-[48px] flex items-center">
                  Start practising
                </Link>
                <Link href="/pause" onClick={() => setMenuOpen(false)} className="min-h-[48px] flex items-center text-vermilion">
                  I am on a call now
                </Link>
              </nav>
            </div>
          )}
        </header>
      )}

      <div id="main-content">{children}</div>

      {/* Floating Pause / Contact button */}
      {!isPracticeRoute && pathname !== "/pause" && (
        <Link
          href="/pause"
          className="no-print fixed bottom-5 right-5 z-40 inline-flex min-h-[48px] items-center justify-center rounded-[8px] border-2 border-ink-border bg-vermilion px-4 text-[16px] font-semibold text-white hover:opacity-95"
        >
          Pause / Help
        </Link>
      )}

      {/* THAMUN Helper Chatbot (hidden during active practice calls) */}
      {!isPracticeRoute && <HelpChatbot />}

      {/* Back to top button */}
      {showTop && !isPracticeRoute && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0 })}
          aria-label="Back to top"
          className="no-print fixed bottom-5 left-5 z-40 min-h-[48px] rounded-[8px] border-2 border-ink-border bg-surface px-4 text-[15px] font-semibold text-ink hover:bg-marigold/25"
        >
          Top ↑
        </button>
      )}

      {/* Simple cookie/storage banner */}
      {!cookieDismissed && (
        <aside
          aria-label="Privacy notice"
          className="no-print fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-xl rounded-[12px] border-2 border-ink-border bg-surface p-4 text-[16px] text-ink"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p>
              THAMUN uses only essential local storage for theme and safety—never ad cookies or call transcripts.{" "}
              <Link href="/cookies" className="font-semibold underline underline-offset-4">
                Cookie Policy
              </Link>
            </p>
            <button
              type="button"
              onClick={dismissCookie}
              className="min-h-[48px] shrink-0 rounded-[8px] border-2 border-ink-border bg-civic-green px-4 font-semibold text-white"
            >
              Got it
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
