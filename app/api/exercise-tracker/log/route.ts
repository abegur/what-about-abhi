// app/api/exercise-tracker/log/route.ts
// Inserts a single workout log entry (run or lift).

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { log_date, week_number, workout_type, status, miles, pace, lift_day } = body

  if (!log_date || !week_number || !workout_type || !status) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!['run', 'lift'].includes(workout_type as string)) {
    return NextResponse.json({ error: 'workout_type must be run or lift' }, { status: 400 })
  }

  if (!['completed', 'skipped'].includes(status as string)) {
    return NextResponse.json({ error: 'status must be completed or skipped' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('workout_logs').insert({
    log_date,
    week_number,
    workout_type,
    status,
    miles: miles ?? null,
    pace: pace ?? null,
    lift_day: lift_day ?? null,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
