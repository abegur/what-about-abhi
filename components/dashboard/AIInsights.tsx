'use client'
// components/dashboard/AIInsights.tsx — Cached AI insights with regenerate button

import { useState, useEffect, useCallback } from 'react'
import type { InsightCard } from '@/types/analytics'

interface Props {
  password: string
}

interface CachedInsights {
  insights: InsightCard[] | null
  generated_at: string | null
}

export default function AIInsights({ password }: Props) {
  const [state, setState] = useState<CachedInsights>({ insights: null, generated_at: null })
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/insights', {
        headers: { 'x-dashboard-password': password },
      })
      const data = await res.json()
      setState({ insights: data.insights, generated_at: data.generated_at ?? null })
    } catch {
      setError('Failed to load insights')
    } finally {
      setLoading(false)
    }
  }, [password])

  useEffect(() => { fetchInsights() }, [fetchInsights])

  const regenerate = async () => {
    setRegenerating(true)
    setError(null)
    try {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'x-dashboard-password': password },
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setState({ insights: data.insights, generated_at: data.generated_at })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate')
    } finally {
      setRegenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-warm/40 text-[10px] tracking-widest uppercase">AI Insights</p>
          {state.generated_at && (
            <p className="text-warm/25 text-xs mt-0.5">
              Generated {new Date(state.generated_at).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
              })}
            </p>
          )}
        </div>
        <button
          onClick={regenerate}
          disabled={regenerating}
          className="text-sm px-4 py-1.5 border border-terracotta/60 text-terracotta rounded-full hover:bg-terracotta hover:text-background transition-all duration-200 disabled:opacity-40"
        >
          {regenerating ? 'Generating…' : 'Regenerate'}
        </button>
      </div>

      {error && (
        <p className="text-red-400/70 text-sm">{error}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-warm/5 rounded-2xl p-6 animate-pulse h-32" />
          ))}
        </div>
      ) : state.insights && state.insights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {state.insights.map((card, i) => (
            <div key={i} className="bg-surface border border-terracotta/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{card.icon}</span>
                <h3 className="font-serif text-lg text-cream">{card.title}</h3>
              </div>
              <p className="text-warm/65 text-sm leading-relaxed mb-3">{card.body}</p>
              <p className="text-terracotta text-xs tracking-wide">{card.metric}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-warm/30 text-sm mb-4">No insights generated yet.</p>
          <p className="text-warm/20 text-xs">Click &ldquo;Regenerate&rdquo; to generate AI insights from your analytics data.</p>
        </div>
      )}
    </div>
  )
}
