// components/projects/ProjectCard.tsx
// A card for each project.
// On hover, a terracotta overlay slides up from the bottom revealing
// the longer description and a "View" nudge.
// Uses React state (not just CSS hover) so we can use AnimatePresence.
"use client";

import { useState }                   from "react";
import { motion, AnimatePresence }    from "framer-motion";
import Link                           from "next/link";

// Shape of a project entry (matches lib/data.ts)
interface Project {
  id:              number;
  title:           string;
  year:            string;
  description:     string;
  longDescription: string;
  tags:            string[];
  status:          string;
  link:            string;
  secondLink?:     { label: string; href: string };
}

export default function ProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      // Subtle lift on hover — the overlay provides the main detail reveal
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative bg-surface rounded-2xl overflow-hidden border border-warm/5 h-64 cursor-pointer"
    >
      {/* ── Default (non-hovered) view ───────────────── */}
      <div className="p-6 h-full flex flex-col justify-between">
        <div>
          {/* Year chip */}
          <p className="text-terracotta text-[10px] tracking-[0.3em] uppercase mb-3">
            {project.year}
          </p>
          {/* Project title */}
          <h3 className="font-serif text-2xl text-cream mb-2">{project.title}</h3>
          {/* Short description */}
          <p className="text-warm/55 text-sm leading-relaxed">{project.description}</p>
        </div>

        {/* Skill tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-[10px] px-2 py-0.5 bg-background rounded text-warm/35 border border-warm/8"
            >
              {tag}
            </span>
          ))}
          {/* Show "+N more" if there are extra tags */}
          {project.tags.length > 3 && (
            <span className="text-[10px] text-warm/25">+{project.tags.length - 3}</span>
          )}
        </div>
      </div>

      {/* ── Hover overlay ───────────────────────────── */}
      {/* Slides up from the bottom, covering the card with a terracotta panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "0%"   }}
            exit={{    y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="absolute inset-0 bg-terracotta p-6 flex flex-col justify-between"
          >
            {/* Long description */}
            <div>
              <h3 className="font-serif text-2xl text-background mb-3">{project.title}</h3>
              <p className="text-background/75 text-sm leading-relaxed">
                {project.longDescription}
              </p>
            </div>

            {/* Bottom row: status + links */}
            <div className="flex items-center justify-between">
              <span className="text-background/50 text-xs uppercase tracking-wider">
                {project.status}
              </span>
              <div className="flex items-center gap-3">
                {project.secondLink && (
                  <Link
                    href={project.secondLink.href}
                    onClick={(e) => e.stopPropagation()}
                    className="text-background/70 text-sm hover:underline underline-offset-2"
                  >
                    {project.secondLink.label}
                  </Link>
                )}
                {project.link && project.link !== "#" && (
                  project.link.startsWith("http") ? (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-background text-sm font-medium hover:underline underline-offset-2"
                    >
                      View →
                    </a>
                  ) : (
                    <Link
                      href={project.link}
                      onClick={(e) => e.stopPropagation()}
                      className="text-background text-sm font-medium hover:underline underline-offset-2"
                    >
                      View →
                    </Link>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
