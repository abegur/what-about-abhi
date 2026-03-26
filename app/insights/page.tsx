'use client'
// app/insights/page.tsx — Public-facing analytics narrative page

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import PageWrapper from '@/components/PageWrapper'
import { generateInsights } from '@/lib/insightsHelpers'
import type { AnalyticsData, InsightCard } from '@/types/analytics'

const PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD ?? ''

// ── Skeleton loaders ──────────────────────────────────────────────────────────
function KPISkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-surface border border-warm/5 rounded-2xl p-6 h-24 animate-pulse" />
      ))}
    </div>
  )
}

function CardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-surface border border-warm/5 rounded-2xl p-6 h-36 animate-pulse" />
      ))}
    </div>
  )
}

// ── KPI mini-cards ────────────────────────────────────────────────────────────
function KPIRow({ data }: { data: AnalyticsData }) {
  const topPage = data.page_views_by_path[0]
  const totalEggs = data.easter_egg_counts.reduce((sum, e) => sum + e.count, 0)

  const cards = [
    {
      label: 'Visitors this month',
      value: data.page_views_by_day
        .reduce((sum, d) => sum + d.views, 0)
        .toLocaleString(),
    },
    {
      label: 'Most popular page',
      value: topPage
        ? (topPage.page_path === '/' ? 'Home' : topPage.page_path.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()))
        : '—',
    },
    {
      label: 'Easter eggs found',
      value: totalEggs.toLocaleString(),
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.07 }}
          className="bg-surface border border-warm/5 rounded-2xl p-6"
        >
          <p className="text-warm/35 text-[10px] tracking-widest uppercase mb-2">{card.label}</p>
          <div className="h-px w-6 bg-terracotta/40 mb-3" />
          <p className="font-serif text-2xl text-cream">{card.value}</p>
        </motion.div>
      ))}
    </div>
  )
}

// ── Insight card ──────────────────────────────────────────────────────────────
function InsightCardComp({ card, index }: { card: InsightCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.1 + index * 0.08 }}
      className="bg-surface border border-warm/5 rounded-2xl p-6 hover:border-terracotta/20 transition-colors duration-300"
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{card.icon}</span>
        <h3 className="font-serif text-xl text-cream leading-tight">{card.title}</h3>
      </div>
      <p className="text-warm/60 text-sm leading-relaxed mb-4">{card.body}</p>
      <div className="h-px bg-warm/5 mb-3" />
      <p className="text-terracotta text-xs tracking-wide">{card.metric}</p>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InsightsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [insights, setInsights] = useState<InsightCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics', {
      headers: { 'x-dashboard-password': PASSWORD },
    })
      .then((r) => r.json())
      .then((d: AnalyticsData) => {
        setData(d)
        setInsights(generateInsights(d))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const lastUpdated = data?.last_updated
    ? new Date(data.last_updated).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
      })
    : null

  return (
    <PageWrapper>
      {/* ── Page hero ───────────────────────────────────── */}
      <div className="pt-20 pb-12 px-6 max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4"
        >
          Live Analytics
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08 }}
          className="font-serif text-5xl md:text-6xl text-cream mb-4 max-w-2xl"
        >
          Here&apos;s what the<br />data says.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-warm/50 text-lg max-w-xl leading-relaxed"
        >
          Real metrics on how people use this site — turned into something actually readable.
        </motion.p>

        {lastUpdated && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-warm/25 text-xs mt-4 tracking-wide"
          >
            Last updated {lastUpdated} · Aggregate data only, no personal info collected
          </motion.p>
        )}

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.28, ease: 'easeOut' }}
          className="mt-10 h-px w-full bg-warm/6 origin-left"
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-12">
        {/* KPI row */}
        <div>
          <p className="text-warm/35 text-xs tracking-widest uppercase mb-5">At a Glance</p>
          {loading ? <KPISkeleton /> : data ? <KPIRow data={data} /> : null}
        </div>

        {/* Insight cards */}
        <div>
          <p className="text-warm/35 text-xs tracking-widest uppercase mb-5">What the Data Says</p>
          {loading ? <CardSkeleton /> : insights.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {insights.map((card, i) => (
                <InsightCardComp key={i} card={card} index={i} />
              ))}
            </div>
          ) : (
            <p className="text-warm/30 text-sm">Not enough data yet — check back after a few visitors.</p>
          )}
        </div>

        {/* Footer note */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="border-t border-warm/5 pt-10 text-center"
        >
          <p className="text-warm/30 text-xs leading-relaxed max-w-md mx-auto">
            This page reads from real session data collected via a custom analytics pipeline built into this site.
            All data is aggregate and session-based — no cookies, no personal information, no third-party trackers.
          </p>
        </motion.div>
      </div>
    </PageWrapper>
  )
}
