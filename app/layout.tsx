// app/layout.tsx
// Root layout — wraps every page on the site.
// This file is a Server Component (no "use client"), which is correct:
// - Fonts load server-side for zero layout shift
// - Client-only pieces (Navbar, ScrollProgress, etc.) are imported as
//   separate "use client" components and hydrate independently.

import type { Metadata } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

import Navbar          from "@/components/Navbar";
import ScrollProgress  from "@/components/ScrollProgress";
import BottomEasterEgg from "@/components/BottomEasterEgg";
import HiddenEasterEgg from "@/components/HiddenEasterEgg";

// ── Google Fonts via Next.js font loader ─────────────────────────────────────
// next/font downloads the font at build time and self-hosts it —
// no runtime request to Google's servers, no layout shift.

// Heading font — injected as the CSS variable --font-dm-serif
const dmSerif = DM_Serif_Display({
  weight:   ["400"],
  subsets:  ["latin"],
  variable: "--font-dm-serif",
  display:  "swap",
});

// Body font — injected as the CSS variable --font-inter
const inter = Inter({
  subsets:  ["latin"],
  variable: "--font-inter",
  display:  "swap",
});

// ── Page metadata (used by Next.js for <head> tags) ──────────────────────────
export const metadata: Metadata = {
  title:       "Abhi Begur",
  description: "Personal portfolio — software engineer & creative thinker.",
};

// ── Root layout component ────────────────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        // Apply both font CSS variables to the document body.
        // globals.css @theme picks them up via var(--font-dm-serif) and
        // var(--font-inter) so Tailwind's font-serif / font-sans classes work.
        className={`${dmSerif.variable} ${inter.variable} antialiased`}
      >
        {/* Thin terracotta bar at the very top tracking scroll progress */}
        <ScrollProgress />

        {/* Sticky top navbar — highlights the active route */}
        <Navbar />

        {/* Page content — pt-16 clears the 64px fixed navbar */}
        <main className="pt-16">{children}</main>

        {/* Revealed at the bottom of every page (scroll easter egg) */}
        <BottomEasterEgg />

        {/* Nearly-invisible clickable dot hidden on screen (easter egg) */}
        <HiddenEasterEgg />
      </body>
    </html>
  );
}
