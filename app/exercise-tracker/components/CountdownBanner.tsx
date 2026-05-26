'use client'
// CountdownBanner.tsx — Race countdown, current week, phase, and progress bar.

import type { TrainingPlan } from '../types'
import { daysUntilRace, getCurrentWeek, PHASE_LABELS, PHASE_COLORS } from '../types'

interface Props {
  trainingPlan: TrainingPlan[]
}

export default function CountdownBanner({ trainingPlan }: Props) {
  const days = daysUntilRace()
  const currentWeek = getCurrentWeek(trainingPlan)
  const weekNum = currentWeek?.week_number ?? 0
  const phase = currentWeek?.phase ?? null
  const progress = Math.round((weekNum / 24) * 100)

  const phaseColor = phase ? PHASE_COLORS[phase] : '#c4703f'
  const phaseLabel = phase ? PHASE_LABELS[phase] : null

  return (
    <div className="bg-surface border border-warm/5 rounded-2xl p-6 mb-6">
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mb-5">
        {/* Countdown */}
        <div>
          <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-1">Race Day</p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl text-cream">{days}</span>
            <span className="text-warm/50 text-sm">days away</span>
          </div>
          <p className="text-warm/30 text-xs mt-0.5">Monterey · Nov 8, 2026</p>
        </div>

        <div className="h-10 w-px bg-warm/8 hidden sm:block" />

        {/* Current week */}
        <div>
          <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-1">Current Week</p>
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl text-cream">
              {weekNum === 0 ? '—' : weekNum}
            </span>
            <span className="text-warm/50 text-sm">of 24</span>
          </div>
          {weekNum === 0 && (
            <p className="text-warm/30 text-xs mt-0.5">Starts Jun 2</p>
          )}
        </div>

        {/* Phase */}
        {phaseLabel && (
          <>
            <div className="h-10 w-px bg-warm/8 hidden sm:block" />
            <div>
              <p className="text-warm/40 text-[10px] tracking-widest uppercase mb-1">Phase</p>
              <span
                className="text-sm font-medium px-3 py-1 rounded-full"
                style={{ background: `${phaseColor}20`, color: phaseColor }}
              >
                {phaseLabel}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-warm/30 text-[10px] tracking-widest uppercase">Training Progress</p>
          <p className="text-warm/40 text-[11px]">{progress}%</p>
        </div>
        <div className="h-1.5 w-full bg-background rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, backgroundColor: phaseColor }}
          />
        </div>
      </div>
    </div>
  )
}
