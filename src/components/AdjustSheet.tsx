import React from 'react'
import { Clock, X, BatteryLow, TrendingDown, Home, Calendar, RefreshCw, Sparkles } from 'lucide-react'
import { AdjustReason, ADJUST_REASON_META } from '../engine/personalizationEngine'
import { useAppStore } from '../store/appStore'

const ICONS: Record<AdjustReason, React.ComponentType<{ className?: string }>> = {
  less_time:         Clock,
  more_tired:        BatteryLow,
  too_difficult:     TrendingDown,
  no_equipment:      Home,
  schedule_changed:  Calendar,
  different_activity:RefreshCw,
}

const TILES: Record<AdjustReason, string> = {
  less_time:         'bg-amber-500/15 text-amber-400',
  more_tired:        'bg-blue-500/15 text-blue-400',
  too_difficult:     'bg-rose-500/15 text-rose-400',
  no_equipment:      'bg-emerald-500/15 text-emerald-400',
  schedule_changed:  'bg-violet-500/15 text-violet-400',
  different_activity:'bg-indigo-500/15 text-indigo-400',
}

interface Props {
  open: boolean
  onClose: () => void
}

const REASONS: AdjustReason[] = [
  'less_time',
  'more_tired',
  'too_difficult',
  'no_equipment',
  'schedule_changed',
  'different_activity',
]

export default function AdjustSheet({ open, onClose }: Props) {
  const adjust = useAppStore(s => s.adjustTodayWorkout)

  if (!open) return null

  const handlePick = (reason: AdjustReason) => {
    adjust(reason)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center md:justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Sheet */}
      <div
        className="relative w-full md:max-w-md bg-[#0a0a0d] border-t md:border border-white/10 rounded-t-3xl md:rounded-3xl p-5 pb-8 md:pb-5 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle (visual only) */}
        <div className="md:hidden w-10 h-1 bg-white/15 rounded-full mx-auto mb-4" />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-md bg-accent-primary/20 text-accent-primary flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <p className="text-2xs font-semibold text-accent-primary uppercase tracking-wider">Adjust Today</p>
            </div>
            <h2 className="text-lg font-bold tracking-tight">What's changed?</h2>
            <p className="text-[13px] text-white/45 mt-0.5">
              Pick the closest reason. We'll adapt the workout in place.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center flex-shrink-0"
          >
            <X className="w-4 h-4 text-white/60" />
          </button>
        </div>

        {/* Reason list */}
        <div className="space-y-2">
          {REASONS.map((reason) => {
            const meta = ADJUST_REASON_META[reason]
            const Icon = ICONS[reason]
            const tile = TILES[reason]
            return (
              <button
                key={reason}
                onClick={() => handlePick(reason)}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 transition-colors text-left"
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${tile}`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-semibold text-white/90">{meta.label}</p>
                  <p className="text-[12px] text-white/45 leading-snug mt-0.5">{meta.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
