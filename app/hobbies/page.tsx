// app/hobbies/page.tsx  — Hobbies page
// A grid of hobby cards. Each card lifts on hover and fades in with stagger.
"use client";

import { motion }    from "framer-motion";
import PageWrapper   from "@/components/PageWrapper";
import HobbyGrid     from "@/components/hobbies/HobbyGrid";

export default function HobbiesPage() {
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
          Outside of work
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-serif text-5xl md:text-7xl text-cream mb-4"
        >
          Hobbies
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-warm/50 text-lg max-w-xl leading-relaxed"
        >
          The things that keep me sane, curious, and human.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
          className="mt-10 h-px w-full bg-warm/6 origin-left"
        />
      </div>

      {/* ── Hobby grid ────────────────────────────────── */}
      <HobbyGrid />
    </PageWrapper>
  );
}
