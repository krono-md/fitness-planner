import { UserProfile, Workout, Exercise } from '../types'

const exerciseDatabase: Record<string, Exercise> = {
  'goblet_squat': {
    id: 'goblet_squat', name: 'Goblet Squat', sets: 3, reps: '10-12', restSeconds: 60,
    equipment: ['dumbbell'], targetMuscles: ['quads', 'glutes', 'core'], difficulty: 'moderate',
    instructions: 'Hold a dumbbell at chest level, feet shoulder-width apart. Lower into a squat, keeping chest upright.'
  },
  'push_ups': {
    id: 'push_ups', name: 'Push-ups', sets: 3, reps: '8-12', restSeconds: 60,
    equipment: [], targetMuscles: ['chest', 'triceps', 'shoulders'], difficulty: 'moderate',
    instructions: 'Start in plank position. Lower until chest nearly touches floor. Push back up.'
  },
  'dumbbell_rows': {
    id: 'dumbbell_rows', name: 'Dumbbell Rows', sets: 3, reps: '10-12', restSeconds: 60,
    equipment: ['dumbbell'], targetMuscles: ['back', 'biceps'], difficulty: 'moderate',
    instructions: 'Bent over position, one knee on bench. Row dumbbell to hip.'
  },
  'jumping_jacks': {
    id: 'jumping_jacks', name: 'Jumping Jacks', sets: 3, reps: '20-30', restSeconds: 45,
    equipment: [], targetMuscles: ['full_body', 'cardio'], difficulty: 'easy',
    instructions: 'Jump feet apart while raising arms overhead. Return to starting position.'
  },
  'plank': {
    id: 'plank', name: 'Plank Hold', sets: 3, reps: '30-60s', restSeconds: 60,
    equipment: [], targetMuscles: ['core', 'shoulders'], difficulty: 'moderate',
    instructions: 'Hold a push-up position with forearms on ground. Keep body straight.'
  },
  'dumbbell_bench_press': {
    id: 'dumbbell_bench_press', name: 'Dumbbell Bench Press', sets: 4, reps: '8-10', restSeconds: 90,
    equipment: ['dumbbell', 'bench'], targetMuscles: ['chest', 'triceps', 'shoulders'], difficulty: 'moderate',
    instructions: 'Lie on bench with dumbbells at shoulder level. Press up and together.'
  },
  'deadlift': {
    id: 'deadlift', name: 'Deadlift', sets: 4, reps: '5-8', restSeconds: 120,
    equipment: ['barbell'], targetMuscles: ['back', 'glutes', 'hamstrings'], difficulty: 'hard',
    instructions: 'Barbell at shins, feet hip-width. Hinge at hips, drive through heels to stand.'
  },
  'mountain_climbers': {
    id: 'mountain_climbers', name: 'Mountain Climbers', sets: 3, reps: '30-40', restSeconds: 45,
    equipment: [], targetMuscles: ['core', 'cardio'], difficulty: 'moderate',
    instructions: 'Plank position. Bring knees alternately toward chest at a quick pace.'
  },
  'burpees': {
    id: 'burpees', name: 'Burpees', sets: 3, reps: '10-15', restSeconds: 60,
    equipment: [], targetMuscles: ['full_body', 'cardio'], difficulty: 'hard',
    instructions: 'Squat down, jump to plank, return to squat, jump up with arms overhead.'
  },
  'running': {
    id: 'running', name: 'Running', sets: 1, reps: '20-30 min', restSeconds: 0,
    equipment: [], targetMuscles: ['cardio', 'legs'], difficulty: 'moderate',
    instructions: 'Maintain steady pace. Focus on breathing and form.'
  },
  'yoga_sun_salutation': {
    id: 'yoga_sun_salutation', name: 'Yoga Sun Salutation', sets: 5, reps: 'rounds', restSeconds: 30,
    equipment: [], targetMuscles: ['flexibility', 'mobility'], difficulty: 'easy',
    instructions: 'Flow through mountain pose, forward fold, plank, up dog, down dog.'
  },
  'leg_press': {
    id: 'leg_press', name: 'Leg Press', sets: 3, reps: '10-12', restSeconds: 90,
    equipment: ['machine'], targetMuscles: ['quads', 'glutes'], difficulty: 'moderate',
    instructions: 'Sit with back against pad. Push platform away using legs.'
  },
  'band_rows': {
    id: 'band_rows', name: 'Resistance Band Rows', sets: 3, reps: '12-15', restSeconds: 60,
    equipment: ['resistance_bands'], targetMuscles: ['back', 'biceps'], difficulty: 'easy',
    instructions: 'Anchor band at chest height. Pull handles to ribs, squeeze shoulder blades.'
  },
  'incline_push_ups': {
    id: 'incline_push_ups', name: 'Incline Push-ups', sets: 3, reps: '10-15', restSeconds: 45,
    equipment: [], targetMuscles: ['chest', 'triceps', 'shoulders'], difficulty: 'easy',
    instructions: 'Hands on a desk or chair. Push-up at an incline. Easier than floor push-ups.'
  },
  'glute_bridges': {
    id: 'glute_bridges', name: 'Glute Bridges', sets: 3, reps: '12-15', restSeconds: 45,
    equipment: [], targetMuscles: ['glutes', 'hamstrings'], difficulty: 'easy',
    instructions: 'Lie on back, knees bent. Drive hips up, squeeze glutes at the top.'
  },
  'bodyweight_squats': {
    id: 'bodyweight_squats', name: 'Bodyweight Squats', sets: 3, reps: '15-20', restSeconds: 45,
    equipment: [], targetMuscles: ['quads', 'glutes'], difficulty: 'easy',
    instructions: 'Feet shoulder-width. Lower hips back and down. Drive back up.'
  },
  'walking_lunges': {
    id: 'walking_lunges', name: 'Walking Lunges', sets: 3, reps: '10 each leg', restSeconds: 60,
    equipment: [], targetMuscles: ['quads', 'glutes', 'hamstrings'], difficulty: 'moderate',
    instructions: 'Step forward into a lunge. Alternate legs as you walk forward.'
  },
}

