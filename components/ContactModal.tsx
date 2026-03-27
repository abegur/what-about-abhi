// components/ContactModal.tsx
// A modal overlay triggered by the "Contact" button in the navbar.
// AnimatePresence handles the enter / exit transitions so it fades in
// and scales up from the centre, then reverses smoothly on close.
"use client";

import { useEffect }                    from "react";
import { motion, AnimatePresence }      from "framer-motion";

// Contact detail rows — swap in real info later
const contactDetails = [
  { label: "Email",    value: "abhibegur2@gmail.com",                    href: "mailto:abhibegur2@gmail.com",                                  icon: "✉️" },
  { label: "LinkedIn", value: "Abhi Begur",                           href: "https://www.linkedin.com/in/abhinav-begur-1a9197156/",          icon: "💼" },
  { label: "City",     value: "San Francisco, CA",                       href: null,                                                           icon: "📍" },
];

interface Props {
  open:    boolean;
  onClose: () => void;
}

export default function ContactModal({ open, onClose }: Props) {
  // Prevent the body from scrolling while the modal is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    // AnimatePresence enables exit animations when `open` becomes false
    <AnimatePresence>
      {open && (
        // Backdrop — clicking it closes the modal
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          {/* Modal panel — stopPropagation so clicks inside don't close it */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{    opacity: 0, scale: 0.92, y: 24  }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-surface rounded-2xl p-8 w-full max-w-md border border-terracotta/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <h2 className="font-serif text-3xl text-cream">Get in touch</h2>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="text-warm/40 hover:text-warm text-3xl leading-none mt-1 transition-colors"
              >
                ×
              </button>
            </div>

            <p className="text-warm/50 text-sm mb-6 leading-relaxed">
              Always open to interesting conversations, collaborations, and opportunities.
            </p>

            {/* Contact rows */}
            <ul className="space-y-3">
              {contactDetails.map((item) => (
                <li
                  key={item.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-warm/5"
                >
                  <span className="text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-[10px] text-warm/40 uppercase tracking-widest mb-0.5">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-warm/90 text-sm hover:text-terracotta transition-colors underline underline-offset-2"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-warm/90 text-sm">{item.value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
