import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Flame, TrendingUp, Target, Moon, ChevronRight, Dumbbell, Play, Zap, AlertTriangle, RefreshCw } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { calculateStreak, calculateConsistency } from '../utils/stats'
import PageHeader from '../components/PageHeader'

export default function Dashboard() {
  const { user, workoutSessions, goals, userPlan, regeneratePlan } = useAppStore()

  if (!user) {
    return <div className="whop-page text-center"><p className="text-white/45">Please complete onboarding first.</p></div>
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const todaysWorkout = userPlan.find(w => w.dayOfWeek === today && w.exercises.length > 0)
  const completedWorkouts = workoutSessions.filter(s => s.completed).length
  const weeklyGoal = goals.find(g => g.category === 'workouts' && !g.completed)
  const streak = calculateStreak(workoutSessions)
  const consistency = calculateConsistency(workoutSessions, user.workoutsPerWeek)

  // Calculate bedtime suggestion helper
  const calculateBedtime = (workoutDuration: number, targetSleep: number) => {
    const windDownTime = 1.5 // hours before bed
    const totalTime = workoutDuration / 60 + windDownTime + targetSleep
    const bedtime = 24 - totalTime
    return Math.round(bedtime)
  }

  // Proactive sleep suggestion based on schedule
  const getNextWorkoutDay = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const todayIndex = days.indexOf(today)
    for (let i = 1; i <= 7; i++) {
      const day = days[(todayIndex + i) % 7]
      const workout = userPlan.find(w => w.dayOfWeek === day && w.exercises && w.exercises.length > 0)
      if (workout) return { day, workout }
    }
    return null
  }

  const nextWorkout = getNextWorkoutDay()
  const sleepTarget = user.averageSleep || 7.5
  const sleepSuggestion = nextWorkout ? `To feel energized for ${nextWorkout.workout.name} tomorrow, aim for ${sleepTarget}h of sleep. Try to be in bed by ${calculateBedtime(nextWorkout.workout.duration, sleepTarget)}:00 PM.` : `Get quality sleep tonight — it's crucial for recovery and next week's workouts!`

  const stats = [
    { label: 'Weekly Goal', value: `${completedWorkouts}/${weeklyGoal?.target || user.workoutsPerWeek}`, icon: Target, tile: 'bg-indigo-500/15 text-indigo-400' },
    { label: 'Streak', value: `${streak}d`, icon: Flame, tile: 'bg-amber-500/15 text-amber-400' },
    { label: 'Sleep', value: `${user.averageSleep}h`, icon: Moon, tile: 'bg-blue-500/15 text-blue-400' },
    { label: 'Consistency', value: `${consistency}%`, icon: TrendingUp, tile: 'bg-emerald-500/15 text-emerald-400' },
  ]

  return (
    <div className="whop-page">
      <PageHeader
        title={`${greeting}, ${user.name?.split(' ')[0]}`}
        subtitle={`${today} · Your personalized fitness plan`}
      />

      {/* Featured workout card */}
      <div className="whop-featured p-5 md:p-6 relative overflow-hidden">
        {/* Subtle decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-accent-primary/10 to-accent-secondary/5 rounded-full blur-2xl -translate-y-1/4 translate-x-1/4 pointer-events-none" />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="whop-micro mb-1.5">Today's Workout</p>
              <h2 className="text-lg font-bold tracking-tight">{todaysWorkout?.name || 'Rest Day'}</h2>
            </div>
            {todaysWorkout && (
              <span className="whop-pill-accent capitalize">{todaysWorkout.difficulty}</span>
            )}
          </div>

          {todaysWorkout ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-indigo-600 flex items-center justify-center shadow-glow-sm hover:shadow-medium transition-shadow duration-300">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[13px] text-white/55">
                    {todaysWorkout.duration} min · {todaysWorkout.exercises.length} exercises
                  </p>
                  <p className="text-2xs text-white/35 mt-0.5">{todaysWorkout.targetMuscles.join(' · ')}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link to={`/workout/${todaysWorkout.id}`} className="whop-btn-primary flex-1 transition-all duration-200 hover:scale-105 active:scale-95">
                  <Play className="w-3.5 h-3.5" /> Start Workout
                </Link>
                <button onClick={() => regeneratePlan()} className="whop-btn-ghost transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap">
                  <RefreshCw className="w-3.5 h-3.5" /> Adjust
                </button>
              </div>
            </div>
          ) : (
            <div className="py-5 text-center">
              <p className="text-[13px] text-white/45 mb-2">No workout today — enjoy your recovery.</p>
              <Link to="/recovery" className="text-accent-primary text-[13px] font-medium hover:underline">Log sleep →</Link>
            </div>
          )}
        </div>
      </div>

      {/* Proactive Sleep Suggestion */}
      {sleepSuggestion && (
        <div className="whop-card p-5 border-accent-primary/20">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-accent-primary/20 rounded-lg flex-shrink-0">
              <Moon className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <p className="text-sm text-white/60 mb-1">Sleep target for tomorrow</p>
              <p className="text-white/90 text-sm leading-relaxed">{sleepSuggestion}</p>
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="whop-stat">
              <div className="relative flex items-center gap-2 mb-2.5">
                <div className={`whop-icon-tile ${stat.tile}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <p className="whop-micro !tracking-[0.08em]">{stat.label}</p>
              </div>
              <div className="whop-stat-value">{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Today's schedule */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-[13px] font-semibold text-white/70">Today's Schedule</h2>
          {nextWorkout && (
            <Link to="/recovery" className="text-accent-primary text-2xs font-semibold flex items-center gap-0.5 hover:underline">
              View plan <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <div className="space-y-1.5">
          {userPlan.filter(w => w.exercises.length > 0).slice(0, 3).map((workout) => {
            const isToday = workout.dayOfWeek === today
            return (
              <div key={workout.id} className={`whop-card-hover !rounded-xl p-3.5 flex items-center justify-between gap-3 ${isToday ? 'bg-accent-primary/[0.03] border-accent-primary/20' : ''}`}>
                <div className="min-w-0 flex items-center gap-3">
                  {isToday && <span className="w-1.5 h-1.5 bg-accent-success rounded-full animate-pulse" />}
                  <div className="min-w-0">
                    <p className="font-semibold text-[13px]">{workout.dayOfWeek}</p>
                    <p className="text-2xs text-white/40 truncate">{workout.name} · {workout.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="whop-pill capitalize">{workout.difficulty}</span>
                  {isToday && workout.exercises.length > 0 && (
                    <Link to={`/workout/${workout.id}`} className="whop-btn-ghost !py-1.5 !px-2.5 !text-2xs">Start</Link>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