const STRENGTH_GOALS = ['improve_strength', 'build_muscle']
const ENDURANCE_GOALS = ['improve_endurance', 'athletic_performance', 'lose_body_fat', 'improve_fitness']
const MOBILITY_GOALS = ['improve_mobility']
const CONSISTENCY_GOALS = ['build_consistency', 'maintain_fitness']

/** Result of fitting a workout into a day's schedule. */
export interface WorkoutWindow {
  /** Human-readable time range, e.g. "5:30 PM – 6:25 PM". */
  window: string | null
  /** The class/work block this workout slot is placed before, if any. */
  beforeBlock?: { startTime: string; endTime: string; type: string; title: string }
  /** The class/work block this workout slot is placed after, if any. */
  afterBlock?: { endTime: string; startTime: string; type: string; title: string }
  /** Two consecutive blocks this workout slot is placed between, if any. */
  betweenBlocks?: { endTime: string; nextStart: string; title: string }
}

/** The 6 reasons a user can pick to adapt today's workout. */
export type AdjustReason =
  | 'less_time'
  | 'more_tired'
  | 'too_difficult'
  | 'no_equipment'
  | 'schedule_changed'
  | 'different_activity'

/** Human-readable label + 1-line description for each reason (used in the UI). */
export const ADJUST_REASON_META: Record<AdjustReason, { label: string; description: string; icon: string }> = {
  less_time:        { label: 'Less time',           description: 'Shrink it to fit the time you have.',         icon: '⏱' },
  more_tired:       { label: 'More tired today',    description: 'Same moves, lighter load and more rest.',    icon: '😴' },
  too_difficult:    { label: 'Workout too difficult', description: 'Swap hard moves for easier ones.',          icon: '📉' },
  no_equipment:     { label: 'No equipment',        description: 'Bodyweight only — drop the gear.',          icon: '🏠' },
  schedule_changed: { label: 'Schedule changed',    description: 'Re-fit around your classes and shifts.',     icon: '🗓' },
  different_activity: { label: 'Different activity', description: 'Swap in a different style for today.',     icon: '🔄' },
}

const GOAL_LABEL: Record<string, string> = {
  build_consistency: 'building consistency',
  improve_fitness: 'improving overall fitness',
  lose_body_fat: 'losing body fat',
  build_muscle: 'building muscle',
  improve_strength: 'improving strength',
  improve_endurance: 'improving endurance',
  improve_mobility: 'improving mobility',
  athletic_performance: 'athletic performance',
  maintain_fitness: 'maintaining fitness',
}

const FITNESS_LEVEL_LABEL: Record<string, string> = {
  beginner: 'beginner',
  novice: 'novice',
  intermediate: 'intermediate',
  advanced: 'advanced',
}

const INTENSITY_LABEL: Record<string, string> = {
  low: 'low intensity',
  moderate: 'moderate intensity',
  high: 'high intensity',
}

const LOCATION_LABEL: Record<string, string> = {
  home: 'at home',
  dorm: 'in your dorm',
  gym: 'at the gym',
  outdoors: 'outdoors',
}

