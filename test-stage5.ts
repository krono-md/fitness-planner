// Stage 5 test: verify sleep + recovery feeds into next-day workout recommendation

import { mockUsers } from './src/data/mockUsers'
import { PersonalizationEngine } from './src/engine/personalizationEngine'
import { UserProfile } from './src/types'

let pass = 0
let fail = 0
const check = (name: string, cond: boolean, detail?: string) => {
  if (cond) { pass++; console.log(`  ✓ ${name}`) }
  else { fail++; console.log(`  ❌ ${name}${detail ? ' — ' + detail : ''}`) }
}

// Use a profile with good baseline sleep so we can isolate Stage 5's behavior
const profile: UserProfile = {
  ...mockUsers.busy_student,
  averageSleep: 8,
  recoveryQuality: 'excellent',
  stressLevel: 'low',
}

// Find next Tuesday as our target day
const today = new Date()
today.setHours(0, 0, 0, 0)
const dayIdx = today.getDay()
const daysUntilTuesday = (2 - dayIdx + 7) % 7 || 7
const targetDate = new Date(today)
targetDate.setDate(targetDate.getDate() + daysUntilTuesday)

const tuesdayName = 'Tuesday'

// Format a Date as YYYY-MM-DD in local time. Sleep records in the app
// come from `<input type="date">` and are stored as local-date strings.
// `toISOString().split('T')[0]` is UTC and lands on the wrong day east of
// UTC, so the test uses local-date keys to match production behavior.
const localDateKey = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

console.log('\n══════════════════════════════════════════════════════════════════════')
console.log('  Stage 5: Sleep + Recovery')
console.log(`  Target: ${targetDate.toDateString()} (${tuesdayName})`)
console.log('══════════════════════════════════════════════════════════════════════\n')

// ─── Test 1: Baseline plan with no sleep data ───
console.log('─── Test 1: Baseline plan with no sleep data ───')
{
  const plan = PersonalizationEngine.generatePlan(profile, [], targetDate)
  const tue = plan.find(w => w.dayOfWeek === tuesdayName)!
  check(`Tuesday workout exists`, !!tue)
  check(`No "Light" suffix on baseline`, !tue.name.includes('Light'))
  check(`No sleep mention in reasoning`, !(tue.reasoning?.toLowerCase().includes('sleep') ?? false))
}

// ─── Test 2: Poor sleep → softer workout for the target day ───
console.log('\n─── Test 2: Poor sleep (4h, poor quality) on target day softens the workout ───')
{
  const poorSleep = {
    id: 'sleep_poor',
    userId: profile.id,
    date: localDateKey(targetDate),
    bedtime: '01:00',
    wakeTime: '05:00',
    duration: 4,
    quality: 'poor' as const,
  }
  const plan = PersonalizationEngine.generatePlan(profile, [poorSleep], targetDate)
  const tue = plan.find(w => w.dayOfWeek === tuesdayName)!
  const baseline = PersonalizationEngine.generatePlan(profile, [], targetDate).find(w => w.dayOfWeek === tuesdayName)!
  check(`Workout name has "Light" suffix`, tue.name.includes('Light'), `got "${tue.name}"`)
  check(`Duration reduced (was ${baseline.duration}, now ${tue.duration})`, tue.duration < baseline.duration)
  check(`Reasoning mentions sleep`, tue.reasoning?.toLowerCase().includes('sleep') || false)
  check(`Reasoning mentions "too little" or "low" or "poor"`, 
    tue.reasoning?.toLowerCase().match(/too little|low|poor/) !== null)
}

// ─── Test 3: Good sleep → normal workout ───
console.log('\n─── Test 3: Good sleep (8h, excellent quality) returns to normal ───')
{
  const goodSleep = {
    id: 'sleep_good',
    userId: profile.id,
    date: localDateKey(targetDate),
    bedtime: '22:30',
    wakeTime: '06:30',
    duration: 8,
    quality: 'excellent' as const,
  }
  const plan = PersonalizationEngine.generatePlan(profile, [goodSleep], targetDate)
  const tue = plan.find(w => w.dayOfWeek === tuesdayName)!
  const baseline = PersonalizationEngine.generatePlan(profile, [], targetDate).find(w => w.dayOfWeek === tuesdayName)!
  check(`No "Light" suffix on good-sleep workout`, !tue.name.includes('Light'))
  check(`Duration matches baseline (${tue.duration} === ${baseline.duration})`, tue.duration === baseline.duration)
  check(`Difficulty matches baseline (${tue.difficulty} === ${baseline.difficulty})`, tue.difficulty === baseline.difficulty)
}

// ─── Test 4: Fair sleep (low duration) also softens ───
console.log('\n─── Test 4: Short sleep (5.5h) softens the workout ───')
{
  const shortSleep = {
    id: 'sleep_short',
    userId: profile.id,
    date: localDateKey(targetDate),
    bedtime: '00:30',
    wakeTime: '06:00',
    duration: 5.5,
    quality: 'good' as const,
  }
  const plan = PersonalizationEngine.generatePlan(profile, [shortSleep], targetDate)
  const tue = plan.find(w => w.dayOfWeek === tuesdayName)!
  const baseline = PersonalizationEngine.generatePlan(profile, [], targetDate).find(w => w.dayOfWeek === tuesdayName)!
  check(`Workout name has "Light" suffix`, tue.name.includes('Light'))
  check(`Duration reduced (was ${baseline.duration}, now ${tue.duration})`, tue.duration < baseline.duration)
}

// ─── Test 5: Sleep on a different day doesn't affect Tuesday ───
console.log('\n─── Test 5: Sleep record for a different day does not affect Tuesday ───')
{
  const otherDay = new Date(targetDate)
  otherDay.setDate(otherDay.getDate() + 3)
  const otherSleep = {
    id: 'sleep_other',
    userId: profile.id,
    date: localDateKey(otherDay),
    bedtime: '01:00',
    wakeTime: '05:00',
    duration: 4,
    quality: 'poor' as const,
  }
  const plan = PersonalizationEngine.generatePlan(profile, [otherSleep], targetDate)
  const tue = plan.find(w => w.dayOfWeek === tuesdayName)!
  const baseline = PersonalizationEngine.generatePlan(profile, [], targetDate).find(w => w.dayOfWeek === tuesdayName)!
  check(`Tuesday NOT softened (duration ${tue.duration} === ${baseline.duration})`, tue.duration === baseline.duration)
  check(`No "Light" suffix on Tuesday`, !tue.name.includes('Light'))
}

console.log('\n══════════════════════════════════════════════════════════════════════')
console.log(`  Result: ${pass} passed, ${fail} failed`)
console.log('══════════════════════════════════════════════════════════════════════\n')
process.exit(fail === 0 ? 0 : 1)
