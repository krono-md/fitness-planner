import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Clock, Target, Dumbbell, TrendingUp, RefreshCw, MoreVertical } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { calculateConsistency } from '../utils/stats'
import PageHeader from '../components/PageHeader'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function MyPlan() {
  const { user, userPlan, workoutSessions, regeneratePlan, rescheduleWorkout, skipWorkout } = useAppStore()
  const [view, setView] = useState<'week' | 'month'>('week')
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)
  const [newDay, setNewDay] = useState('Monday')

  const consistency = user ? calculateConsistency(workoutSessions, user.workoutsPerWeek) : 0
  const activeWorkouts = userPlan.filter(w => w.exercises.length > 0)

  const handleReschedule = (workout: any) => {
    setSelectedWorkout(workout)
    setNewDay(workout.dayOfWeek)
    setShowRescheduleModal(true)
  }

  const confirmReschedule = () => {
    if (selectedWorkout) {
      rescheduleWorkout(selectedWorkout.id, newDay)
    }
    setShowRescheduleModal(false)
  }

  if (!user) {
    return <div className="p-8 text-center"><p className="text-white/50">Please complete onboarding first.</p></div>
  }

  return (
    <div className="whop-page">
      <PageHeader
        subtitle="Your personalized weekly workout schedule"
        action={
          <div className="flex gap-1.5">
            <button onClick={regeneratePlan} className="whop-btn-ghost !py-2 !px-3 !text-2xs flex items-center gap-1.5">
              <RefreshCw className="w-3 h-3" /> Regenerate
            </button>
            <button
              onClick={() => setView(view === 'week' ? 'month' : 'week')}
              className="whop-btn-ghost !py-2 !px-3 !text-2xs flex items-center gap-1.5"
            >
              <Calendar className="w-3 h-3" /> {view === 'week' ? 'Month' : 'Week'}
            </button>
          </div>
        }
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: 'Weekly Total', value: `${activeWorkouts.reduce((t, w) => t + w.duration, 0)} min`, color: 'text-accent-primary' },
          { icon: Dumbbell, label: 'Workouts', value: activeWorkouts.length, color: 'text-accent-secondary' },
          { icon: TrendingUp, label: 'Consistency', value: `${consistency}%`, color: 'text-accent-success' },
          { icon: Target, label: 'This Week', value: `${workoutSessions.filter(s => s.completed).length}/${user.workoutsPerWeek}`, color: 'text-accent-warning' },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="whop-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-[11px] text-white/40 font-medium">{stat.label}</span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Week or Month view */}
      {view === 'week' ? (
        <div className="whop-card overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h2 className="font-bold">Weekly Schedule</h2>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {daysOfWeek.map((day) => {
              const workouts = userPlan.filter(w => w.dayOfWeek === day)
              const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day
              return (
                <div key={day} className="p-4 md:p-5 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-24 flex-shrink-0">
                      <p className={`text-sm font-bold ${isToday ? 'text-accent-primary' : 'text-white/80'}`}>{day.slice(0, 3)}</p>
                      <p className="text-[11px] text-white/35">{workouts.length > 0 ? `${workouts.length} item${workouts.length > 1 ? 's' : ''}` : 'Rest'}</p>
                    </div>
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {workouts.length > 0 ? workouts.map((workout) => (
                        <div key={workout.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-sm">{workout.name}</h3>
                              <div className="flex items-center gap-2 mt-1 text-xs text-white/45">
                                {workout.duration > 0 && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{workout.duration} min</span>}
                                <span className="whop-pill capitalize !py-0">{workout.difficulty}</span>
                              </div>
                            </div>
                            <button className="p-1 text-white/30 hover:text-white/60">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                          {workout.exercises.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {workout.exercises.slice(0, 2).map(ex => (
                                <span key={ex.id} className="text-[11px] px-2 py-0.5 bg-white/[0.04] rounded-md text-white/55">{ex.name}</span>
                              ))}
                              {workout.exercises.length > 2 && <span className="text-[11px] text-white/30">+{workout.exercises.length - 2}</span>}
                            </div>
                          )}
                          {workout.notes && <p className="text-[11px] text-white/35 mb-3">{workout.notes}</p>}
                          {workout.exercises.length > 0 && (
                            <div className="flex gap-2">
                              <Link to={`/workout/${workout.id}`} className="whop-btn-primary flex-1 !py-2 text-xs text-center">Start</Link>
                              <button onClick={() => handleReschedule(workout)} className="whop-btn-ghost !py-2 !px-3 text-xs">Move</button>
                              <button onClick={() => skipWorkout(workout.id)} className="whop-btn-ghost !py-2 !px-3 text-xs">Skip</button>
                            </div>
                          )}
                        </div>
                      )) : (
                        <div className="col-span-full text-center py-4 text-white/30 text-sm">Rest day</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="whop-card p-5">
          <h2 className="font-bold mb-4">Monthly Overview</h2>
          <div className="grid grid-cols-7 gap-1.5">
            {daysOfWeek.map(d => (
              <p key={d} className="text-center text-[10px] text-white/30 font-semibold py-1">{d.slice(0, 2)}</p>
            ))}
            {Array.from({ length: 28 }).map((_, i) => {
              const dayIdx = i % 7
              const day = daysOfWeek[dayIdx]
              const hasWorkout = userPlan.some(w => w.dayOfWeek === day && w.exercises.length > 0)
              return (
                <div key={i} className={`aspect-square rounded-lg flex items-center justify-center text-[11px] border ${
                  hasWorkout ? 'bg-accent-primary/15 border-accent-primary/25 text-accent-primary' : 'bg-white/[0.02] border-white/[0.05] text-white/25'
                }`}>
                  {i + 1}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showRescheduleModal && selectedWorkout && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="whop-card max-w-md w-full p-6 shadow-large">
            <h2 className="text-xl font-bold mb-1">Reschedule Workout</h2>
            <p className="text-white/45 text-sm mb-5">Move "{selectedWorkout.name}" to another day</p>
            <div className="space-y-3 mb-5">
              <label className="block text-sm font-medium">Move to</label>
              <select
                value={newDay}
                onChange={(e) => setNewDay(e.target.value)}
                className="whop-input"
              >
                {daysOfWeek.map(day => <option key={day} value={day}>{day}</option>)}
              </select>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowRescheduleModal(false)} className="whop-btn-ghost flex-1">Cancel</button>
              <button onClick={confirmReschedule} className="whop-btn-primary flex-1">Reschedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
