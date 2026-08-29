import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Flame, TrendingUp, Target, Moon, ChevronRight, Dumbbell, Play } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { calculateStreak, calculateConsistency } from '../utils/stats'
import PageHeader from '../components/PageHeader'

export default function Dashboard() {
  const { user, workoutSessions, goals, userPlan } = useAppStore()

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
      <div className="whop-featured p-5 md:p-6">
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-primary to-indigo-600 flex items-center justify-center shadow-glow-sm">
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
                <Link to={`/workout/${todaysWorkout.id}`} className="whop-btn-primary flex-1">
                  <Play className="w-3.5 h-3.5" /> Start Workout
                </Link>
                <Link to="/plan" className="whop-btn-ghost">Reschedule</Link>
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

      {/* This week */}
      <div>
        <div className="flex items-center justify-between mb-2.5 px-0.5">
          <h2 className="text-[13px] font-semibold text-white/70">This Week</h2>
          <Link to="/plan" className="text-accent-primary text-2xs font-semibold flex items-center gap-0.5 hover:underline">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-1.5">
          {userPlan.filter(w => w.exercises.length > 0).slice(0, 4).map((workout) => (
            <div key={workout.id} className="whop-card-hover !rounded-xl p-3.5 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-[13px]">{workout.dayOfWeek}</p>
                <p className="text-2xs text-white/40 truncate">{workout.name} · {workout.duration} min</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="whop-pill capitalize">{workout.difficulty}</span>
                <Link to={`/workout/${workout.id}`} className="whop-btn-ghost !py-1.5 !px-2.5 !text-2xs">Start</Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 gap-2.5">
        {[
          { icon: Clock, label: 'Calendar', path: '/calendar', desc: 'Classes & workouts', tile: 'bg-sky-500/15 text-sky-400' },
          { icon: TrendingUp, label: 'Insights', path: '/insights', desc: 'Your patterns', tile: 'bg-yellow-500/15 text-yellow-400' },
        ].map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.path} to={action.path} className="whop-card-hover !rounded-xl p-4 group">
              <div className={`whop-icon-tile w-8 h-8 rounded-xl mb-2.5 ${action.tile}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="font-semibold text-[13px] text-white/85">{action.label}</p>
              <p className="text-2xs text-white/35 mt-0.5">{action.desc}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
