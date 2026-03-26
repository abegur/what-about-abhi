// app/api/insights/route.ts
// GET: return cached AI insights from Supabase
// POST: generate new insights via Claude API, cache, and return
// Protected by x-dashboard-password header.

import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabaseAdmin } from '@/lib/supabase'

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

function checkAuth(req: NextRequest) {
  return req.headers.get('x-dashboard-password') === process.env.DASHBOARD_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized()

  try {
    const { data } = await supabaseAdmin
      .from('ai_insights_cache')
      .select('content,generated_at')
      .order('generated_at', { ascending: false })
      .limit(1)
      .single()

    if (!data) return NextResponse.json({ insights: null })

    return NextResponse.json({
      insights: JSON.parse(data.content),
      generated_at: data.generated_at,
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch {
    return NextResponse.json({ insights: null })
  }
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return unauthorized()
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY not configured' }, { status: 500 })
  }

  try {
    // Fetch analytics data
    const analyticsRes = await fetch(new URL('/api/analytics', req.url), {
      headers: { 'x-dashboard-password': process.env.DASHBOARD_PASSWORD! },
    })
    const analyticsData = await analyticsRes.json()

    // Build summary for the prompt
    const summary = {
      total_views: analyticsData.total_views,
      unique_sessions: analyticsData.unique_sessions,
      top_pages: analyticsData.page_views_by_path?.slice(0, 5),
      easter_egg_counts: analyticsData.easter_egg_counts,
      scroll_depth: analyticsData.scroll_depth_distribution,
      avg_time_by_path: analyticsData.avg_time_by_path,
      nav_clicks: analyticsData.nav_clicks?.slice(0, 6),
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: `You are a product analyst writing insights for a personal portfolio website owned by Abhi Begur, a software engineer in test who is trying to move into product management or solutions engineering.

Here are the site analytics:
${JSON.stringify(summary, null, 2)}

Write exactly 4 insight cards. Each card should:
- Have a short, punchy title (5 words max)
- Have 1-2 sentences of narrative insight that tells a story (not just a number restatement)
- Include a metric callout (a specific number or percentage)
- Include a relevant emoji icon

The tone should be: human, curious, product-minded. Think like a PM writing for a recruiter audience.

Respond ONLY with a valid JSON array (no markdown, no explanation):
[{"title": "...", "body": "...", "metric": "...", "icon": "..."}]`,
        },
      ],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : '[]'
    const insights = JSON.parse(rawText)

    // Cache in Supabase
    await supabaseAdmin.from('ai_insights_cache').insert({
      content: JSON.stringify(insights),
    })

    return NextResponse.json({
      insights,
      generated_at: new Date().toISOString(),
    }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (err) {
    console.error('[insights] Error generating insights:', err)
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 })
  }
}
