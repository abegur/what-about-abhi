// app/api/exercise-tracker/plan-update/route.ts
// Applies AI recalibration adjustments to training_plan rows and inserts a recalibration_log entry.

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

interface Adjustment {
  weekNumber: number
  field: 'target_weekly_miles' | 'planned_runs' | 'note'
  oldValue: string
  newValue: string
  reason: string
}

export async function PATCH(req: Request) {
  let body: {
    weekNumber: number
    updates: Adjustment[]
    summaryInput: Record<string, unknown>
    aiResponse: string
    adjustmentsApplied: Adjustment[]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { weekNumber, updates, summaryInput, aiResponse, adjustmentsApplied } = body

  // Apply each adjustment to the relevant training_plan row
  for (const update of updates) {
    const patch: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
      is_recalibrated: true,
    }

    if (update.field === 'target_weekly_miles') {
      const parsed = parseFloat(update.newValue)
      if (!isNaN(parsed)) patch.target_weekly_miles = parsed
    } else if (update.field === 'planned_runs') {
      try {
        patch.planned_runs = JSON.parse(update.newValue)
      } catch {
        patch.recalibration_notes = `Planned runs update: ${update.newValue}`
      }
    } else if (update.field === 'note') {
      patch.recalibration_notes = update.newValue
    }

    const { error } = await supabaseAdmin
      .from('training_plan')
      .update(patch)
      .eq('week_number', update.weekNumber)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
  }

  // Record this recalibration event
  const { error: logError } = await supabaseAdmin.from('recalibration_log').insert({
    week_number: weekNumber,
    summary_input: summaryInput,
    ai_response: aiResponse,
    adjustments_applied: adjustmentsApplied,
  })

  if (logError) {
    return NextResponse.json({ error: logError.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
