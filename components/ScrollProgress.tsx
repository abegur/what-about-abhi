// components/ScrollProgress.tsx
// A thin bar fixed at the very top of the screen.
// Its width animates from 0 → 100% as the user scrolls the page.
// Uses Framer Motion's useScroll + useSpring for a smooth, physics-based feel.
"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export default function ScrollProgress() {
  // useScroll returns scrollYProgress: a MotionValue that goes 0 → 1
  const { scrollYProgress } = useScroll();

  // useSpring adds mass/damping so the bar doesn't jump sharply.
  // Adjust stiffness / damping to taste.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping:   30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      // origin-left so the bar grows from the left edge
      className="fixed top-0 left-0 right-0 h-[2px] bg-terracotta z-[60] origin-left"
      style={{ scaleX }}
      // Hide until the user starts scrolling (avoids a flash at 0)
      aria-hidden="true"
    />
  );
}
