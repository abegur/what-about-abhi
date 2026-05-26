'use client'
// LogLiftForm.tsx — Modal form for logging or editing a lift session.
// Bottom sheet on mobile, centered modal on desktop.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface InitialValues {
  date: string
  status: 'completed' | 'skipped'
  liftDay: 'A' | 'B' | 'C'
}

interface Props {
  weekNumber: number
  onSubmit: () => void
  onClose: () => void
  logId?: string           // present in edit mode
  initialValues?: InitialValues
}

const LIFT_LABELS: Record<'A' | 'B' | 'C', { title: string; sub: string }> = {
  A: { title: 'Day A', sub: 'Power' },
  B: { title: 'Day B', sub: 'Strength' },
  C: { title: 'Day C', sub: 'Hypertrophy' },
}

export default function LogLiftForm({ weekNumber, onSubmit, onClose, logId, initialValues }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const isEdit = !!logId

  const [date, setDate] = useState(initialValues?.date ?? today)
  const [liftDay, setLiftDay] = useState<'A' | 'B' | 'C'>(initialValues?.liftDay ?? 'A')
  const [status, setStatus] = useState<'completed' | 'skipped'>(initialValues?.status ?? 'completed')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const payload = {
      log_date: date,
      week_number: weekNumber,
      workout_type: 'lift',
      status,
      lift_day: liftDay,
    }

    try {
      const url = isEdit
        ? `/api/exercise-tracker/log/${logId}`
        : '/api/exercise-tracker/log'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to save lift')
      }
      onSubmit()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

        {/* Sheet */}
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-md bg-surface border border-warm/10 rounded-t-2xl sm:rounded-2xl p-6 pb-10 sm:pb-6 max-h-[92vh] overflow-y-auto"
        >
          {/* Handle bar (mobile only) */}
          <div className="w-10 h-1 bg-warm/15 rounded-full mx-auto mb-5 sm:hidden" />

          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-0.5">
                {isEdit ? 'Edit Lift' : 'Log Lift'}
              </p>
              <p className="text-warm/40 text-xs">Week {weekNumber}</p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full border border-warm/10 text-warm/40 hover:text-warm/70 transition-colors"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Status toggle */}
            <div>
              <p className="text-[11px] text-warm/40 tracking-widest uppercase mb-2">Status</p>
              <div className="flex gap-2">
                {(['completed', 'skipped'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStatus(s)}
                    className={`flex-1 py-3 rounded-xl text-sm capitalize font-medium transition-colors duration-200 ${
                      status === s
                        ? s === 'completed'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : 'bg-background border border-warm/10 text-warm/40'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <p className="text-[11px] text-warm/40 tracking-widest uppercase mb-2">Date</p>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-background border border-warm/10 focus:border-terracotta/50 rounded-xl px-4 py-3.5 text-warm outline-none text-base transition-colors duration-200"
              />
            </div>

            {/* Lift day selector */}
            <div>
              <p className="text-[11px] text-warm/40 tracking-widest uppercase mb-2">Workout</p>
              <div className="grid grid-cols-3 gap-2">
                {(['A', 'B', 'C'] as const).map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setLiftDay(day)}
                    className={`py-3.5 px-3 rounded-xl text-sm text-center transition-colors duration-200 ${
                      liftDay === day
                        ? 'bg-terracotta/15 text-terracotta border border-terracotta/30'
                        : 'bg-background border border-warm/10 text-warm/50'
                    }`}
                  >
                    <span className="block font-medium">{LIFT_LABELS[day].title}</span>
                    <span className="block text-[11px] opacity-60 mt-0.5">{LIFT_LABELS[day].sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-400/70 text-sm">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 border border-warm/10 text-warm/40 rounded-xl text-sm hover:border-warm/20 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3.5 bg-terracotta text-background rounded-xl text-sm font-medium hover:bg-terracotta/90 disabled:opacity-50 transition-colors duration-200"
              >
                {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Save Lift'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
