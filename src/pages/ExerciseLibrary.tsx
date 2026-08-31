import React, { useState } from 'react'
import { Search, X, Dumbbell, Clock, Target, Zap, ChevronRight, BookOpen } from 'lucide-react'

const exerciseDatabase = [
  {
    id: 'goblet_squat',
    name: 'Goblet Squat',
    category: 'strength',
    difficulty: 'moderate',
    equipment: ['dumbbell'],
    targetMuscles: ['quads', 'glutes', 'core'],
    instructions: 'Hold a dumbbell at chest level, feet shoulder-width apart. Lower into a squat, keeping chest upright and weight in heels. Return to standing.',
    sets: 3,
    reps: '10-12',
    restSeconds: 60
  },
  {
    id: 'push_ups',
    name: 'Push-ups',
    category: 'strength',
    difficulty: 'moderate',
    equipment: [],
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    instructions: 'Start in plank position. Lower your body until chest nearly touches floor. Push back up to starting position.',
    sets: 3,
    reps: '8-12',
    restSeconds: 60
  },
  {
    id: 'dumbbell_rows',
    name: 'Dumbbell Rows',
    category: 'strength',
    difficulty: 'moderate',
    equipment: ['dumbbell'],
    targetMuscles: ['back', 'biceps'],
    instructions: 'Bent over position, one knee on bench. Row dumbbell to hip, squeezing shoulder blade.',
    sets: 3,
    reps: '10-12',
    restSeconds: 60
  },
  {
    id: 'jumping_jacks',
    name: 'Jumping Jacks',
    category: 'cardio',
    difficulty: 'easy',
    equipment: [],
    targetMuscles: ['full_body', 'cardio'],
    instructions: 'Jump feet apart while raising arms overhead. Return to starting position. Repeat at steady pace.',
    sets: 3,
    reps: '20-30',
    restSeconds: 45
  },
  {
    id: 'plank',
    name: 'Plank Hold',
    category: 'core',
    difficulty: 'moderate',
    equipment: [],
    targetMuscles: ['core', 'shoulders'],
    instructions: 'Hold a push-up position with forearms on ground. Keep body straight and core tight.',
    sets: 3,
    reps: '30-60s',
    restSeconds: 60
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    category: 'cardio',
    difficulty: 'moderate',
    equipment: [],
    targetMuscles: ['core', 'cardio', 'shoulders'],
    instructions: 'Plank position. Bring knees alternately toward chest at a quick pace.',
    sets: 3,
    reps: '30-40',
    restSeconds: 45
  },
  {
    id: 'burpees',
    name: 'Burpees',
    category: 'cardio',
    difficulty: 'hard',
    equipment: [],
    targetMuscles: ['full_body', 'cardio'],
    instructions: 'Squat down, place hands on floor, jump feet back to plank, jump feet back to squat, jump up with arms overhead.',
    sets: 3,
    reps: '10-15',
    restSeconds: 60
  },
  {
    id: 'yoga_sun_salutation',
    name: 'Yoga Sun Salutation',
    category: 'mobility',
    difficulty: 'easy',
    equipment: [],
    targetMuscles: ['flexibility', 'mobility', 'core'],
    instructions: 'Flow through mountain pose, forward fold, plank, up dog, down dog, returning to mountain.',
    sets: 5,
    reps: 'rounds',
    restSeconds: 30
  },
  {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Bench Press',
    category: 'strength',
    difficulty: 'moderate',
    equipment: ['dumbbell', 'bench'],
    targetMuscles: ['chest', 'triceps', 'shoulders'],
    instructions: 'Lie on bench with dumbbells at shoulder level. Press up and together. Lower with control.',
    sets: 4,
    reps: '8-10',
    restSeconds: 90
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'strength',
    difficulty: 'hard',
    equipment: ['barbell'],
    targetMuscles: ['back', 'glutes', 'hamstrings', 'core'],
    instructions: 'Barbell at shins, feet hip-width. Hinge at hips, keep back straight. Drive through heels to stand.',
    sets: 4,
    reps: '5-8',
    restSeconds: 120
  },
  {
    id: 'running',
    name: 'Running',
    category: 'cardio',
    difficulty: 'moderate',
    equipment: [],
    targetMuscles: ['cardio', 'legs'],
    instructions: 'Maintain steady pace. Focus on breathing and form. Can be on treadmill or outdoors.',
    sets: 1,
    reps: '20-30 min',
    restSeconds: 0
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    category: 'strength',
    difficulty: 'moderate',
    equipment: ['machine'],
    targetMuscles: ['quads', 'glutes', 'hamstrings'],
    instructions: 'Sit with back against pad. Push platform away using legs. Return with control.',
    sets: 3,
    reps: '10-12',
    restSeconds: 90
  }
]

