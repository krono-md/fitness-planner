import { WorkoutSession, SleepRecord, Goal, Workout, UserProfile } from '../types'

/** YYYY-MM-DD in the local timezone (not UTC). Sessions are stamped via
 *  `new Date().toISOString()`, which is UTC, so reading back the date with
 *  `toISOString().split('T')[0]` will land on the wrong day in any timezone
 *  east of UTC. Use this everywhere we compare "what day did this happen on". */
export function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function calculateStreak(sessions: WorkoutSession[]): number {
  const completedDates = [...new Set(
    sessions
      .filter(s => s.completed)
      .map(s => localDateKey(new Date(s.date)))
  )].sort().reverse()

  if (completedDates.length === 0) return 0

  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  for (let i = 0; i < completedDates.length; i++) {
    const expected = new Date(today)
    expected.setDate(expected.getDate() - i)
    const expectedStr = localDateKey(expected)

    if (completedDates.includes(expectedStr)) {
      streak++
    } else if (i === 0) {
      // Allow streak if last workout was yesterday
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      if (completedDates[0] === localDateKey(yesterday)) {
        streak = 1
        for (let j = 1; j < completedDates.length; j++) {
          const exp = new Date(yesterday)
          exp.setDate(exp.getDate() - (j - 1))
          if (completedDates[j] === localDateKey(exp)) streak++
          else break
        }
      }
      break
    } else {
      break
    }
  }

  return streak
}

export function calculateConsistency(sessions: WorkoutSession[], weeklyTarget: number): number {
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const recent = sessions.filter(s => s.completed && new Date(s.date) >= weekAgo)
  if (weeklyTarget === 0) return 0
  return Math.min(100, Math.round((recent.length / weeklyTarget) * 100))
}

export function getInitials(name?: string): string {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
}

// ─── Stage 6: Progress page derivations ─────────────────────────────────────
// All helpers here are pure: they take the raw store data and return the
// derived shape the Progress page renders. No React, no store reads.

const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const DAY_LONG = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

/** Build the local-date keys for the last N days, oldest-first, ending today.
 *  Each entry is the key plus the matching JS Date for day-of-week lookups. */
function lastNDays(n: number): { key: string; date: Date; dayOfWeek: number }[] {
  const out: { key: string; date: Date; dayOfWeek: number }[] = []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    // JS getDay: 0=Sun..6=Sat; convert to 0=Mon..6=Sun for our ordering.
    const dayOfWeek = (d.getDay() + 6) % 7
    out.push({ key: localDateKey(d), date: d, dayOfWeek })
  }
  return out
}

/** Completed sessions in the last 7 days / planned workouts in the last 7
 *  days, as a 0–100 percentage. A "planned" day is one whose weekday is
 *  in the user's `userPlan`. Returns 0 when there's no plan or no sessions
 *  (so the UI can show "no data yet" instead of NaN). */
export function calculateScheduleAdherence(
  sessions: WorkoutSession[],
  plan: Workout[]
): number {
  if (!plan || plan.length === 0) return 0
  const plannedDays = new Set(plan.map(w => w.dayOfWeek))
  const week = lastNDays(7)
  let plannedCount = 0
  let completedCount = 0
  for (const { date, dayOfWeek } of week) {
    const dayName = DAY_LONG[dayOfWeek]
    if (!plannedDays.has(dayName)) continue
    plannedCount++
    // Did the user complete a session on this date? (Skips don't count.)
    const dateKey = localDateKey(date)
    if (sessions.some(s => s.completed && localDateKey(new Date(s.date)) === dateKey)) {
      completedCount++
    }
  }
  if (plannedCount === 0) return 0
  return Math.min(100, Math.round((completedCount / plannedCount) * 100))
}

/** Last 7 days of completed-vs-skipped, in stable Mon→Sun order. Each entry
 *  is a day the user logged something — or zero on a quiet day, so the bar
 *  chart never has a missing column. */
export function calculateWeeklyCompleted(
  sessions: WorkoutSession[]
): { day: string; completed: number; skipped: number; minutes: number }[] {
  const week = lastNDays(7)
  // Index the week by dayOfWeek (0=Mon..6=Sun) so we always get 7 slots in order.
  const slots = week.map(({ date, dayOfWeek }) => ({
    day: DAY_SHORT[dayOfWeek],
    key: localDateKey(date),
    completed: 0,
    skipped: 0,
    minutes: 0,
  }))
  for (const s of sessions) {
    const key = localDateKey(new Date(s.date))
    const slot = slots.find(x => x.key === key)
    if (!slot) continue
    if (s.completed) {
      slot.completed += 1
      slot.minutes += s.duration || 0
    } else {
      slot.skipped += 1
    }
  }
  return slots.map(({ key, ...rest }) => rest)
}

