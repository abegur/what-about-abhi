// app/page.tsx  — Home page
// Composed of:
//   1. Hero       — full-viewport intro with animated name + 3-sec easter egg
//   2. Currently  — live snapshot widget (what I'm reading, building, etc.)
//   3. Brief About — short paragraph + call-to-action links
"use client";

import { motion }    from "framer-motion";
import Link          from "next/link";
import Hero          from "@/components/home/Hero";
import Currently     from "@/components/home/Currently";

export default function Home() {
  return (
    <>
      {/* ── 1. Hero ─────────────────────────────────────── */}
      <Hero />

      {/* ── 2. Currently widget ─────────────────────────── */}
      <Currently />

      {/* ── 3. About / navigation hints ─────────────────── */}
      <section className="px-6 py-16 max-w-6xl mx-auto border-t border-warm/5">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4"
        >
          A bit about me
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-serif text-4xl text-cream mb-6 max-w-xl"
        >
          Engineer by trade,<br />product-minded by nature.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className="text-warm/55 text-base leading-relaxed max-w-2xl mb-10"
        >
          I&apos;m currently a Software Engineer II - Test at Paze, focused on
          building quality into consumer-facing products. I&apos;m a creative thinker
          who loves the intersection of technology and people, and I&apos;m
          increasingly drawn to how AI can help us ship better, more intuitive
          solutions. Outside of work you&apos;ll find me outdoors, at the gym, or
          sharing good experiences with friends and family.
        </motion.p>

        {/* Quick-nav links to the other pages */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="flex flex-wrap gap-3"
        >
          {[
            { href: "/experience", label: "Experience"  },
            { href: "/projects",   label: "Projects"    },
            { href: "/hobbies",    label: "Hobbies"     },
            { href: "/travel",     label: "Travel"      },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="
                text-sm px-5 py-2 rounded-full
                border border-warm/15 text-warm/60
                hover:border-terracotta/50 hover:text-terracotta
                transition-all duration-200
              "
            >
              {link.label} →
            </Link>
          ))}
        </motion.div>
      </section>
    </>
  );
}
