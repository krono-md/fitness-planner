import React from 'react'
import { TrendingUp, Calendar, Target, Flame, Award, Dumbbell, Heart, Zap, Activity } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

export default function Progress() {
  const { user, workoutSessions, goals } = useAppStore()

  // Mock data for demonstration
  const weeklyData = [
    { day: 'Mon', workouts: 1, duration: 28 },
    { day: 'Tue', workouts: 0, duration: 0 },
    { day: 'Wed', workouts: 1, duration: 32 },
    { day: 'Thu', workouts: 0, duration: 0 },
    { day: 'Fri', workouts: 1, duration: 25 },
    { day: 'Sat', workouts: 1, duration: 45 },
    { day: 'Sun', workouts: 0, duration: 0 },
  ]

  const consistencyData = [
    { month: 'Jun', rate: 65 },
    { month: 'Jul', rate: 72 },
    { month: 'Aug', rate: 82 },
  ]

  const fitnessRadar = [
    { area: 'Strength', value: 75 },
    { area: 'Endurance', value: 60 },
    { area: 'Mobility', value: 45 },
    { area: 'Consistency', value: 82 },
    { area: 'Recovery', value: 70 },
  ]

  const stats = [
    { label: 'Total Workouts', value: '24', icon: Dumbbell, color: 'text-accent-primary', bg: 'bg-accent-primary/20' },
    { label: 'This Month', value: '12', icon: Calendar, color: 'text-accent-secondary', bg: 'bg-accent-secondary/20' },
    { label: 'Current Streak', value: '5', icon: Flame, color: 'text-accent-warning', bg: 'bg-accent-warning/20' },
    { label: 'Goals Met', value: '3/5', icon: Target, color: 'text-accent-success', bg: 'bg-accent-success/20' },
  ]

  const achievements = [
    { icon: Award, title: '5-Day Streak', desc: 'Completed workouts 5 days in a row', date: 'Aug 25' },
    { icon: Activity, title: 'First Month', desc: 'Completed your first month of workouts', date: 'Aug 1' },
    { icon: Heart, title: 'Recovery Pro', desc: 'Logged sleep for 7 consecutive days', date: 'Aug 20' },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Progress</h1>
        <p className="text-white/60 text-sm md:text-base">Track your fitness journey and achievements</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-dark-surface border border-dark-border rounded-xl p-3 md:p-4">
              <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                <div className={`p-1.5 md:p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                </div>
                <span className="text-xs md:text-sm text-white/60">{stat.label}</span>
              </div>
              <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Weekly Activity */}
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Weekly Activity</h2>
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
                <Bar
                  dataKey="duration"
                  fill="#6366f1"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fitness Radar */}
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Fitness Profile</h2>
          <div className="h-48 md:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={fitnessRadar}>
                <PolarGrid stroke="#262626" />
                <PolarAngleAxis
                  dataKey="area"
                  stroke="#666"
                  fontSize={10}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  stroke="#262626"
                  fontSize={8}
                />
                <Radar
                  name="Fitness"
                  dataKey="value"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Consistency Trend */}
      <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Consistency Trend</h2>
        <div className="h-36 md:h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={consistencyData}>
              <XAxis
                dataKey="month"
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
                domain={[0, 100]}
                ticks={[0, 25, 50, 75, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #262626',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value}%`, 'Completion Rate']}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {achievements.map((achievement, idx) => {
            const Icon = achievement.icon
            return (
              <div key={idx} className="bg-dark-surface border border-dark-border rounded-xl p-3 md:p-4 flex items-start gap-3 md:gap-4">
                <div className="p-2 md:p-3 bg-gradient-to-br from-accent-warning/20 to-accent-warning/5 rounded-xl">
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-accent-warning" />
                </div>
                <div>
                  <h3 className="font-bold mb-0.5 md:mb-1 text-sm md:text-base">{achievement.title}</h3>
                  <p className="text-xs md:text-sm text-white/60 mb-1 md:mb-2">{achievement.desc}</p>
                  <span className="text-xs text-white/40">{achievement.date}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Goal Progress */}
      <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Goal Progress</h2>
        <div className="space-y-3 md:space-y-4">
          {[
            { title: 'Complete 20 workouts this month', current: 12, target: 20, color: 'bg-accent-primary' },
            { title: 'Maintain 7-day streak', current: 5, target: 7, color: 'bg-accent-warning' },
            { title: 'Log sleep for 30 days', current: 18, target: 30, color: 'bg-accent-secondary' },
          ].map((goal, idx) => (
            <div key={idx} className="space-y-1.5 md:space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-sm md:text-base">{goal.title}</span>
                <span className="text-white/60 text-sm">{goal.current}/{goal.target}</span>
              </div>
              <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
                <div
                  className={`h-full ${goal.color} rounded-full transition-all duration-500`}
                  style={{ width: `${(goal.current / goal.target) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}