/** Last 7 days of total workout minutes, in Mon→Sun order. Zero on quiet
 *  days so the chart stays continuous. */
export function calculateWeeklyDuration(
  sessions: WorkoutSession[]
): { day: string; duration: number }[] {
  return calculateWeeklyCompleted(sessions).map(({ day, minutes }) => ({
    day,
    duration: minutes,
  }))
}

/** Per-exercise progression over the last 4 weeks. We pull exercise names
 *  off the session by looking at the workout definition in the plan, but
 *  sessions don't currently carry a copy of the exercise list — so we infer
 *  per-exercise attribution from `missedExercises` (inverted) and from
 *  `exercisesCompleted` (count). The trend bar is "how often did the user
 *  reach a session that included this exercise, week over week".
 *
 *  Since session.exerciseId[] isn't tracked today, we approximate by using
 *  the workout *name* as a proxy: each plan workout has a stable name, and
 *  sessions carry `workoutId`. We aggregate per-name for the trend.
 *  Returns at most `limit` entries, sorted by total completions desc. */
export function calculateExerciseProgression(
  sessions: WorkoutSession[],
  plan: Workout[],
  limit: number = 3
): { name: string; count: number; weeklyTrend: number[] }[] {
  if (plan.length === 0 || sessions.length === 0) return []

  // Map workoutId → workout name (so we can label the bucket per session)
  const idToName = new Map<string, string>()
  for (const w of plan) idToName.set(w.id, w.name)

  // Bucket sessions by workout name; we use the *name* as a stand-in for
  // "the exercise the user is most repeatedly working". This loses some
  // granularity (a workout has multiple exercises) but matches the data we
  // actually have on a completed session.
  const buckets = new Map<string, number[]>() // name → counts per week (oldest-first, length 4)
  const now = new Date()
  for (let w = 3; w >= 0; w--) {
    const weekStart = new Date(now)
    weekStart.setDate(weekStart.getDate() - (w * 7 + 7))
    const weekEnd = new Date(now)
    weekEnd.setDate(weekEnd.getDate() - w * 7)
    for (const s of sessions) {
      if (!s.completed) continue
      const d = new Date(s.date)
      if (d < weekStart || d >= weekEnd) continue
      const name = idToName.get(s.workoutId) || 'Workout'
      const arr = buckets.get(name) || [0, 0, 0, 0]
      arr[3 - w] += 1
      buckets.set(name, arr)
    }
  }

  const out: { name: string; count: number; weeklyTrend: number[] }[] = []
  for (const [name, weeklyTrend] of buckets) {
    const count = weeklyTrend.reduce((a, b) => a + b, 0)
    if (count < 3) continue // drop exercises without enough data
    out.push({ name, count, weeklyTrend })
  }
  out.sort((a, b) => b.count - a.count)
  return out.slice(0, limit)
}

/** Last 7 days of sleep in Mon→Sun order, with `null` on days the user
 *  didn't log so the line chart shows gaps honestly. `quality` is mapped
 *  to a 1–4 score for the secondary axis. */
export function calculateSleepTrend(
  records: SleepRecord[]
): { day: string; hours: number | null; quality: number | null }[] {
  const week = lastNDays(7)
  const slots = week.map(({ date, dayOfWeek }) => ({
    day: DAY_SHORT[dayOfWeek],
    key: localDateKey(date),
    hours: null as number | null,
    quality: null as number | null,
  }))
  for (const r of records) {
    const key = localDateKey(new Date(r.date))
    const slot = slots.find(x => x.key === key)
    if (!slot) continue
    slot.hours = r.duration
    slot.quality = r.quality === 'excellent' ? 4 : r.quality === 'good' ? 3 : r.quality === 'fair' ? 2 : 1
  }
  return slots
}

/** Mean duration and modal quality over the last `days` days. Returns
 *  `null` if there are no records (caller should render the empty state). */
