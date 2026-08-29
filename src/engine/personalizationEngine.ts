import { UserProfile, Workout, Exercise } from '../types'

// Exercise Database
const exerciseDatabase: Record<string, Exercise> = {
  'goblet_squat': {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    equipment: ['dumbbell'],
    targetMuscles: ['quads', 'glutes', 'core'],
    difficulty: 'moderate',
    instructions: 'Hold a dumbbell at chest level, feet shoulder-width apart. Lower into a squat, keeping chest upright and weight in heels. Return to standing.'
  },
  'push_ups': {
    id: 'push_ups',
    name: 'Push-ups',
    sets: 3,
    reps: '8-12',
    restSeconds: 60,
    equipment: [],
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'moderate',
    instructions: 'Start in plank position. Lower your body until chest nearly touches floor. Push back up to starting position.'
  },
  'dumbbell_rows': {
    id: 'dumbbell_rows',
    name: 'Dumbbell Rows',
    sets: 3,
    reps: '10-12',
    restSeconds: 60,
    equipment: ['dumbbell'],
    targetMuscles: ['back', 'biceps'],
    difficulty: 'moderate',
    instructions: 'Bent over position, one knee on bench. Row dumbbell to hip, squeezing shoulder blade.'
  },
  'jumping_jacks': {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    sets: 3,
    reps: '20-30',
    restSeconds: 45,
    equipment: [],
    targetMuscles: ['full_body', 'cardio'],
    difficulty: 'easy',
    instructions: 'Jump feet apart while raising arms overhead. Return to starting position. Repeat at steady pace.'
  },
  'plank': {
    id: 'plank',
    name: 'Plank Hold',
    sets: 3,
    reps: '30-60s',
    restSeconds: 60,
    equipment: [],
    targetMuscles: ['core', 'shoulders'],
    difficulty: 'moderate',
    instructions: 'Hold a push-up position with forearms on ground. Keep body straight and core tight.'
  },
  'dumbbell_bench_press': {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Bench Press',
    sets: 4,
    reps: '8-10',
    restSeconds: 90,
    equipment: ['dumbbell', 'bench'],
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    difficulty: 'moderate',
    instructions: 'Lie on bench with dumbbells at shoulder level. Press up and together. Lower with control.'
  },
  'deadlift': {
    id: 'deadlift',
    name: 'Deadlift',
    sets: 4,
    reps: '5-8',
    restSeconds: 120,
    equipment: ['barbell'],
    targetMuscles: ['back', 'glutes', 'hamstrings', 'core'],
    difficulty: 'hard',
    instructions: 'Barbell at shins, feet hip-width. Hinge at hips, keep back straight. Drive through heels to stand.'
  },
  'mountain_climbers': {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    sets: 3,
    reps: '30-40',
    restSeconds: 45,
    equipment: [],
    targetMuscles: ['core', 'cardio', 'shoulders'],
    difficulty: 'moderate',
    instructions: 'Plank position. Bring knees alternately toward chest at a quick pace.'
  },
  'burpees': {
    id: 'burpees',
    name: 'Burpees',
    sets: 3,
    reps: '10-15',
    restSeconds: 60,
    equipment: [],
    targetMuscles: ['full_body', 'cardio'],
    difficulty: 'hard',
    instructions: 'Squat down, place hands on floor, jump feet back to plank, jump feet back to squat, jump up with arms overhead.'
  },
  'running': {
    id: 'running',
    name: 'Running',
    sets: 1,
    reps: '20-30 min',
    restSeconds: 0,
    equipment: [],
    targetMuscles: ['cardio', 'legs'],
    difficulty: 'moderate',
    instructions: 'Maintain steady pace. Focus on breathing and form. Can be on treadmill or outdoors.'
  },
  'yoga_sun_salutation': {
    id: 'yoga_sun_salutation',
    name: 'Yoga Sun Salutation',
    sets: 5,
    reps: 'rounds',
    restSeconds: 30,
    equipment: [],
    targetMuscles: ['flexibility', 'mobility', 'core'],
    difficulty: 'easy',
    instructions: 'Flow through mountain pose, forward fold, plank, up dog, down dog, returning to mountain.'
  },
  'leg_press': {
    id: 'leg_press',
    name: 'Leg Press',
    sets: 3,
    reps: '10-12',
    restSeconds: 90,
    equipment: ['machine'],
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    difficulty: 'moderate',
    instructions: 'Sit with back against pad. Push platform away using legs. Return with control.'
  }
}

