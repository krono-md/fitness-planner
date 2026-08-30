import { WorkoutSession } from '../types'

/** YYYY-MM-DD in the local timezone (not UTC). Sessions are stamped via
 *  `new Date().toISOString()`, which is UTC, so reading back the date with
 *  `toISOString().split('T')[0]` will land on the wrong day in any timezone
 *  east of UTC. Use this everywhere we compare "what day did this happen on". */
function localDateKey(d: Date): string {
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
