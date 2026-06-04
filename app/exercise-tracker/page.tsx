'use client'
// app/exercise-tracker/page.tsx — Half Marathon Training Dashboard
// Public: anyone can view. Owner-only actions gated behind a PIN stored in sessionStorage.

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import PageWrapper from '@/components/PageWrapper'
import type { ExerciseTrackerData } from './types'

import PinGate from './components/PinGate'
import CountdownBanner from './components/CountdownBanner'
import ProgressStats from './components/ProgressStats'
import ThisWeek from './components/ThisWeek'
import RecalibratePanel from './components/RecalibratePanel'
import RecentLogs from './components/RecentLogs'
import TrainingPlanTable from './components/TrainingPlanTable'

// Dynamic import to avoid SSR issues with recharts
const MileageChart = dynamic(() => import('./components/MileageChart'), { ssr: false })

const AUTH_KEY = 'tracker_auth'
const PIN = process.env.NEXT_PUBLIC_TRACKER_PIN ?? ''

export default function ExerciseTrackerPage() {
  const [isUnlocked, setIsUnlocked] = useState<boolean | null>(null)
  const [showPin, setShowPin] = useState(false)
  const [data, setData] = useState<ExerciseTrackerData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check sessionStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setIsUnlocked(sessionStorage.getItem(AUTH_KEY) === 'true')
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/exercise-tracker/data')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setData(await res.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleUnlock = () => {
    sessionStorage.setItem(AUTH_KEY, 'true')
    setIsUnlocked(true)
    setShowPin(false)
  }

  const trainingPlan = data?.trainingPlan ?? []
  const workoutLogs = data?.workoutLogs ?? []

  return (
    <PageWrapper>
      <div className="min-h-screen px-6 py-10 max-w-7xl mx-auto">

        {/* PIN modal */}
        {showPin && !isUnlocked && (
          <PinGate pin={PIN} onUnlock={handleUnlock} onClose={() => setShowPin(false)} />
        )}

        {/* Top bar: back nav + owner toggle */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="text-sm px-4 py-1.5 border border-warm/15 text-warm/50 rounded-full hover:border-terracotta/50 hover:text-terracotta transition-all duration-200"
          >
            ← Portfolio
          </Link>

          {isUnlocked === null ? null : isUnlocked ? (
            <span className="text-terracotta/60 text-xs flex items-center gap-1.5 select-none">
              🔑 Owner
            </span>
          ) : (
            <button
              onClick={() => setShowPin(true)}
              className="text-warm/15 text-xs hover:text-warm/35 transition-colors duration-200"
            >
              Owner
            </button>
          )}
        </div>

        {/* Page hero */}
        <div className="pb-10">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-terracotta text-xs tracking-[0.3em] uppercase mb-4"
          >
            Training
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-serif text-5xl md:text-7xl text-cream mb-4"
          >
            Half Marathon
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-warm/50 text-lg max-w-xl leading-relaxed"
          >
            Monterey, November 8, 2026. Goal: sub-2:00.
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.28, ease: 'easeOut' }}
            className="mt-10 h-px w-full bg-warm/6 origin-left"
          />
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-surface border border-red-500/20 rounded-xl p-4 text-red-400/70 text-sm mb-6">
            Error loading data: {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-6">
            <div className="bg-surface border border-warm/5 rounded-2xl p-6 h-28 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-surface border border-warm/5 rounded-2xl p-5 h-24 animate-pulse" />
              ))}
            </div>
            <div className="bg-surface border border-warm/5 rounded-2xl p-6 h-64 animate-pulse" />
          </div>
        ) : (
          <div className="space-y-6">
            <CountdownBanner trainingPlan={trainingPlan} />
            <ProgressStats trainingPlan={trainingPlan} workoutLogs={workoutLogs} />
            <ThisWeek
              trainingPlan={trainingPlan}
              workoutLogs={workoutLogs}
              isUnlocked={isUnlocked}
              onLog={fetchData}
            />
            {isUnlocked && (
              <RecalibratePanel
                trainingPlan={trainingPlan}
                workoutLogs={workoutLogs}
                isUnlocked={isUnlocked}
                onRecalibrate={fetchData}
              />
            )}
            <MileageChart trainingPlan={trainingPlan} workoutLogs={workoutLogs} />
            <RecentLogs trainingPlan={trainingPlan} workoutLogs={workoutLogs} isUnlocked={isUnlocked} onUpdate={fetchData} />
            <TrainingPlanTable trainingPlan={trainingPlan} workoutLogs={workoutLogs} />
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
