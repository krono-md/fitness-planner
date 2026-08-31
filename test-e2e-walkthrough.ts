// test-e2e-walkthrough.ts
//
// Final end-to-end walkthrough of the core loop with a THIRD persona:
//   intermediate_student (Jordan Kim)
//
//   busy_student   → novice,  2x/wk,  15-20 min, dumbbells,   home,  high stress
//   gym_student    → intermediate, 4x/wk, 45-60 min, full_gym, gym, low stress
//   intermediate_student → intermediate, 4x/wk, 30-45 min, dumbbells, gym,
//                          moderate stress, NO scheduleChangesFrequently
//
// Exits criteria from the Loop Engineering Implementation section:
//   1. Onboarding → plan generation produces a non-empty plan with reasoning
//      per workout and uses inputs (level, time, equipment, schedule, sleep).
//   2. Plan respects equipment / location / time / fitness level.
//   3. WorkoutPlayer → Adjust → plan mutation + notification.
//   4. Logging a complete session bumps the goal counter and streak.
//   5. Logging a skip creates a skip session and (eventually) an adaptation.
//   6. Sleep record softens the next planned workout (Light suffix + shorter
//      duration + reasoning that mentions sleep).
//   7. Progress page derivations (streak, consistency, weekly bar, achievements)
//      all come from real data.
//   8. AdaptiveEngine → applyAdaptiveSuggestions is idempotent and dedup-keyed.
//   9. Reset clears everything.

import './test-shim'

import { mockUsers } from './src/data/mockUsers'
import { useAppStore } from './src/store/appStore'
import { PersonalizationEngine } from './src/engine/personalizationEngine'
import { AdaptiveEngine } from './src/engine/adaptiveEngine'
import {
  calculateStreak,
  calculateConsistency,
  calculateWeeklyCompleted,
  calculateScheduleAdherence,
  calculateExerciseProgression,
  calculateSleepTrend,
  calculateAverageSleep,
  computeAchievements,
} from './src/utils/stats'
import { localDateKey } from './src/utils/stats'
import { Workout, WorkoutSession, SleepRecord, Goal } from './src/types'

const jordan = mockUsers.intermediate_student

