// app/exercise-tracker/types.ts

export interface PlannedRun {
  day: string
  type: 'easy' | 'tempo' | 'long' | 'race_pace'
  miles: number
  pace_zone: string
}

export interface PlannedLift {
  day: string
  workout: 'A' | 'B' | 'C'
}

export interface TrainingPlan {
  id: string
  week_number: number
  week_start_date: string
  phase: 'base' | 'build' | 'peak' | 'taper' | 'race'
  planned_runs: PlannedRun[]
  planned_lifts: PlannedLift[]
  target_weekly_miles: number
  is_recalibrated: boolean
  recalibration_notes: string | null
  created_at: string
  updated_at: string
}

export interface WorkoutLog {
  id: string
  log_date: string
  week_number: number
  workout_type: 'run' | 'lift'
  status: 'completed' | 'skipped'
  miles: number | null
  pace: string | null
  lift_day: string | null
  created_at: string
}

export interface RecalibrationLog {
  id: string
  triggered_at: string
  week_number: number
  summary_input: Record<string, unknown>
  ai_response: string
  adjustments_applied: Record<string, unknown> | null
}

export interface ExerciseTrackerData {
  trainingPlan: TrainingPlan[]
  workoutLogs: WorkoutLog[]
}

export interface RecalibrateAdjustment {
  weekNumber: number
  field: 'target_weekly_miles' | 'planned_runs' | 'note'
  oldValue: string
  newValue: string
  reason: string
}

export interface RecalibrateResult {
  summary: string
  status: 'on_track' | 'slightly_behind' | 'behind' | 'ahead'
  adjustments: RecalibrateAdjustment[]
  coachNote: string
}

// Utility: parse a YYYY-MM-DD string as local time (avoids UTC offset shifting the day)
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Utility: find the training plan row that contains today's date
export function getCurrentWeek(trainingPlan: TrainingPlan[]): TrainingPlan | null {
  const now = new Date()
  return (
    trainingPlan.find((w) => {
      const start = parseLocalDate(w.week_start_date)
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000)
      return now >= start && now < end
    }) ?? null
  )
}

// Utility: sum miles logged for a given week number
export function weekActualMiles(weekNumber: number, workoutLogs: WorkoutLog[]): number {
  return workoutLogs
    .filter((l) => l.week_number === weekNumber && l.workout_type === 'run' && l.status === 'completed')
    .reduce((sum, l) => sum + (l.miles ?? 0), 0)
}

// Utility: days until Nov 8, 2026 from today
export function daysUntilRace(): number {
  const race = new Date(2026, 10, 8) // Nov 8, local time
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  race.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round((race.getTime() - now.getTime()) / (24 * 60 * 60 * 1000)))
}

export const PHASE_LABELS: Record<TrainingPlan['phase'], string> = {
  base: 'Base',
  build: 'Build',
  peak: 'Peak',
  taper: 'Taper',
  race: 'Race',
}

export const PHASE_COLORS: Record<TrainingPlan['phase'], string> = {
  base: '#3b82f6',
  build: '#22c55e',
  peak: '#f97316',
  taper: '#eab308',
  race: '#c4703f',
}
