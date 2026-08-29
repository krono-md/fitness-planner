import React from 'react'
import { Link } from 'react-router-dom'
import {
  Zap,
  Clock,
  Flame,
  TrendingUp,
  Target,
  Moon,
  ChevronRight,
  Dumbbell,
  Heart,
  Award,
  Coffee,
  Play
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { PersonalizationEngine } from '../engine/personalizationEngine'

export default function Dashboard() {
  const { user, workoutSessions, sleepRecords, goals } = useAppStore()
  const [generatedPlan, setGeneratedPlan] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    if (user) {
      setLoading(true)
      setTimeout(() => {
        const plan = PersonalizationEngine.generatePlan(user)
        setGeneratedPlan(plan)
        setLoading(false)
      }, 500)
    }
  }, [user])

  if (!user) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">Please complete onboarding first.</p>
      </div>
    )
  }

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  const todaysWorkout = generatedPlan.find(workout => workout.dayOfWeek === today)
  const completedWorkouts = workoutSessions.filter(s => s.completed).length
  const thisWeeksGoal = goals.find(g => g.category === 'workouts' && !g.completed)

  const stats = [
    { label: 'Weekly Goal', value: `${completedWorkouts}/${thisWeeksGoal?.target || 4}`, icon: Target, color: 'from-accent-primary to-accent-primary/60' },
    { label: 'Workout Streak', value: '5 days', icon: Flame, color: 'from-accent-warning to-accent-warning/60' },
    { label: 'Sleep Avg', value: `${user.averageSleep}h`, icon: Moon, color: 'from-accent-secondary to-accent-secondary/60' },
    { label: 'Consistency', value: '82%', icon: TrendingUp, color: 'from-accent-success to-accent-success/60' },
  ]

  const quickActions = [
    { icon: Clock, label: 'Schedule', desc: 'Find a time slot', color: 'bg-accent-primary/20 text-accent-primary' },
    { icon: Coffee, label: 'Log Sleep', desc: 'Track recovery', color: 'bg-accent-secondary/20 text-accent-secondary' },
    { icon: Award, label: 'Set Goal', desc: 'Stay motivated', color: 'bg-accent-success/20 text-accent-success' },
    { icon: Heart, label: 'Check-in', desc: 'How are you?', color: 'bg-accent-warning/20 text-accent-warning' },
  ]

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Good morning, {user.name?.split(' ')[0]}</h1>
        <p className="text-white/50 text-lg">{today} • Let's build your fitness today</p>
      </div>

      {/* Today's Workout - Featured Card */}
      <div className="bg-gradient-to-br from-dark-surface to-dark-elevated border border-dark-border rounded-2xl p-8 shadow-medium hover:shadow-large transition-shadow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">Today's Workout</h2>
            <p className="text-white/50">{today} • {todaysWorkout ? todaysWorkout.duration : 30} minutes</p>
          </div>
          {todaysWorkout && (
            <div className="px-4 py-2 bg-accent-primary/10 text-accent-primary rounded-full font-medium text-sm border border-accent-primary/20">
              {todaysWorkout.difficulty}
            </div>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-dark-hover rounded-xl" />
          </div>
        ) : todaysWorkout ? (
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{todaysWorkout.name}</h3>
                <p className="text-white/60 mb-3 text-[15px]">
                  {todaysWorkout.exercises.length} exercises • {todaysWorkout.targetMuscles.join(', ')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {todaysWorkout.equipment.slice(0, 3).map((eq: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-dark-hover rounded-lg text-sm text-white/70 border border-dark-border">
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                to={`/workout/${todaysWorkout.id}`}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary/90 hover:to-accent-secondary/90 rounded-xl font-bold text-center transition-all hover:shadow-medium flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Workout
              </Link>
              <button className="px-6 py-4 border border-dark-border hover:bg-dark-hover rounded-xl font-medium transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-white/60 mb-4 text-lg">No workout scheduled for today.</p>
            <button className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-medium">
              Add a workout
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-soft hover:shadow-medium transition-shadow hover:border-dark-border/80">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} opacity-20`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <p className="text-white/60 text-sm font-medium mb-2">{stat.label}</p>
              <div className="text-3xl font-bold">{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => {
            const Icon = action.icon
            return (
              <button
                key={idx}
                className="bg-dark-surface border border-dark-border rounded-2xl p-6 hover:bg-dark-hover hover:border-dark-border/80 transition-all shadow-soft hover:shadow-medium group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
                <h3 className="font-bold mb-1 text-left">{action.label}</h3>
                <p className="text-sm text-white/50 text-left">{action.desc}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Upcoming Workouts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">This Week</h2>
          <Link to="/plan" className="text-accent-primary hover:text-accent-primary/80 text-sm font-medium flex items-center gap-1 transition-colors">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {generatedPlan.slice(0, 3).map((workout) => (
            <div
              key={workout.id}
              className="bg-dark-surface border border-dark-border rounded-xl p-5 flex items-center justify-between hover:bg-dark-hover hover:border-dark-border/80 transition-all shadow-soft hover:shadow-medium"
            >
              <div className="flex-1">
                <h3 className="font-bold mb-1">{workout.dayOfWeek}</h3>
                <p className="text-sm text-white/60">{workout.name} • {workout.duration} min</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-dark-elevated rounded-lg text-sm text-white/70 border border-dark-border">
                  {workout.difficulty}
                </div>
                <Link
                  to={`/workout/${workout.id}`}
                  className="px-4 py-2 bg-dark-elevated hover:bg-dark-hover border border-dark-border rounded-lg text-sm font-medium transition-colors"
                >
                  Start
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