export class PersonalizationEngine {
  /**
   * Format a Date as YYYY-MM-DD in local time. We use this everywhere we
   * compare "what day did this happen on" because `toISOString().split('T')[0]`
   * is UTC and lands on the wrong day in any timezone east of UTC.
   */
  private static localDateKey(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  /**
   * Get the sleep record for a specific date.
   * Returns null if no sleep record exists for that exact date.
   * Sleep records are date-specific — a poor night on Friday should not
   * soften Tuesday's workout.
   *
   * Both sides are normalized to a local-time YYYY-MM-DD key before
   * comparison, so the lookup is timezone-stable regardless of whether
   * `record.date` is a YYYY-MM-DD string ("2026-09-01") or a full ISO
   * timestamp ("2026-09-01T07:00:00.000Z").
   */
  static getRecentSleepRecord(sleepRecords: any[], dateStr: string): any | null {
    if (!sleepRecords || sleepRecords.length === 0) return null
    const givenKey = this.localDateKey(new Date(dateStr))

    for (const record of sleepRecords) {
      const recordKey = this.localDateKey(new Date(record.date))
      if (recordKey === givenKey) {
        return record
      }
    }
    return null
  }

  /**
   * Determine if a workout should be softened based on recent sleep quality.
   * Returns { soften: boolean, reason: string } if softening is needed.
   */
  static shouldSoftenForSleep(sleepRecord: any | null): { soften: boolean; reason: string } {
    if (!sleepRecord) return { soften: false, reason: '' }
    const duration = sleepRecord.duration || 0
    const quality = sleepRecord.quality || 'fair'

    // Poor sleep (low duration OR poor quality) → soften
    const isPoorSleep = duration < 6 || quality === 'poor' || quality === 'fair'

    if (isPoorSleep) {
      let reason = ''
      if (duration < 6) {
        reason = `Only ${duration}h of sleep — too little for a full workout.`
      } else if (quality === 'poor') {
        reason = `Sleep quality was poor — better to recovery today.`
      } else {
        reason = `Low sleep debt – plan is softened for recovery.`
      }
      return { soften: true, reason }
    }
    return { soften: false, reason: '' }
  }

  /**
   * Generate a workout adjusted for poor sleep.
   * This creates a "sleep-adapted" workout with reduced intensity.
   */
  static generateSleepAdaptedWorkout(
    baseWorkout: Workout,
    reason: string
  ): Workout {
    // Create a lighter version: fewer exercises, easier difficulty
    const adaptedExercises = baseWorkout.exercises.slice(0, Math.max(2, Math.ceil(baseWorkout.exercises.length / 2)))
    const adapted = adaptedExercises.map(ex => ({
      ...ex,
      sets: Math.max(2, Math.round(ex.sets * 0.7)),
      restSeconds: ex.restSeconds + 15,
    }))

    return {
      ...baseWorkout,
      name: baseWorkout.name + ' (Light)',
      duration: Math.max(10, Math.round(baseWorkout.duration * 0.7)),
      difficulty: 'easy' as const,
      exercises: adapted,
      reasoning: `Adjusted for recovery: ${reason}`,
    }
  }

  static generatePlan(profile: UserProfile, sleepRecords: any[] = [], forDate = new Date()): Workout[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let workoutsPerWeek = profile.workoutsPerWeek

    // Reduce frequency for high stress or low sleep (historical)
    if (profile.scheduleChangesFrequently && profile.stressLevel === 'high') {
      workoutsPerWeek = Math.max(2, workoutsPerWeek - 1)
    }
    if (profile.availableTimePerSession === '10-15') {
      workoutsPerWeek = Math.min(workoutsPerWeek, 4)
    }
    if (profile.averageSleep < 6.5) {
      workoutsPerWeek = Math.max(2, workoutsPerWeek - 1)
    }
    if (profile.recoveryQuality === 'poor') {
      workoutsPerWeek = Math.max(2, workoutsPerWeek - 1)
    }

    const selectedDays = this.selectWorkoutDays(profile, days, workoutsPerWeek)
    const templates = this.selectTemplates(profile)
    const duration = this.calculateDuration(profile)
    const difficulty = this.calculateDifficulty(profile)
    const workouts: Workout[] = []

    // Check if sleep adaptation should apply for the target date
    const targetDayName = forDate.toLocaleDateString('en-US', { weekday: 'long' })
    const sleepRecord = this.getRecentSleepRecord(sleepRecords, forDate.toISOString())
    const sleepAdaptation = this.shouldSoftenForSleep(sleepRecord)

    for (let i = 0; i < workoutsPerWeek; i++) {
      const day = selectedDays[i % selectedDays.length]
      const template = templates[i % templates.length]
      let exercises = this.filterExercises(template.exercises, profile)
      const windowInfo = this.findWorkoutWindow(profile, day)
      let workoutDuration = duration
      let workoutDifficulty = difficulty
      let reasoning = ''

      // Apply sleep adaptation if this is the target day and sleep was poor
      if (day === targetDayName && sleepAdaptation.soften) {
        // Soften the workout: reduce exercises, lower intensity
        exercises = exercises.slice(0, Math.max(2, Math.ceil(exercises.length / 2)))
          .map(ex => ({
            ...ex,
            sets: Math.max(2, Math.round(ex.sets * 0.7)),
            restSeconds: ex.restSeconds + 15,
          }))
        workoutDuration = Math.max(10, Math.round(duration * 0.7))
        workoutDifficulty = 'easy'
        reasoning = this.buildReasoning(profile, {
          name: template.name + ' (Light)',
          day,
          duration: workoutDuration,
          difficulty: workoutDifficulty,
          exercises,
          window: windowInfo,
          sleepReason: sleepAdaptation.reason,
        })
      } else {
        reasoning = this.buildReasoning(profile, {
          name: template.name,
          day,
          duration,
          difficulty,
          exercises,
          window: windowInfo,
        })
      }

      workouts.push({
        id: `workout_${i}`,
        name: day === targetDayName && sleepAdaptation.soften ? template.name + ' (Light)' : template.name,
        dayOfWeek: day,
        duration: day === targetDayName && sleepAdaptation.soften ? workoutDuration : duration,
        difficulty: day === targetDayName && sleepAdaptation.soften ? workoutDifficulty : difficulty,
        targetMuscles: template.targetMuscles,
        exercises,
        equipment: template.equipment,
        estimatedCalories: Math.round((day === targetDayName && sleepAdaptation.soften ? workoutDuration : duration) * 6),
        notes: windowInfo.window
          ? `Suggested window: ${windowInfo.window}. ${template.notes}`
          : template.notes,
        reasoning,
        suggestedWindow: windowInfo.window || undefined,
      })
    }

    // Recovery days
    let recoveryIndex = 0
    for (const day of days) {
      if (!selectedDays.includes(day)) {
        const isActiveRecovery = profile.recoveryDayPreference === 'active_recovery'
        const recoveryReasoning = this.buildRecoveryReasoning(profile, day, isActiveRecovery, selectedDays)
        const recoveryWindow = this.findRecoveryWindow(profile, day, isActiveRecovery)
        workouts.push({
          id: `recovery_${recoveryIndex++}`,
          name: isActiveRecovery ? 'Active Recovery' : 'Rest Day',
          dayOfWeek: day,
          duration: isActiveRecovery ? 15 : 0,
          difficulty: 'easy',
          targetMuscles: isActiveRecovery ? ['mobility'] : [],
          exercises: isActiveRecovery ? [exerciseDatabase['yoga_sun_salutation']] : [],
          equipment: [],
          notes: isActiveRecovery
            ? 'Light mobility or a walk. Keep it easy.'
            : 'Rest day. Focus on recovery and sleep.',
          reasoning: recoveryReasoning,
          suggestedWindow: recoveryWindow || undefined,
        })
      }
    }

    return workouts.sort((a, b) => days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek))
  }

