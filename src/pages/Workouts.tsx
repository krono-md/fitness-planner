import React from 'react'
import { Link } from 'react-router-dom'
import { Clock, Dumbbell, Play, ChevronRight } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import PageHeader from '../components/PageHeader'

export default function Workouts() {
  const { userPlan } = useAppStore()
  const activeWorkouts = userPlan.filter(w => w.exercises.length > 0)

  return (
    <div className="whop-page">
      <PageHeader subtitle="Your personalized workout sessions this week" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
        {activeWorkouts.map((workout) => (
          <div key={workout.id} className="whop-card-hover !rounded-xl p-4">
            <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="whop-micro mb-1">{workout.dayOfWeek}</p>
                <h3 className="font-bold text-[15px]">{workout.name}</h3>
              </div>
              <span className="whop-pill-accent capitalize">{workout.difficulty}</span>
            </div>

            <div className="flex items-center gap-3 text-2xs text-white/45 mb-3">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{workout.duration} min</span>
              <span className="flex items-center gap-1"><Dumbbell className="w-3 h-3" />{workout.exercises.length} exercises</span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {workout.exercises.slice(0, 3).map(ex => (
                <span key={ex.id} className="whop-pill">{ex.name}</span>
              ))}
              {workout.exercises.length > 3 && (
                <span className="text-xs text-white/35">+{workout.exercises.length - 3} more</span>
              )}
            </div>

            <Link
              to={`/workout/${workout.id}`}
              className="whop-btn-primary w-full"
            >
              <Play className="w-3.5 h-3.5" /> Start Workout
            </Link>
            </div>
          </div>
        ))}
      </div>

      {activeWorkouts.length === 0 && (
        <div className="whop-card p-12 text-center">
          <p className="text-white/50">No workouts in your plan yet. Complete onboarding to generate your plan.</p>
          <Link to="/plan" className="inline-flex items-center gap-1 mt-4 text-accent-primary text-sm font-medium">
            View My Plan <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  )
}
