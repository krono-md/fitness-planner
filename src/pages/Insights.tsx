import React from 'react'
import { TrendingUp, Calendar, Clock, Target, Flame, Zap, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { AdaptiveEngine } from '../engine/adaptiveEngine'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

export default function Insights() {
  const { user, workoutSessions, goals } = useAppStore()

  // Generate insights data
  const adaptations = user ? AdaptiveEngine.analyzePatterns(workoutSessions, user) : []
  const recommendations = user ? AdaptiveEngine.generateRecommendations(workoutSessions, user) : []
  const optimalTime = user ? AdaptiveEngine.suggestOptimalTime(workoutSessions, user) : null

  // Weekly consistency data
  const weeklyData = [
    { day: 'Mon', completed: 1, skipped: 0 },
    { day: 'Tue', completed: 0, skipped: 1 },
    { day: 'Wed', completed: 1, skipped: 0 },
    { day: 'Thu', completed: 0, skipped: 0 },
    { day: 'Fri', completed: 1, skipped: 0 },
    { day: 'Sat', completed: 1, skipped: 0 },
    { day: 'Sun', completed: 0, skipped: 0 },
  ]

  // Workout distribution by type
  const workoutDistribution = [
    { name: 'Strength', value: 45, color: '#6366f1' },
    { name: 'Cardio', value: 30, color: '#8b5cf6' },
    { name: 'Mobility', value: 15, color: '#10b981' },
    { name: 'Rest', value: 10, color: '#f59e0b' },
  ]

  // Best performing days
  const bestDays = [
    { day: 'Saturday', completion: 95, workouts: 8 },
    { day: 'Monday', completion: 88, workouts: 7 },
    { day: 'Friday', completion: 82, workouts: 6 },
  ]

  const insights = [
    {
      icon: Calendar,
      title: 'Most Consistent Day',
      value: 'Saturday',
      detail: '95% completion rate',
      color: 'text-accent-primary',
      bg: 'bg-accent-primary/20'
    },
    {
      icon: Clock,
      title: 'Avg Workout Duration',
      value: '28 min',
      detail: 'Within your target range',
      color: 'text-accent-secondary',
      bg: 'bg-accent-secondary/20'
    },
    {
      icon: TrendingUp,
      title: 'Monthly Progress',
      value: '+12%',
      detail: 'vs last month',
      color: 'text-accent-success',
      bg: 'bg-accent-success/20'
    },
    {
      icon: Flame,
      title: 'Longest Streak',
      value: '5 days',
      detail: 'Current active streak',
      color: 'text-accent-warning',
      bg: 'bg-accent-warning/20'
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Insights</h1>
        <p className="text-white/50 text-sm md:text-lg">Personalized analytics and recommendations</p>
      </div>

      {/* Key Insights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {insights.map((insight, idx) => {
          const Icon = insight.icon
          return (
            <div key={idx} className="bg-dark-surface border border-dark-border rounded-xl p-4 md:p-5 shadow-soft hover:shadow-medium transition-all">
              <div className={`inline-flex p-2.5 md:p-3 rounded-xl ${insight.bg} mb-2.5 md:mb-4`}>
                <Icon className={`w-4 h-4 md:w-5 md:h-5 ${insight.color}`} />
              </div>
              <p className="text-xs md:text-sm text-white/50 font-medium mb-0.5">{insight.title}</p>
              <div className="text-2xl md:text-3xl font-bold mb-1">{insight.value}</div>
              <p className="text-xs md:text-sm text-white/60">{insight.detail}</p>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Weekly Consistency */}
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-medium">
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Weekly Consistency</h2>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis
                  dataKey="day"
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#666"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="skipped" fill="#262626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workout Distribution */}
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-medium">
          <h2 className="text-lg md:text-2xl font-bold mb-4 md:mb-6">Workout Distribution</h2>
          <div className="h-48 md:h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workoutDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {workoutDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #262626',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                  labelStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-2.5 md:gap-6 mt-4">
            {workoutDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs md:text-sm text-white/70">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-medium">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="p-2.5 md:p-3 rounded-xl bg-accent-primary/20">
            <Lightbulb className="w-4 h-4 md:w-6 md:h-6 text-accent-primary" />
          </div>
          <div>
            <h2 className="text-lg md:text-2xl font-bold">Recommendations</h2>
            <p className="text-white/50 text-xs md:text-sm">Personalized suggestions based on your patterns</p>
          </div>
        </div>

        <div className="space-y-2 md:space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="flex items-start gap-2.5 md:gap-3 p-3 md:p-4 bg-dark-elevated rounded-xl border border-dark-border">
              <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-accent-success flex-shrink-0 mt-0.5" />
              <p className="text-white/90 text-sm md:text-base">{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive Suggestions */}
      {adaptations.length > 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-medium">
          <div className="flex items-center gap-3 mb-4 md:mb-6">
            <div className="p-2.5 md:p-3 rounded-xl bg-accent-warning/20">
              <Zap className="w-4 h-4 md:w-6 md:h-6 text-accent-warning" />
            </div>
            <div>
              <h2 className="text-lg md:text-2xl font-bold">Plan Adjustments</h2>
              <p className="text-white/50 text-sm">Suggestions to optimize your plan</p>
            </div>
          </div>

          <div className="space-y-4">
            {adaptations.map((adaptation, idx) => (
              <div key={idx} className="p-5 bg-dark-elevated rounded-xl border border-dark-border">
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-5 h-5 text-accent-warning flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium mb-1">{adaptation.reason}</p>
                    <p className="text-white/60 text-sm">{adaptation.suggestion}</p>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button className="px-4 py-2 bg-accent-primary text-white rounded-lg font-medium text-sm hover:bg-accent-primary/90 transition-colors">
                    Apply
                  </button>
                  <button className="px-4 py-2 border border-dark-border hover:bg-dark-hover rounded-lg text-sm transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Best Days */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-medium">
        <h2 className="text-2xl font-bold mb-6">Your Best Workout Days</h2>
        <div className="space-y-4">
          {bestDays.map((day, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 bg-dark-elevated rounded-xl border border-dark-border">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-white/40">#{idx + 1}</div>
                <div>
                  <p className="font-bold text-lg">{day.day}</p>
                  <p className="text-sm text-white/60">{day.workouts} workouts completed</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent-success">{day.completion}%</div>
                <p className="text-sm text-white/60">completion</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimal Time */}
      {optimalTime && (
        <div className="bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30 rounded-2xl p-6 shadow-medium">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-accent-primary/20 rounded-xl">
                <Clock className="w-8 h-8 text-accent-primary" />
              </div>
              <div>
                <p className="text-sm text-white/60 font-medium mb-1">Suggested Workout Time</p>
                <p className="text-2xl font-bold">{optimalTime.startTime} - {optimalTime.endTime}</p>
                <p className="text-sm text-white/70 mt-1">{optimalTime.reason}</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-accent-primary text-white rounded-xl font-bold hover:bg-accent-primary/90 transition-colors">
              Update Schedule
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