  /**
   * Build a single, plain-language sentence explaining why a workout was
   * recommended. Cites the specific onboarding inputs that drove the choice
   * so the user can see the link between their answers and the plan.
   */
  static buildReasoning(
    profile: UserProfile,
    ctx: { name: string; day: string; duration: number; difficulty: string; exercises: Exercise[]; window: WorkoutWindow; sleepReason?: string }
  ): string {
    const parts: string[] = []
    const goalLabel = GOAL_LABEL[profile.goal] || 'your goal'
    const levelLabel = FITNESS_LEVEL_LABEL[profile.fitnessLevel] || profile.fitnessLevel
    const intensityLabel = INTENSITY_LABEL[profile.preferredIntensity] || 'moderate'
    const locationLabel = LOCATION_LABEL[profile.workoutLocation] || 'at your workout spot'
    const timeMin = ctx.duration
    const windowInfo = ctx.window
    const equipmentCount = profile.equipment.length
    // Equipment access is determined by what the user actually owns, not by
    // their workoutLocation. See selectTemplates for the rationale.
    const hasGym = profile.equipment.includes('full_gym')
    const noEquipment = equipmentCount === 0 || profile.equipment.includes('none')

    // Goal + level basis
    const article = /^[aeiou]/i.test(levelLabel) ? 'an' : 'a'
    parts.push(`Recommended for ${goalLabel} as ${article} ${levelLabel} (${intensityLabel}).`)

    // Time basis
    if (profile.availableTimePerSession === '10-15' || profile.availableTimePerSession === '15-20') {
      parts.push(`Trimmed to ~${timeMin} min to fit your busy window.`)
    } else {
      parts.push(`Sized to your ${timeMin}-min window.`)
    }

    // Equipment / location basis
    if (noEquipment) {
      parts.push(`No equipment required — perfect for ${locationLabel}.`)
    } else if (hasGym) {
      parts.push(`Uses your full gym setup for compound lifts.`)
    } else {
      parts.push(`Uses what you have available (${profile.equipment.join(', ')}).`)
    }

    // Schedule basis (window or fallback) — cite the actual block before/after
    parts.push(this.formatScheduleReason(ctx.day, windowInfo, profile))

    // Sleep adaptation reason (takes priority - shown first in reasoning)
    if (ctx.sleepReason) {
      parts.push(ctx.sleepReason)
      // When sleep is poor, also note that intensity is dialed back
      parts.push(`Intensity dialed back to support your recovery today.`)
    } else {
      // Stress / sleep / recovery adjustments (only if no sleep adaptation active)
      if (profile.stressLevel === 'high') {
        parts.push(`Intensity dialed back because you reported high stress.`)
      }
      if (profile.averageSleep < 6.5) {
        parts.push(`Shorter session to respect your current sleep debt.`)
      }
      if (profile.recoveryQuality === 'poor') {
        parts.push(`Easier load to support recovery.`)
      }
    }

    return parts.join(' ')
  }

  /**
   * Format the schedule portion of the reasoning. Tries to cite a specific
   * class/work block (e.g. "before your 9:00 AM Seminar") rather than a
   * generic "based on your classes" line.
   */
  private static formatScheduleReason(
    day: string,
    window: WorkoutWindow,
    profile: UserProfile
  ): string {
    if (!window.window) {
      return `Scheduled for ${day} — it has no classes or commitments, so it's free for training.`
    }
    if (window.beforeBlock) {
      return `Scheduled for ${day} before your ${window.beforeBlock.startTime} ${window.beforeBlock.title} (${window.beforeBlock.type}). Window: ${window.window}.`
    }
    if (window.afterBlock) {
      return `Scheduled for ${day} after your ${window.afterBlock.endTime} ${window.afterBlock.title} (${window.afterBlock.type}). Window: ${window.window}.`
    }
    if (window.betweenBlocks) {
      return `Scheduled for ${day} between your ${window.betweenBlocks.endTime} ${window.betweenBlocks.title} and ${window.betweenBlocks.nextStart} next block. Window: ${window.window}.`
    }
    // No surrounding blocks (fallback by preference)
    const pref = profile.morningVsEvening
    const prefLabel = pref === 'morning' ? 'morning' : pref === 'evening' ? 'evening' : 'midday'
    return `Scheduled for ${day} in your ${prefLabel} window (${window.window}) — no classes that day.`
  }

  static buildRecoveryReasoning(
    profile: UserProfile,
    day: string,
    active: boolean,
    workoutDays: string[]
  ): string {
    const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const sortedWorkoutDays = [...workoutDays].sort((a, b) => order.indexOf(a) - order.indexOf(b))
    // Find the previous and next *workout* day relative to this recovery day
    const dayIdx = order.indexOf(day)
    const prevWorkout = sortedWorkoutDays
      .filter(d => order.indexOf(d) < dayIdx)
      .pop() || null
    const nextWorkout = sortedWorkoutDays
      .find(d => order.indexOf(d) > dayIdx) || null

    if (active) {
      let neighbor = ''
      if (prevWorkout && nextWorkout) neighbor = ` — sits between your ${prevWorkout} and ${nextWorkout} sessions to let muscles recover.`
      else if (nextWorkout) neighbor = ` — the day before your ${nextWorkout} session.`
      else if (prevWorkout) neighbor = ` — the day after your ${prevWorkout} session.`
      return `${day} is an active recovery day${neighbor} You marked "active recovery" as your preference, so we'll do light mobility.`
    }
    let neighbor = ''
    if (prevWorkout && nextWorkout) neighbor = ` It sits between your ${prevWorkout} and ${nextWorkout} sessions.`
    else if (nextWorkout) neighbor = ` Your next session is ${nextWorkout}.`
    else if (prevWorkout) neighbor = ` Your last session was ${prevWorkout}.`
    return `${day} is a full rest day.${neighbor} Use it for sleep and recovery so the next session lands well.`
  }

