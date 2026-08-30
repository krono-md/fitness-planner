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
  static generatePlan(profile: UserProfile): Workout[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let workoutsPerWeek = profile.workoutsPerWeek

    // Reduce frequency for high stress or low sleep
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

    for (let i = 0; i < workoutsPerWeek; i++) {
      const day = selectedDays[i % selectedDays.length]
      const template = templates[i % templates.length]
      const exercises = this.filterExercises(template.exercises, profile)
      const window = this.findWorkoutWindow(profile, day)
      const reasoning = this.buildReasoning(profile, {
        name: template.name,
        day,
        duration,
        difficulty,
        exercises,
        window,
      })

      workouts.push({
        id: `workout_${i}`,
        name: template.name,
        dayOfWeek: day,
        duration,
        difficulty,
        targetMuscles: template.targetMuscles,
        exercises,
        equipment: template.equipment,
        estimatedCalories: Math.round(duration * 6),
        notes: window
          ? `Suggested window: ${window}. ${template.notes}`
          : template.notes,
        reasoning,
        suggestedWindow: window || undefined,
      })
    }

    // Recovery days
    let recoveryIndex = 0
    for (const day of days) {
      if (!selectedDays.includes(day)) {
        const isActiveRecovery = profile.recoveryDayPreference === 'active_recovery'
        const recoveryReasoning = this.buildRecoveryReasoning(profile, day, isActiveRecovery)
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
    ctx: { name: string; day: string; duration: number; difficulty: string; exercises: Exercise[]; window: string | null }
  ): string {
    const parts: string[] = []
    const goalLabel = GOAL_LABEL[profile.goal] || 'your goal'
    const levelLabel = FITNESS_LEVEL_LABEL[profile.fitnessLevel] || profile.fitnessLevel
    const intensityLabel = INTENSITY_LABEL[profile.preferredIntensity] || 'moderate'
    const locationLabel = LOCATION_LABEL[profile.workoutLocation] || 'at your workout spot'
    const timeMin = ctx.duration
    const window = ctx.window
    const equipmentCount = profile.equipment.length
    const hasGym = profile.equipment.includes('full_gym') || profile.workoutLocation === 'gym'
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

    // Schedule basis (window or fallback)
    if (window) {
      parts.push(`Scheduled for ${ctx.day} around ${window} based on your classes.`)
    } else {
      parts.push(`Scheduled for ${ctx.day} — your least busy day.`)
    }

    // Stress / sleep / recovery adjustments
    if (profile.stressLevel === 'high') {
      parts.push(`Intensity dialed back because you reported high stress.`)
    }
    if (profile.averageSleep < 6.5) {
      parts.push(`Shorter session to respect your current sleep debt.`)
    }
    if (profile.recoveryQuality === 'poor') {
      parts.push(`Easier load to support recovery.`)
    }

    return parts.join(' ')
  }

  static buildRecoveryReasoning(profile: UserProfile, day: string, active: boolean): string {
    if (active) {
      return `${day} is a recovery day. We picked active recovery (light mobility) since you marked "active_recovery" as your preference.`
    }
    return `${day} is a full rest day based on your preference. Use it for sleep and recovery so the next session lands well.`
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

  static findWorkoutWindow(profile: UserProfile, day: string): string | null {
    const blocks = profile.scheduleBlocks
      .filter(b => b.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))

    if (blocks.length === 0) {
      if (profile.morningVsEvening === 'morning') return '6:30 AM – 7:30 AM'
      if (profile.morningVsEvening === 'evening') return '5:30 PM – 6:30 PM'
      return '3:00 PM – 4:00 PM'
    }

    // Find the first gap between or after blocks that fits the user's session length
    const timeMap: Record<string, number> = {
      '10-15': 15, '15-20': 18, '20-30': 30, '30-45': 40, '45-60': 55, '60+': 75,
    }
    const neededMinutes = timeMap[profile.availableTimePerSession] || 30
    const fmt = (totalMinutes: number) => {
      const total = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
      const hr = Math.floor(total / 60)
      const min = total % 60
      const period = hr >= 12 ? 'PM' : 'AM'
      const h12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr
      return `${h12}:${min.toString().padStart(2, '0')} ${period}`
    }

    // Try gaps between consecutive blocks first
    for (let i = 0; i < blocks.length - 1; i++) {
      const end = this.timeToMinutes(blocks[i].endTime)
      const nextStart = this.timeToMinutes(blocks[i + 1].startTime)
      const gap = nextStart - end
      if (gap >= neededMinutes) {
        return `${fmt(end)} – ${fmt(end + neededMinutes)}`
      }
    }

    // Try after the last block, in the evening
    const lastEnd = this.timeToMinutes(blocks[blocks.length - 1].endTime)
    const eveningStart = 17 * 60 // 5:00 PM
    const startCandidate = Math.max(lastEnd + 30, eveningStart)
    return `${fmt(startCandidate)} – ${fmt(startCandidate + neededMinutes)}`
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

    const hasGym = profile.equipment.includes('full_gym') || profile.workoutLocation === 'gym'
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
    const hasGym = profile.equipment.includes('full_gym') || profile.workoutLocation === 'gym'
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
}

export { exerciseDatabase }
