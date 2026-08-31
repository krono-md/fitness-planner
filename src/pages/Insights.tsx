import React, { useMemo } from 'react'
import { TrendingUp, Calendar, Clock, Flame, Zap, Lightbulb, CheckCircle, AlertCircle, BarChart3, PieChart as ChartPie, Trophy } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { AdaptiveEngine } from '../engine/adaptiveEngine'
import { DailyAdaptation } from '../types'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import {
  calculateWeeklyCompleted,
  calculateStreak,
  localDateKey,
  calculateConsistency,
} from '../utils/stats'

const DAY_FULL = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const TYPE_COLORS: Record<string, string> = {
  strength: '#6366f1',
  cardio: '#8b5cf6',
  mobility: '#10b981',
  rest: '#f59e0b',
}

/** Compute the workout-type distribution from a session + plan. Each
 *  completed session attributes 1 to the bucket matching its workout's
 *  `type` (defaulting to 'strength' for plans that don't set it). */
function distributionFromPlan(
  sessions: { workoutId: string; completed: boolean }[],
  plan: { id: string; type?: string }[]
): { name: string; value: number; color: string }[] {
  const idToType = new Map<string, string>()
  for (const w of plan) idToType.set(w.id, w.type || 'strength')
  const buckets: Record<string, number> = { strength: 0, cardio: 0, mobility: 0, rest: 0 }
  for (const s of sessions) {
    if (!s.completed) continue
    const t = idToType.get(s.workoutId) || 'strength'
    buckets[t] = (buckets[t] || 0) + 1
  }
  const total = Object.values(buckets).reduce((a, b) => a + b, 0)
  if (total === 0) return []
  return Object.entries(buckets)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({
      name: k[0].toUpperCase() + k.slice(1),
      value: Math.round((v / total) * 100),
      color: TYPE_COLORS[k] || '#94a3b8',
    }))
}

/** Best weekday by completion rate over the user's full session history. */
function bestConsistentDay(sessions: { date: string; completed: boolean }[]): { name: string; rate: number } | null {
  const buckets: Record<number, { done: number; total: number }> = {}
  for (const s of sessions) {
    const d = new Date(s.date)
    if (isNaN(d.getTime())) continue
    const dow = (d.getDay() + 6) % 7 // 0=Mon..6=Sun
    if (!buckets[dow]) buckets[dow] = { done: 0, total: 0 }
    buckets[dow].total += 1
    if (s.completed) buckets[dow].done += 1
  }
  let best: { name: string; rate: number } | null = null
  for (const [dow, { done, total }] of Object.entries(buckets)) {
    if (total < 2) continue
    const rate = done / total
    if (!best || rate > best.rate) {
      best = { name: DAY_FULL[Number(dow)], rate }
    }
  }
  return best
}

/** Mean duration of completed sessions, in whole minutes. */
function meanDuration(sessions: { completed: boolean; duration: number }[]): number {
  const completed = sessions.filter(s => s.completed)
  if (completed.length === 0) return 0
  return Math.round(completed.reduce((a, s) => a + s.duration, 0) / completed.length)
}

/** Completion rate of last 2 weeks vs prior 2 weeks, as a percent delta. */
function monthlyProgressDelta(sessions: { date: string; completed: boolean }[]): number {
  const now = new Date()
  const twoWeeksAgo = new Date(now)
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)
  const fourWeeksAgo = new Date(now)
  fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28)
  const inLast2 = sessions.filter(s => s.completed && new Date(s.date) >= twoWeeksAgo).length
  const inPrior2 = sessions.filter(s => s.completed && new Date(s.date) >= fourWeeksAgo && new Date(s.date) < twoWeeksAgo).length
  // Normalize to weekly rate (prior2 has 14 days; we scale to 7 for comparison)
  const recentRate = inLast2 / 2
  const priorRate = inPrior2 / 2
  if (priorRate === 0) return recentRate > 0 ? 100 : 0
  return Math.round(((recentRate - priorRate) / priorRate) * 100)
}

/** Longest streak across all completed sessions — independent of "current
 *  streak" which resets on a gap. We collapse sessions onto date keys, then
 *  walk contiguous runs. */
