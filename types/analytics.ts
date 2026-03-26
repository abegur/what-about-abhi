// types/analytics.ts — Shared TypeScript types for the analytics system

export type EventName =
  | 'page_view'
  | 'page_exit'
  | 'nav_click'
  | 'contact_open'
  | 'scroll_depth'
  | 'section_view'
  | 'easter_egg'
  | 'what_is_this_visit'

export interface TrackingEvent {
  id?: string
  event_name: EventName
  page_path: string
  session_id: string
  metadata: Record<string, unknown>
  created_at?: string
}

export interface PageViewsByDay {
  day: string
  views: number
}

export interface PageViewsByPath {
  page_path: string
  views: number
}

export interface ScrollDepthData {
  depth: 25 | 50 | 75 | 100
  count: number
}

export interface EasterEggCount {
  type: string
  count: number
}

export interface SessionSummary {
  session_id: string
  first_seen: string
  last_seen: string
  event_count: number
  pages_visited: string[]
}

export interface NavClickData {
  destination: string
  clicks: number
}

export interface SectionViewData {
  section: string
  count: number
}

export interface AnalyticsData {
  page_views_by_day: PageViewsByDay[]
  page_views_by_path: PageViewsByPath[]
  unique_sessions: number
  total_views: number
  scroll_depth_distribution: ScrollDepthData[]
  easter_egg_counts: EasterEggCount[]
  avg_time_by_path: Array<{ page_path: string; avg_seconds: number }>
  nav_clicks: NavClickData[]
  recent_sessions: SessionSummary[]
  section_views: SectionViewData[]
  last_updated: string
}

export interface InsightCard {
  title: string
  body: string
  metric: string
  icon: string
}
