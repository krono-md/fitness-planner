import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Play } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { PersonalizationEngine } from '../engine/personalizationEngine'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Calendar() {
  const { user, userPlan } = useAppStore()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Calendar</h1>
        <p className="text-white/45 text-sm">Your weekly schedule with classes and workouts</p>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {daysOfWeek.map((day, i) => {
          const workouts = userPlan.filter(w => w.dayOfWeek === day)
          const blocks = user?.scheduleBlocks?.filter(b => b.day === day) || []
          const isToday = day === today
          const windowInfo = user ? PersonalizationEngine.findWorkoutWindow(user, day) : null

          return (
            <div
              key={day}
              className={`whop-card p-3 min-h-[140px] ${isToday ? 'border-accent-primary/30 bg-accent-primary/[0.04]' : ''}`}
            >
              <div className="mb-2">
                <p className={`text-[11px] font-bold ${isToday ? 'text-accent-primary' : 'text-white/40'}`}>
                  {shortDays[i]}
                </p>
                {isToday && <p className="text-[9px] text-accent-primary/70 font-medium">Today</p>}
              </div>

              <div className="space-y-1.5">
                {blocks.map((block, idx) => (
                  <div key={idx} className="px-1.5 py-1 bg-white/[0.04] rounded-md border border-white/[0.05]">
                    <p className="text-[9px] text-white/35">{block.startTime}</p>
                    <p className="text-[10px] text-white/60 truncate">{block.title}</p>
                  </div>
                ))}

                {workouts.map(w => (
                  <div key={w.id} className={`px-1.5 py-1 rounded-md border ${
                    w.exercises.length > 0
                      ? 'bg-accent-primary/10 border-accent-primary/20'
                      : 'bg-white/[0.03] border-white/[0.05]'
                  }`}>
                    <p className="text-[10px] font-medium text-white/80 truncate">{w.name}</p>
                    {w.duration > 0 && (
                      <p className="text-[9px] text-white/40 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" />{w.duration}m
                      </p>
                    )}
                  </div>
                ))}

                {windowInfo?.window && workouts.some(w => w.exercises.length > 0) && (
                  <p className="text-[9px] text-accent-success/70 mt-1">Free: {windowInfo.window}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Today's detail */}
      <div className="whop-card p-5">
        <h2 className="font-bold mb-4">Today's Schedule — {today}</h2>
        <div className="space-y-3">
          {user?.scheduleBlocks?.filter(b => b.day === today).map((block, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
              <div className="w-1 h-8 rounded-full bg-white/20" />
              <div>
                <p className="text-sm font-medium">{block.title}</p>
                <p className="text-xs text-white/45">{block.startTime} – {block.endTime} · {block.type}</p>
              </div>
            </div>
          ))}
          {userPlan.filter(w => w.dayOfWeek === today).map(w => (
            <div key={w.id} className="flex items-center justify-between p-3 bg-accent-primary/10 rounded-xl border border-accent-primary/20">
              <div>
                <p className="text-sm font-medium">{w.name}</p>
                <p className="text-xs text-white/45">{w.duration} min · {w.difficulty}</p>
              </div>
              {w.exercises.length > 0 && (
                <Link to={`/workout/${w.id}`} className="whop-btn-primary !py-2 !px-3 flex items-center gap-1.5 text-xs">
                  <Play className="w-3 h-3" /> Start
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