// Workout Templates
const workoutTemplates = {
  beginner: {
    'Full Body': [
      exerciseDatabase['goblet_squat'],
      exerciseDatabase['push_ups'],
      exerciseDatabase['dumbbell_rows'],
      exerciseDatabase['plank']
    ],
    'Cardio': [
      exerciseDatabase['jumping_jacks'],
      exerciseDatabase['mountain_climbers'],
      exerciseDatabase['running']
    ],
    'Mobility': [
      exerciseDatabase['yoga_sun_salutation']
    ]
  },
  intermediate: {
    'Upper Body': [
      exerciseDatabase['dumbbell_bench_press'],
      exerciseDatabase['dumbbell_rows'],
      exerciseDatabase['push_ups']
    ],
    'Lower Body': [
      exerciseDatabase['goblet_squat'],
      exerciseDatabase['leg_press'],
      exerciseDatabase['dumbbell_rows']
    ],
    'Full Body': [
      exerciseDatabase['goblet_squat'],
      exerciseDatabase['push_ups'],
      exerciseDatabase['dumbbell_bench_press'],
      exerciseDatabase['dumbbell_rows'],
      exerciseDatabase['plank']
    ],
    'Cardio': [
      exerciseDatabase['burpees'],
      exerciseDatabase['mountain_climbers'],
      exerciseDatabase['jumping_jacks']
    ]
  },
  advanced: {
    'Strength': [
      exerciseDatabase['deadlift'],
      exerciseDatabase['dumbbell_bench_press'],
      exerciseDatabase['dumbbell_rows']
    ],
    'Power': [
      exerciseDatabase['burpees'],
      exerciseDatabase['mountain_climbers']
    ]
  }
}

export class PersonalizationEngine {
  static generatePlan(profile: UserProfile): Workout[] {
    const workouts: Workout[] = []
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const selectedDays = profile.preferredDays.length > 0 ? profile.preferredDays : days.slice(0, profile.workoutsPerWeek)

    const templates = this.selectTemplates(profile)
    let workoutIndex = 0

    for (let i = 0; i < profile.workoutsPerWeek; i++) {
      const dayIndex = i % selectedDays.length
      const day = selectedDays[dayIndex]

      const template = templates[i % templates.length]
      const duration = this.calculateDuration(profile)
      const difficulty = this.calculateDifficulty(profile)

      workouts.push({
        id: `workout_${i}`,
        name: template.name,
        dayOfWeek: day,
        duration,
        difficulty,
        targetMuscles: template.targetMuscles || [],
        exercises: template.exercises,
        equipment: template.equipment,
        notes: template.notes
      })
    }

    // Add recovery days
    const recoveryDayCount = 7 - profile.workoutsPerWeek
    let recoveryIndex = 0
    for (const day of days) {
      if (!selectedDays.includes(day) && recoveryIndex < recoveryDayCount) {
        workouts.push({
          id: `recovery_${recoveryIndex}`,
          name: 'Rest / Recovery',
          dayOfWeek: day,
          duration: 0,
          difficulty: 'easy',
          targetMuscles: [],
          exercises: [],
          equipment: [],
          notes: 'Rest day. Focus on recovery and mobility if desired.'
        })
        recoveryIndex++
      }
    }

    return workouts.sort((a, b) => days.indexOf(a.dayOfWeek) - days.indexOf(b.dayOfWeek))
  }

  private static selectTemplates(profile: UserProfile): any[] {
    const level = profile.fitnessLevel
    const goal = profile.goal
    const templates: any[] = []

    // Select based on fitness level and goal
    if (profile.goal === 'strength' || profile.secondaryGoals.includes('strength')) {
      templates.push({
        name: 'Strength Focus',
        targetMuscles: ['chest', 'back', 'legs'],
        exercises: [
          exerciseDatabase['dumbbell_bench_press'],
          exerciseDatabase['dumbbell_rows'],
          exerciseDatabase['goblet_squat']
        ],
        equipment: ['dumbbell'],
        notes: 'Focus on progressive overload'
      })
    }

    if (profile.goal === 'cardio' || profile.secondaryGoals.includes('endurance')) {
      templates.push({
        name: 'Cardio Session',
        targetMuscles: ['cardio'],
        exercises: [
          exerciseDatabase['running'],
          exerciseDatabase['mountain_climbers']
        ],
        equipment: [],
        notes: 'Maintain steady intensity'
      })
    }

    if (profile.goal === 'mobility' || profile.goal === 'flexibility') {
      templates.push({
        name: 'Mobility Work',
        targetMuscles: ['flexibility', 'mobility'],
        exercises: [exerciseDatabase['yoga_sun_salutation']],
        equipment: [],
        notes: 'Focus on range of motion'
      })
    }

    // Default to full body workouts
    if (templates.length === 0) {
      templates.push({
        name: 'Full Body Workout',
        targetMuscles: ['full_body'],
        exercises: level === 'beginner'
          ? workoutTemplates.beginner['Full Body']
          : workoutTemplates.intermediate['Full Body'],
        equipment: ['dumbbell'],
        notes: 'Balanced full body session'
      })
    }

    return templates
  }

  private static calculateDuration(profile: UserProfile): number {
    const timeMap: Record<string, number> = {
      '10-15': 15,
      '20-30': 30,
      '30-45': 45,
      '45-60': 60,
      '60+': 75
    }
    return timeMap[profile.availableTimePerSession] || 30
  }

  private static calculateDifficulty(profile: UserProfile): 'easy' | 'moderate' | 'hard' {
    if (profile.fitnessLevel === 'beginner' || profile.fitnessLevel === 'novice') return 'easy'
    if (profile.fitnessLevel === 'intermediate') return 'moderate'
    return 'hard'
  }
}
