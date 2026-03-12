// components/hobbies/HobbyGrid.tsx
// A responsive grid of hobby cards.
// Each card fades in with a staggered delay as it enters the viewport.
"use client";

import { motion } from "framer-motion";
import { hobbies } from "@/lib/data";

export default function HobbyGrid() {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {hobbies.map((hobby, i) => (
          <motion.div
            key={hobby.id}
            // Stagger each card by 80 ms; slide up from below
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            // Subtle lift on hover
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="
              bg-surface rounded-2xl p-6
              border border-warm/5 hover:border-terracotta/20
              transition-colors duration-300
            "
          >
            {/* Emoji icon in a soft pill */}
            <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-background mb-4 text-xl">
              {hobby.icon}
            </div>

            <h3 className="font-serif text-xl text-cream mb-2">{hobby.title}</h3>
            <p className="text-warm/55 text-sm leading-relaxed">{hobby.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
