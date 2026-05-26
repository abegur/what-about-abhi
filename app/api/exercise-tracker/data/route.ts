// app/api/exercise-tracker/data/route.ts
// Returns full training plan + recent workout logs for the /exercise-tracker page.

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const [planRes, logsRes] = await Promise.all([
    supabaseAdmin
      .from('training_plan')
      .select('*')
      .order('week_number', { ascending: true }),
    supabaseAdmin
      .from('workout_logs')
      .select('*')
      .order('log_date', { ascending: false })
      .limit(50),
  ])

  if (planRes.error) {
    return NextResponse.json({ error: planRes.error.message }, { status: 500 })
  }
  if (logsRes.error) {
    return NextResponse.json({ error: logsRes.error.message }, { status: 500 })
  }

  return NextResponse.json({
    trainingPlan: planRes.data,
    workoutLogs: logsRes.data,
  })
}
