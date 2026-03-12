// components/home/Hero.tsx
// Full-viewport hero section on the home page.
//
// Easter egg: if you hover over the name for 3 full seconds without leaving,
// the name shakes and a little speech-bubble message pops up.
// The timer is cleared if the cursor leaves before 3 s.
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useAnimation, AnimatePresence }    from "framer-motion";

// Messages that randomly appear after the 3-second hover
const easterEggMessages = [
  "hey, you found me 👋",
  "okay okay, I see you 😄",
  "still here? impressive.",
  "you're quite persistent, aren't you?",
];

export default function Hero() {
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [easterEggMsg,     setEasterEggMsg]     = useState("");
  const hoverTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Controls for the shake animation triggered by the easter egg
  const shakeControls = useAnimation();

  // Clean up timers on unmount
  useEffect(() => () => {
    if (hoverTimer.current)   clearTimeout(hoverTimer.current);
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
  }, []);

  // Start the 3-second countdown when the cursor enters the name
  const handleMouseEnter = useCallback(() => {
    hoverTimer.current = setTimeout(async () => {
      // Pick a random message
      const msg = easterEggMessages[Math.floor(Math.random() * easterEggMessages.length)];
      setEasterEggMsg(msg);
      setEasterEggVisible(true);

      // Play a quick wiggle on the name element
      await shakeControls.start({
        rotate: [0, -3, 3, -2, 2, -1, 0],
        transition: { duration: 0.5 },
      });

      // Auto-dismiss the speech bubble after 3 s
      dismissTimer.current = setTimeout(() => setEasterEggVisible(false), 3000);
    }, 3000); // ← 3-second hover threshold
  }, [shakeControls]);

  // If the cursor leaves before 3 s, cancel the countdown
  const handleMouseLeave = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  }, []);

  return (
    <section className="min-h-screen flex items-center px-6 relative overflow-hidden">

      {/* Ambient glow blobs in the background — pure decoration */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-terracotta/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-cream/3 blur-3xl" />
      </div>

      <div className="max-w-6xl w-full mx-auto relative">

        {/* "Hello, I'm" label — fades up first */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-terracotta text-xs tracking-[0.35em] uppercase mb-4 select-none pointer-events-none"
        >
          Hello, I&apos;m
        </motion.p>

        {/* Name block ─────────────────────────────────────── */}
        {/* Outer div: entrance slide-up animation */}
        <motion.div
          initial={{ opacity: 0, y: 48 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative inline-block"
        >
          {/* Inner element: easter egg shake via shakeControls */}
          <motion.h1
            animate={shakeControls}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="font-serif text-[clamp(4rem,12vw,9rem)] text-cream leading-[0.9] cursor-default select-none"
          >
            Abhi<br />Begur
          </motion.h1>

          {/* Speech-bubble tooltip — appears/disappears via AnimatePresence */}
          <AnimatePresence>
            {easterEggVisible && (
              <motion.div
                initial={{ opacity: 0, y: 4,  scale: 0.9 }}
                animate={{ opacity: 1, y: -8, scale: 1   }}
                exit={{    opacity: 0, y: 4,  scale: 0.9  }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="
                  absolute -top-12 left-0
                  bg-terracotta text-background
                  text-sm font-medium px-3 py-1.5 rounded-full
                  whitespace-nowrap shadow-lg
                "
              >
                {easterEggMsg}
                {/* Little downward triangle pointing at the name */}
                <span className="absolute -bottom-1.5 left-6 w-3 h-3 bg-terracotta rotate-45 rounded-sm" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.6, delay: 0.65 }}
          className="mt-8 text-warm/55 text-lg md:text-xl leading-relaxed max-w-xl"
        >
          Software engineer in test & creative thinker. I build consumer
          products and love exploring how AI can make technology feel more human.
        </motion.p>

        {/* Location / status line */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0  }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="mt-6 flex items-center gap-3 text-warm/35 text-sm"
        >
          {/* Pulsing green dot → "online / open to work" indicator */}
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta/60 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-terracotta/80" />
          </span>
          Based in San Francisco, CA · Open to opportunities
        </motion.div>

        {/* Scroll nudge arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1  }}
          transition={{ delay: 1.4 }}
          className="mt-24 flex flex-col items-start gap-2"
          aria-hidden="true"
        >
          <span className="text-warm/25 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          {/* Animated downward line */}
          <motion.div
            animate={{ scaleY: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-terracotta/60 to-transparent origin-top"
          />
        </motion.div>
      </div>
    </section>
  );
}
