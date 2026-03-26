// lib/insightsHelpers.ts
// Generates deterministic InsightCard[] from AnalyticsData.
// Runs client-side after fetching analytics — no AI needed for public /insights page.

import type { AnalyticsData, InsightCard } from '@/types/analytics'

function formatPath(path: string) {
  if (path === '/') return 'Home'
  return path.replace('/', '').replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export function generateInsights(data: AnalyticsData): InsightCard[] {
  const cards: InsightCard[] = []

  // 1. Most visited page insight
  const topPage = data.page_views_by_path[0]
  if (topPage && data.total_views > 0) {
    const pct = Math.round((topPage.views / data.total_views) * 100)
    const pageName = formatPath(topPage.page_path)
    const bodyMap: Record<string, string> = {
      'Projects': 'Engineers and PMs care most about what you\'ve shipped. The Projects page is consistently where people spend the most time — a strong signal that work speaks louder than a résumé.',
      'Experience': 'People want to understand your career arc. The Experience page is the most-visited, suggesting visitors are orienting themselves before diving into the details.',
      'Home': 'Most visitors are forming their first impression and not navigating further. The home page headline and hero section is doing the heavy lifting.',
    }
    cards.push({
      title: `${pageName} leads traffic`,
      body: bodyMap[pageName] ?? `${pageName} draws the most visitors — ${pct}% of all page views land there.`,
      metric: `${topPage.views.toLocaleString()} views (${pct}% of total)`,
      icon: '📊',
    })
  }

  // 2. Scroll depth insight (home page)
  const depth75 = data.scroll_depth_distribution.find((d) => d.depth === 75)
  const depth25 = data.scroll_depth_distribution.find((d) => d.depth === 25)
  if (depth25 && depth25.count > 0) {
    const scrollRate = depth75 && depth25.count > 0
      ? Math.round((depth75.count / depth25.count) * 100)
      : 0
    cards.push({
      title: 'The fold isn\'t a wall',
      body: scrollRate > 50
        ? `More than half of visitors who scroll at all make it 75% down the home page. The content is holding attention.`
        : `About ${scrollRate}% of home page visitors scroll past the fold — there may be room to hook people earlier.`,
      metric: `${scrollRate}% of scrollers reach 75% depth`,
      icon: '📜',
    })
  }

  // 3. Easter egg insight
  const totalEggs = data.easter_egg_counts.reduce((sum, e) => sum + e.count, 0)
  if (totalEggs > 0 && data.unique_sessions > 0) {
    const hardestEgg = [...data.easter_egg_counts].sort((a, b) => a.count - b.count)[0]
    const eggLabels: Record<string, string> = {
      hover_name_trick: 'the 3-second name hover',
      hidden_dot: 'the hidden bottom-right dot',
      bottom_message: 'the footer scroll message',
      what_is_this_visit: 'the What Is This? page',
    }
    const hardestLabel = hardestEgg ? (eggLabels[hardestEgg.type] ?? hardestEgg.type) : 'the hidden dot'
    cards.push({
      title: 'Hidden things get found',
      body: `The easter eggs have been discovered ${totalEggs} times across all visitors. The hardest to find? ${hardestLabel} — which tells you something about how people explore this site.`,
      metric: `${totalEggs} total egg triggers across ${data.unique_sessions} sessions`,
      icon: '🥚',
    })
  }

  // 4. Sessions / repeat visits
  if (data.unique_sessions > 0) {
    const avgPagesPerSession = data.total_views > 0
      ? (data.total_views / data.unique_sessions).toFixed(1)
      : '1.0'
    cards.push({
      title: 'Visitors explore',
      body: parseFloat(avgPagesPerSession) > 1.5
        ? `On average, visitors hit more than one page — they\'re not just bouncing off the home page. Multi-page sessions suggest genuine curiosity about the work.`
        : `Most visitors land and browse one section before leaving. The navigation is there — getting them to click through is the next challenge.`,
      metric: `~${avgPagesPerSession} page views per session`,
      icon: '🗺️',
    })
  }

  // 5. What-is-this insight (if any visits)
  const whatIsThis = data.page_views_by_path.find((p) => p.page_path === '/what-is-this')
  if (whatIsThis && data.total_views > 0) {
    const pct = Math.round((whatIsThis.views / data.total_views) * 100)
    cards.push({
      title: 'Meta curiosity is real',
      body: `${pct}% of page views land on the "What Is This?" page — visitors are curious about the reasoning behind the portfolio, not just the work itself. That\'s a good sign.`,
      metric: `${whatIsThis.views.toLocaleString()} visits to /what-is-this`,
      icon: '🤔',
    })
  }

  return cards.slice(0, 5)
}
