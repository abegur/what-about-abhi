// app/projects/page.tsx  — Projects page
// A 3-column grid (responsive) of ProjectCard components.
// Each card reveals extra detail on hover via an animated overlay.
"use client";

import { motion }       from "framer-motion";
import PageWrapper      from "@/components/PageWrapper";
import ProjectCard      from "@/components/projects/ProjectCard";
import { projects }     from "@/lib/data";

export default function ProjectsPage() {
  return (
    <PageWrapper>
      {/* ── Page hero ─────────────────────────────────── */}
      <div className="pt-20 pb-16 px-6 max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4"
        >
          Things I&apos;ve built
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-serif text-5xl md:text-7xl text-cream mb-4"
        >
          Projects
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-warm/50 text-lg max-w-xl leading-relaxed"
        >
          A selection of side projects and products. Hover a card to see more detail.
        </motion.p>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.28, ease: "easeOut" }}
          className="mt-10 h-px w-full bg-warm/6 origin-left"
        />
      </div>

      {/* ── Project grid ──────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            // Stagger the card entrances using whileInView on a wrapper
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
