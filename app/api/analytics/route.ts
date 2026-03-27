// app/api/analytics/route.ts
// Aggregates event data for the dashboard and insights pages.
// Protected by x-dashboard-password header.

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type {
  AnalyticsData,
  PageViewsByDay,
  PageViewsByPath,
  ScrollDepthData,
  EasterEggCount,
  NavClickData,
  SessionSummary,
  SectionViewData,
} from '@/types/analytics'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-dashboard-password')
  if (password !== process.env.DASHBOARD_PASSWORD) return unauthorized()

  try {
    // Fetch all events in parallel
    const [
      allPageViews,
      allPageExits,
      allScrollDepth,
      allEasterEggs,
      allNavClicks,
      allSectionViews,
    ] = await Promise.all([
      supabaseAdmin.from('page_events').select('page_path,session_id,created_at').eq('event_name', 'page_view'),
      supabaseAdmin.from('page_events').select('page_path,metadata,session_id').eq('event_name', 'page_exit'),
      supabaseAdmin.from('page_events').select('metadata,session_id').eq('event_name', 'scroll_depth'),
      supabaseAdmin.from('page_events').select('metadata,session_id,created_at').eq('event_name', 'easter_egg'),
      supabaseAdmin.from('page_events').select('metadata,session_id').eq('event_name', 'nav_click'),
      supabaseAdmin.from('page_events').select('metadata,session_id').eq('event_name', 'section_view'),
    ])

    const pageViews = allPageViews.data ?? []
    const pageExits = allPageExits.data ?? []
    const scrollDepthEvents = allScrollDepth.data ?? []
    const easterEggEvents = allEasterEggs.data ?? []
    const navClickEvents = allNavClicks.data ?? []
    const sectionViewEvents = allSectionViews.data ?? []

    // ── Unique sessions + session filter ─────────────────────────────────────
    const allSessions = await supabaseAdmin.from('page_events').select('session_id,page_path,created_at,event_name,metadata').order('created_at', { ascending: false }).limit(5000)
    const allEvents = allSessions.data ?? []

    // Filter out sessions shorter than 5 seconds (likely bots or accidental hits)
    const SESSION_MIN_MS = 5000
    const sessionBounds = new Map<string, { first: number; last: number }>()
    for (const ev of allEvents) {
      const t = new Date(ev.created_at).getTime()
      const b = sessionBounds.get(ev.session_id)
      if (!b) sessionBounds.set(ev.session_id, { first: t, last: t })
      else { if (t < b.first) b.first = t; if (t > b.last) b.last = t }
    }
    const validSessionIds = new Set(
      Array.from(sessionBounds.entries())
        .filter(([, b]) => b.last - b.first >= SESSION_MIN_MS)
        .map(([id]) => id)
    )
    const filteredEvents       = allEvents.filter(e => validSessionIds.has(e.session_id))
    const filteredPageViews    = pageViews.filter(e => validSessionIds.has(e.session_id))
    const filteredPageExits    = pageExits.filter(e => validSessionIds.has(e.session_id))
    const filteredScrollDepth  = scrollDepthEvents.filter(e => validSessionIds.has(e.session_id))
    const filteredEasterEggs   = easterEggEvents.filter(e => validSessionIds.has(e.session_id))
    const filteredNavClicks    = navClickEvents.filter(e => validSessionIds.has(e.session_id))
    const filteredSectionViews = sectionViewEvents.filter(e => validSessionIds.has(e.session_id))

    const unique_sessions = validSessionIds.size
    const total_views = filteredPageViews.length

    // ── Page views by day (last 30 days) ──────────────────────────────────────
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const viewsByDayMap = new Map<string, number>()
    for (const ev of filteredPageViews) {
      if (!ev.created_at) continue
      const d = new Date(ev.created_at)
      if (d < thirtyDaysAgo) continue
      const day = d.toISOString().slice(0, 10)
      viewsByDayMap.set(day, (viewsByDayMap.get(day) ?? 0) + 1)
    }
    const page_views_by_day: PageViewsByDay[] = Array.from(viewsByDayMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([day, views]) => ({ day, views }))

    // ── Page views by path ────────────────────────────────────────────────────
    const viewsByPathMap = new Map<string, number>()
    for (const ev of filteredPageViews) {
      viewsByPathMap.set(ev.page_path, (viewsByPathMap.get(ev.page_path) ?? 0) + 1)
    }
    const page_views_by_path: PageViewsByPath[] = Array.from(viewsByPathMap.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([page_path, views]) => ({ page_path, views }))

    // ── Scroll depth distribution ─────────────────────────────────────────────
    const depthMap = new Map<number, number>()
    for (const ev of filteredScrollDepth) {
      const depth = ev.metadata?.depth as number
      if ([25, 50, 75, 100].includes(depth)) {
        depthMap.set(depth, (depthMap.get(depth) ?? 0) + 1)
      }
    }
    const scroll_depth_distribution: ScrollDepthData[] = [25, 50, 75, 100].map((depth) => ({
      depth: depth as 25 | 50 | 75 | 100,
      count: depthMap.get(depth) ?? 0,
    }))

    // ── Easter egg counts ─────────────────────────────────────────────────────
    const eggMap = new Map<string, number>()
    for (const ev of filteredEasterEggs) {
      const type = ev.metadata?.type as string
      if (type) eggMap.set(type, (eggMap.get(type) ?? 0) + 1)
    }

    const easter_egg_counts: EasterEggCount[] = Array.from(eggMap.entries())
      .map(([type, count]) => ({ type, count }))

    // ── Avg time by path ──────────────────────────────────────────────────────
    const timeByPath = new Map<string, number[]>()
    for (const ev of filteredPageExits) {
      const secs = ev.metadata?.time_spent_seconds as number
      if (typeof secs === 'number' && secs >= 0) {
        const arr = timeByPath.get(ev.page_path) ?? []
        arr.push(secs)
        timeByPath.set(ev.page_path, arr)
      }
    }
    const avg_time_by_path = Array.from(timeByPath.entries()).map(([page_path, times]) => ({
      page_path,
      avg_seconds: Math.round(times.reduce((a, b) => a + b, 0) / times.length),
    }))

    // ── Nav clicks ────────────────────────────────────────────────────────────
    const navMap = new Map<string, number>()
    for (const ev of filteredNavClicks) {
      const dest = ev.metadata?.destination as string
      if (dest) navMap.set(dest, (navMap.get(dest) ?? 0) + 1)
    }
    const nav_clicks: NavClickData[] = Array.from(navMap.entries())
      .sort(([, a], [, b]) => b - a)
      .map(([destination, clicks]) => ({ destination, clicks }))

    // ── Section views ─────────────────────────────────────────────────────────
    const sectionMap = new Map<string, number>()
    for (const ev of filteredSectionViews) {
      const section = ev.metadata?.section as string
      if (section) sectionMap.set(section, (sectionMap.get(section) ?? 0) + 1)
    }
    const section_views: SectionViewData[] = Array.from(sectionMap.entries())
      .map(([section, count]) => ({ section, count }))

    // ── Recent sessions ───────────────────────────────────────────────────────
    const sessionDataMap = new Map<string, {
      first_seen: string
      last_seen: string
      pages: Set<string>
      event_count: number
    }>()

    for (const ev of filteredEvents) {
      const sid = ev.session_id
      if (!sessionDataMap.has(sid)) {
        sessionDataMap.set(sid, {
          first_seen: ev.created_at,
          last_seen: ev.created_at,
          pages: new Set(),
          event_count: 0,
        })
      }
      const s = sessionDataMap.get(sid)!
      s.event_count++
      if (ev.page_path) s.pages.add(ev.page_path)
      if (ev.created_at < s.first_seen) s.first_seen = ev.created_at
      if (ev.created_at > s.last_seen) s.last_seen = ev.created_at
    }

    const recent_sessions: SessionSummary[] = Array.from(sessionDataMap.entries())
      .sort(([, a], [, b]) => b.last_seen.localeCompare(a.last_seen))
      .slice(0, 50)
      .map(([session_id, s]) => ({
        session_id,
        first_seen: s.first_seen,
        last_seen: s.last_seen,
        event_count: s.event_count,
        pages_visited: Array.from(s.pages),
      }))

    const data: AnalyticsData = {
      page_views_by_day,
      page_views_by_path,
      unique_sessions,
      total_views,
      scroll_depth_distribution,
      easter_egg_counts,
      avg_time_by_path,
      nav_clicks,
      recent_sessions,
      section_views,
      last_updated: new Date().toISOString(),
    }

    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'no-store' },
    })
  } catch (err) {
    console.error('[analytics/analytics] Error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
