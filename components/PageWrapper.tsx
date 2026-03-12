// components/PageWrapper.tsx
// A lightweight wrapper that fades + slides each page in on mount.
// Import this at the top level of every page component and wrap the content.
"use client";

import { motion } from "framer-motion";

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Start invisible and slightly below final position
      initial={{ opacity: 0, y: 18 }}
      // Animate to fully visible, natural position
      animate={{ opacity: 1, y: 0  }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
