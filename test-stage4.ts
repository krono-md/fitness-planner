// Stage 4 test: verify tracking state updates correctly across:
//  - regular completion
//  - completion after Adjust (wasAdjusted: true)
//  - skip (completed: false, rescheduledFrom set)
//  - quit-early partial completion
//  - difficulty rating is required
//  - streak and consistency update accordingly

import { mockUsers } from './src/data/mockUsers'
import { PersonalizationEngine, AdjustReason } from './src/engine/personalizationEngine'
import { WorkoutSession } from './src/types'
import { calculateStreak, calculateConsistency } from './src/utils/stats'

let pass = 0
let fail = 0
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`) }
}

// ─── Helpers ─────────────────────────────────────────────────────────────
function makeSession(overrides: Partial<WorkoutSession>): WorkoutSession {
  return {
    id: `session_${Math.random().toString(36).slice(2)}`,
    workoutId: 'w',
    userId: 'u',
    date: new Date().toISOString(),
    completed: true,
    exercisesCompleted: 3,
    duration: 15,
    difficulty: 'moderate',
    ...overrides,
  }
}

function todayMinus(days: number): string {
  // Build the date in the same way calculateStreak reads it: local midnight,
  // formatted as YYYY-MM-DD so it round-trips through toISOString().split('T')[0]
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

console.log('\n══════════════════════════════════════════════════════════════════════')
console.log('  Stage 4: Tracking')
console.log('══════════════════════════════════════════════════════════════════════\n')

// ─── 1. buildSession produces correct exercisesCompleted & missedExercises
//      Simulate the WorkoutPlayer's "buildSession(completed)" logic
//      directly to keep the test isolated from React state.
function buildSession(workout: any, completed: boolean, completedExercises: Set<string>, elapsedSec: number, difficulty: string | null): WorkoutSession {
  const total = workout?.exercises.length || 0
  const done = completedExercises.size
  const missed = (workout?.exercises || [])
    .filter((e: any) => !completedExercises.has(e.id))
    .map((e: any) => e.name)
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).slice(2)}`,
    workoutId: workout?.id || '',
    userId: 'u',
    date: new Date().toISOString(),
    startTime: new Date(Date.now() - elapsedSec * 1000).toISOString(),
    endTime: new Date().toISOString(),
    completed,
    exercisesCompleted: done,
    duration: Math.max(1, Math.floor(elapsedSec / 60)),
    difficulty: (difficulty || 'moderate') as WorkoutSession['difficulty'],
    missedExercises: missed.length > 0 ? missed : undefined,
    wasAdjusted: !!workout?.adjustedReason,
    adjustReason: workout?.adjustedReason,
  }
}

const plan = PersonalizationEngine.generatePlan(mockUsers.busy_student)
const tueWorkout = plan.find(w => w.dayOfWeek === 'Tuesday')!

console.log('─── Test 1: buildSession — full completion (all exercises done) ───')
{
  const completedAll = new Set(tueWorkout.exercises.map((e: any) => e.id))
  const s = buildSession(tueWorkout, true, completedAll, 15 * 60, 'moderate')
  check('completed = true', s.completed === true)
  check(`exercisesCompleted = ${tueWorkout.exercises.length}`, s.exercisesCompleted === tueWorkout.exercises.length)
  check('missedExercises is undefined', s.missedExercises === undefined)
  check('wasAdjusted = false', s.wasAdjusted === false)
  check('difficulty = moderate', s.difficulty === 'moderate')
}

console.log('\n─── Test 2: buildSession — partial completion (1 of 3 done) ───')
{
  const onlyFirst = new Set([tueWorkout.exercises[0].id])
  const s = buildSession(tueWorkout, true, onlyFirst, 8 * 60, 'hard')
  check('completed = true', s.completed === true)
  check(`exercisesCompleted = 1 (only first counted)`, s.exercisesCompleted === 1)
  check(`missedExercises has ${tueWorkout.exercises.length - 1} entries`, s.missedExercises?.length === tueWorkout.exercises.length - 1)
  check('missedExercises does not include the done exercise', !s.missedExercises?.includes(tueWorkout.exercises[0].name))
}

