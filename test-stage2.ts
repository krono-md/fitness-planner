// Stage 2 test: verify Today's Workout is grounded in actual schedule, reasoning is specific
import { mockUsers } from './src/data/mockUsers'
import { PersonalizationEngine } from './src/engine/personalizationEngine'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Simulate "today" being each day for each persona to check every day's plan
const testPersonas = ['busy_student', 'gym_student'] // from Stage 1

console.log("=== Stage 2: Today's Workout Verification ===\n")

for (const key of testPersonas) {
  const p = mockUsers[key]
  console.log(`\n--- PERSONA: ${key} (${p.name}) ---`)
  console.log(`Goal: ${p.goal} | Level: ${p.fitnessLevel} | Time: ${p.availableTimePerSession} | ${p.workoutsPerWeek}x/wk`)
  console.log(`Equipment: [${p.equipment.join(', ')}] | Loc: ${p.workoutLocation}`)
  console.log(`Schedule blocks:`)
  p.scheduleBlocks.forEach(b => {
    console.log(`  ${b.day}: ${b.startTime}-${b.endTime} (${b.type}: ${b.title})`)
  })

  const plan = PersonalizationEngine.generatePlan(p)

  // For each day, print what today's workout would be and the reasoning
  for (const today of days) {
    const todays = plan.find(w => w.dayOfWeek === today)
    if (!todays) {
      console.log(`  ${today}: NO PLAN ENTRY`)
      continue
    }
    if (todays.exercises.length === 0) {
      console.log(`  ${today}: REST DAY (${todays.name})`)
      console.log(`    reasoning: ${todays.reasoning}`)
    } else {
      console.log(`  ${today}: ${todays.name} (${todays.duration}min, ${todays.difficulty}, ${todays.exercises.length} ex)`)
      console.log(`    window: ${todays.suggestedWindow || 'none'}`)
      console.log(`    reasoning: ${todays.reasoning}`)
    }
  }
}
