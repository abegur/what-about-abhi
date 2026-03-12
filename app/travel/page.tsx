// app/travel/page.tsx  — Travel page
// Shows an interactive Leaflet map with two pin types:
//   • Solid terracotta = places visited
//   • Dashed cream     = places on the wishlist
// Below the map is a two-column list of all locations.
"use client";

import { motion }      from "framer-motion";
import PageWrapper     from "@/components/PageWrapper";
import TravelMap       from "@/components/travel/TravelMap";
import { travelData }  from "@/lib/data";

export default function TravelPage() {
  return (
    <PageWrapper>
      {/* ── Page hero ─────────────────────────────────── */}
      <div className="pt-20 pb-12 px-6 max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4"
        >
          Around the world
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-serif text-5xl md:text-7xl text-cream mb-4"
        >
          Travel
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-warm/50 text-lg max-w-xl leading-relaxed"
        >
          Places I&apos;ve been and places I&apos;m dreaming about.
          Click a pin for details.
        </motion.p>

        {/* Map legend */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.24 }}
          className="mt-6 flex items-center gap-6 text-sm"
        >
          {/* Visited legend item */}
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-terracotta border-2 border-cream/60 inline-block" />
            <span className="text-warm/50">Visited</span>
          </div>
          {/* Wishlist legend item */}
          <div className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full inline-block"
              style={{ border: "2px dashed #e8dcc8", background: "transparent" }}
            />
            <span className="text-warm/50">Want to visit</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-8 h-px w-full bg-warm/6 origin-left"
        />
      </div>

      {/* ── Interactive map ───────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="max-w-6xl mx-auto px-6 mb-16"
      >
        <TravelMap />
      </motion.div>

      {/* ── Location lists ────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Visited */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="font-serif text-2xl text-cream mb-6"
            >
              Been to
            </motion.h2>
            <ul className="space-y-2">
              {travelData.visited.map((place, i) => (
                <motion.li
                  key={place.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex items-center gap-3 text-warm/60 text-sm py-2 border-b border-warm/5"
                >
                  <span className="w-2 h-2 rounded-full bg-terracotta shrink-0" />
                  {place.name}
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Wishlist */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="font-serif text-2xl text-cream mb-6"
            >
              Want to visit
            </motion.h2>
            <ul className="space-y-2">
              {travelData.wishlist.map((place, i) => (
                <motion.li
                  key={place.name}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="flex items-center gap-3 text-warm/60 text-sm py-2 border-b border-warm/5"
                >
                  {/* Dashed circle icon for wishlist */}
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ border: "1.5px dashed #e8dcc8" }}
                  />
                  {place.name}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
