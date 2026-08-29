import React, { useState } from 'react'
import { Search, Filter, Dumbbell, Clock, Target, Zap, ChevronRight } from 'lucide-react'

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
    { id: 'strength', label: 'Strength', icon: Dumbbell, count: exerciseDatabase.filter(e => e.category === 'strength').length },
    { id: 'cardio', label: 'Cardio', icon: Zap, count: exerciseDatabase.filter(e => e.category === 'cardio').length },
    { id: 'core', label: 'Core', icon: Target, count: exerciseDatabase.filter(e => e.category === 'core').length },
    { id: 'mobility', label: 'Mobility', icon: Clock, count: exerciseDatabase.filter(e => e.category === 'mobility').length },
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
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Exercise Library</h1>
        <p className="text-white/50 text-lg">Browse and search exercises</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises or muscle groups..."
            className="w-full bg-dark-surface border border-dark-border rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary"
          />
        </div>
        <button className="px-6 py-3 border border-dark-border hover:bg-dark-hover rounded-xl font-medium flex items-center gap-2 transition-colors">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(isActive ? null : cat.id)}
              className={`p-5 rounded-2xl border transition-all shadow-soft hover:shadow-medium ${
                isActive
                  ? 'bg-accent-primary/10 border-accent-primary/30'
                  : 'bg-dark-surface border-dark-border hover:bg-dark-hover'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-accent-primary' : 'text-white/60'}`} />
              <p className="font-bold text-lg">{cat.label}</p>
              <p className="text-sm text-white/50">{cat.count} exercises</p>
            </button>
          )
        })}
      </div>

      {/* Difficulty Filter */}
      <div className="flex gap-2">
        {['easy', 'moderate', 'hard'].map((diff) => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(selectedDifficulty === diff ? null : diff)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedDifficulty === diff
                ? difficultyColors[diff]
                : 'bg-dark-surface border border-dark-border text-white/70 hover:bg-dark-hover'
            }`}
          >
            {diff.charAt(0).toUpperCase() + diff.slice(1)}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredExercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="bg-dark-surface border border-dark-border rounded-2xl p-6 text-left hover:bg-dark-hover transition-all shadow-soft hover:shadow-medium"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1">{exercise.name}</h3>
                <p className="text-sm text-white/60 capitalize">{exercise.category}</p>
              </div>
              <span className={`px-3 py-1 rounded-lg text-xs font-medium ${difficultyColors[exercise.difficulty]}`}>
                {exercise.difficulty}
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {exercise.targetMuscles.map((muscle, idx) => (
                <span key={idx} className="px-2 py-1 bg-dark-elevated rounded text-xs text-white/70">
                  {muscle}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-white/60">
                <span>{exercise.sets} sets</span>
                <span>{exercise.reps} reps</span>
                <span>{exercise.restSeconds}s rest</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/40" />
            </div>
          </button>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-12 text-center shadow-soft">
          <div className="w-16 h-16 bg-dark-hover rounded-full flex items-center justify-center mx-auto mb-4">
            <Dumbbell className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="font-bold text-lg mb-2">No exercises found</h3>
          <p className="text-white/60">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-dark-surface border border-dark-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-large">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedExercise.name}</h2>
                  <p className="text-white/60 capitalize">{selectedExercise.category}</p>
                </div>
                <span className={`px-4 py-2 rounded-lg font-medium ${difficultyColors[selectedExercise.difficulty]}`}>
                  {selectedExercise.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-dark-elevated rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-accent-primary">{selectedExercise.sets}</p>
                  <p className="text-sm text-white/60">Sets</p>
                </div>
                <div className="bg-dark-elevated rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-accent-secondary">{selectedExercise.reps}</p>
                  <p className="text-sm text-white/60">Reps</p>
                </div>
                <div className="bg-dark-elevated rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-accent-warning">{selectedExercise.restSeconds}s</p>
                  <p className="text-sm text-white/60">Rest</p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3">Instructions</h3>
                <p className="text-white/80 leading-relaxed">{selectedExercise.instructions}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3">Target Muscles</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.targetMuscles.map((muscle: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-dark-elevated rounded-lg text-sm text-white/80">
                      {muscle}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold mb-3">Equipment</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedExercise.equipment.length > 0 ? (
                    selectedExercise.equipment.map((eq: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-dark-elevated rounded-lg text-sm text-white/80">
                        {eq}
                      </span>
                    ))
                  ) : (
                    <span className="px-3 py-1 bg-dark-elevated rounded-lg text-sm text-white/80">
                      No equipment needed
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="flex-1 px-4 py-3 border border-dark-border hover:bg-dark-hover rounded-lg font-medium transition-colors"
                >
                  Close
                </button>
                <button className="flex-1 px-4 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg font-bold transition-all hover:shadow-medium">
                  Add to Workout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
