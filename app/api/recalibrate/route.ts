// app/api/recalibrate/route.ts
// Sends this week's performance data to Claude and returns a recalibration plan as JSON.

import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are a running coach and strength trainer helping Abhi prepare for the Monterey Half Marathon on November 8, 2026. His goal is a sub-2:00 finish (9:09/mile pace).

Key context about Abhi:
- He has a jumper's knee injury (patellar tendinopathy) that is healing but still causes mild discomfort on some movements
- Current base: consistently running 5-8 miles, 2x per week
- He lifts full body 3x/week (Day A: Power, Day B: Strength, Day C: Hypertrophy)
- In weeks 17-22 lifting drops to 2x/week
- In week 23 lifting drops to 1x/week
- Race week (24): no lifting at all
- He logs workouts weekly and recalibrates at the end of each week

Recalibration philosophy — be conservative:
- Your default answer is NO CHANGES. An empty adjustments array is correct and preferred for minor deviations.
- Only suggest adjustments if the week's deficit meaningfully threatens the sub-2:00 goal given where Abhi is in the 24-week plan.
- Threshold for making changes: total miles logged must be below 60% of the weekly target AND at least one key session (long run or tempo run) must have been missed. Skipping a single easy run while completing everything else = on_track, no adjustments.
- In early weeks (1-8), small deficits are not a concern — the body is still building base fitness and minor misses are normal. Lean toward on_track unless the deficit is large.
- When adjustments are warranted, minimize scope: prefer changing 1 future week before considering 2-3. Make the smallest change that keeps the goal achievable.
- Never include an adjustment for the current week being reviewed or any past week. Only weekNumber values strictly greater than the current week are valid.

Hard rules you must always follow:
- Never increase any single week by more than 10% above its originally planned miles
- Never suggest more than 4 running days in any single week
- Never suggest running and lifting on the same day
- If ahead of plan, return on_track with no adjustments — do not accelerate
- Never touch taper weeks 21-24 regardless of deficit

Respond ONLY with valid JSON in exactly this format, no prose before or after:

{
  "summary": "2-3 sentence plain English summary of the week and what is changing",
  "status": "on_track | slightly_behind | behind | ahead",
  "adjustments": [
    {
      "weekNumber": <integer>,
      "field": "target_weekly_miles | planned_runs | note",
      "oldValue": "<original value as string>",
      "newValue": "<adjusted value as string>",
      "reason": "one sentence explanation"
    }
  ],
  "coachNote": "A direct, motivational 1-2 sentence note addressed to Abhi"
}`

function buildUserMessage(
  weekNumber: number,
  weekLogs: Array<{
    log_date: string
    workout_type: string
    status: string
    miles?: number | null
    pace?: string | null
    lift_day?: string | null
  }>,
  trainingPlan: Array<{
    week_number: number
    week_start_date: string
    phase: string
    planned_runs: Array<{ day: string; type: string; miles: number; pace_zone: string }>
    planned_lifts: Array<{ day: string; workout: string }>
    target_weekly_miles: number
  }>
): string {
  const currentWeek = trainingPlan.find((w) => w.week_number === weekNumber)
  if (!currentWeek) return ''

  const weekStart = new Date(currentWeek.week_start_date)
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const runLogs = weekLogs.filter((l) => l.workout_type === 'run')
  const liftLogs = weekLogs.filter((l) => l.workout_type === 'lift')
  const completedRuns = runLogs.filter((l) => l.status === 'completed')
  const skippedRuns = runLogs.filter((l) => l.status === 'skipped')
  const completedLifts = liftLogs.filter((l) => l.status === 'completed')
  const skippedLifts = liftLogs.filter((l) => l.status === 'skipped')
  const totalMiles = completedRuns.reduce((s, l) => s + (l.miles ?? 0), 0)

  const formatRun = (l: typeof runLogs[0]) =>
    l.status === 'completed'
      ? `${l.log_date}: ${l.miles} mi @ ${l.pace}/mi`
      : `${l.log_date}: SKIPPED`

  const formatLift = (l: typeof liftLogs[0]) =>
    l.status === 'completed' ? `${l.log_date}: Day ${l.lift_day}` : `${l.log_date}: SKIPPED`

  const upcomingWeeks = trainingPlan
    .filter((w) => w.week_number > weekNumber && w.week_number <= weekNumber + 3)
    .map((w) => JSON.stringify(w))
    .join('\n')

  return `Week ${weekNumber} Performance Summary (${fmt(weekStart)} - ${fmt(weekEnd)}):

PLANNED:
- Target miles: ${currentWeek.target_weekly_miles}
- Planned runs: ${currentWeek.planned_runs.map((r) => `${r.day} ${r.type} ${r.miles}mi`).join(', ')}
- Planned lifts: ${currentWeek.planned_lifts.map((l) => `${l.day} Day ${l.workout}`).join(', ')}

COMPLETED:
- Runs logged: ${completedRuns.length > 0 ? completedRuns.map(formatRun).join('; ') : 'none'}
- Lifts logged: ${completedLifts.length > 0 ? completedLifts.map(formatLift).join('; ') : 'none'}
- Total miles this week: ${totalMiles.toFixed(1)}

SKIPPED:
- Runs skipped: ${skippedRuns.length > 0 ? skippedRuns.map(formatRun).join('; ') : 'none'}
- Lifts skipped: ${skippedLifts.length > 0 ? skippedLifts.map(formatLift).join('; ') : 'none'}

UPCOMING PLAN (weeks ${weekNumber + 1} through ${weekNumber + 3}):
${upcomingWeeks}

Based on this week's performance, recalibrate my upcoming plan as needed.`
}

export async function POST(req: Request) {
  let body: {
    weekNumber: number
    weekLogs: Parameters<typeof buildUserMessage>[1]
    trainingPlan: Parameters<typeof buildUserMessage>[2]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { weekNumber, weekLogs, trainingPlan } = body

  if (!weekNumber || !weekLogs || !trainingPlan) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const userMessage = buildUserMessage(weekNumber, weekLogs, trainingPlan)

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userMessage }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      return NextResponse.json({ error: 'AI returned invalid JSON', raw: text }, { status: 502 })
    }

    return NextResponse.json(parsed)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