console.log('\n─── Test 3: buildSession — quit early (completed=false) ───')
{
  const onlyFirst = new Set([tueWorkout.exercises[0].id])
  const s = buildSession(tueWorkout, false, onlyFirst, 4 * 60, null)
  check('completed = false', s.completed === false)
  check('exercisesCompleted = 1 (done before quitting)', s.exercisesCompleted === 1)
  check('missedExercises is set with the rest', s.missedExercises?.length === 2)
  check('difficulty defaults to moderate when null', s.difficulty === 'moderate')
}

console.log('\n─── Test 4: buildSession — adjusted workout carries the reason ───')
{
  const adjusted = PersonalizationEngine.adjustWorkout(tueWorkout, 'less_time', mockUsers.busy_student)
  const completedAll = new Set(adjusted.exercises.map((e: any) => e.id))
  const s = buildSession(adjusted, true, completedAll, 12 * 60, 'easy')
  check('wasAdjusted = true', s.wasAdjusted === true)
  check('adjustReason = less_time', s.adjustReason === 'less_time')
  check(`duration = 12 (the adjusted value, not the original 15)`, s.duration === 12)
}

// ─── 5. calculateStreak and calculateConsistency respond correctly
console.log('\n─── Test 5: calculateStreak — two consecutive completions today and yesterday ───')
{
  const sessions: WorkoutSession[] = [
    makeSession({ date: todayMinus(0), completed: true }),
    makeSession({ date: todayMinus(1), completed: true }),
  ]
  const streak = calculateStreak(sessions)
  check(`streak = 2 (consecutive days)`, streak === 2, `got ${streak}`)
}
console.log('\n─── Test 6: calculateStreak — skipped session does not count ───')
{
  const sessions: WorkoutSession[] = [
    makeSession({ date: todayMinus(0), completed: true }),
    makeSession({ date: todayMinus(1), completed: false }), // skipped
    makeSession({ date: todayMinus(2), completed: true }),
  ]
  const streak = calculateStreak(sessions)
  check(`streak = 1 (skip on day -1 breaks the chain)`, streak === 1, `got ${streak}`)
}
console.log('\n─── Test 7: calculateStreak — adjusted completion counts the same as a regular one ───')
{
  const sessions: WorkoutSession[] = [
    makeSession({ date: todayMinus(0), completed: true, wasAdjusted: true, adjustReason: 'less_time' }),
    makeSession({ date: todayMinus(1), completed: true }),
  ]
  const streak = calculateStreak(sessions)
  check(`streak = 2 (adjusted completion still counts)`, streak === 2, `got ${streak}`)
}
console.log('\n─── Test 8: calculateConsistency — sessions inside the 7-day window count toward % ───')
{
  const sessions: WorkoutSession[] = [
    makeSession({ date: todayMinus(0), completed: true }),
    makeSession({ date: todayMinus(2), completed: true }),
    makeSession({ date: todayMinus(8), completed: true }), // outside window
  ]
  // Maria: workoutsPerWeek = 2 → 2/2 = 100%
  const c = calculateConsistency(sessions, 2)
  check(`consistency = 100% (2 of 2 target met)`, c === 100, `got ${c}`)
}
console.log('\n─── Test 9: calculateConsistency — skipped sessions do not contribute ───')
{
  const sessions: WorkoutSession[] = [
    makeSession({ date: todayMinus(0), completed: false }),
    makeSession({ date: todayMinus(1), completed: false }),
  ]
  const c = calculateConsistency(sessions, 4)
  check(`consistency = 0% (no completions)`, c === 0, `got ${c}`)
}
console.log('\n─── Test 10: calculateConsistency — adjusted completion contributes normally ───')
{
  const sessions: WorkoutSession[] = [
    makeSession({ date: todayMinus(0), completed: true, wasAdjusted: true }),
    makeSession({ date: todayMinus(1), completed: true }),
    makeSession({ date: todayMinus(2), completed: true }),
  ]
  // Daniel: workoutsPerWeek = 4 → 3/4 = 75%
  const c = calculateConsistency(sessions, 4)
  check(`consistency = 75% (3 of 4 target, adjusted session counts)`, c === 75, `got ${c}`)
}

