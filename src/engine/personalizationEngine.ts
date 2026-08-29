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
}

const STRENGTH_GOALS = ['improve_strength', 'build_muscle']
const ENDURANCE_GOALS = ['improve_endurance', 'athletic_performance', 'lose_body_fat']
const MOBILITY_GOALS = ['improve_mobility']

export class PersonalizationEngine {
  static generatePlan(profile: UserProfile): Workout[] {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    let workoutsPerWeek = profile.workoutsPerWeek

    // Reduce frequency for busy schedules
    if (profile.scheduleChangesFrequently && profile.stressLevel === 'high') {
      workoutsPerWeek = Math.max(2, workoutsPerWeek - 1)
    }
    if (profile.availableTimePerSession === '10-15') {
      workoutsPerWeek = Math.min(workoutsPerWeek, 4)
    }

    const selectedDays = this.selectWorkoutDays(profile, days, workoutsPerWeek)
    const templates = this.selectTemplates(profile)
    const workouts: Workout[] = []

    for (let i = 0; i < workoutsPerWeek; i++) {
      const day = selectedDays[i % selectedDays.length]
      const template = templates[i % templates.length]
      const exercises = this.filterExercises(template.exercises, profile)
      const window = this.findWorkoutWindow(profile, day)

      workouts.push({
        id: `workout_${i}`,
        name: template.name,
        dayOfWeek: day,
        duration: this.calculateDuration(profile),
        difficulty: this.calculateDifficulty(profile),
        targetMuscles: template.targetMuscles,
        exercises,
        equipment: template.equipment,
        estimatedCalories: Math.round(this.calculateDuration(profile) * 6),
        notes: window
          ? `Suggested window: ${window}. ${template.notes}`
          : template.notes,
      })
    }

    // Recovery days
    let recoveryIndex = 0
    for (const day of days) {
      if (!selectedDays.includes(day)) {
        const isActiveRecovery = profile.recoveryDayPreference === 'active_recovery'
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
        })
      }
    }

    return workouts.sort((a, b) => days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek))
  }

  private static selectWorkoutDays(profile: UserProfile, days: string[], count: number): string[] {
    if (profile.preferredDays.length > 0) {
      return profile.preferredDays.slice(0, count)
    }

    // Prefer days with fewer schedule blocks (more free time)
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

    // Find gap after last commitment
    const lastBlock = blocks[blocks.length - 1]
    const [h, m] = lastBlock.endTime.split(':').map(Number)
    const endMinutes = h * 60 + m + 30
    const startH = Math.floor(endMinutes / 60)
    const startM = endMinutes % 60
    const endH = startH + 1
    const fmt = (hr: number, min: number) => {
      const period = hr >= 12 ? 'PM' : 'AM'
      const h12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr
      return `${h12}:${min.toString().padStart(2, '0')} ${period}`
    }
    return `${fmt(startH, startM)} – ${fmt(endH, startM)}`
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
      const exercises: Exercise[] = noEquipment
        ? [exerciseDatabase['push_ups'], exerciseDatabase['goblet_squat'], exerciseDatabase['plank']]
        : hasGym
          ? [exerciseDatabase['deadlift'], exerciseDatabase['dumbbell_bench_press'], exerciseDatabase['leg_press']]
          : [exerciseDatabase['dumbbell_bench_press'], exerciseDatabase['dumbbell_rows'], exerciseDatabase['goblet_squat']]
      templates.push({
        name: 'Strength Focus',
        targetMuscles: ['chest', 'back', 'legs'],
        exercises,
        equipment: noEquipment ? [] : hasGym ? ['full_gym'] : ['dumbbell'],
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
        ? [exerciseDatabase['goblet_squat'], exerciseDatabase['push_ups'], exerciseDatabase['plank']]
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
    const noEquipment = profile.equipment.length === 0
    return exercises.filter(ex => {
      if (noEquipment && ex.equipment.some(e => !['', 'none'].includes(e))) {
        // Replace with bodyweight alternative if possible
        return ex.equipment.length === 0
      }
      return true
    }).slice(0, profile.shortVsLong === 'short' ? 4 : 6)
  }

  private static calculateDuration(profile: UserProfile): number {
    const timeMap: Record<string, number> = {
      '10-15': 15, '15-20': 18, '20-30': 30, '30-45': 40, '45-60': 55, '60+': 75,
    }
    let duration = timeMap[profile.availableTimePerSession] || 30
    if (profile.shortVsLong === 'short') duration = Math.min(duration, 25)
    if (profile.stressLevel === 'high') duration = Math.max(15, duration - 10)
    return duration
  }

  private static calculateDifficulty(profile: UserProfile): 'easy' | 'moderate' | 'hard' {
    if (profile.preferredIntensity === 'low' || profile.fitnessLevel === 'beginner') return 'easy'
    if (profile.preferredIntensity === 'high' || profile.fitnessLevel === 'advanced') return 'hard'
    if (profile.fitnessLevel === 'intermediate') return 'moderate'
    return 'easy'
  }
}

export { exerciseDatabase }
