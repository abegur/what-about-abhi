// components/experience/Timeline.tsx
// Renders a vertical timeline of experience / education entries.
// Each card slides in from the left with a staggered delay as the user scrolls.
// A continuous vertical line runs through the centre-left, with a dot
// at each entry point.
"use client";

import { motion } from "framer-motion";
import { experiences } from "@/lib/data";

// Colour-code the entry type badge
const typeBadgeClass: Record<string, string> = {
  "Full-time":  "bg-terracotta/15 text-terracotta border-terracotta/30",
  "Internship": "bg-cream/10      text-cream      border-cream/25",
  "Education":  "bg-warm/10       text-warm/60    border-warm/20",
  "Research":   "bg-cream/10      text-cream      border-cream/25",
  "Academic":   "bg-warm/10       text-warm/60    border-warm/20",
};

export default function Timeline() {
  return (
    <div className="relative max-w-3xl mx-auto px-6 pb-20">

      {/* Vertical guide line */}
      <div className="absolute left-[2.15rem] md:left-[2.85rem] top-0 bottom-0 w-px bg-warm/8" />

      <ul className="space-y-6">
        {experiences.map((exp, i) => (
          <motion.li
            key={exp.id}
            // Each card slides in from the left, staggered by index
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: i * 0.08, ease: "easeOut" }}
            className="relative flex gap-6 md:gap-8"
          >
            {/* Timeline dot — sits on the vertical line */}
            <div className="shrink-0 mt-1 flex flex-col items-center z-10">
              <div className="w-3 h-3 rounded-full bg-terracotta ring-4 ring-background" />
            </div>

            {/* Card */}
            <div
              className="
                flex-1 bg-surface rounded-2xl p-4 border border-warm/5
                hover:border-terracotta/20 transition-colors duration-300
              "
            >
              {/* Top row: company + badge, then title + period */}
              <div className="mb-3">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-warm/40 text-xs uppercase tracking-widest">
                    {exp.company}
                  </p>
                  <span
                    className={`
                      text-[10px] px-2 py-0.5 rounded-full border
                      tracking-wider uppercase shrink-0
                      ${typeBadgeClass[exp.type] ?? typeBadgeClass["Full-time"]}
                    `}
                  >
                    {exp.type}
                  </span>
                </div>
                <h3 className="font-serif text-xl text-cream whitespace-pre-line mb-1">{exp.title}</h3>
                <span className="text-warm/35 text-xs">{exp.period}</span>
              </div>

              {/* Location */}
              <p className="text-warm/30 text-xs mb-3">📍 {exp.location}</p>

              {/* Description — only rendered when non-empty */}
              {exp.description && (
                <p className="text-warm/65 text-sm leading-relaxed mb-4 whitespace-pre-line">{exp.description}</p>
              )}

            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