export default function ExerciseLibrary() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [selectedExercise, setSelectedExercise] = useState<any>(null)

  const categories = [
    { id: 'strength', label: 'Strength', icon: Dumbbell, count: exerciseDatabase.filter(e => e.category === 'strength').length, color: 'bg-amber-500/15 text-amber-400' },
    { id: 'cardio', label: 'Cardio', icon: Zap, count: exerciseDatabase.filter(e => e.category === 'cardio').length, color: 'bg-violet-500/15 text-violet-400' },
    { id: 'core', label: 'Core', icon: Target, count: exerciseDatabase.filter(e => e.category === 'core').length, color: 'bg-rose-500/15 text-rose-400' },
    { id: 'mobility', label: 'Mobility', icon: Clock, count: exerciseDatabase.filter(e => e.category === 'mobility').length, color: 'bg-emerald-500/15 text-emerald-400' },
  ]

  const filteredExercises = exerciseDatabase.filter(exercise => {
    const matchesSearch = exercise.name.toLowerCase().includes(search.toLowerCase()) ||
                         exercise.targetMuscles.some(m => m.toLowerCase().includes(search.toLowerCase()))
    const matchesCategory = !selectedCategory || exercise.category === selectedCategory
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const difficultyColors: Record<string, string> = {
    easy: 'bg-accent-success/20 text-accent-success',
    moderate: 'bg-accent-warning/20 text-accent-warning',
    hard: 'bg-accent-danger/20 text-accent-danger'
  }

  return (
    <div className="whop-page">
      <div className="mb-5">
        <h1 className="whop-page-title">Exercise Library</h1>
        <p className="whop-page-sub">Browse and search exercises</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search exercises or muscle groups..."
          className="whop-input pl-10"
        />
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isActive ? null : cat.id)}
              className={`whop-card p-4 text-left transition-all ${isActive ? 'whop-nav-active' : ''}`}
            >
              <div className={`whop-icon-tile ${cat.color} mb-2`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-sm font-semibold">{cat.label}</p>
              <p className="text-xs text-white/50">{cat.count} exercises</p>
            </button>
          )
        })}
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {['easy', 'moderate', 'hard'].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
            className={`whop-pill cursor-pointer ${selectedDifficulty === diff ? 'whop-pill-accent' : ''}`}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredExercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="whop-card p-4 text-left hover:bg-white/[0.04] transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold mb-0.5">{exercise.name}</h3>
                <p className="text-xs text-white/55 capitalize">{exercise.category}</p>
              </div>
              <span className={`whop-pill ${difficultyColors[exercise.difficulty]}`}>
                {exercise.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-3">
              {exercise.targetMuscles.map((muscle, idx) => (
                <span key={idx} className="whop-pill text-[10px]">
                  {muscle}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-white/55">
              <div className="flex items-center gap-3">
                <span>{exercise.sets} sets</span>
                <span>{exercise.reps} reps</span>
                <span>{exercise.restSeconds}s rest</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-white/40" />
            </div>
          </button>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="whop-card p-10 text-center max-w-md mx-auto">
          <div className="whop-icon-tile bg-white/[0.06] text-white/40 w-12 h-12 mx-auto mb-3">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="whop-page-title text-base mb-1.5">No exercises found</h3>
          <p className="whop-page-sub">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="whop-card p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="whop-page-title text-lg mb-1">{selectedExercise.name}</h2>
                <p className="whop-page-sub text-sm capitalize">{selectedExercise.category}</p>
              </div>
              <button
                onClick={() => setSelectedExercise(null)}
                className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.06]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="whop-card p-3 text-center">
                <p className="text-xl font-bold text-accent-primary">{selectedExercise.sets}</p>
                <p className="text-xs text-white/55">Sets</p>
              </div>
              <div className="whop-card p-3 text-center">
                <p className="text-xl font-bold text-accent-secondary">{selectedExercise.reps}</p>
                <p className="text-xs text-white/55">Reps</p>
              </div>
              <div className="whop-card p-3 text-center">
                <p className="text-xl font-bold text-accent-warning">{selectedExercise.restSeconds}s</p>
                <p className="text-xs text-white/55">Rest</p>
              </div>
            </div>

            <div className="mb-5">
              <h3 className="whop-section-label mb-2">Instructions</h3>
              <p className="text-sm text-white/80 leading-relaxed">{selectedExercise.instructions}</p>
            </div>

            <div className="mb-5">
              <h3 className="whop-section-label mb-2">Target Muscles</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedExercise.targetMuscles.map((muscle: string, idx: number) => (
                  <span key={idx} className="whop-pill">{muscle}</span>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <h3 className="whop-section-label mb-2">Equipment</h3>
              <div className="flex flex-wrap gap-1.5">
                {selectedExercise.equipment.length > 0 ? (
                  selectedExercise.equipment.map((eq: string, idx: number) => (
                    <span key={idx} className="whop-pill">{eq}</span>
                  ))
                ) : (
                  <span className="whop-pill">No equipment needed</span>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/[0.05]">
              <button
                onClick={() => setSelectedExercise(null)}
                className="flex-1 whop-btn-ghost"
              >
                Close
              </button>
              <button className="flex-1 whop-btn-primary">
                Add to Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
