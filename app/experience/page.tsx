// app/experience/page.tsx  — Experience page
// Shows a vertical timeline of work history and education.
// PageWrapper provides the page-entrance fade animation.
"use client";

import { motion }   from "framer-motion";
import PageWrapper  from "@/components/PageWrapper";
import Timeline     from "@/components/experience/Timeline";

export default function ExperiencePage() {
  return (
    <PageWrapper>
      {/* ── Page hero ─────────────────────────────────── */}
      <div className="pt-20 pb-16 px-6 max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4"
        >
          Where I&apos;ve been
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-serif text-5xl md:text-7xl text-cream mb-4"
        >
          Experience
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-warm/50 text-lg max-w-xl leading-relaxed"
        >
          My educational background and the roles that have shaped how I
          think, build, and collaborate.
        </motion.p>

        {/* Decorative divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
          className="mt-10 h-px w-full bg-warm/6 origin-left"
        />
      </div>

      {/* ── Timeline ──────────────────────────────────── */}
      <Timeline />

    </PageWrapper>
  );
}
