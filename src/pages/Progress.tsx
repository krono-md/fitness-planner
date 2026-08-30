import React, { useMemo } from 'react'
import {
  TrendingUp,
  Calendar,
  Target,
  Flame,
  Award,
  Dumbbell,
  Heart,
  Moon,
  Activity,
  Sparkles,
  BarChart3,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts'
import {
  calculateStreak,
  calculateConsistency,
  calculateScheduleAdherence,
  calculateWeeklyCompleted,
  calculateExerciseProgression,
  calculateSleepTrend,
  calculateAverageSleep,
  computeAchievements,
} from '../utils/stats'

const QUALITY_NUM: Record<string, number> = { excellent: 4, good: 3, fair: 2, poor: 1 }

export default function Progress() {
  const { user, workoutSessions, sleepRecords, goals, userPlan } = useAppStore()

  // All derivations are pure — memoize so a re-render without data changes
  // doesn't recompute, but a freshly logged workout does.
  const completedSessions = useMemo(
    () => workoutSessions.filter(s => s.completed),
    [workoutSessions]
  )
  const streak = useMemo(() => calculateStreak(workoutSessions), [workoutSessions])
  const consistency = useMemo(
    () => (user ? calculateConsistency(workoutSessions, user.workoutsPerWeek) : 0),
    [workoutSessions, user]
  )
  const scheduleAdherence = useMemo(
    () => calculateScheduleAdherence(workoutSessions, userPlan),
    [workoutSessions, userPlan]
  )
  const weeklyData = useMemo(() => calculateWeeklyCompleted(workoutSessions), [workoutSessions])
  const exerciseProgression = useMemo(
    () => calculateExerciseProgression(workoutSessions, userPlan, 3),
    [workoutSessions, userPlan]
  )
  const sleepTrend = useMemo(() => calculateSleepTrend(sleepRecords), [sleepRecords])
  const avgSleep = useMemo(() => calculateAverageSleep(sleepRecords, 7), [sleepRecords])
  const achievements = useMemo(
    () => computeAchievements(workoutSessions, sleepRecords, streak, goals),
    [workoutSessions, sleepRecords, streak, goals]
  )

  // This-month completions — use local-month boundary so the tile isn't
  // affected by timezone drift.
  const thisMonthCount = useMemo(() => {
    const now = new Date()
    return completedSessions.filter(s => {
      const d = new Date(s.date)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    }).length
  }, [completedSessions])

  // Fitness Profile radar — five areas, each derived from real data and
  // clamped to 0–100. A 0 means "no data yet" and renders a soft note.
  const fitnessRadar = useMemo(() => {
    const completedCount = completedSessions.length
    const avgExercises =
      completedCount > 0
        ? completedSessions.reduce((s, x) => s + x.exercisesCompleted, 0) / completedCount
        : 0
    const totalMinutes = completedSessions.reduce((s, x) => s + (x.duration || 0), 0)
    const weeklyTarget = user?.workoutsPerWeek || 3
    return [
      {
        area: 'Strength',
        value: Math.min(100, Math.round(avgExercises * 20)), // 5 exercises ≈ 100
      },
      {
        area: 'Endurance',
        value: Math.min(100, Math.round(totalMinutes / 6)), // 10h total ≈ 100
      },
      {
        area: 'Mobility',
        value: Math.min(100, Math.round((completedCount / Math.max(1, weeklyTarget * 4)) * 100)),
      },
      { area: 'Consistency', value: consistency },
      {
        area: 'Recovery',
        value: avgSleep ? Math.min(100, Math.round((avgSleep.duration / 8) * 100)) : 0,
      },
    ]
  }, [completedSessions, consistency, avgSleep, user])

  const hasAnyData = workoutSessions.length > 0 || sleepRecords.length > 0
  const completedGoals = goals.filter(g => g.completed)
  const goalProgressLabel =
    goals.length === 0 ? '—' : `${completedGoals.length}/${goals.length}`

  const stats = [
    {
      label: 'Total Workouts',
      value: String(completedSessions.length),
      icon: Dumbbell,
      color: 'text-accent-primary',
      bg: 'bg-accent-primary/20',
      empty: 'Log your first workout',
    },
    {
      label: 'This Month',
      value: String(thisMonthCount),
      icon: Calendar,
      color: 'text-accent-secondary',
      bg: 'bg-accent-secondary/20',
      empty: 'No workouts yet this month',
    },
    {
      label: 'Current Streak',
      value: `${streak} ${streak === 1 ? 'day' : 'days'}`,
      icon: Flame,
      color: 'text-accent-warning',
      bg: 'bg-accent-warning/20',
      empty: 'Build a streak this week',
    },
    {
      label: 'Goals Met',
      value: goalProgressLabel,
      icon: Target,
      color: 'text-accent-success',
      bg: 'bg-accent-success/20',
      empty: 'Add a goal on the Goals page',
    },
  ]

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Progress</h1>
        <p className="text-white/60 text-sm md:text-base">
          {hasAnyData
            ? 'Tracking what you have actually done — not placeholder numbers.'
            : 'Log a workout or sleep entry to see your progress come to life.'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          const isEmpty =
            (stat.label === 'Total Workouts' && completedSessions.length === 0) ||
            (stat.label === 'This Month' && thisMonthCount === 0) ||
            (stat.label === 'Current Streak' && streak === 0) ||
            (stat.label === 'Goals Met' && goals.length === 0)
          return (
            <div
              key={idx}
              className="bg-dark-surface border border-dark-border rounded-xl p-3 md:p-4"
            >
              <div className="flex items-center gap-2 md:gap-3 mb-1.5 md:mb-2">
                <div className={`p-1.5 md:p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-4 h-4 md:w-5 md:h-5 ${stat.color}`} />
                </div>
                <span className="text-xs md:text-sm text-white/60">{stat.label}</span>
              </div>
              <div className="text-xl md:text-2xl font-bold">{stat.value}</div>
              {isEmpty && (
                <div className="text-2xs text-white/40 mt-0.5">{stat.empty}</div>
              )}
            </div>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Weekly Activity (now stacked completed/skipped) */}
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">This Week</h2>
            <span className="text-2xs text-white/50">
              {weeklyData.reduce((s, d) => s + d.completed, 0)} done ·{' '}
              {weeklyData.reduce((s, d) => s + d.skipped, 0)} skipped
            </span>
          </div>
          <div className="h-48 md:h-64">
            {completedSessions.length === 0 && weeklyData.every(d => d.completed === 0) ? (
              <EmptyChart message="Log a workout to see your week at a glance." />
            ) : (
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
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar
                    dataKey="completed"
                    stackId="a"
                    fill="#6366f1"
                    name="Completed"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="skipped"
                    stackId="a"
                    fill="#ef4444"
                    name="Skipped"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Fitness Profile (now derived from real data) */}
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Fitness Profile</h2>
          <div className="h-48 md:h-64">
            {!hasAnyData ? (
              <EmptyChart message="Complete a few workouts to fill this in." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={fitnessRadar}>
                  <PolarGrid stroke="#262626" />
                  <PolarAngleAxis dataKey="area" stroke="#666" fontSize={10} />
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
            )}
          </div>
        </div>
      </div>

      {/* Schedule Adherence + Sleep Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Schedule Adherence */}
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold">Schedule Adherence</h2>
            <span className="text-2xs text-white/50">Last 7 days</span>
          </div>
          <div className="flex items-end gap-3 mb-4">
            <div className="text-4xl md:text-5xl font-bold text-accent-success">
              {scheduleAdherence}%
            </div>
            <div className="text-xs text-white/50 pb-2">
              of planned workouts completed
            </div>
          </div>
          <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-primary to-accent-success rounded-full transition-all duration-500"
              style={{ width: `${scheduleAdherence}%` }}
            />
          </div>
          {userPlan.length === 0 && (
            <p className="text-2xs text-white/40 mt-3">
              Generate a plan first — adherence needs planned days to compare against.
            </p>
          )}
        </div>

        {/* Sleep Trend (7 days) */}
        <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h2 className="text-lg md:text-xl font-bold">Sleep Trend</h2>
            {avgSleep ? (
              <div className="text-right">
                <div className="text-2xs text-white/50">7-day average</div>
                <div className="text-sm font-semibold text-accent-primary">
                  {avgSleep.duration}h · {avgSleep.quality}
                </div>
              </div>
            ) : (
              <span className="text-2xs text-white/50">No sleep logged</span>
            )}
          </div>
          <div className="h-36 md:h-48">
            {sleepRecords.length === 0 ? (
              <EmptyChart message="Log a few nights of sleep to see your trend." />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sleepTrend}>
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
                    domain={[0, 12]}
                    ticks={[0, 4, 8, 12]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1a1a',
                      border: '1px solid #262626',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: '#fff' }}
                    formatter={(value) => (value == null ? '—' : [`${value}h`, 'Hours'])}
                  />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                    connectNulls
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Exercise Progression */}
      <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent-primary" />
              Exercise Progression
            </h2>
            <p className="text-2xs text-white/50 mt-0.5">
              Top moves over the last 4 weeks (need 3+ completions to appear)
            </p>
          </div>
        </div>
        {exerciseProgression.length === 0 ? (
          <div className="py-8 text-center">
            <Sparkles className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/60">No qualifying exercises yet.</p>
            <p className="text-2xs text-white/40 mt-1">
              Keep logging to see your strongest moves.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {exerciseProgression.map((ex) => (
              <div key={ex.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-medium text-sm md:text-base">{ex.name}</span>
                  <span className="text-2xs text-white/50">
                    {ex.count} {ex.count === 1 ? 'completion' : 'completions'}
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {ex.weeklyTrend.map((c, i) => {
                    const max = Math.max(...ex.weeklyTrend, 1)
                    return (
                      <div
                        key={i}
                        className="flex-1 h-8 bg-dark-elevated rounded-md overflow-hidden relative"
                        title={`Week ${4 - i}: ${c}`}
                      >
                        <div
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-accent-primary to-accent-secondary transition-all"
                          style={{ height: `${Math.max(8, (c / max) * 100)}%` }}
                        />
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between text-2xs text-white/30 mt-1">
                  <span>4w ago</span>
                  <span>this week</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Recent Achievements</h2>
        {achievements.length === 0 ? (
          <div className="bg-dark-surface border border-dark-border rounded-xl p-6 text-center">
            <Award className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/60">Your first milestone is one workout away.</p>
            <p className="text-2xs text-white/40 mt-1">
              Complete a session to unlock the "First Workout" achievement.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {achievements.map((a) => (
              <div
                key={a.id}
                className="bg-dark-surface border border-dark-border rounded-xl p-3 md:p-4 flex items-start gap-3 md:gap-4"
              >
                <div className="p-2 md:p-3 bg-gradient-to-br from-accent-warning/20 to-accent-warning/5 rounded-xl">
                  {a.id === 'first_sleep' ? (
                    <Moon className="w-5 h-5 md:w-6 md:h-6 text-accent-warning" />
                  ) : a.id === 'adapted' ? (
                    <Activity className="w-5 h-5 md:w-6 md:h-6 text-accent-warning" />
                  ) : a.id === 'goal_getter' ? (
                    <Target className="w-5 h-5 md:w-6 md:h-6 text-accent-warning" />
                  ) : (
                    <Award className="w-5 h-5 md:w-6 md:h-6 text-accent-warning" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold mb-0.5 md:mb-1 text-sm md:text-base">{a.title}</h3>
                  <p className="text-xs md:text-sm text-white/60 mb-1 md:mb-2">{a.description}</p>
                  <span className="text-xs text-white/40">
                    {new Date(a.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Goal Progress */}
      <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6">Goal Progress</h2>
        {goals.length === 0 ? (
          <div className="py-6 text-center">
            <Target className="w-8 h-8 text-white/20 mx-auto mb-2" />
            <p className="text-sm text-white/60">No goals set yet.</p>
            <p className="text-2xs text-white/40 mt-1">
              Head to the Goals page to add one and start tracking it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {goals.map((goal) => {
              const pct =
                goal.target > 0
                  ? Math.min(100, Math.round((goal.current / goal.target) * 100))
                  : 0
              const colorClass = goal.completed
                ? 'bg-accent-success'
                : goal.category === 'consistency'
                ? 'bg-accent-warning'
                : goal.category === 'endurance'
                ? 'bg-accent-secondary'
                : 'bg-accent-primary'
              return (
                <div key={goal.id}>
                  <div className="flex justify-between mb-1.5">
                    <span className="font-medium text-sm md:text-base">{goal.title}</span>
                    <span className="text-white/60 text-sm">
                      {goal.current}/{goal.target} {goal.unit}
                      {goal.completed && ' ✓'}
                    </span>
                  </div>
                  <div className="h-2 bg-dark-elevated rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass} rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Quick Summary Footer (sleep + schedule together) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <SummaryTile
          icon={Heart}
          label="Total Minutes"
          value={String(completedSessions.reduce((s, x) => s + (x.duration || 0), 0))}
          color="text-accent-secondary"
          bg="bg-accent-secondary/20"
        />
        <SummaryTile
          icon={Moon}
          label="Avg Sleep (7d)"
          value={avgSleep ? `${avgSleep.duration}h` : '—'}
          color="text-accent-primary"
          bg="bg-accent-primary/20"
        />
        <SummaryTile
          icon={TrendingUp}
          label="Adjusted Done"
          value={String(workoutSessions.filter(s => s.completed && s.wasAdjusted).length)}
          color="text-accent-warning"
          bg="bg-accent-warning/20"
        />
      </div>
    </div>
  )
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-4">
      <p className="text-sm text-white/50">{message}</p>
    </div>
  )
}

function SummaryTile({
  icon: Icon,
  label,
  value,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  color: string
  bg: string
}) {
  return (
    <div className="bg-dark-surface border border-dark-border rounded-xl p-3 md:p-4 flex items-center gap-3">
      <div className={`p-2 rounded-lg ${bg}`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <div className="text-2xs text-white/50">{label}</div>
        <div className="text-lg md:text-xl font-bold">{value}</div>
      </div>
    </div>
  )
}
