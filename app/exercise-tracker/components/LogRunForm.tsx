'use client'
// LogRunForm.tsx — Modal form for logging or editing a run.
// Bottom sheet on mobile, centered modal on desktop.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { PlannedRun } from '../types'

const RUN_TYPE_LABELS: Record<string, string> = {
  easy: 'Easy Run',
  tempo: 'Tempo Run',
  long: 'Long Run',
  race_pace: 'Race Pace',
}

interface InitialValues {
  date: string
  status: 'completed' | 'skipped'
  miles: string
  pace: string
  runType?: string
}

interface Props {
  weekNumber: number
  plannedRuns?: PlannedRun[]
  onSubmit: () => void
  onClose: () => void
  logId?: string
  initialValues?: InitialValues
}

function parsePace(pace: string): { min: string; sec: string } {
  const [min = '', sec = ''] = pace.split(':')
  return { min, sec }
}

export default function LogRunForm({ weekNumber, plannedRuns, onSubmit, onClose, logId, initialValues }: Props) {
  const today = new Date().toISOString().split('T')[0]
  const isEdit = !!logId

  const initPace = parsePace(initialValues?.pace ?? '')

  const [date, setDate] = useState(initialValues?.date ?? today)
  const [miles, setMiles] = useState(initialValues?.miles ?? '')
  const [paceMin, setPaceMin] = useState(initPace.min)
  const [paceSec, setPaceSec] = useState(initPace.sec)
  const [paceError, setPaceError] = useState(false)
  const [runType, setRunType] = useState(initialValues?.runType ?? '')
  const [status, setStatus] = useState<'completed' | 'skipped'>(initialValues?.status ?? 'completed')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buildPace = (): string | null => {
    if (!paceMin) return null
    const sec = paceSec.padStart(2, '0')
    return `${paceMin}:${sec}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (status === 'completed' && paceMin) {
      const min = parseInt(paceMin, 10)
      const sec = parseInt(paceSec || '0', 10)
      if (isNaN(min) || min < 1 || min > 99 || isNaN(sec) || sec < 0 || sec > 59) {
        setPaceError(true)
        return
      }
    }

    setSubmitting(true)
    setError(null)

    const payload = {
      log_date: date,
      week_number: weekNumber,
      workout_type: 'run',
      status,
      miles: status === 'completed' ? parseFloat(miles) || null : null,
      pace: status === 'completed' ? buildPace() : null,
      run_type: runType || null,
    }

    try {
      const url = isEdit ? `/api/exercise-tracker/log/${logId}` : '/api/exercise-tracker/log'
      const method = isEdit ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'Failed to save run')
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
                {isEdit ? 'Edit Run' : 'Log Run'}
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
            {/* Run type selector */}
            {plannedRuns && plannedRuns.length > 0 && (
              <div>
                <p className="text-[11px] text-warm/40 tracking-widest uppercase mb-2">Which Run</p>
                <div className="space-y-2">
                  {plannedRuns.map((run) => {
                    const selected = runType === run.type
                    return (
                      <button
                        key={run.type}
                        type="button"
                        onClick={() => setRunType(run.type)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-colors duration-200 border ${
                          selected
                            ? 'bg-terracotta/10 text-terracotta border-terracotta/30'
                            : 'bg-background border-warm/10 text-warm/50 hover:border-warm/20'
                        }`}
                      >
                        <span className="font-medium">{RUN_TYPE_LABELS[run.type] ?? run.type}</span>
                        <span className={`text-xs ${selected ? 'text-terracotta/70' : 'text-warm/30'}`}>
                          {run.miles} mi · {run.pace_zone}/mi
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

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

            {status === 'completed' && (
              <>
                {/* Miles */}
                <div>
                  <p className="text-[11px] text-warm/40 tracking-widest uppercase mb-2">Miles</p>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    min="0"
                    value={miles}
                    onChange={(e) => setMiles(e.target.value)}
                    placeholder="4.2"
                    className="w-full bg-background border border-warm/10 focus:border-terracotta/50 rounded-xl px-4 py-3.5 text-warm placeholder-warm/25 outline-none text-base transition-colors duration-200"
                  />
                </div>

                {/* Pace — split MM and SS */}
                <div>
                  <p className="text-[11px] text-warm/40 tracking-widest uppercase mb-2">Pace per mile (MM:SS)</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1"
                      max="99"
                      value={paceMin}
                      onChange={(e) => { setPaceMin(e.target.value); setPaceError(false) }}
                      placeholder="9"
                      className={`flex-1 bg-background border rounded-xl px-4 py-3.5 text-warm placeholder-warm/25 outline-none text-base transition-colors duration-200 ${
                        paceError ? 'border-red-500/50' : 'border-warm/10 focus:border-terracotta/50'
                      }`}
                    />
                    <span className="text-warm/40 text-lg font-light select-none">:</span>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      max="59"
                      value={paceSec}
                      onChange={(e) => { setPaceSec(e.target.value); setPaceError(false) }}
                      placeholder="45"
                      className={`flex-1 bg-background border rounded-xl px-4 py-3.5 text-warm placeholder-warm/25 outline-none text-base transition-colors duration-200 ${
                        paceError ? 'border-red-500/50' : 'border-warm/10 focus:border-terracotta/50'
                      }`}
                    />
                  </div>
                  {paceError && (
                    <p className="text-red-400/70 text-xs mt-1.5">Invalid pace — minutes 1–99, seconds 0–59</p>
                  )}
                </div>
              </>
            )}

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
                {submitting ? 'Saving…' : isEdit ? 'Save Changes' : 'Save Run'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
