// app/what-is-this/page.tsx  — Meta page explaining the portfolio itself
"use client";

import { useEffect } from "react";
import { motion }    from "framer-motion";
import Link          from "next/link";
import PageWrapper   from "@/components/PageWrapper";
import { track }     from "@/lib/analytics";

// ── Tech stack entries ────────────────────────────────────────────────────────
const stack = [
  { name: "Next.js",         role: "Framework: App Router, server components"    },
  { name: "TypeScript",      role: "Type safety across the whole codebase"        },
  { name: "Tailwind CSS",    role: "Utility-first styling with a custom theme"    },
  { name: "Framer Motion",   role: "All animations and scroll-triggered effects"  },
  { name: "React Leaflet",   role: "Interactive travel map"                       },
  { name: "Supabase",        role: "Analytics database (stores all visitor event data)" },
  { name: "Claude AI",       role: "AI collaborator for design, code, and copy"   },
  { name: "Vercel",          role: "Deployment and edge hosting"                  },
];

// ── Design decisions ──────────────────────────────────────────────────────────
const decisions = [
  {
    title: "Dark with warmth",
    body:  "Most dark portfolios feel cold and a little intimidating. I wanted mine to feel like a warm evening, hence the terracotta accent, the near-black background, and the cream text. Intentional, not accidental.",
  },
  {
    title: "DM Serif Display",
    body:  "The heading font does a lot of heavy lifting. Its editorial quality makes the portfolio feel crafted and considered, not like something spun up in an afternoon (even if parts of it were).",
  },
  {
    title: "No JavaScript for layout",
    body:  "Everything structural (the grid, the timeline, the card sizing) is pure CSS. JavaScript (Framer Motion) is reserved for motion only. Fast by default, not by accident.",
  },
  {
    title: "Easter eggs",
    body:  "The hover-name trick, the hidden dot, and the bottom message exist because I think portfolios should have a little personality. If you found them all, hi 👋.",
  },
];

export default function WhatIsThisPage() {
  useEffect(() => {
    track('what_is_this_visit', '/what-is-this', {});
  }, []);

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
          Okay, good question
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-serif text-5xl md:text-7xl text-cream mb-4"
        >
          What Is<br />This, Exactly?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-warm/50 text-lg max-w-xl leading-relaxed"
        >
          Glad you asked. Buckle up, this one&apos;s a bit of a story.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
          className="mt-10 h-px w-full bg-warm/6 origin-left"
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-20">

        {/* ── The honest why ────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4">
            The honest why
          </p>
          <h2 className="font-serif text-3xl text-cream mb-6">
            I want to work closer to the product. So I built one.
          </h2>

          <div className="space-y-4 text-warm/60 leading-relaxed">
            <p>
              After years building alongside product teams, something became clear: I think
              like a product person, even when my title said otherwise. I obsess over details
              and care about the user experience more than my job description ever required.
            </p>
            <p>
              So instead of just writing that on a resume, I built something to show it. This
              whole site is the project. Every design decision, every interaction, every line
              of code, and yes, the custom analytics tracking whether any of this actually
              works.
            </p>

            {/* PM framework callout */}
            <div className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "My product",    value: "This website"                         },
                { label: "My clients",    value: "You (yes, you reading this right now)" },
                { label: "My deliverable", value: "A live analytics dashboard, built from scratch" },
                { label: "Success metric", value: "Whether this leads to an opportunity" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="bg-surface rounded-xl p-4 border border-warm/5"
                >
                  <p className="text-terracotta text-[10px] tracking-widest uppercase mb-1">{item.label}</p>
                  <p className="text-cream text-sm">{item.value}</p>
                </motion.div>
              ))}
            </div>

            <p>
              Is it unconventional? A little. But whatever role brought you here, I&apos;d
              like to think this says more than a resume ever could.
            </p>
            <p>
              And if you&apos;re reading this page, the product worked. You&apos;re the user.
              Welcome. I&apos;m glad you made it this far.{" "}
              <Link
                href="/"
                className="text-terracotta hover:underline underline-offset-2 transition-colors"
              >
                Say hi →
              </Link>
            </p>
          </div>
        </motion.section>

        {/* ── Tech stack ───────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4">
            Tech stack
          </p>
          <h2 className="font-serif text-3xl text-cream mb-6">Built with</h2>

          <ul className="space-y-3">
            {stack.map((item, i) => (
              <motion.li
                key={item.name}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="
                  flex items-start gap-4 p-4 rounded-xl
                  bg-surface border border-warm/5
                  hover:border-terracotta/20 transition-colors duration-300
                "
              >
                <span className="text-terracotta mt-0.5">▸</span>
                <div>
                  <p className="text-cream text-sm font-medium mb-0.5">{item.name}</p>
                  <p className="text-warm/45 text-sm">{item.role}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.section>

        {/* ── Under the hood ───────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4">
            Under the hood
          </p>
          <h2 className="font-serif text-3xl text-cream mb-6">
            I built real analytics for this. No Google, no trackers.
          </h2>

          <div className="space-y-4 text-warm/60 leading-relaxed">
            <p>
              I wanted to actually understand how people use this site. So I built the tooling
              to do that. It tracks page views, scroll depth, nav clicks, and even whether
              visitors find the easter eggs. All custom-built on top of Supabase, no
              third-party trackers, no cookies.
            </p>
            <p>
              The goal is to close the feedback loop. If people are spending a lot of time on
              a specific project, that&apos;s a signal. Maybe I highlight that work more in a
              conversation, or put it front and center on my resume. If most visitors drop off
              before reaching a certain section, something isn&apos;t landing. The data tells
              me what&apos;s working and what to fix.
            </p>
            <p>
              The results are public.{" "}
              <Link
                href="/insights"
                className="text-terracotta hover:underline underline-offset-2 transition-colors"
              >
                You can see what the data says on the Insights page.
              </Link>
            </p>
          </div>
        </motion.section>

        {/* ── Design decisions ─────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
        >
          <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4">
            Design thinking
          </p>
          <h2 className="font-serif text-3xl text-cream mb-6">Key decisions</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {decisions.map((d, i) => (
              <motion.div
                key={d.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.07 }}
                className="bg-surface rounded-2xl p-6 border border-warm/5"
              >
                <h3 className="font-serif text-xl text-cream mb-2">{d.title}</h3>
                <p className="text-warm/55 text-sm leading-relaxed">{d.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Closing note ─────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="text-center py-8"
        >
          <p className="font-serif text-2xl text-cream/60 italic">
            &ldquo;The best way to predict the future is to build it.&rdquo;
          </p>
          <p className="text-warm/30 text-sm mt-3">Abraham Lincoln (probably not, but still)</p>
        </motion.section>
      </div>
    </PageWrapper>
  );
}
