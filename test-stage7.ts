// Stage 7 test: AdaptiveEngine → store wiring.
//
// Verifies:
//   1. detectSkipPattern still surfaces ≥2 same-weekday skips
//   2. detectDifficultyPattern still surfaces 3+ hard sessions
//   3. applyAdaptiveSuggestions mutates the plan for skip_pattern
//   4. applyAdaptiveSuggestions is idempotent on (type, today) — the second
//      call for the same date+type is a no-op (lastAppliedAdaptations grows
//      but no extra mutations)
//   5. dismissAdaptiveSuggestion records a key without mutating the plan
//   6. lastAppliedAdaptations only ever holds "${type}:${YYYY-MM-DD}" strings
//
// Runs against the real store factory (no React) by calling `useAppStore`
// inside a fresh import boundary.

import './test-shim' // must be the very first import so localStorage exists
                     // before the store module is evaluated.

import { mockUsers } from './src/data/mockUsers'
import { AdaptiveEngine } from './src/engine/adaptiveEngine'
import { WorkoutSession, Workout, UserProfile } from './src/types'
import { useAppStore } from './src/store/appStore'
import { localDateKey } from './src/utils/stats'

let pass = 0
let fail = 0
const check = (name: string, cond: boolean, detail?: string) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`) }
}

// ─── Helpers ──────────────────────────────────────────────────────────────
const busy = mockUsers.busy_student

function makeSkip(weekdayIndex: number, weeksAgo: number): WorkoutSession {
  // 0 = Monday ... 6 = Sunday, JS: getDay 0=Sun..6=Sat
  const jsWeekday = weekdayIndex === 6 ? 0 : weekdayIndex + 1
  const d = new Date()
  // Walk back day-by-day until we land on the target weekday
  for (let i = 0; i < 14; i++) {
    const cand = new Date()
    cand.setDate(cand.getDate() - (weeksAgo * 7) - i)
    if (cand.getDay() === jsWeekday) {
      return {
        id: `skip_${weekdayIndex}_${weeksAgo}`,
        workoutId: 'w1',
        userId: busy.id,
        date: cand.toISOString(),
        completed: false,
        exercisesCompleted: 0,
        duration: 0,
        difficulty: 'moderate',
        rescheduledFrom: 'Wednesday',
      }
    }
  }
  // Should never reach here in tests
  return {
    id: 'skip_fallback',
    workoutId: 'w1',
    userId: busy.id,
    date: new Date().toISOString(),
    completed: false,
    exercisesCompleted: 0,
    duration: 0,
    difficulty: 'moderate',
    rescheduledFrom: 'Wednesday',
  }
}

function makeHardSession(weekdayIndex: number, weeksAgo: number): WorkoutSession {
  // Same weekday lookup as above
  const jsWeekday = weekdayIndex === 6 ? 0 : weekdayIndex + 1
  const d = new Date()
  for (let i = 0; i < 14; i++) {
    const cand = new Date()
    cand.setDate(cand.getDate() - (weeksAgo * 7) - i)
    if (cand.getDay() === jsWeekday) {
      return {
        id: `hard_${weekdayIndex}_${weeksAgo}`,
        workoutId: 'w1',
        userId: busy.id,
        date: cand.toISOString(),
        completed: true,
        exercisesCompleted: 6,
        duration: 28,
        difficulty: 'hard',
      }
    }
  }
  return {
    id: 'hard_fallback',
    workoutId: 'w1',
    userId: busy.id,
    date: new Date().toISOString(),
    completed: true,
    exercisesCompleted: 6,
    duration: 28,
    difficulty: 'hard',
  }
}

// ─── Tests ────────────────────────────────────────────────────────────────

// 1. detectSkipPattern: 2 Wednesday skips → adaptation with suggested day
console.log('1) detectSkipPattern on 2 same-weekday skips')
{
  const sessions = [makeSkip(2, 0), makeSkip(2, 1)] // 2 = Wednesday
  const result = AdaptiveEngine.analyzePatterns(sessions, busy)
  const skip = result.find(a => a.adaptationType === 'skip_pattern')
  check('returns a skip_pattern adaptation', skip !== undefined)
  check('suggested day is 2 days after Wednesday (Friday)', skip?.suggestion.includes('Friday') ?? false, skip?.suggestion)
}

// 2. detectDifficultyPattern: 3 hard sessions → difficulty_adjustment
console.log('\n2) detectDifficultyPattern on 3 hard sessions')
{
  const sessions = [makeHardSession(0, 0), makeHardSession(1, 0), makeHardSession(2, 0)]
  const result = AdaptiveEngine.analyzePatterns(sessions, busy)
  const diff = result.find(a => a.adaptationType === 'difficulty_adjustment')
  check('returns a difficulty_adjustment adaptation', diff !== undefined)
  check('reason mentions the hard rating', diff?.reason.toLowerCase().includes('hard') ?? false, diff?.reason)
}

// 3. applyAdaptiveSuggestions mutates the plan for a skip_pattern
console.log('\n3) applyAdaptiveSuggestions moves the recurring skip day')
{
  // Build a fresh plan with a Wednesday workout
  const plan: Workout[] = [
    { id: 'w_mon', userId: busy.id, name: 'Monday Workout', dayOfWeek: 'Monday', duration: 30, exercises: [{ id: 'e1', name: 'X', sets: 3, reps: '10', restSeconds: 60 }] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
    { id: 'w_wed', userId: busy.id, name: 'Wednesday Workout', dayOfWeek: 'Wednesday', duration: 30, exercises: [{ id: 'e1', name: 'X', sets: 3, reps: '10', restSeconds: 60 }] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
    { id: 'w_fri', userId: busy.id, name: 'Friday Workout', dayOfWeek: 'Friday', duration: 30, exercises: [{ id: 'e1', name: 'X', sets: 3, reps: '10', restSeconds: 60 }] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
  ]
  // Seed the store directly
  useAppStore.setState({ user: busy, userPlan: plan, workoutSessions: [makeSkip(2, 0), makeSkip(2, 1)], lastAppliedAdaptations: [] })
  const before = useAppStore.getState().userPlan.find(w => w.id === 'w_wed')?.dayOfWeek
  useAppStore.getState().applyAdaptiveSuggestions()
  const after = useAppStore.getState().userPlan.find(w => w.id === 'w_wed')?.dayOfWeek
  check('Wednesday workout was moved (not still Wednesday)', after !== 'Wednesday', `before=${before}, after=${after}`)
  check('New day is Friday (2 days later)', after === 'Friday', `got ${after}`)
  const applied = useAppStore.getState().lastAppliedAdaptations
  check('lastAppliedAdaptations records the skip_pattern key', applied.some(k => k.startsWith('skip_pattern:')), applied.join(','))
}

// 4. applyAdaptiveSuggestions is idempotent for the same (type, date)
console.log('\n4) applyAdaptiveSuggestions is idempotent on (type, today)')
{
  useAppStore.setState({
    user: busy,
    userPlan: [
      { id: 'w_wed', userId: busy.id, name: 'Wednesday Workout', dayOfWeek: 'Wednesday', duration: 30, exercises: [{ id: 'e1', name: 'X', sets: 3, reps: '10', restSeconds: 60 }] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
    ],
    workoutSessions: [makeSkip(2, 0), makeSkip(2, 1)],
    lastAppliedAdaptations: [],
  })
  useAppStore.getState().applyAdaptiveSuggestions()
  const planAfterFirst = useAppStore.getState().userPlan
  const keysAfterFirst = [...useAppStore.getState().lastAppliedAdaptations]
  // Call again — should not mutate plan
  useAppStore.getState().applyAdaptiveSuggestions()
  const planAfterSecond = useAppStore.getState().userPlan
  const keysAfterSecond = useAppStore.getState().lastAppliedAdaptations
  check('Plan is unchanged on second call', JSON.stringify(planAfterFirst) === JSON.stringify(planAfterSecond))
  check('lastAppliedAdaptations is unchanged on second call', JSON.stringify(keysAfterFirst) === JSON.stringify(keysAfterSecond))
}

// 5. dismissAdaptiveSuggestion records a key without mutating the plan
console.log('\n5) dismissAdaptiveSuggestion adds the key without changing the plan')
{
  useAppStore.setState({
    user: busy,
    userPlan: [
      { id: 'w_a', userId: busy.id, name: 'A', dayOfWeek: 'Monday', duration: 30, exercises: [] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
    ],
    workoutSessions: [],
    lastAppliedAdaptations: [],
  })
  const planBefore = useAppStore.getState().userPlan
  useAppStore.getState().dismissAdaptiveSuggestion('skip_pattern:2025-01-01')
  const planAfter = useAppStore.getState().userPlan
  const keys = useAppStore.getState().lastAppliedAdaptations
  check('Plan unchanged after dismiss', JSON.stringify(planBefore) === JSON.stringify(planAfter))
  check('Key added to lastAppliedAdaptations', keys.includes('skip_pattern:2025-01-01'), keys.join(','))
}

// 6. lastAppliedAdaptations only contains well-formed keys
console.log('\n6) lastAppliedAdaptations shape is always "${type}:${YYYY-MM-DD}"')
{
  // Run a few passes; the keys should always be type-prefixed and date-suffixed
  useAppStore.setState({ user: busy, userPlan: [], workoutSessions: [], lastAppliedAdaptations: [] })
  useAppStore.getState().applyAdaptiveSuggestions()
  useAppStore.getState().applyAdaptiveSuggestions()
  useAppStore.getState().dismissAdaptiveSuggestion('difficulty_adjustment:2025-01-02')
  const keys = useAppStore.getState().lastAppliedAdaptations
  const re = /^(skip_pattern|difficulty_adjustment|schedule_conflict|progression):\d{4}-\d{2}-\d{2}$/
  const allValid = keys.every(k => re.test(k))
  check(`all ${keys.length} keys match shape`, allValid, keys.join(','))
}

// ─── Summary ──────────────────────────────────────────────────────────────
console.log(`\n${pass}/${pass + fail} assertions passed`)
if (fail > 0) process.exit(1)
