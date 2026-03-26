// components/home/Currently.tsx
// A "right now" snapshot widget on the home page.
// Shows what I'm reading, building, listening to, etc.
// Each row fades in from below when it enters the viewport (staggered).
"use client";

import { motion } from "framer-motion";
import { currentlyItems } from "@/lib/data";

export default function Currently() {
  return (
    <section id="currently-section" className="px-6 py-20 max-w-6xl mx-auto">

      {/* Section header */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4"
      >
        Right now
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="font-serif text-4xl text-cream mb-10"
      >
        Currently
      </motion.h2>

      {/* Widget card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="bg-surface rounded-2xl border border-warm/5 overflow-hidden"
      >
        {/* "live" header bar */}
        <div className="flex items-center gap-2 px-6 py-4 border-b border-warm/5">
          {/* Pulsing dot to imply "live / real-time" */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta/60 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta" />
          </span>
          <span className="text-warm/40 text-xs tracking-widest uppercase">Live snapshot</span>
        </div>

        {/* Individual item rows */}
        <ul>
          {currentlyItems.map((item, i) => (
            <motion.li
              key={item.label}
              // Each row staggers its entrance by 60 ms
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="
                flex items-center gap-4 px-6 py-4
                border-b border-warm/5 last:border-b-0
                hover:bg-background/30 transition-colors duration-200
              "
            >
              {/* Emoji icon */}
              <span className="text-xl shrink-0 w-7 text-center">{item.icon}</span>

              {/* Label column */}
              <span className="text-warm/35 text-xs uppercase tracking-widest w-20 shrink-0">
                {item.label}
              </span>

              {/* Value */}
              <span className="text-warm/80 text-sm">{item.value}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </section>
  );
}