export function calculateAverageSleep(
  records: SleepRecord[],
  days: number = 7
): { duration: number; quality: 'poor' | 'fair' | 'good' | 'excellent' } | null {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const recent = records.filter(r => new Date(r.date) >= cutoff)
  if (recent.length === 0) return null
  const duration = recent.reduce((sum, r) => sum + r.duration, 0) / recent.length
  // Modal quality
  const counts: Record<string, number> = { poor: 0, fair: 0, good: 0, excellent: 0 }
  for (const r of recent) counts[r.quality] = (counts[r.quality] || 0) + 1
  const quality = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'good') as
    | 'poor' | 'fair' | 'good' | 'excellent'
  return { duration: Math.round(duration * 10) / 10, quality }
}

export interface Achievement {
  id: string
  title: string
  description: string
  date: string
}

/** Real milestones, derived from logged data. Returns at most 3.
 *  We give "foundational" achievements (First Workout, Started Tracking
 *  Sleep, Goal Getter) priority — once a user does any of those, it's a
 *  permanent milestone that should remain visible. Streak and Adapted
 *  fill remaining slots. */
export function computeAchievements(
  sessions: WorkoutSession[],
  records: SleepRecord[],
  streak: number,
  goals: Goal[]
): Achievement[] {
  const out: Achievement[] = []
  const completed = sessions.filter(s => s.completed)
  const adjusted = sessions.filter(s => s.completed && s.wasAdjusted)

  // First workout — foundational, always shown once earned
  if (completed.length > 0) {
    const first = completed[0]
    out.push({
      id: 'first_workout',
      title: 'First Workout',
      description: `Logged your first session on ${new Date(first.date).toLocaleDateString()}.`,
      date: localDateKey(new Date(first.date)),
    })
  }

  // First sleep record — foundational
  if (records.length > 0) {
    const sorted = [...records].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    out.push({
      id: 'first_sleep',
      title: 'Started Tracking Sleep',
      description: `First sleep entry on ${new Date(sorted[0].date).toLocaleDateString()}.`,
      // Date = most recent sleep record, so it sorts ahead of older
      // foundational achievements and doesn't get sliced off when a user
      // earns newer ones.
      date: localDateKey(new Date(sorted[sorted.length - 1].date)),
    })
  }

  // Goal Getter — foundational
  const completedGoals = goals.filter(g => g.completed)
  if (completedGoals.length > 0) {
    out.push({
      id: 'goal_getter',
      title: 'Goal Getter',
      description: `Closed out ${completedGoals.length} goal${completedGoals.length === 1 ? '' : 's'}.`,
      date: todayKey(),
    })
  }

  // Streak — highest tier earned (3/5/7/14)
  let streakAchievement: Achievement | null = null
  if (streak >= 14) {
    streakAchievement = { id: 'streak_14', title: '14-Day Streak', description: 'Two weeks of consistency — impressive.', date: todayKey() }
  } else if (streak >= 7) {
    streakAchievement = { id: 'streak_7', title: '7-Day Streak', description: 'A full week of showing up.', date: todayKey() }
  } else if (streak >= 5) {
    streakAchievement = { id: 'streak_5', title: '5-Day Streak', description: 'Five days in a row — keep the momentum.', date: todayKey() }
  } else if (streak >= 3) {
    streakAchievement = { id: 'streak_3', title: '3-Day Streak', description: 'Three days in a row. The habit is forming.', date: todayKey() }
  }

  // Adapted & Crushed It — earned when the user pushed through an adjust
  let adaptedAchievement: Achievement | null = null
  if (adjusted.length > 0) {
    adaptedAchievement = {
      id: 'adapted',
      title: 'Adapted & Crushed It',
      description: `Completed ${adjusted.length} adjusted workout${adjusted.length === 1 ? '' : 's'} — you listen to your body.`,
      date: localDateKey(new Date(adjusted[0].date)),
    }
  }

  // Cap at 3. Foundational achievements always show once earned; remaining
  // slots go to streak + adapted (whichever applies, ordered by date desc).
  const fillers = [streakAchievement, adaptedAchievement].filter((x): x is Achievement => x !== null)
  fillers.sort((a, b) => (a.date < b.date ? 1 : -1))
  out.push(...fillers)

  // Date-desc final ordering for the UI
  out.sort((a, b) => (a.date < b.date ? 1 : -1))
  return out.slice(0, 3)
}

function todayKey(): string {
  return localDateKey(new Date())
}
