// components/Navbar.tsx
// Sticky top navigation bar.
// - Desktop: horizontal link list + Contact button
// - Mobile: hamburger icon → animated slide-down menu
// - Highlights the active route using usePathname()
// - Background blurs in on scroll (glass effect)
// - Opens the ContactModal via shared state
"use client";

import { useState, useEffect }        from "react";
import Link                           from "next/link";
import { usePathname }                from "next/navigation";
import { motion, AnimatePresence }    from "framer-motion";
import ContactModal                   from "@/components/ContactModal";

// Every route shown in the nav
const navLinks = [
  { href: "/",             label: "Home"          },
  { href: "/experience",   label: "Experience"    },
  { href: "/projects",     label: "Projects"      },
  { href: "/hobbies",      label: "Hobbies"       },
  { href: "/travel",       label: "Travel"        },
  { href: "/what-is-this", label: "What Is This?" },
];

export default function Navbar() {
  const pathname       = usePathname();
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  // True once the user scrolls past 20px — triggers the blur/border treatment
  const [scrolled,    setScrolled]    = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when the route changes (user tapped a link)
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  return (
    <>
      <nav
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${scrolled
            ? "bg-background/90 backdrop-blur-md border-b border-warm/5"
            : "bg-transparent"}
        `}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo / wordmark */}
          <Link
            href="/"
            className="font-serif text-xl text-cream hover:text-terracotta transition-colors"
          >
            ab.
          </Link>

          {/* ── Desktop nav ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  text-sm tracking-wide transition-colors duration-200
                  ${pathname === link.href
                    ? "text-terracotta font-medium"
                    : "text-warm/50 hover:text-warm"}
                `}
              >
                {link.label}
              </Link>
            ))}

            {/* Contact — opens modal, not a page */}
            <button
              onClick={() => setContactOpen(true)}
              className="
                text-sm px-4 py-1.5
                border border-terracotta/60 text-terracotta rounded-full
                hover:bg-terracotta hover:text-background
                transition-all duration-200
              "
            >
              Contact
            </button>
          </div>

          {/* ── Mobile hamburger ────────────────────────── */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {/* Three bars that morph into an × when open */}
            <span
              className={`block w-5 h-[1.5px] bg-warm transition-all duration-300 origin-center
                ${menuOpen ? "rotate-45 translate-y-[6.5px]" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-warm transition-all duration-300
                ${menuOpen ? "opacity-0 scale-x-0" : ""}`}
            />
            <span
              className={`block w-5 h-[1.5px] bg-warm transition-all duration-300 origin-center
                ${menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""}`}
            />
          </button>
        </div>

        {/* ── Mobile slide-down menu ───────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{    opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-surface border-t border-warm/5"
            >
              <div className="flex flex-col px-6 py-4 gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      py-3 text-sm tracking-wide
                      border-b border-warm/5
                      transition-colors duration-200
                      ${pathname === link.href
                        ? "text-terracotta"
                        : "text-warm/60 hover:text-warm"}
                    `}
                  >
                    {link.label}
                  </Link>
                ))}

                <button
                  onClick={() => { setContactOpen(true); setMenuOpen(false); }}
                  className="
                    mt-3 text-sm px-4 py-2
                    border border-terracotta/60 text-terracotta rounded-full
                    hover:bg-terracotta hover:text-background
                    transition-all duration-200 text-left w-fit
                  "
                >
                  Contact
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Contact modal — rendered at the root so it overlays everything */}
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}
