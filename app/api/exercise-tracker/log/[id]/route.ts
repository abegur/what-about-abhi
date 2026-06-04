// app/api/exercise-tracker/log/[id]/route.ts
// PATCH — update a specific workout log. DELETE — remove it.

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { log_date, status, miles, pace, lift_day, run_type } = body

  const patch: Record<string, unknown> = {}
  if (log_date !== undefined) patch.log_date = log_date
  if (status !== undefined) patch.status = status
  if (miles !== undefined) patch.miles = miles
  if (pace !== undefined) patch.pace = pace
  if (lift_day !== undefined) patch.lift_day = lift_day
  if (run_type !== undefined) patch.run_type = run_type

  const { error } = await supabaseAdmin
    .from('workout_logs')
    .update(patch)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params

  const { error } = await supabaseAdmin
    .from('workout_logs')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