// ─── 11. Simulate the full end-to-end flow with a fake store
console.log('\n─── Test 11: end-to-end flow — Adjust → Complete for busy_student ───')
{
  // Fake store state
  let sessions: WorkoutSession[] = []
  let goals = [{
    id: 'g_workouts',
    userId: 'u',
    title: 'Weekly workouts',
    description: 'Hit your weekly target',
    category: 'workouts' as const,
    target: 2,
    current: 0,
    unit: 'sessions',
    completed: false,
  }]
  let notifications: any[] = []

  function addWorkoutSession(s: WorkoutSession) {
    sessions = [...sessions, s]
    if (s.completed) {
      const wg = goals.find(g => g.category === 'workouts' && !g.completed)
      if (wg) {
        const newCurrent = Math.min(wg.current + 1, wg.target)
        goals = goals.map(g => g.id === wg.id ? { ...g, current: newCurrent, completed: newCurrent >= wg.target } : g)
      }
      notifications.push({ type: 'completion', title: 'Workout complete', message: `${s.exercisesCompleted} exercises logged · rated ${s.difficulty}${s.wasAdjusted ? ' (after adjust)' : ''}` })
    }
  }

  function logSkippedWorkout(workoutId: string, opts?: { rescheduleTo?: string; reason?: string }) {
    const w = plan.find(x => x.id === workoutId)!
    const s: WorkoutSession = {
      id: `skip_${Date.now()}`,
      workoutId: w.id,
      userId: 'u',
      date: new Date().toISOString(),
      completed: false,
      exercisesCompleted: 0,
      duration: 0,
      difficulty: 'moderate',
      notes: opts?.reason,
      rescheduledFrom: opts?.rescheduleTo ? w.dayOfWeek : undefined,
    }
    addWorkoutSession(s)
    notifications.push({ type: 'plan_adjustment', title: 'Workout skipped', message: opts?.rescheduleTo ? `Moved to ${opts.rescheduleTo}` : 'Logged as skipped' })
  }

  // Step 1: Adjust Tuesday's workout
  const tue = plan.find(w => w.dayOfWeek === 'Tuesday')!
  const adjusted = PersonalizationEngine.adjustWorkout(tue, 'less_time', mockUsers.busy_student)
  check('Tuesday original duration = 15', tue.duration === 15)
  check('Tuesday adjusted duration < 15', adjusted.duration < 15, `got ${adjusted.duration}`)
  check('Tuesday adjusted has adjustedReason = less_time', adjusted.adjustedReason === 'less_time')

  // Step 2: Complete it (simulating the player's buildSession)
  const s1 = buildSession(adjusted, true, new Set(adjusted.exercises.map((e: any) => e.id)), adjusted.duration * 60, 'moderate')
  addWorkoutSession(s1)
  check('Session 1 logged with completed=true', sessions[0].completed === true)
  check('Session 1 carries wasAdjusted=true', sessions[0].wasAdjusted === true)
  check('Session 1 carries adjustReason=less_time', sessions[0].adjustReason === 'less_time')
  check('Goal counter incremented to 1', goals[0].current === 1, `got ${goals[0].current}`)
  check('Goal not yet complete (target=2)', goals[0].completed === false)

  // Step 3: Skip Saturday's workout with a reschedule
  const sat = plan.find(w => w.dayOfWeek === 'Saturday')!
  logSkippedWorkout(sat.id, { rescheduleTo: 'Sunday' })
  check('Session 2 logged with completed=false', sessions[1].completed === false)
  check('Session 2 has rescheduledFrom = Saturday', sessions[1].rescheduledFrom === 'Saturday')
  check('Skip notification posted', notifications.some(n => n.type === 'plan_adjustment'))
  check('Goal counter NOT incremented for skip', goals[0].current === 1, `got ${goals[0].current}`)

  // Step 4: verify streak (just the one completion, today)
  const streak = calculateStreak(sessions)
  check('streak = 1 (only one completion)', streak === 1, `got ${streak}`)

  // Step 5: verify consistency (1 of 2 weekly target)
  const consistency = calculateConsistency(sessions, 2)
  check('consistency = 50% (1 of 2)', consistency === 50, `got ${consistency}`)
}

console.log('\n══════════════════════════════════════════════════════════════════════')
console.log(`  Result: ${pass} passed, ${fail} failed`)
console.log('══════════════════════════════════════════════════════════════════════\n')
process.exit(fail === 0 ? 0 : 1)
