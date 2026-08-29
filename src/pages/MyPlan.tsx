import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Target,
  Dumbbell,
  TrendingUp,
  RefreshCw,
  MoreVertical,
  ChevronRight,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { PersonalizationEngine } from '../engine/personalizationEngine'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function MyPlan() {
  const { user } = useAppStore()
  const [view, setView] = useState<'week' | 'month'>('week')
  const [generatedPlan, setGeneratedPlan] = useState<any[]>([])
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedWorkout, setSelectedWorkout] = useState<any>(null)

  React.useEffect(() => {
    if (user) {
      const plan = PersonalizationEngine.generatePlan(user)
      setGeneratedPlan(plan)
    }
  }, [user])

  const getWorkoutsForDay = (day: string) => {
    return generatedPlan.filter(workout => workout.dayOfWeek === day)
  }

  const handleReschedule = (workout: any) => {
    setSelectedWorkout(workout)
    setShowRescheduleModal(true)
  }

  const handleRegeneratePlan = () => {
    if (user) {
      const newPlan = PersonalizationEngine.generatePlan(user)
      setGeneratedPlan(newPlan)
    }
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">Please complete onboarding first.</p>
      </div>
    )
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">My Plan</h1>
          <p className="text-white/50 text-lg">Your personalized weekly workout schedule</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRegeneratePlan}
            className="px-6 py-3 border border-dark-border hover:bg-dark-hover rounded-xl font-medium flex items-center gap-2 transition-colors shadow-soft hover:shadow-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Regenerate
          </button>
          <button
            onClick={() => setView(view === 'week' ? 'month' : 'week')}
            className="px-6 py-3 border border-dark-border hover:bg-dark-hover rounded-xl font-medium flex items-center gap-2 transition-colors shadow-soft hover:shadow-medium"
          >
            <Calendar className="w-4 h-4" />
            {view === 'week' ? 'Month' : 'Week'}
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-accent-primary/20">
              <Clock className="w-5 h-5 text-accent-primary" />
            </div>
            <span className="text-white/60 text-sm font-medium">Weekly Total</span>
          </div>
          <div className="text-3xl font-bold">
            {generatedPlan.reduce((total, w) => total + w.duration, 0)} min
          </div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-accent-secondary/20">
              <Dumbbell className="w-5 h-5 text-accent-secondary" />
            </div>
            <span className="text-white/60 text-sm font-medium">Workouts</span>
          </div>
          <div className="text-3xl font-bold">{generatedPlan.length}</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-accent-success/20">
              <TrendingUp className="w-5 h-5 text-accent-success" />
            </div>
            <span className="text-white/60 text-sm font-medium">Consistency</span>
          </div>
          <div className="text-3xl font-bold">82%</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-accent-warning/20">
              <Target className="w-5 h-5 text-accent-warning" />
            </div>
            <span className="text-white/60 text-sm font-medium">This Week</span>
          </div>
          <div className="text-3xl font-bold">4/4</div>
        </div>
      </div>

      {/* Week Calendar */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl shadow-medium overflow-hidden">
        <div className="p-6 border-b border-dark-border bg-dark-surface/50">
          <h2 className="text-2xl font-bold">Weekly Schedule</h2>
        </div>
        <div className="divide-y divide-dark-border">
          {daysOfWeek.map((day) => {
            const workouts = getWorkoutsForDay(day)
            const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day
            return (
              <div key={day} className="p-6 hover:bg-dark-elevated/50 transition-colors">
                <div className="flex items-start gap-8">
                  {/* Day Header */}
                  <div className="w-40 flex-shrink-0">
                    <div className={`text-lg font-bold mb-1 ${isToday ? 'text-accent-primary' : 'text-white/90'}`}>
                      {day}
                    </div>
                    <div className="text-sm text-white/50">
                      {workouts.length > 0 ? workouts.length + ' workout' + (workouts.length !== 1 ? 's' : '') : 'Rest day'}
                    </div>
                  </div>

                  {/* Workout Cards */}
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {workouts.length > 0 ? (
                      workouts.map((workout, workoutIdx) => (
                        <div
                          key={workoutIdx}
                          className="bg-dark-elevated border border-dark-border rounded-xl p-5 hover:border-dark-border/80 transition-all shadow-soft hover:shadow-medium"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1">{workout.name}</h3>
                              <div className="flex items-center gap-3 text-sm text-white/60">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {workout.duration} min
                                </span>
                                <span className="px-2 py-1 bg-dark-hover rounded-lg text-white/70">
                                  {workout.difficulty}
                                </span>
                              </div>
                            </div>
                            <button className="p-2 text-white/40 hover:text-white hover:bg-dark-hover rounded-lg transition-colors">
                              <MoreVertical className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="space-y-3 mb-4 pb-4 border-t border-dark-border pt-4">
                            {/* Exercises */}
                            <div>
                              <p className="text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Exercises</p>
                              <div className="flex flex-wrap gap-2">
                                {workout.exercises.slice(0, 2).map((ex: any, exIdx: number) => (
                                  <span
                                    key={exIdx}
                                    className="px-3 py-1 bg-dark-hover rounded-lg text-sm text-white/80 border border-dark-border/50"
                                  >
                                    {ex.name}
                                  </span>
                                ))}
                                {workout.exercises.length > 2 && (
                                  <span className="px-3 py-1 bg-dark-hover rounded-lg text-sm text-white/60">
                                    +{workout.exercises.length - 2} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Target Muscles */}
                            <div>
                              <p className="text-xs text-white/50 uppercase tracking-wider mb-2 font-medium">Targets</p>
                              <div className="flex flex-wrap gap-2">
                                {workout.targetMuscles.map((muscle: string, idx: number) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-dark-hover rounded-lg text-sm text-white/80 border border-dark-border/50"
                                  >
                                    {muscle}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Link
                              to={`/workout/${workout.id}`}
                              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary/90 hover:to-accent-secondary/90 rounded-lg font-bold text-center text-sm transition-all"
                            >
                              Start
                            </Link>
                            <button
                              onClick={() => handleReschedule(workout)}
                              className="px-4 py-2.5 border border-dark-border hover:bg-dark-hover rounded-lg font-medium text-sm transition-colors"
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-dark-elevated border border-dark-border rounded-xl p-6 text-center col-span-1 lg:col-span-2">
                        <div className="w-12 h-12 bg-dark-hover rounded-full flex items-center justify-center mx-auto mb-3">
                          <RefreshCw className="w-6 h-6 text-white/30" />
                        </div>
                        <h3 className="font-medium mb-1">Rest Day</h3>
                        <p className="text-sm text-white/50 mb-4">
                          Focus on recovery, light activity, or flexibility.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedWorkout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-dark-surface border border-dark-border rounded-2xl max-w-md w-full p-8 shadow-large">
            <h2 className="text-2xl font-bold mb-2">Reschedule Workout</h2>
            <p className="text-white/60 mb-6">
              Move "{selectedWorkout.name}" to another day
            </p>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">Move to</label>
                <select className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-white">
                  {daysOfWeek.map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Reason</label>
                <select className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-white">
                  <option>Schedule conflict</option>
                  <option>Too tired</option>
                  <option>Busy with studies</option>
                  <option>Other commitment</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="flex-1 px-4 py-3 border border-dark-border hover:bg-dark-hover rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowRescheduleModal(false)
                }}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg font-bold transition-all hover:shadow-medium"
              >
                Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
