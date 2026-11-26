import type { Metadata } from "next";
import { Fraunces, Hind_Siliguri } from "next/font/google";
import { SiteChrome } from "@/components/SiteChrome";
import "./globals.css";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thamun.org";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-fraunces",
});

const hindSiliguri = Hind_Siliguri({
  subsets: ["latin", "bengali"],
  weight: ["400", "600", "700"],
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "THAMUN (থামুন) — Scam Call Practice",
    template: "%s | THAMUN (থামুন)",
  },
  description:
    "Practise pressure calls in Bangla or English, see what worked on you, and learn one safer move. No real money, PIN, or account.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "THAMUN (থামুন) — Meet the scam before it meets you.",
    description:
      "Practise pressure calls in Bangla or English, see what worked on you, and learn one safer move.",
    url: SITE_URL,
    siteName: "THAMUN",
    type: "website",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: "THAMUN — Scam Call Practice" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "THAMUN (থামুন) — Scam Call Practice",
    description: "Practise pressure calls safely in Bangla or English.",
    images: ["/og-image.svg"],
  },
};

const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "THAMUN (থামুন)",
  url: SITE_URL,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  inLanguage: ["en", "bn"],
  description:
    "Interactive scam-call rehearsal web app for parents, grandparents, and first-time mobile-money users.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${hindSiliguri.variable}`}>
      <body className="bg-paper text-ink font-sans text-[18px] leading-relaxed antialiased selection:bg-marigold/40">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-[8px] focus:border-2 focus:border-ink-border focus:bg-marigold focus:px-4 focus:py-2 focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