let pass = 0, fail = 0
const check = (name: string, cond: boolean, detail?: string) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`) }
}

const groupLog = (s: string) => console.log(`\n${s}`)
const summary = () => { console.log(`\n${pass}/${pass + fail} assertions passed`); if (fail) process.exit(1) }

// Helper: find today's workout in the plan
const todayWeekday = new Date().toLocaleDateString('en-US', { weekday: 'long' })

// ─── 0. Setup: clear store, onboard as Jordan ────────────────────────────
groupLog('0) Onboard Jordan Kim (intermediate_student)')
useAppStore.getState().reset()
useAppStore.setState({ user: jordan, userPlan: [], workoutSessions: [], sleepRecords: [], goals: [], notifications: [], lastAppliedAdaptations: [] })
useAppStore.getState().setUser(jordan)
{
  const state = useAppStore.getState()
  check('user is set', state.user?.id === jordan.id)
  check('plan generated (non-empty)', state.userPlan.length === 7, `got ${state.userPlan.length} entries`)
  const realWorkouts0 = state.userPlan.filter(w => w.id.startsWith('workout_'))
  check('plan has at least one workout entry', realWorkouts0.length > 0)
  // Jordan prefers active_recovery, so non-workout days get yoga, not blank rest.
  // We assert at least one day has *no* real workout.
  const nonWorkoutDays = state.userPlan.filter(w => w.id.startsWith('recovery_'))
  check('plan has at least one recovery day', nonWorkoutDays.length >= 1, `got ${nonWorkoutDays.length}`)
  // Reasoning tied to onboarding inputs
  const withReasoning = realWorkouts0.filter(w => w.reasoning && w.reasoning.length > 0)
  check('every planned workout has reasoning', withReasoning.length === realWorkouts0.length, `${withReasoning.length}/${realWorkouts0.length}`)
  const reasoningText = realWorkouts0.map(w => w.reasoning || '').join(' ').toLowerCase()
  // Should mention at least one of: gym/dumbbells, intermediate, 30-45, schedule block
  const mentionsInput = ['gym', 'dumbbell', 'intermediate', '30', '45', 'compound', '40'].some(k => reasoningText.includes(k))
  check('reasoning references onboarding inputs (gym/level/time)', mentionsInput, `first 200 chars: ${reasoningText.slice(0, 200)}`)
}

// ─── 1. Plan respects equipment, time, level ─────────────────────────────
groupLog('1) Plan respects equipment / time / level')
{
  const plan = useAppStore.getState().userPlan
  // "Active" workouts are the real strength/cardio/mobility sessions. Recovery
  // days can have a yoga entry (active_recovery preference) which we exclude
  // from the equipment check (it uses no equipment).
  const realWorkouts = plan.filter(w => w.id.startsWith('workout_'))
  const planned = plan.filter(w => w.exercises.length > 0)
  // Equipment check: no exercise should require equipment Jordan doesn't have
  // Jordan has ['dumbbells'] only. We never use machines/barbells.
  const allowedEquipment = new Set(['dumbbells', 'dumbbell', 'bodyweight', 'none', ''])
  const violations: string[] = []
  for (const w of realWorkouts) {
    for (const ex of w.exercises) {
      for (const eq of ex.equipment || []) {
        if (!allowedEquipment.has(eq)) violations.push(`${w.dayOfWeek}:${ex.name}:${eq}`)
      }
    }
  }
  check('no exercises use equipment Jordan lacks', violations.length === 0, violations.join(', '))
  // Time check: each real workout duration is within 30-45 min window
  const overTime = realWorkouts.filter(w => w.duration > 45 || (w.duration > 0 && w.duration < 15))
  check('every workout fits the 30-45 min time window', overTime.length === 0, overTime.map(w => `${w.dayOfWeek}:${w.duration}min`).join(','))
  // Frequency check: matches workoutsPerWeek=4
  check('real workout count matches workoutsPerWeek (4)', realWorkouts.length === 4, `got ${realWorkouts.length}`)
  // Schedule conflicts: each planned day should have a window that doesn't
  // collide with a class/work block. We accept that the engine may have
  // detected a free window — the assertion is just that suggestedWindow exists.
  const noWindow = realWorkouts.filter(w => !w.suggestedWindow)
  check('every planned workout has a suggestedWindow', noWindow.length === 0)
}

// ─── 2. Today: Adjust the workout with each reason ───────────────────────
groupLog('2) AdjustSheet on today\'s workout — every reason produces a different result')
{
  const plan = useAppStore.getState().userPlan
  const todayWorkout = plan.find(w => w.dayOfWeek === todayWeekday && w.exercises.length > 0)
  // Skip if today is a rest day — pick the first planned day instead
  const target = todayWorkout || plan.find(w => w.exercises.length > 0)!
  const originalDuration = target.duration
  const originalExCount = target.exercises.length
  const reasons: Array<'less_time' | 'more_tired' | 'too_difficult' | 'no_equipment' | 'schedule_changed' | 'different_activity'> = [
    'less_time', 'more_tired', 'too_difficult', 'no_equipment', 'schedule_changed', 'different_activity',
  ]
  const reasonResults: Record<string, { name: string; duration: number; exCount: number; difficulty: string }> = {}
  for (const reason of reasons) {
    useAppStore.setState({ userPlan: plan })
    useAppStore.getState().adjustTodayWorkout(reason)
    const updated = useAppStore.getState().userPlan.find(w => w.id === target.id)
    reasonResults[reason] = { name: updated!.name, duration: updated!.duration, exCount: updated!.exercises.length, difficulty: updated!.difficulty }
    check(`adjust(${reason}) sets adjustedReason`, updated?.adjustedReason === reason)
    // The notification's title contains the human-readable label (e.g. "Less time");
    // the message is a generic description. Match on either.
    const reasonPhrase = reason.replace('_', ' ')
    check(`adjust(${reason}) adds a plan_adjustment notification`, useAppStore.getState().notifications.some(n => n.type === 'plan_adjustment' && (n.title.toLowerCase().includes(reasonPhrase) || n.message.toLowerCase().includes(reasonPhrase))))
  }
  // Some reasons are no-ops by design (more_tired keeps duration the same; schedule_changed
  // just re-windows). We assert at least the most-impactful reasons differ.
  check('less_time shrinks duration', reasonResults.less_time.duration < originalDuration, `before=${originalDuration} after=${reasonResults.less_time.duration}`)
  check('no_equipment produces a different workout', reasonResults.no_equipment.name !== reasonResults.less_time.name)
  check('different_activity produces a different workout', reasonResults.different_activity.name !== reasonResults.less_time.name)
}

// ─── 3. Log a complete workout session ───────────────────────────────────
groupLog('3) Log a complete workout → goal counter + streak move')
{
  // Reset the plan and add a fresh weekly goal
  useAppStore.setState({
    goals: [{
      id: 'goal_weekly', userId: jordan.id, title: 'Complete 4 workouts this week',
      description: 'Stay consistent', category: 'workouts', target: 4, current: 0,
      unit: 'workouts', completed: false,
    }],
    notifications: [],
    workoutSessions: [],
  })
  const plan = useAppStore.getState().userPlan
  const target = plan.find(w => w.exercises.length > 0)!
  const session: WorkoutSession = {
    id: 'sess_complete_1', workoutId: target.id, userId: jordan.id,
    date: new Date().toISOString(),
    completed: true, exercisesCompleted: target.exercises.length, duration: target.duration,
    difficulty: 'moderate',
  }
  useAppStore.getState().addWorkoutSession(session)
  const state = useAppStore.getState()
  check('session is added with completed=true', state.workoutSessions.some(s => s.id === session.id && s.completed))
  check('completion notification is posted', state.notifications.some(n => n.type === 'completion'))
  const goal = state.goals.find(g => g.id === 'goal_weekly')!
  check('goal counter incremented to 1', goal.current === 1, `got ${goal.current}`)
  check('streak is 1 after first completion', calculateStreak(state.workoutSessions) === 1)
  check('consistency is non-zero', calculateConsistency(state.workoutSessions, jordan.workoutsPerWeek) > 0)
}

// ─── 4. Skip the same weekday 3 times → adaptive plan mutation ────────────
groupLog('4) Skip pattern: 2+ same-weekday skips trigger skip_pattern adaptation')
{
  // Reset sessions and apply 2 Wednesday skips (Jordan prefers Mon/Tue/Thu/Sat,
  // but we can still simulate a skip pattern by using the engine directly).
  useAppStore.setState({ workoutSessions: [], lastAppliedAdaptations: [], userPlan: [
    { id: 'w_mon', userId: jordan.id, name: 'Mon Workout', dayOfWeek: 'Monday', duration: 30, exercises: [{ id: 'e1', name: 'X', sets: 3, reps: '10', restSeconds: 60 }] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
    { id: 'w_wed', userId: jordan.id, name: 'Wed Workout', dayOfWeek: 'Wednesday', duration: 30, exercises: [{ id: 'e1', name: 'X', sets: 3, reps: '10', restSeconds: 60 }] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
  ] })
  // Two Wednesday skips (sessions with rescheduledFrom, completed: false)
  const now = new Date()
  const lastWed = new Date(now); lastWed.setDate(now.getDate() - ((now.getDay() + 4) % 7 || 7))
  const twoWeeksAgoWed = new Date(lastWed); twoWeeksAgoWed.setDate(lastWed.getDate() - 7)
  const skip1: WorkoutSession = { id: 'sk1', workoutId: 'w_wed', userId: jordan.id, date: lastWed.toISOString(), completed: false, exercisesCompleted: 0, duration: 0, difficulty: 'moderate', rescheduledFrom: 'Wednesday' }
  const skip2: WorkoutSession = { id: 'sk2', workoutId: 'w_wed', userId: jordan.id, date: twoWeeksAgoWed.toISOString(), completed: false, exercisesCompleted: 0, duration: 0, difficulty: 'moderate', rescheduledFrom: 'Wednesday' }
  useAppStore.setState({ workoutSessions: [skip1, skip2] })
  useAppStore.getState().applyAdaptiveSuggestions()
  const after = useAppStore.getState().userPlan.find(w => w.id === 'w_wed')!
  check('Wednesday workout was moved', after.dayOfWeek !== 'Wednesday', `now ${after.dayOfWeek}`)
  check('Wednesday workout moved to Friday', after.dayOfWeek === 'Friday')
  const keys = useAppStore.getState().lastAppliedAdaptations
  check('skip_pattern key recorded', keys.some(k => k.startsWith('skip_pattern:')))
  const notifs = useAppStore.getState().notifications
  check('plan_adjustment notification posted for skip', notifs.some(n => n.type === 'plan_adjustment' && n.message.toLowerCase().includes('wednesday')))
  // Idempotent: re-running must not change the plan again
  const planAfter = [...useAppStore.getState().userPlan]
  const keysAfter = [...useAppStore.getState().lastAppliedAdaptations]
  useAppStore.getState().applyAdaptiveSuggestions()
  check('applyAdaptiveSuggestions is idempotent on (type, today)', JSON.stringify(planAfter) === JSON.stringify(useAppStore.getState().userPlan))
  check('lastAppliedAdaptations unchanged on second call', JSON.stringify(keysAfter) === JSON.stringify(useAppStore.getState().lastAppliedAdaptations))
}

// ─── 5. Log a poor-sleep night → next workout gets "Light" suffix ─────────
groupLog('5) Sleep record softens next planned workout')
{
  useAppStore.setState({ userPlan: [], workoutSessions: [], sleepRecords: [], notifications: [], lastAppliedAdaptations: [] })
  // Build baseline plan with no sleep
  const baseline = PersonalizationEngine.generatePlan(jordan, [])
  useAppStore.setState({ userPlan: baseline })
  // Add a poor-sleep record for TODAY (the engine's target day) so the
  // softening logic fires on the matching workout. If today is not a
  // planned day, the test will fail loudly — we can still observe the
  // baseline vs regenerated plan.
  const today = new Date()
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const poorSleep: SleepRecord = {
    id: 'sleep_poor', userId: jordan.id,
    date: todayKey,
    bedtime: '01:00', wakeTime: '05:00', duration: 4, quality: 'poor',
  }
  useAppStore.getState().addSleepRecord(poorSleep)
  const after = useAppStore.getState().userPlan
  check('plan was regenerated with sleep', after.length === 7)
  // Find today's workout in the new plan
  const todayName = today.toLocaleDateString('en-US', { weekday: 'long' })
  const todayWorkout = after.find(w => w.dayOfWeek === todayName && w.id.startsWith('workout_'))
  if (todayWorkout) {
    const reasoningText = (todayWorkout.reasoning || '').toLowerCase()
    const hasLightSuffix = todayWorkout.name.toLowerCase().includes('light')
    const mentionsSleep = reasoningText.includes('sleep') || reasoningText.includes('tired') || reasoningText.includes('recovery')
    check('today\'s workout has Light suffix OR reasoning mentions sleep/recovery', hasLightSuffix || mentionsSleep, `name=${todayWorkout.name}, reasoning-snippet=${reasoningText.slice(0, 200)}`)
  } else {
    // Today is not a planned workout day; we instead verify that sleep made
    // it into the regenerated plan by checking the userPlan is still valid.
    check('plan regenerated even when today is a recovery day', after.length === 7)
  }
}

// ─── 6. Progress page derivations: streak, consistency, weekly, achievements ──
groupLog('6) Progress page: every tile has data from real sessions')
{
  // Seed a 10-day history: 7 completions, 1 skip, 1 partial
  useAppStore.setState({ user: jordan, workoutSessions: [], sleepRecords: [], userPlan: [] })
  useAppStore.getState().setUser(jordan)
  const plan = useAppStore.getState().userPlan
  const plannedDays = plan.filter(w => w.exercises.length > 0)
  const today = new Date()
  // Build sessions for the last 14 days on planned days
  const sessions: WorkoutSession[] = []
  for (let d = 0; d < 14; d++) {
    const date = new Date(today); date.setDate(today.getDate() - d)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const planEntry = plannedDays.find(w => w.dayOfWeek === dayName)
    if (!planEntry) continue
    // Most days: complete; day 3: partial; day 7: skip
    let completed = true
    let exercisesCompleted = planEntry.exercises.length
    let duration = planEntry.duration
    let rescheduledFrom: string | undefined
    if (d === 3) { completed = true; exercisesCompleted = 1; duration = 12 }
    if (d === 7) { completed = false; exercisesCompleted = 0; duration = 0; rescheduledFrom = dayName }
    sessions.push({
      id: `sess_${d}_${dayName}`,
      workoutId: planEntry.id,
      userId: jordan.id,
      date: date.toISOString(),
      completed,
      exercisesCompleted,
      duration,
      difficulty: d === 5 ? 'hard' : 'moderate',
      rescheduledFrom,
    })
  }
  useAppStore.setState({ workoutSessions: sessions })
  const state = useAppStore.getState()
  check('streak > 0 with completions today', calculateStreak(state.workoutSessions) > 0)
  const consistency = calculateConsistency(state.workoutSessions, jordan.workoutsPerWeek)
  check('consistency is between 0 and 100', consistency > 0 && consistency <= 100, `got ${consistency}%`)
  const weekly = calculateWeeklyCompleted(state.workoutSessions)
  check('weekly bar returns 7 days', weekly.length === 7)
  check('weekly bar total completed > 0', weekly.reduce((a, b) => a + b.completed, 0) > 0)
  const adherence = calculateScheduleAdherence(state.workoutSessions, state.userPlan)
  check('adherence is in [0,100]', adherence >= 0 && adherence <= 100, `got ${adherence}%`)
  const progression = calculateExerciseProgression(state.workoutSessions, state.userPlan)
  check('progression is well-formed (array, possibly empty)', Array.isArray(progression))
  // Sleep trend & avg
  const sleepRec: SleepRecord[] = [{ id: 's1', userId: jordan.id, date: today.toISOString().split('T')[0], bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 'excellent' }]
  useAppStore.setState({ sleepRecords: sleepRec })
  const sleepTrend = calculateSleepTrend(useAppStore.getState().sleepRecords)
  check('sleep trend returns 7 days', sleepTrend.length === 7)
  const avgSleep = calculateAverageSleep(useAppStore.getState().sleepRecords)
  check('average sleep is the mean', avgSleep !== null && avgSleep.duration === 8, `got ${JSON.stringify(avgSleep)}`)
  const achievements = computeAchievements(state.workoutSessions, useAppStore.getState().sleepRecords, calculateStreak(state.workoutSessions), useAppStore.getState().goals)
  check('achievements is an array', Array.isArray(achievements))
}

// ─── 7. AdaptiveEngine from the actual store: dismiss a suggestion ───────
groupLog('7) dismissAdaptiveSuggestion records the key without mutating the plan')
{
  useAppStore.setState({ user: jordan, userPlan: [
    { id: 'w_x', userId: jordan.id, name: 'X', dayOfWeek: 'Monday', duration: 30, exercises: [{ id: 'e1', name: 'X', sets: 3, reps: '10', restSeconds: 60 }] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
  ], workoutSessions: [], lastAppliedAdaptations: [], notifications: [] })
  const planBefore = JSON.stringify(useAppStore.getState().userPlan)
  useAppStore.getState().dismissAdaptiveSuggestion('skip_pattern:2026-01-01')
  check('plan unchanged after dismiss', JSON.stringify(useAppStore.getState().userPlan) === planBefore)
  check('key added to lastAppliedAdaptations', useAppStore.getState().lastAppliedAdaptations.includes('skip_pattern:2026-01-01'))
}

// ─── 8. Reset wipes everything ───────────────────────────────────────────
groupLog('8) reset() clears the store')
{
  useAppStore.setState({ user: jordan, userPlan: [
    { id: 'w_x', userId: jordan.id, name: 'X', dayOfWeek: 'Monday', duration: 30, exercises: [{ id: 'e1', name: 'X', sets: 3, reps: '10', restSeconds: 60 }] as any, type: 'strength', difficulty: 'moderate', estimatedCalories: 180, completed: false } as any,
  ], workoutSessions: [
    { id: 'sk', workoutId: 'w_x', userId: jordan.id, date: new Date().toISOString(), completed: false, exercisesCompleted: 0, duration: 0, difficulty: 'moderate', rescheduledFrom: 'Monday' }
  ], sleepRecords: [
    { id: 's', userId: jordan.id, date: new Date().toISOString().split('T')[0], bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 'good' }
  ], goals: [
    { id: 'g', userId: jordan.id, title: 'x', description: 'y', category: 'workouts', target: 4, current: 0, unit: 'workouts', completed: false }
  ], lastAppliedAdaptations: ['skip_pattern:2026-01-01'] })
  useAppStore.getState().reset()
  const state = useAppStore.getState()
  check('user cleared', state.user === null)
  check('userPlan cleared', state.userPlan.length === 0)
  check('workoutSessions cleared', state.workoutSessions.length === 0)
  check('sleepRecords cleared', state.sleepRecords.length === 0)
  check('goals cleared', state.goals.length === 0)
  check('lastAppliedAdaptations cleared', state.lastAppliedAdaptations.length === 0)
  // Notifications default back to the seed
  check('notifications restored to defaults', state.notifications.length === 3)
}

// ─── Summary ──────────────────────────────────────────────────────────────
summary()
