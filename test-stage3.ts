// Stage 3 test: verify the 6 Adjust reasons each produce a distinct, logical change
// for today's workout, for both test personas.
import { mockUsers } from './src/data/mockUsers'
import { PersonalizationEngine, AdjustReason, ADJUST_REASON_META } from './src/engine/personalizationEngine'

const REASONS: AdjustReason[] = [
  'less_time',
  'more_tired',
  'too_difficult',
  'no_equipment',
  'schedule_changed',
  'different_activity',
]

// Pick the first day that actually has a workout (not a rest day)
function findTodayWorkoutDay(plan: any[]): string | null {
  return plan.find(w => w.exercises.length > 0)?.dayOfWeek || null
}

function fingerprint(w: any) {
  return {
    name: w.name,
    duration: w.duration,
    exCount: w.exercises.length,
    exNames: w.exercises.map((e: any) => e.name).sort().join('|'),
    difficulty: w.difficulty,
    window: w.suggestedWindow,
    setsTotal: w.exercises.reduce((s: number, e: any) => s + e.sets, 0),
    restAvg: w.exercises.length
      ? Math.round(w.exercises.reduce((s: number, e: any) => s + e.restSeconds, 0) / w.exercises.length)
      : 0,
  }
}

for (const key of ['busy_student', 'gym_student'] as const) {
  const profile = mockUsers[key]
  const plan = PersonalizationEngine.generatePlan(profile)
  const day = findTodayWorkoutDay(plan)
  if (!day) {
    console.log(`\n--- PERSONA ${key}: no workout day found, skipping ---`)
    continue
  }
  const original = plan.find(w => w.dayOfWeek === day)!

  console.log(`\n${'═'.repeat(70)}`)
  console.log(`PERSONA: ${key} (${profile.name})`)
  console.log(`Original on ${day}: ${original.name} | ${original.duration} min | ${original.exercises.length} ex | ${original.difficulty}`)
  console.log(`  Exercises: ${original.exercises.map(e => e.name).join(', ')}`)
  console.log(`  Window: ${original.suggestedWindow || 'n/a'}`)

  const results: Array<{ reason: AdjustReason; fp: any; w: any }> = []
  console.log(`\n${'─'.repeat(70)}`)
  for (const reason of REASONS) {
    const adjusted = PersonalizationEngine.adjustWorkout(original, reason, profile)
    const fp = fingerprint(adjusted)
    results.push({ reason, fp, w: adjusted })
    console.log(`\n[${ADJUST_REASON_META[reason].label}]`)
    console.log(`  → ${fp.name} | ${fp.duration} min | ${fp.exCount} ex | ${fp.difficulty}`)
    console.log(`  Exercises: ${adjusted.exercises.map(e => e.name).join(', ')}`)
    console.log(`  Sets total: ${fp.setsTotal} | Avg rest: ${fp.restAvg}s | Window: ${fp.window || 'n/a'}`)
    console.log(`  Reasoning: ${adjusted.reasoning}`)
  }

  // Pairwise distinctness check
  console.log(`\n${'─'.repeat(70)}`)
  console.log(`PAIRWISE DISTINCTNESS (each reason must differ from each other):`)
  let distinct = true
  for (let i = 0; i < results.length; i++) {
    for (let j = i + 1; j < results.length; j++) {
      const a = results[i].fp
      const b = results[j].fp
      const diffs: string[] = []
      if (a.name !== b.name) diffs.push('name')
      if (a.duration !== b.duration) diffs.push('duration')
      if (a.exCount !== b.exCount) diffs.push('exCount')
      if (a.exNames !== b.exNames) diffs.push('exercises')
      if (a.difficulty !== b.difficulty) diffs.push('difficulty')
      if (a.setsTotal !== b.setsTotal) diffs.push('setsTotal')
      if (a.restAvg !== b.restAvg) diffs.push('restAvg')
      if (a.window !== b.window) diffs.push('window')
      if (diffs.length === 0) {
        console.log(`  ❌ ${results[i].reason} vs ${results[j].reason}: IDENTICAL`)
        distinct = false
      } else {
        console.log(`  ✓ ${results[i].reason} vs ${results[j].reason}: differ on ${diffs.join(', ')}`)
      }
    }
  }
  console.log(`\n  ${distinct ? '✅ All 6 reasons produce distinct results' : '❌ Some reasons produce identical results'}`)
}
