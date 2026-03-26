// components/HiddenEasterEgg.tsx
// A tiny, nearly-invisible dot fixed in the bottom-right corner.
// If you click it, a random fun fact pops up for 4 seconds.
// The opacity is intentionally very low — it's meant to be discovered.
"use client";

import { useState, useCallback }   from "react";
import { motion, AnimatePresence } from "framer-motion";
import { funFacts }                from "@/lib/data";
import { track }                   from "@/lib/analytics";

export default function HiddenEasterEgg() {
  const [fact, setFact] = useState<string | null>(null);

  const reveal = useCallback(() => {
    // Pick a random fun fact from the list in data.ts
    const random = funFacts[Math.floor(Math.random() * funFacts.length)];
    setFact(random);
    track('easter_egg', window.location.pathname, { type: 'hidden_dot' });
    // Auto-dismiss after 4 seconds
    setTimeout(() => setFact(null), 4000);
  }, []);

  return (
    <>
      {/* The hidden trigger — a tiny dot, opacity-[0.06] makes it barely visible */}
      <button
        onClick={reveal}
        aria-label="Hidden easter egg"
        className="fixed bottom-5 right-5 w-2 h-2 rounded-full bg-terracotta opacity-[0.06] hover:opacity-20 transition-opacity z-50 cursor-default"
      />

      {/* Fun fact toast — appears centred at the bottom of the screen */}
      <AnimatePresence>
        {fact && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 20, scale: 0.95  }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[200]
                       bg-surface border border-terracotta/30 rounded-2xl
                       px-6 py-4 max-w-sm w-[90vw] shadow-2xl text-center"
          >
            <p className="text-[10px] text-terracotta uppercase tracking-widest mb-2">
              fun fact ✦
            </p>
            <p className="text-warm/80 text-sm leading-relaxed">{fact}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
