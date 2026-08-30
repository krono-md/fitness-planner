// User Profile and Plan Types
export interface UserProfile {
  id: string
  name: string
  age: number
  height: number
  weight: number
  goal: string
  secondaryGoals: string[]
  fitnessLevel: 'beginner' | 'novice' | 'intermediate' | 'advanced'
  activityLevel: 'mostly_inactive' | 'lightly_active' | 'moderately_active' | 'very_active'
  availableTimePerSession: string
  workoutsPerWeek: number
  preferredDays: string[]
  scheduleChangesFrequently: boolean
  workoutType: string
  equipment: string[]
  workoutLocation: string
  preferredExercises: string[]
  dislikedExercises: string[]
  typicalBedtime: string
  typicalWakeTime: string
  averageSleep: number
  stressLevel: 'low' | 'moderate' | 'high'
  recoveryQuality: 'poor' | 'fair' | 'good' | 'excellent'
  preferredIntensity: 'low' | 'moderate' | 'high'
  morningVsEvening: 'morning' | 'evening' | 'flexible'
  shortVsLong: 'short' | 'long' | 'mixed'
  recoveryDayPreference: string
  scheduleBlocks: ScheduleBlock[]
  onboardingComplete: boolean
}

export interface ScheduleBlock {
  day: string
  startTime: string
  endTime: string
  type: 'class' | 'study' | 'work' | 'other'
  title: string
}

export interface Workout {
  id: string
  name: string
  dayOfWeek: string
  duration: number
  difficulty: 'easy' | 'moderate' | 'hard'
  targetMuscles: string[]
  exercises: Exercise[]
  equipment: string[]
  estimatedCalories?: number
  notes?: string
  /** Plain-language reasoning tying this workout back to onboarding inputs. */
  reasoning?: string
  /** Window string (e.g. "5:30 PM – 6:30 PM") derived from the user's schedule. */
  suggestedWindow?: string
  /** Set when the user picked an Adjust reason — used to label the change in the UI. */
  adjustedReason?: 'less_time' | 'more_tired' | 'too_difficult' | 'no_equipment' | 'schedule_changed' | 'different_activity'
}

export interface Exercise {
  id: string
  name: string
  sets: number
  reps: number | string
  restSeconds: number
  equipment: string[]
  targetMuscles: string[]
  difficulty: 'easy' | 'moderate' | 'hard'
  instructions: string
  alternatives?: string[]
}

export interface WorkoutSession {
  id: string
  workoutId: string
  userId: string
  date: string
  startTime?: string
  endTime?: string
  completed: boolean
  exercisesCompleted: number
  duration: number
  difficulty: 'too_easy' | 'easy' | 'moderate' | 'hard' | 'very_hard'
  notes?: string
  missedExercises?: string[]
  rescheduledFrom?: string
  /** True if the workout was adapted (Stage 3 Adjust) before this session was logged. */
  wasAdjusted?: boolean
  /** Which Adjust reason was applied (mirrors Workout.adjustedReason). */
  adjustReason?: 'less_time' | 'more_tired' | 'too_difficult' | 'no_equipment' | 'schedule_changed' | 'different_activity'
}

export interface SleepRecord {
  id: string
  userId: string
  date: string
  bedtime: string
  wakeTime: string
  duration: number
  quality: 'poor' | 'fair' | 'good' | 'excellent'
  notes?: string
}

export interface Goal {
  id: string
  userId: string
  title: string
  description: string
  category: 'workouts' | 'consistency' | 'strength' | 'endurance' | 'custom'
  target: number
  current: number
  unit: string
  deadline?: string
  completed: boolean
}

export interface Notification {
  id: string
  userId: string
  type: 'workout_reminder' | 'streak' | 'completion' | 'plan_adjustment' | 'achievement'
  title: string
  message: string
  read: boolean
  createdAt: string
  actionUrl?: string
}

export interface DailyAdaptation {
  userId: string
  date: string
  adaptationType: 'skip_pattern' | 'difficulty_adjustment' | 'schedule_conflict' | 'progression'
  reason: string
  suggestion: string
  applied: boolean
}