  /**
   * Soft "anytime" window for active-recovery days. Picks a low-stress slot
   * that doesn't conflict with any class/work block.
   */
  static findRecoveryWindow(profile: UserProfile, day: string, active: boolean): string | null {
    if (!active) return null
    const blocks = profile.scheduleBlocks
      .filter(b => b.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
    if (blocks.length === 0) {
      if (profile.morningVsEvening === 'morning') return '6:30 AM – 6:50 AM'
      if (profile.morningVsEvening === 'evening') return '5:30 PM – 5:50 PM'
      return '3:00 PM – 3:20 PM'
    }
    // Try morning before the first block, or evening after the last block
    const firstStart = this.timeToMinutes(blocks[0].startTime)
    if (firstStart >= 7 * 60) {
      const start = 6 * 60 + 30
      return `${this.fmtTime(start)} – ${this.fmtTime(start + 20)}`
    }
    const lastEnd = this.timeToMinutes(blocks[blocks.length - 1].endTime)
    const start = lastEnd + 30
    return `${this.fmtTime(start)} – ${this.fmtTime(start + 20)}`
  }

  private static selectWorkoutDays(profile: UserProfile, days: string[], count: number): string[] {
    if (profile.preferredDays.length > 0) {
      // Honor preferred days first
      const preferred = profile.preferredDays.filter(d => days.includes(d))
      if (preferred.length >= count) {
        return preferred.slice(0, count)
      }
      // Backfill with the least-busy non-preferred days
      const blockCount: Record<string, number> = {}
      days.forEach(d => { blockCount[d] = 0 })
      profile.scheduleBlocks.forEach(b => {
        blockCount[b.day] = (blockCount[b.day] || 0) + 1
      })
      const backfill = days
        .filter(d => !preferred.includes(d))
        .sort((a, b) => (blockCount[a] || 0) - (blockCount[b] || 0))
      return [...preferred, ...backfill].slice(0, count)
    }

    // No preferences: pick days with the fewest schedule blocks (most free time)
    const blockCount: Record<string, number> = {}
    days.forEach(d => { blockCount[d] = 0 })
    profile.scheduleBlocks.forEach(b => {
      blockCount[b.day] = (blockCount[b.day] || 0) + 1
    })

    return [...days]
      .sort((a, b) => (blockCount[a] || 0) - (blockCount[b] || 0))
      .slice(0, count)
  }

  static findWorkoutWindow(profile: UserProfile, day: string): WorkoutWindow {
    const blocks = profile.scheduleBlocks
      .filter(b => b.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    const timeMap: Record<string, number> = {
      '10-15': 15, '15-20': 18, '20-30': 30, '30-45': 40, '45-60': 55, '60+': 75,
    }
    const neededMinutes = timeMap[profile.availableTimePerSession] || 30
    const fmtRange = (start: number, end: number) =>
      `${this.fmtTime(start)} – ${this.fmtTime(end)}`

    // No blocks: return a window based on the user's preferred time of day
    if (blocks.length === 0) {
      if (profile.morningVsEvening === 'morning') {
        return { window: fmtRange(6 * 60 + 30, 6 * 60 + 30 + neededMinutes) }
      }
      if (profile.morningVsEvening === 'evening') {
        return { window: fmtRange(17 * 60 + 30, 17 * 60 + 30 + neededMinutes) }
      }
      return { window: fmtRange(15 * 60, 15 * 60 + neededMinutes) }
    }

    // 1. Try the slot BEFORE the first block (for morning preference, this is the natural fit)
    const firstStart = this.timeToMinutes(blocks[0].startTime)
    if (profile.morningVsEvening === 'morning' && firstStart >= 7 * 60) {
      // We need the workout to END at least 15 min before class so the user can change/shower
      const end = Math.max(6 * 60 + 30 + neededMinutes, firstStart - 15)
      const start = end - neededMinutes
      if (start >= 5 * 60) {
        return {
          window: fmtRange(start, end),
          beforeBlock: { ...blocks[0] },
        }
      }
    }

    // 2. Try gaps between consecutive blocks
    for (let i = 0; i < blocks.length - 1; i++) {
      const end = this.timeToMinutes(blocks[i].endTime)
      const nextStart = this.timeToMinutes(blocks[i + 1].startTime)
      const gap = nextStart - end
      if (gap >= neededMinutes + 15) {
        return {
          window: fmtRange(end + 15, end + 15 + neededMinutes),
          betweenBlocks: {
            endTime: blocks[i].endTime,
            nextStart: blocks[i + 1].startTime,
            title: blocks[i].title,
          },
        }
      }
    }

    // 3. Try the slot AFTER the last block (for evening preference, this is the natural fit)
    const lastEnd = this.timeToMinutes(blocks[blocks.length - 1].endTime)
    if (profile.morningVsEvening === 'evening') {
      const start = lastEnd + 30
      return {
        window: fmtRange(start, start + neededMinutes),
        afterBlock: {
          endTime: blocks[blocks.length - 1].endTime,
          startTime: blocks[blocks.length - 1].startTime,
          type: blocks[blocks.length - 1].type,
          title: blocks[blocks.length - 1].title,
        },
      }
    }

    // 4. Default fallback: after the last block (with 30 min buffer) or evening start
    const eveningStart = 17 * 60 // 5:00 PM
    const startCandidate = Math.max(lastEnd + 30, eveningStart)
    return {
      window: fmtRange(startCandidate, startCandidate + neededMinutes),
      afterBlock: {
        endTime: blocks[blocks.length - 1].endTime,
        startTime: blocks[blocks.length - 1].startTime,
        type: blocks[blocks.length - 1].type,
        title: blocks[blocks.length - 1].title,
      },
    }
  }

  private static fmtTime(totalMinutes: number): string {
    const total = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
    const hr = Math.floor(total / 60)
    const min = total % 60
    const period = hr >= 12 ? 'PM' : 'AM'
    const h12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr
    return `${h12}:${min.toString().padStart(2, '0')} ${period}`
  }

  private static timeToMinutes(t: string): number {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  private static selectTemplates(profile: UserProfile): Array<{
    name: string; targetMuscles: string[]; exercises: Exercise[]; equipment: string[]; notes: string
  }> {
    const level = profile.fitnessLevel
    const goal = profile.goal
    const secondary = profile.secondaryGoals || []
    const templates: Array<{ name: string; targetMuscles: string[]; exercises: Exercise[]; equipment: string[]; notes: string }> = []

    // Equipment access is determined by what the user actually owns, not by
    // their workoutLocation. (Someone can train at a gym but only have a
    // pair of dumbbells.) WorkoutLocation still affects windowing / travel
    // time but not which equipment is allowed.
    const hasGym = profile.equipment.includes('full_gym')
    const hasDumbbells = profile.equipment.includes('dumbbells') || hasGym
    const hasBands = profile.equipment.includes('resistance_bands')
    const noEquipment = profile.equipment.length === 0 || profile.equipment.includes('none')

    if (STRENGTH_GOALS.includes(goal) || secondary.some(g => STRENGTH_GOALS.includes(g)) || profile.workoutType === 'strength') {
      let exercises: Exercise[]
      let equipment: string[]
      if (noEquipment) {
        exercises = level === 'beginner' || level === 'novice'
          ? [exerciseDatabase['incline_push_ups'], exerciseDatabase['bodyweight_squats'], exerciseDatabase['plank']]
          : [exerciseDatabase['push_ups'], exerciseDatabase['walking_lunges'], exerciseDatabase['plank'], exerciseDatabase['mountain_climbers']]
        equipment = []
      } else if (hasGym) {
        exercises = [exerciseDatabase['deadlift'], exerciseDatabase['dumbbell_bench_press'], exerciseDatabase['leg_press']]
        equipment = ['full_gym']
      } else {
        exercises = level === 'beginner' || level === 'novice'
          ? [exerciseDatabase['dumbbell_bench_press'], exerciseDatabase['goblet_squat'], exerciseDatabase['plank']]
          : [exerciseDatabase['dumbbell_bench_press'], exerciseDatabase['dumbbell_rows'], exerciseDatabase['goblet_squat'], exerciseDatabase['plank']]
        equipment = ['dumbbell']
      }
      templates.push({
        name: 'Strength Focus',
        targetMuscles: ['chest', 'back', 'legs'],
        exercises,
        equipment,
        notes: 'Focus on progressive overload',
      })
    }

    if (ENDURANCE_GOALS.includes(goal) || secondary.some(g => ENDURANCE_GOALS.includes(g)) || profile.workoutType === 'cardio') {
      templates.push({
        name: 'Cardio & Conditioning',
        targetMuscles: ['cardio', 'full_body'],
        exercises: level === 'advanced'
          ? [exerciseDatabase['burpees'], exerciseDatabase['mountain_climbers'], exerciseDatabase['running']]
          : [exerciseDatabase['jumping_jacks'], exerciseDatabase['mountain_climbers'], exerciseDatabase['running']],
        equipment: [],
        notes: 'Maintain steady intensity throughout',
      })
    }

    if (MOBILITY_GOALS.includes(goal) || profile.workoutType === 'mobility' || profile.workoutType === 'flexibility') {
      templates.push({
        name: 'Mobility & Flexibility',
        targetMuscles: ['flexibility', 'mobility'],
        exercises: [exerciseDatabase['yoga_sun_salutation'], exerciseDatabase['plank']],
        equipment: [],
        notes: 'Focus on range of motion and breathing',
      })
    }

    if (CONSISTENCY_GOALS.includes(goal) && templates.length === 0) {
      // For consistency goals, build a simple full-body plan
      const exercises = noEquipment
        ? [exerciseDatabase['bodyweight_squats'], exerciseDatabase['incline_push_ups'], exerciseDatabase['plank']]
        : hasDumbbells
          ? [exerciseDatabase['goblet_squat'], exerciseDatabase['dumbbell_rows'], exerciseDatabase['plank']]
          : [exerciseDatabase['bodyweight_squats'], exerciseDatabase['plank']]
      templates.push({
        name: 'Full Body Basics',
        targetMuscles: ['full_body'],
        exercises,
        equipment: noEquipment ? [] : hasDumbbells ? ['dumbbell'] : [],
        notes: 'Simple full-body work to keep the streak alive',
      })
    }

    if (hasBands && templates.length === 0) {
      templates.push({
        name: 'Band Resistance',
        targetMuscles: ['back', 'arms', 'core'],
        exercises: [exerciseDatabase['band_rows'], exerciseDatabase['push_ups'], exerciseDatabase['plank']],
        equipment: ['resistance_bands'],
        notes: 'Controlled resistance band work',
      })
    }

    if (templates.length === 0) {
      const exercises = level === 'beginner' || level === 'novice'
        ? [exerciseDatabase['goblet_squat'], exerciseDatabase['incline_push_ups'], exerciseDatabase['plank']]
        : level === 'intermediate'
          ? [exerciseDatabase['goblet_squat'], exerciseDatabase['dumbbell_rows'], exerciseDatabase['push_ups'], exerciseDatabase['plank']]
          : [exerciseDatabase['deadlift'], exerciseDatabase['dumbbell_bench_press'], exerciseDatabase['burpees']]

      templates.push({
        name: profile.shortVsLong === 'short' ? 'Quick Full Body' : 'Full Body Workout',
        targetMuscles: ['full_body'],
        exercises: noEquipment
          ? exercises.filter(e => e.equipment.length === 0)
          : hasDumbbells ? exercises : exercises.filter(e => e.equipment.length === 0),
        equipment: noEquipment ? [] : ['dumbbell'],
        notes: 'Balanced full body session',
      })
    }

    return templates
  }

  private static filterExercises(exercises: Exercise[], profile: UserProfile): Exercise[] {
    const noEquipment = profile.equipment.length === 0 || profile.equipment.includes('none')
    // Equipment access is determined by what the user actually owns, not by
    // their workoutLocation. See selectTemplates for the rationale.
    const hasGym = profile.equipment.includes('full_gym')
    const hasDumbbells = profile.equipment.includes('dumbbells') || hasGym
    const hasBands = profile.equipment.includes('resistance_bands')

    const filtered = exercises.filter(ex => {
      if (noEquipment) {
        return ex.equipment.length === 0
      }
      if (hasGym) return true
      return ex.equipment.every(e =>
        e === '' || e === 'none' ||
        (e === 'dumbbell' && (hasDumbbells || hasGym)) ||
        (e === 'resistance_bands' && hasBands) ||
        (e === 'barbell' && hasGym) ||
        (e === 'machine' && hasGym) ||
        (e === 'bench' && hasGym)
      )
    })

    const cap = profile.shortVsLong === 'short' ? 4 : profile.shortVsLong === 'long' ? 6 : 5
    return filtered.slice(0, cap)
  }

  private static calculateDuration(profile: UserProfile): number {
    const timeMap: Record<string, number> = {
      '10-15': 15, '15-20': 18, '20-30': 30, '30-45': 40, '45-60': 55, '60+': 75,
    }
    let duration = timeMap[profile.availableTimePerSession] || 30
    if (profile.shortVsLong === 'short') duration = Math.min(duration, 25)
    if (profile.stressLevel === 'high') duration = Math.max(15, duration - 10)
    if (profile.averageSleep < 6.5) duration = Math.max(15, duration - 5)
    if (profile.recoveryQuality === 'poor') duration = Math.max(15, duration - 5)
    return duration
  }

  private static calculateDifficulty(profile: UserProfile): 'easy' | 'moderate' | 'hard' {
    if (profile.preferredIntensity === 'low' || profile.fitnessLevel === 'beginner') return 'easy'
    if (profile.preferredIntensity === 'high' && profile.fitnessLevel === 'advanced') return 'hard'
    if (profile.fitnessLevel === 'intermediate' || profile.fitnessLevel === 'advanced') return 'moderate'
    if (profile.stressLevel === 'high' || profile.recoveryQuality === 'poor') return 'easy'
    return 'easy'
  }

  // ─────────────────────────────────────────────────────────────────────
  // ADAPTIVE ADJUST (Stage 3)
  // Each reason applies a distinct, deterministic transformation to
  // today's workout. None of them regenerate the plan or randomize.
  // ─────────────────────────────────────────────────────────────────────

  /**
   * Dispatcher: apply the chosen adjust reason to a single workout and
   * return the new workout. Today's entry in `userPlan` is replaced with
   * the result; everything else in the week is unchanged.
   */
  static adjustWorkout(workout: Workout, reason: AdjustReason, profile: UserProfile): Workout {
    // Rest days and active-recovery days can't really be "adjusted" by these
    // reasons — but a user can still pick one, so substitute a quick
    // bodyweight session instead of no-op-ing.
    if (workout.exercises.length === 0) {
      const placeholder: Workout = {
        ...workout,
        name: 'Quick Bodyweight Reset',
        duration: 12,
        difficulty: 'easy',
        targetMuscles: ['full_body'],
        exercises: [
          exerciseDatabase['bodyweight_squats'],
          exerciseDatabase['incline_push_ups'],
          exerciseDatabase['plank'],
        ],
        equipment: [],
        estimatedCalories: Math.round(12 * 6),
      }
      return this.withAdjustedMeta(placeholder, reason, 'Swap from rest to a 12-min bodyweight reset so you still move today.')
    }

    switch (reason) {
      case 'less_time':         return this.shortenForTime(workout)
      case 'more_tired':        return this.toneDownForFatigue(workout)
      case 'too_difficult':     return this.lowerDifficulty(workout)
      case 'no_equipment':      return this.stripEquipment(workout, profile)
      case 'schedule_changed':  return this.refitToSchedule(workout, profile)
      case 'different_activity':return this.rotateTemplate(workout, profile)
    }
  }

  // 1) Less time — cut duration, drop tail exercises, shorten rest
  private static shortenForTime(workout: Workout): Workout {
    const newDuration = Math.max(12, Math.round(workout.duration * 0.6))
    // Drop the last 1-2 exercises, but always keep at least 2
    const dropCount = workout.exercises.length >= 5 ? 2 : workout.exercises.length >= 3 ? 1 : 0
    const newExercises = workout.exercises.slice(0, Math.max(2, workout.exercises.length - dropCount))
    const newRest = Math.max(20, Math.round(workout.exercises[0]?.restSeconds ?? 60) * 0.75)
    const newExercisesWithRest = newExercises.map(ex => ({ ...ex, restSeconds: newRest }))

    const updated: Workout = {
      ...workout,
      duration: newDuration,
      exercises: newExercisesWithRest,
      estimatedCalories: Math.round(newDuration * 6),
    }
    return this.withAdjustedMeta(
      updated,
      'less_time',
      `Trimmed from ${workout.duration} to ${newDuration} min and cut ${dropCount} move${dropCount === 1 ? '' : 's'} to fit your window.`
    )
  }

  // 2) More tired — keep the moves, drop the load
  private static toneDownForFatigue(workout: Workout): Workout {
    const newExercises = workout.exercises.map(ex => ({
      ...ex,
      // Halve the sets so total volume drops, but keep all the moves
      sets: Math.max(2, Math.round(ex.sets * 0.5)),
      // +15s rest so the user can actually catch their breath
      restSeconds: ex.restSeconds + 15,
    }))
    const updated: Workout = {
      ...workout,
      difficulty: 'easy',
      exercises: newExercises,
    }
    return this.withAdjustedMeta(
      updated,
      'more_tired',
      `Kept your ${workout.exercises.length} moves but halved the sets and added 15s of rest — easier on tired muscles.`
    )
  }

  // 3) Too difficult — swap hard/moderate moves for easy alternatives that target the same muscles
  private static lowerDifficulty(workout: Workout): Workout {
    // Index all `easy` exercises by their first target muscle for quick lookup
    const easyByMuscle: Record<string, Exercise[]> = {}
    for (const id of Object.keys(exerciseDatabase)) {
      const ex = exerciseDatabase[id]
      if (ex.difficulty !== 'easy') continue
      const primary = ex.targetMuscles[0]
      if (!primary) continue
      ;(easyByMuscle[primary] ||= []).push(ex)
    }

    const newExercises: Exercise[] = workout.exercises.map(ex => {
      if (ex.difficulty === 'easy') return { ...ex, sets: Math.min(ex.sets, 3) }
      const primary = ex.targetMuscles[0]
      const candidates = primary ? easyByMuscle[primary] : undefined
      if (candidates && candidates.length > 0) {
        // Pick a deterministic alternative (first one that's not the same id)
        const alt = candidates.find(c => c.id !== ex.id) || candidates[0]
        return { ...alt, sets: 3 }
      }
      // No muscle-specific alternative: just reduce sets and rest
      return { ...ex, difficulty: 'easy' as const, sets: 3, restSeconds: Math.max(30, ex.restSeconds - 15) }
    })

    const updated: Workout = {
      ...workout,
      difficulty: 'easy',
      exercises: newExercises,
    }
    return this.withAdjustedMeta(
      updated,
      'too_difficult',
      `Swapped harder moves for easier ones that still hit the same muscles. Same plan, friendlier load.`
    )
  }

  // 4) No equipment — strip to bodyweight, falling back to a known-good template
  private static stripEquipment(workout: Workout, profile: UserProfile): Workout {
    // Temporarily pretend the user has zero equipment
    const noEquipProfile: UserProfile = { ...profile, equipment: ['none'] }
    const stripped = this.filterExercises(workout.exercises, noEquipProfile)
    if (stripped.length >= 2) {
      const updated: Workout = {
        ...workout,
        exercises: stripped,
        equipment: [],
        // Re-fit duration to a sensible bodyweight cap
        duration: Math.min(workout.duration, 30),
        estimatedCalories: Math.round(Math.min(workout.duration, 30) * 6),
      }
      return this.withAdjustedMeta(
        updated,
        'no_equipment',
        `Dropped every move that needs gear — ${stripped.length} bodyweight exercises left.`
      )
    }
    // Fall back to a known-good bodyweight template
    const fallback: Workout = {
      ...workout,
      name: 'Bodyweight Reset',
      duration: 20,
      difficulty: 'easy',
      targetMuscles: ['full_body'],
      exercises: [
        exerciseDatabase['bodyweight_squats'],
        exerciseDatabase['incline_push_ups'],
        exerciseDatabase['glute_bridges'],
        exerciseDatabase['plank'],
      ],
      equipment: [],
      estimatedCalories: 120,
    }
    return this.withAdjustedMeta(
      fallback,
      'no_equipment',
      `Replaced the workout with a 20-min bodyweight set — no gear needed.`
    )
  }

  // 5) Schedule changed — re-fit window to the same workout; trim if it doesn't fit
  private static refitToSchedule(workout: Workout, profile: UserProfile): Workout {
    const win = this.findWorkoutWindow(profile, workout.dayOfWeek)
    if (!win.window) {
      // No real window found — fall back to time-shorten so the user can still train
      return this.shortenForTime(workout)
    }
    // Try to estimate the new window length from the "HH:MM AM/PM – HH:MM AM/PM" string
    const m = win.window.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*[–-]\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    let windowMinutes = workout.duration
    if (m) {
      const [, h1, min1, ap1, h2, min2, ap2] = m
      const toMin = (h: string, mm: string, ap: string) => {
        let hh = parseInt(h, 10)
        if (ap.toUpperCase() === 'PM' && hh !== 12) hh += 12
        if (ap.toUpperCase() === 'AM' && hh === 12) hh = 0
        return hh * 60 + parseInt(mm, 10)
      }
      const a = toMin(h1, min1, ap1)
      let b = toMin(h2, min2, ap2)
      if (b < a) b += 24 * 60 // overnight
      windowMinutes = b - a
    }
    if (windowMinutes >= workout.duration) {
      // Window has room — keep the workout, just update the label
      const updated: Workout = {
        ...workout,
        suggestedWindow: win.window,
        notes: win.window ? `Suggested window: ${win.window}. ${workout.notes || ''}` : workout.notes,
      }
      return this.withAdjustedMeta(
        updated,
        'schedule_changed',
        `Re-fit to your current schedule: ${win.window}. Same workout, new slot.`
      )
    }
    // Window is too tight — shorten to match
    const newDuration = Math.max(10, windowMinutes - 2)
    const updated: Workout = {
      ...workout,
      duration: newDuration,
      suggestedWindow: win.window,
      notes: `Suggested window: ${win.window}. ${workout.notes || ''}`,
      estimatedCalories: Math.round(newDuration * 6),
    }
    return this.withAdjustedMeta(
      updated,
      'schedule_changed',
      `Window is only ${windowMinutes} min — trimmed the workout from ${workout.duration} to ${newDuration} min to fit.`
    )
  }

  // 6) Different activity — rotate to the next template in the user's plan set
  private static rotateTemplate(workout: Workout, profile: UserProfile): Workout {
    const templates = this.selectTemplates(profile)
    if (templates.length <= 1) {
      // Nothing to rotate to — fall back to a different style entirely
      const alt: Workout = {
        ...workout,
        name: 'Mobility & Flow',
        targetMuscles: ['flexibility', 'mobility'],
        exercises: [exerciseDatabase['yoga_sun_salutation'], exerciseDatabase['plank']],
        equipment: [],
        difficulty: 'easy',
      }
      return this.withAdjustedMeta(alt, 'different_activity', `Swapped in a mobility & flow session — different style, same effort.`)
    }
    // Find current template index by name match
    const currentIdx = templates.findIndex(t => t.name === workout.name)
    const nextIdx = (currentIdx + 1) % templates.length
    const next = templates[nextIdx]
    // Filter the new template's exercises through the user's real equipment so we
    // don't end up recommending moves they can't do.
    const newExercises = this.filterExercises(next.exercises, profile)
    if (newExercises.length === 0) {
      // Equip-filter emptied it — try the next-next template
      const fallback = templates[(nextIdx + 1) % templates.length]
      const fbExercises = this.filterExercises(fallback.exercises, profile)
      const updated: Workout = {
        ...workout,
        name: fallback.name,
        targetMuscles: fallback.targetMuscles,
        exercises: fbExercises,
        equipment: fallback.equipment,
        reasoning: `Adjusted: different activity — swapped ${workout.name} for ${fallback.name} for variety.`,
      }
      return this.withAdjustedMeta(updated, 'different_activity', `Swapped in ${fallback.name} instead — different style for today.`)
    }
    const updated: Workout = {
      ...workout,
      name: next.name,
      targetMuscles: next.targetMuscles,
      exercises: newExercises,
      equipment: next.equipment,
      reasoning: `Adjusted: different activity — swapped ${workout.name} for ${next.name} for variety.`,
    }
    return this.withAdjustedMeta(updated, 'different_activity', `Swapped in ${next.name} instead — different style for today.`)
  }

  // Helper: stamp the adjustment reason on the workout + prepend a plain-language note
  private static withAdjustedMeta(workout: Workout, reason: AdjustReason, body: string): Workout {
    const prefix = `Adjusted: ${reason.replace(/_/g, ' ')} — `
    const prev = workout.reasoning ? workout.reasoning + ' ' : ''
    return {
      ...workout,
      adjustedReason: reason,
      reasoning: prefix + body + (prev && !prev.startsWith('Adjusted') ? ` (Original: ${prev.trim()})` : ''),
    }
  }
}

export { exerciseDatabase }
