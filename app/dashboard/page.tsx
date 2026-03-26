'use client'
// app/dashboard/page.tsx — Private analytics dashboard
// Protected by a password wall backed by sessionStorage.

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { AnalyticsData } from '@/types/analytics'
import { isTrackingPaused, setTrackingPaused } from '@/lib/analytics'
import KPICards from '@/components/dashboard/KPICards'
import EasterEggCounts from '@/components/dashboard/EasterEggCounts'
import NavClickHeatmap from '@/components/dashboard/NavClickHeatmap'
import SessionTable from '@/components/dashboard/SessionTable'
import AIInsights from '@/components/dashboard/AIInsights'

// Dynamic imports to avoid SSR issues with recharts
const PageViewsChart = dynamic(() => import('@/components/dashboard/PageViewsChart'), { ssr: false })
const PageBreakdownChart = dynamic(() => import('@/components/dashboard/PageBreakdownChart'), { ssr: false })
const ScrollDepthChart = dynamic(() => import('@/components/dashboard/ScrollDepthChart'), { ssr: false })

const AUTH_KEY = 'dashboard_auth'
const PASSWORD = process.env.NEXT_PUBLIC_DASHBOARD_PASSWORD ?? ''

// ── Password wall ─────────────────────────────────────────────────────────────
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === PASSWORD) {
      sessionStorage.setItem(AUTH_KEY, 'true')
      onSuccess()
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-3">Dashboard</p>
        <h1 className="font-serif text-3xl text-cream mb-8">Enter password</h1>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => { setInput(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            className={`
              w-full bg-surface border rounded-xl px-4 py-3 text-warm
              placeholder-warm/25 outline-none text-sm
              transition-colors duration-200
              ${error ? 'border-red-500/50' : 'border-warm/10 focus:border-terracotta/50'}
            `}
          />
          {error && <p className="text-red-400/70 text-xs">Incorrect password</p>}
          <button
            type="submit"
            className="w-full py-3 bg-terracotta text-background rounded-xl text-sm font-medium hover:bg-terracotta/90 transition-colors duration-200"
          >
            Enter
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard section wrapper ─────────────────────────────────────────────────
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface border border-warm/5 rounded-2xl p-6">
      <h2 className="text-warm/40 text-[10px] tracking-widest uppercase mb-5">{title}</h2>
      {children}
    </div>
  )
}

// ── Dashboard content ─────────────────────────────────────────────────────────
function DashboardContent() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [paused, setPaused] = useState(false)

  useEffect(() => { setPaused(isTrackingPaused()) }, [])

  const toggleTracking = () => {
    const next = !paused
    setTrackingPaused(next)
    setPaused(next)
  }

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/analytics', {
        headers: { 'x-dashboard-password': PASSWORD },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const lastUpdated = data?.last_updated
    ? new Date(data.last_updated).toLocaleTimeString('en-US', {
        hour: 'numeric', minute: '2-digit',
      })
    : null

  return (
    <div className="min-h-screen px-6 py-12 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-2">Internal</p>
          <h1 className="font-serif text-5xl text-cream">Analytics</h1>
          {lastUpdated && (
            <p className="text-warm/30 text-xs mt-2">Last fetched at {lastUpdated}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTracking}
            className={`text-sm px-4 py-1.5 rounded-full border transition-all duration-200 ${
              paused
                ? 'border-terracotta/60 text-terracotta hover:bg-terracotta hover:text-background'
                : 'border-warm/10 text-warm/50 hover:border-warm/30 hover:text-warm'
            }`}
          >
            {paused ? 'Resume Tracking' : 'Pause Tracking'}
          </button>
          <button
            onClick={fetchData}
            className="text-sm px-4 py-1.5 border border-warm/10 text-warm/50 rounded-full hover:border-terracotta/40 hover:text-warm transition-all duration-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-surface border border-red-500/20 rounded-xl p-4 text-red-400/70 text-sm">
          Error loading data: {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-surface border border-warm/5 rounded-2xl p-5 h-28 animate-pulse" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="bg-surface border border-warm/5 rounded-2xl p-6 h-72 animate-pulse" />
            ))}
          </div>
        </div>
      ) : data ? (
        <div className="space-y-6">
          {/* KPI Cards */}
          <KPICards data={data} />

          {/* Charts row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Page Views — Last 30 Days">
              <PageViewsChart data={data.page_views_by_day} />
            </Section>
            <Section title="Views by Page">
              <PageBreakdownChart data={data.page_views_by_path} />
            </Section>
          </div>

          {/* Charts row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Section title="Scroll Depth (Home Page)">
              <ScrollDepthChart data={data.scroll_depth_distribution} />
            </Section>
            <Section title="Easter Egg Discovery">
              <EasterEggCounts data={data.easter_egg_counts} />
            </Section>
            <Section title="Nav Link Clicks">
              <NavClickHeatmap data={data.nav_clicks} />
            </Section>
          </div>

          {/* Session explorer */}
          <Section title={`Recent Sessions (${data.recent_sessions.length})`}>
            <SessionTable sessions={data.recent_sessions} />
          </Section>

          {/* AI Insights (stretch goal) */}
          <div className="bg-surface border border-warm/5 rounded-2xl p-6">
            <AIInsights password={PASSWORD} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

// ── Page root ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(AUTH_KEY) === 'true'
    setAuthed(stored)
  }, [])

  // Avoid flash of login screen while checking sessionStorage
  if (authed === null) return null

  if (!authed) {
    return <LoginScreen onSuccess={() => setAuthed(true)} />
  }

  return <DashboardContent />
}
