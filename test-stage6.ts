// Stage 6 test: Progress page derivations all reflect real data, not placeholders.
// Composes 10 days of fake-but-realistic data for `busy_student` and asserts
// every new util returns the expected shape.

import { mockUsers } from './src/data/mockUsers'
import { PersonalizationEngine } from './src/engine/personalizationEngine'
import { WorkoutSession, SleepRecord, Goal, UserProfile, Workout } from './src/types'
import {
  calculateStreak,
  calculateConsistency,
  calculateScheduleAdherence,
  calculateWeeklyCompleted,
  calculateExerciseProgression,
  calculateSleepTrend,
  calculateAverageSleep,
  computeAchievements,
  localDateKey,
} from './src/utils/stats'

let pass = 0
let fail = 0
const check = (name: string, cond: boolean, detail?: string) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`) }
}

// ─── Helpers ──────────────────────────────────────────────────────────────
function todayMinus(days: number, hour = 9): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, 0, 0, 0)
  return d.toISOString()
}

function makeCompletedSession(overrides: Partial<WorkoutSession>): WorkoutSession {
  return {
    id: `s_${Math.random().toString(36).slice(2)}`,
    workoutId: 'w',
    userId: 'u',
    date: new Date().toISOString(),
    completed: true,
    exercisesCompleted: 4,
    duration: 25,
    difficulty: 'moderate',
    ...overrides,
  }
}

function makeSkippedSession(overrides: Partial<WorkoutSession>): WorkoutSession {
  return {
    id: `s_${Math.random().toString(36).slice(2)}`,
    workoutId: 'w',
    userId: 'u',
    date: new Date().toISOString(),
    completed: false,
    exercisesCompleted: 0,
    duration: 0,
    difficulty: 'moderate',
    ...overrides,
  }
}

const profile: UserProfile = mockUsers.busy_student
const plan: Workout[] = PersonalizationEngine.generatePlan(profile, [])

console.log('\n══════════════════════════════════════════════════════════════════════')
console.log('  Stage 6: Progress')
console.log('══════════════════════════════════════════════════════════════════════\n')

// ─── 1. Build the synthetic 10-day history ──────────────────────────────
const sessions: WorkoutSession[] = [
  // Two consecutive days, today + yesterday, so streak = 2
  makeCompletedSession({ date: todayMinus(0), workoutId: plan[0].id }),
  makeCompletedSession({ date: todayMinus(1), workoutId: plan[0].id }),
  // 3 days ago, 5 days ago
  makeCompletedSession({ date: todayMinus(3), workoutId: plan[0].id }),
  makeCompletedSession({ date: todayMinus(5), workoutId: plan[0].id }),
  // 7 days ago (one completion, but this falls inside the 7-day window for consistency)
  makeCompletedSession({ date: todayMinus(7), workoutId: plan[0].id }),
  // 8 days ago, outside the consistency window
  makeCompletedSession({ date: todayMinus(8), workoutId: plan[0].id }),
  // One of the completions was after an Adjust
  makeCompletedSession({
    date: todayMinus(3),
    workoutId: plan[0].id,
    wasAdjusted: true,
    adjustReason: 'less_time',
  }),
  // One skip, today
  makeSkippedSession({ date: todayMinus(0), workoutId: plan[0].id, rescheduledFrom: 'Wednesday' }),
]

const sleepRecords: SleepRecord[] = [
  { id: 'sl_1', userId: 'u', date: localDateKey(new Date(Date.now() - 0 * 86400000)), bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 'good' },
  { id: 'sl_2', userId: 'u', date: localDateKey(new Date(Date.now() - 1 * 86400000)), bedtime: '00:30', wakeTime: '06:30', duration: 6, quality: 'fair' },
  { id: 'sl_3', userId: 'u', date: localDateKey(new Date(Date.now() - 2 * 86400000)), bedtime: '01:00', wakeTime: '05:00', duration: 4, quality: 'poor' },
  { id: 'sl_4', userId: 'u', date: localDateKey(new Date(Date.now() - 6 * 86400000)), bedtime: '22:30', wakeTime: '06:30', duration: 8, quality: 'excellent' },
]

const goals: Goal[] = [
  {
    id: 'g1', userId: 'u', title: 'Hit 4 workouts this week', description: '',
    category: 'workouts', target: 4, current: 2, unit: 'workouts', completed: false,
  },
  {
    id: 'g2', userId: 'u', title: 'Sleep 7+ hours for 5 nights', description: '',
    category: 'consistency', target: 5, current: 5, unit: 'nights', completed: true,
  },
]

// ─── 2. Streak + consistency ─────────────────────────────────────────────
console.log('─── Test 1: Streak and consistency from the 10-day history ───')
{
  const streak = calculateStreak(sessions)
  check(`streak = 2 (today + yesterday)`, streak === 2, `got ${streak}`)

  // busy_student.workoutsPerWeek = 2
  const c = calculateConsistency(sessions, profile.workoutsPerWeek)
  // Window: last 7 days, completed only. We have 6 completions within 7 days (day 0,1,3,5,7 — that's 5; day 8 is outside).
  // Wait — day 7 is exactly 7 days ago, weekAgo is "7 days back from now". `new Date(s.date) >= weekAgo` includes day 7.
  // So 5 completions in window, target 2 → 5/2 = 250% capped at 100
  check(`consistency capped at 100% (got ${c}%)`, c === 100, `got ${c}%`)
}

// ─── 3. Schedule adherence ──────────────────────────────────────────────
console.log('\n─── Test 2: Schedule adherence counts only planned days ───')
{
  const pct = calculateScheduleAdherence(sessions, plan)
  // planned days = busy_student's 2 preferred days; check that the function
  // returns a sensible non-zero value (not the exact number, since the planned
  // days depend on the engine's day-selection logic)
  check(`adherence is between 0 and 100`, pct >= 0 && pct <= 100, `got ${pct}%`)
  check(`adherence is non-zero (we have completions on planned days)`, pct > 0, `got ${pct}%`)

  // No plan → 0
  const noPlan = calculateScheduleAdherence(sessions, [])
  check(`adherence is 0 when no plan`, noPlan === 0, `got ${noPlan}%`)
}

// ─── 4. Weekly completed (7-day stacked data) ───────────────────────────
console.log('\n─── Test 3: Weekly completed/skipped for the 7-day bar chart ───')
{
  const wk = calculateWeeklyCompleted(sessions)
  check(`returns 7 days`, wk.length === 7, `got ${wk.length}`)
  // Today (day 0) we have 1 completed + 1 skipped (and also a dup completed at day 3 with adjusted)
  const today = wk.find(d => d.day === new Date().toLocaleDateString('en-US', { weekday: 'short' }))!
  check(`today has 1 completed and 1 skipped`, today.completed === 1 && today.skipped === 1,
    `got completed=${today.completed} skipped=${today.skipped}`)
  // Yesterday (day 1) we have 1 completed, 0 skipped
  const yestDate = new Date()
  yestDate.setDate(yestDate.getDate() - 1)
  const yesterday = wk.find(d => d.day === yestDate.toLocaleDateString('en-US', { weekday: 'short' }))!
  check(`yesterday has 1 completed`, yesterday.completed === 1, `got ${yesterday.completed}`)
  // Total minutes should be > 0
  const totalMin = wk.reduce((s, d) => s + d.minutes, 0)
  check(`total minutes across week > 0`, totalMin > 0, `got ${totalMin}`)
}

// ─── 5. Exercise progression (top 3 by completion count) ────────────────
console.log('\n─── Test 4: Exercise progression caps at top 3 ───')
{
  const prog = calculateExerciseProgression(sessions, plan, 3)
  check(`at most 3 entries`, prog.length <= 3, `got ${prog.length}`)
  // All entries have count >= 3 (we set 6 completed across 4 weeks)
  check(`all entries have count >= 3`, prog.every(e => e.count >= 3))
  check(`sorted by count desc`, prog.every((e, i) => i === 0 || prog[i - 1].count >= e.count))
  // weeklyTrend should be 4 weeks
  check(`weeklyTrend has 4 buckets`, prog[0]?.weeklyTrend.length === 4)
}

// ─── 6. Sleep trend (7 days with nulls for missing days) ─────────────────
console.log('\n─── Test 5: Sleep trend shows nulls for days with no record ───')
{
  const trend = calculateSleepTrend(sleepRecords)
  check(`returns 7 days`, trend.length === 7, `got ${trend.length}`)
  // The 4h record from 2 days ago should be present (4)
  const d2 = trend.find(t => t.day === new Date(Date.now() - 2 * 86400000).toLocaleDateString('en-US', { weekday: 'short' }))!
  check(`2-days-ago has 4h logged`, d2.hours === 4, `got ${d2.hours}`)
  // Today: 8h
  const today = trend.find(t => t.day === new Date().toLocaleDateString('en-US', { weekday: 'short' }))!
  check(`today has 8h logged`, today.hours === 8, `got ${today.hours}`)
  // Some day should be null (we have 4 records across 7 days)
  const nulls = trend.filter(t => t.hours === null).length
  check(`some days are null (gaps)`, nulls === 3, `got ${nulls} nulls`)
}

// ─── 7. Average sleep ───────────────────────────────────────────────────
console.log('\n─── Test 6: Average sleep rolls up records correctly ───')
{
  const avg = calculateAverageSleep(sleepRecords, 7)
  check(`avg duration is the mean (${avg?.duration}h)`, avg !== null && Math.abs(avg.duration - 6.5) < 0.1,
    `got ${avg?.duration}`)
  // No records → null
  const empty = calculateAverageSleep([], 7)
  check(`null when no records`, empty === null)
}

// ─── 8. Achievements ────────────────────────────────────────────────────
console.log('\n─── Test 7: Achievements derive from real milestones ───')
{
  const streak = calculateStreak(sessions)
  const ach = computeAchievements(sessions, sleepRecords, streak, goals)
  check(`at most 3 achievements (capped)`, ach.length <= 3, `got ${ach.length}`)
  // All three foundational achievements should be visible since they're
  // earned and we only have 4 total (Goal Getter, First Workout, Started
  // Tracking Sleep, Adapted). The cap-3 means at most one gets dropped;
  // we just need to make sure the most recent three are the right ones.
  const ids = ach.map(a => a.id)
  check(`includes at least 3 of: First Workout / Sleep / Adapted / Goal Getter`,
    ['first_workout', 'first_sleep', 'adapted', 'goal_getter'].filter(id => ids.includes(id)).length === 3,
    `got [${ids.join(', ')}]`)
  // The most-recent-date achievement should always be in (since cap=3 and
  // the rest are foundational, the top 3 by date get shown).
  check(`includes the today-dated Goal Getter (most recent)`, ids.includes('goal_getter'),
    `got [${ids.join(', ')}]`)
  // No achievements with empty data
  const none = computeAchievements([], [], 0, [])
  check(`no achievements with empty data`, none.length === 0, `got ${none.length}`)
}

// ─── 9. End-to-end: every page panel would have data ────────────────────
console.log('\n─── Test 8: End-to-end — every page derivation has data ───')
{
  // Quick stats
  const totalCompleted = sessions.filter(s => s.completed).length
  // 6 unique days but day 3 has two completions (one normal, one wasAdjusted),
  // so the count is 7
  check(`Total Workouts tile = ${totalCompleted} (includes adjusted on day 3)`, totalCompleted === 7, `got ${totalCompleted}`)

  // Schedule adherence
  const adh = calculateScheduleAdherence(sessions, plan)
  check(`Schedule Adherence shows a real number (${adh}%)`, adh >= 0, `got ${adh}`)

  // Goals: 1 in progress, 1 complete
  const completed = goals.filter(g => g.completed).length
  check(`Goals Met = ${completed}/${goals.length}`, completed === 1 && goals.length === 2)

  // Radar
  const fitnessRadar = [
    { area: 'Strength', value: Math.min(100, Math.round((sessions.filter(s => s.completed).reduce((s, x) => s + x.exercisesCompleted, 0) / totalCompleted) * 20)) },
    { area: 'Recovery', value: calculateAverageSleep(sleepRecords, 7) ? Math.round((calculateAverageSleep(sleepRecords, 7)!.duration / 8) * 100) : 0 },
  ]
  check(`Strength radar > 0 (sessions had exercises)`, fitnessRadar[0].value > 0, `got ${fitnessRadar[0].value}`)
  check(`Recovery radar > 0 (we have sleep)`, fitnessRadar[1].value > 0, `got ${fitnessRadar[1].value}`)
}

console.log('\n══════════════════════════════════════════════════════════════════════')
console.log(`  Result: ${pass} passed, ${fail} failed`)
console.log('══════════════════════════════════════════════════════════════════════\n')
process.exit(fail === 0 ? 0 : 1)