function longestStreak(sessions: { date: string; completed: boolean }[]): number {
  const keys = new Set(sessions.filter(s => s.completed).map(s => localDateKey(new Date(s.date))))
  if (keys.size === 0) return 0
  const sorted = [...keys].sort()
  // Build Date objects from the local-date keys so day arithmetic uses local time.
  const dates = sorted.map(k => {
    const [y, m, d] = k.split('-').map(Number)
    return new Date(y, m - 1, d)
  })
  let longest = 1
  let run = 1
  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1])
    prev.setDate(prev.getDate() + 1)
    if (localDateKey(prev) === localDateKey(dates[i])) {
      run++
      longest = Math.max(longest, run)
    } else {
      run = 1
    }
  }
  return longest
}

export default function Insights() {
  const { user, workoutSessions, userPlan, applyAdaptiveSuggestions, dismissAdaptiveSuggestion } = useAppStore()

  const adaptations = useMemo(
    () => user ? AdaptiveEngine.analyzePatterns(workoutSessions, user) : [],
    [user, workoutSessions]
  )
  const recommendations = useMemo(
    () => user ? AdaptiveEngine.generateRecommendations(workoutSessions, user) : [],
    [user, workoutSessions]
  )
  const optimalTime = useMemo(
    () => user ? AdaptiveEngine.suggestOptimalTime(workoutSessions, user) : null,
    [user, workoutSessions]
  )

  const weeklyData = useMemo(() => calculateWeeklyCompleted(workoutSessions), [workoutSessions])
  const distribution = useMemo(
    () => distributionFromPlan(workoutSessions, userPlan),
    [workoutSessions, userPlan]
  )
  const bestDay = useMemo(() => bestConsistentDay(workoutSessions), [workoutSessions])
  const avgDuration = useMemo(() => meanDuration(workoutSessions), [workoutSessions])
  const monthlyDelta = useMemo(() => monthlyProgressDelta(workoutSessions), [workoutSessions])
  const longest = useMemo(() => longestStreak(workoutSessions), [workoutSessions])
  const currentStreak = useMemo(() => calculateStreak(workoutSessions), [workoutSessions])

  const hasData = workoutSessions.length > 0

  // Apply/Dismiss handlers
  const handleApply = (adapt: DailyAdaptation) => {
    // applyAdaptiveSuggestions is idempotent on (type, today). Since the
    // user explicitly clicked Apply, force a re-run by re-analyzing and
    // calling the action with the current state.
    applyAdaptiveSuggestions()
  }
  const handleDismiss = (adapt: DailyAdaptation) => {
    const today = localDateKey(new Date())
    dismissAdaptiveSuggestion(`${adapt.adaptationType}:${today}`)
  }

  return (
    <div className="whop-page">
      <div className="mb-5">
        <h1 className="whop-page-title">Insights</h1>
        <p className="whop-page-sub">Personalized analytics and recommendations</p>
      </div>

      {!hasData && (
        <div className="whop-card p-10 text-center max-w-md mx-auto">
          <div className="whop-icon-tile bg-yellow-500/15 text-yellow-400 w-12 h-12 mx-auto mb-4">
            <Lightbulb className="w-6 h-6" />
          </div>
          <h2 className="whop-page-title text-lg mb-2">No data yet</h2>
          <p className="whop-page-sub mb-5">
            Log a workout to see insights here. We'll surface patterns and adapt your plan as you go.
          </p>
        </div>
      )}

      {hasData && (
        <>
          {/* Top stat row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
            <div className="whop-stat">
              <div className="whop-icon-tile bg-accent-primary/15 text-accent-primary mb-3">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-white/50 font-medium mb-0.5">Most Consistent Day</p>
              <div className="whop-stat-value">{bestDay?.name || '—'}</div>
              <p className="whop-micro">
                {bestDay ? `${Math.round(bestDay.rate * 100)}% completion rate` : 'Need more data'}
              </p>
            </div>
            <div className="whop-stat">
              <div className="whop-icon-tile bg-accent-secondary/15 text-accent-secondary mb-3">
                <Clock className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-white/50 font-medium mb-0.5">Avg Workout Duration</p>
              <div className="whop-stat-value">{avgDuration || 0}<span className="text-base text-white/40 ml-1">min</span></div>
              <p className="whop-micro">Across all logged sessions</p>
            </div>
            <div className="whop-stat">
              <div className="whop-icon-tile bg-accent-success/15 text-accent-success mb-3">
                <TrendingUp className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-white/50 font-medium mb-0.5">Monthly Progress</p>
              <div className={`whop-stat-value ${monthlyDelta >= 0 ? 'text-accent-success' : 'text-rose-400'}`}>
                {monthlyDelta >= 0 ? '+' : ''}{monthlyDelta}<span className="text-base text-white/40 ml-1">%</span>
              </div>
              <p className="whop-micro">Last 2 weeks vs prior 2</p>
            </div>
            <div className="whop-stat">
              <div className="whop-icon-tile bg-accent-warning/15 text-accent-warning mb-3">
                <Flame className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-white/50 font-medium mb-0.5">Longest Streak</p>
              <div className="whop-stat-value">{longest}<span className="text-base text-white/40 ml-1">days</span></div>
              <p className="whop-micro">
                {currentStreak > 0 ? `Currently on ${currentStreak}-day streak` : 'Start a new streak today'}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            <div className="whop-card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="whop-icon-tile bg-accent-primary/15 text-accent-primary">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-semibold text-[15px]">Weekly Consistency</h2>
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <XAxis dataKey="day" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f0f10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }}
                      labelStyle={{ color: '#fff' }}
                    />
                    <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="skipped" fill="rgba(255,255,255,0.08)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="whop-card p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="whop-icon-tile bg-accent-secondary/15 text-accent-secondary">
                  <ChartPie className="w-3.5 h-3.5" />
                </div>
                <h2 className="font-semibold text-[15px]">Workout Distribution</h2>
              </div>
              {distribution.length === 0 ? (
                <p className="whop-page-sub text-center py-8">No completed sessions yet</p>
              ) : (
                <>
                  <div className="h-48 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f0f10', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', fontSize: '12px' }}
                          labelStyle={{ color: '#fff' }}
                          formatter={(value: number) => `${value}%`}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3 mt-2">
                    {distribution.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-xs text-white/70">{item.name} · {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="whop-card p-5 mb-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="whop-icon-tile bg-accent-primary/15 text-accent-primary">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-semibold text-[15px]">Recommendations</h2>
                  <p className="whop-micro">Personalized suggestions based on your patterns</p>
                </div>
              </div>
              <div className="space-y-2">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <CheckCircle className="w-4 h-4 text-accent-success flex-shrink-0 mt-0.5" />
                    <p className="text-white/85 text-sm">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Adaptive suggestions — wired to the store */}
          {adaptations.length > 0 && (
            <div className="whop-card p-5 mb-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="whop-icon-tile bg-accent-warning/15 text-accent-warning">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h2 className="font-semibold text-[15px]">Plan Adjustments</h2>
                  <p className="whop-micro">Suggestions to optimize your plan</p>
                </div>
              </div>
              <div className="space-y-3">
                {adaptations.map((adaptation, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="flex items-start gap-2.5 mb-3">
                      <AlertCircle className="w-4 h-4 text-accent-warning flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm mb-0.5">{adaptation.reason}</p>
                        <p className="text-white/55 text-[13px]">{adaptation.suggestion}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApply(adaptation)}
                        className="whop-btn-primary text-xs px-3 py-1.5"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => handleDismiss(adaptation)}
                        className="whop-btn-ghost text-xs px-3 py-1.5"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimal Time */}
          {optimalTime && (
            <div className="whop-card whop-featured p-5 mb-5">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="whop-icon-tile bg-accent-primary/15 text-accent-primary w-11 h-11">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="whop-micro">Suggested Workout Time</p>
                    <p className="text-xl font-bold mt-0.5">{optimalTime.startTime} – {optimalTime.endTime}</p>
                    <p className="text-sm text-white/65 mt-0.5">{optimalTime.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-sm">
                  <Trophy className="w-4 h-4" />
                  <span>Adapts as you log</span>
                </div>
              </div>
            </div>
          )}

          {/* Consistency banner */}
          {user && (
            <div className="whop-card p-4 flex items-center gap-3">
              <div className="whop-icon-tile bg-accent-primary/15 text-accent-primary">
                <CheckCircle className="w-3.5 h-3.5" />
              </div>
              <p className="text-sm text-white/75">
                You're <span className="text-white font-semibold">{calculateConsistency(workoutSessions, user.workoutsPerWeek)}%</span> on track for your weekly goal of {user.workoutsPerWeek} sessions.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
