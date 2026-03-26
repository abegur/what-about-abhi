// components/BottomEasterEgg.tsx
// Sits at the very bottom of every page (rendered from layout.tsx).
// The message is invisible until the user scrolls all the way down —
// useInView detects when this element enters the viewport.
"use client";

import { useRef, useEffect }   from "react";
import { motion, useInView }   from "framer-motion";
import { track }               from "@/lib/analytics";

export default function BottomEasterEgg() {
  // Attach a ref so Framer Motion can observe when this element is visible
  const ref = useRef<HTMLDivElement>(null);
  // Guard against re-firing on the same page visit (isInView toggles on scroll)
  const firedRef = useRef(false);

  // once: false means the animation re-triggers every time the user scrolls
  // to the bottom (not just the first time)
  const isInView = useInView(ref, { once: false, margin: "0px" });

  // Track the easter egg once per page mount (resets on navigation)
  useEffect(() => {
    if (isInView && !firedRef.current) {
      firedRef.current = true;
      track('easter_egg', window.location.pathname, { type: 'bottom_message' });
    }
  }, [isInView]);

  return (
    <div ref={ref} className="py-16 flex flex-col items-center gap-3">
      {/* Decorative divider line */}
      <div className="w-px h-12 bg-gradient-to-b from-terracotta/30 to-transparent" />

      {/* The hidden message — fades in when scrolled into view */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-warm/20 text-xs tracking-[0.25em] uppercase text-center"
      >
        you scrolled all the way down here. i respect that. ✦
      </motion.p>

      {/* Tiny year / signature */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-warm/10 text-[10px] tracking-widest"
      >
        © {new Date().getFullYear()} abhi begur
      </motion.p>
    </div>
  );
}
