'use client'
// PinGate.tsx — Modal overlay for owner PIN entry.
// Rendered when the owner tries to access log/recalibrate actions.

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  pin: string
  onUnlock: () => void
  onClose: () => void
}

export default function PinGate({ pin, onUnlock, onClose }: Props) {
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input === pin) {
      onUnlock()
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center px-6"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-sm bg-surface border border-warm/10 rounded-2xl p-8"
        >
          <p className="text-terracotta text-xs tracking-[0.3em] uppercase mb-3">Owner Access</p>
          <h2 className="font-serif text-2xl text-cream mb-6">Enter PIN</h2>

          <form onSubmit={submit} className="space-y-4">
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false) }}
              placeholder="PIN"
              autoFocus
              className={`
                w-full bg-background border rounded-xl px-4 py-3 text-warm
                placeholder-warm/25 outline-none text-sm tracking-widest
                transition-colors duration-200
                ${error ? 'border-red-500/50' : 'border-warm/10 focus:border-terracotta/50'}
              `}
            />
            {error && (
              <p className="text-red-400/70 text-xs">Incorrect PIN</p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-warm/10 text-warm/50 rounded-xl text-sm hover:border-warm/20 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-terracotta text-background rounded-xl text-sm font-medium hover:bg-terracotta/90 transition-colors duration-200"
              >
                Unlock
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
