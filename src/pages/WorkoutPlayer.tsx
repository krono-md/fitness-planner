import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Play,
  Pause,
  CheckCircle,
  X,
  Volume2
} from 'lucide-react'
import { useAppStore } from '../store/appStore'

export default function WorkoutPlayer() {
  const { workoutId } = useParams()
  const navigate = useNavigate()
  const { user, addWorkoutSession, userPlan } = useAppStore()

  const [workout, setWorkout] = useState<any>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isResting, setIsResting] = useState(false)
  const [restTime, setRestTime] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showCompletion, setShowCompletion] = useState(false)
  const [difficultyRating, setDifficultyRating] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      const found = userPlan.find(w => w.id === workoutId) || userPlan.find(w => w.exercises.length > 0)
      setWorkout(found || null)
    }
  }, [user, workoutId, userPlan])

  // Timer for rest and elapsed time
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isPlaying && !isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
        if (isResting && restTime > 0) {
          setRestTime(prev => {
            if (prev <= 1) {
              setIsResting(false)
              return 0
            }
            return prev - 1
          })
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isPlaying, isPaused, isResting, restTime])

  const currentExercise = workout?.exercises?.[currentExerciseIndex]

  const handleStart = () => {
    setIsPlaying(true)
  }

  const handleNext = () => {
    if (currentExerciseIndex < (workout?.exercises?.length || 0) - 1) {
      setIsResting(true)
      setRestTime(currentExercise?.restSeconds || 60)
      setCurrentExerciseIndex(prev => prev + 1)
    } else {
      setShowCompletion(true)
    }
  }

  const handlePrevious = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1)
    }
  }

  const handleFinish = () => {
    const session = {
      id: `session_${Date.now()}`,
      workoutId: workout?.id || '',
      userId: user?.id || '',
      date: new Date().toISOString(),
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      completed: true,
      exercisesCompleted: workout?.exercises.length || 0,
      duration: Math.floor(elapsedTime / 60),
      difficulty: difficultyRating as any || 'moderate',
    }
    addWorkoutSession(session)
    navigate('/')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!workout) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">Loading workout...</p>
      </div>
    )
  }

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-surface border border-dark-border rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-success to-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Workout Complete!</h1>
          <p className="text-white/60 mb-8">Great job on finishing your workout.</p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-dark-elevated rounded-xl p-4">
              <div className="text-2xl font-bold">{formatTime(elapsedTime)}</div>
              <div className="text-sm text-white/60">Duration</div>
            </div>
            <div className="bg-dark-elevated rounded-xl p-4">
              <div className="text-2xl font-bold">{workout.exercises.length}</div>
              <div className="text-sm text-white/60">Exercises</div>
            </div>
          </div>

          {/* Difficulty Rating */}
          <div className="mb-8">
            <p className="font-medium mb-3">How was this workout?</p>
            <div className="flex justify-center gap-2">
              {['too_easy', 'easy', 'moderate', 'hard', 'very_hard'].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setDifficultyRating(rating)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${difficultyRating === rating
                      ? 'bg-accent-primary text-white'
                      : 'bg-dark-elevated border border-dark-border hover:bg-dark-hover'
                    }
                  `}
                >
                  {rating.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFinish}
            className="w-full py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-bold text-lg hover:from-accent-primary/90 hover:to-accent-secondary/90 transition-all"
          >
            Finish
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header with blur effect */}
      <div className="bg-dark-surface/90 backdrop-blur-xl border-b border-white/[0.06] p-4">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
          <div className="text-center">
            <h1 className="font-bold">{workout.name}</h1>
            <p className="text-sm text-white/60">Exercise {currentExerciseIndex + 1} of {workout.exercises.length}</p>
          </div>
          <button className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
            <Volume2 className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar with gradient */}
        <div className="mt-4 h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary transition-all duration-500 ease-out"
            style={{
              width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite'
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Rest Overlay with premium animation */}
        {isResting && (
          <div className="fixed inset-0 bg-dark-bg/98 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            {/* Animated background circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-primary/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-secondary/5 rounded-full animate-ping" style={{ animationDuration: '2s', animationDelay: '0.5s' }} />
            </div>

            <div className="text-center max-w-sm w-full relative z-10">
              <p className="text-lg md:text-xl text-white/50 mb-6 font-medium tracking-wide uppercase">Rest Period</p>
              <div className="relative mb-6">
                <div className="text-8xl md:text-9xl font-bold tabular-nums">{restTime}</div>
                <div className="text-white/30 text-sm mt-2">seconds remaining</div>
              </div>
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-8">
                <p className="text-white/60 text-sm mb-1">Up Next</p>
                <p className="font-semibold text-lg">{workout.exercises[currentExerciseIndex + 1]?.name}</p>
              </div>
              <button
                onClick={() => setIsResting(false)}
                className="min-h-12 px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-transform"
              >
                Skip Rest
              </button>
            </div>
          </div>
        )}

        {/* Exercise Display */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            {/* Exercise Name */}
            <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2">
              {currentExercise?.name}
            </h1>
            <p className="text-white/60 text-center mb-8">{currentExercise?.targetMuscles?.join(', ')}</p>

            {/* Sets & Reps */}
            <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 md:p-8 mb-8">
              <div className="grid grid-cols-3 gap-4 md:gap-6 text-center">
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-accent-primary">{currentExercise?.sets}</div>
                  <div className="text-xs md:text-sm text-white/60 mt-1 md:mt-2">Sets</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-accent-secondary">{currentExercise?.reps}</div>
                  <div className="text-xs md:text-sm text-white/60 mt-1 md:mt-2">Reps</div>
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-accent-warning">{currentExercise?.restSeconds}s</div>
                  <div className="text-xs md:text-sm text-white/60 mt-1 md:mt-2">Rest</div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-dark-elevated border border-dark-border rounded-xl p-6 mb-8">
              <h3 className="font-bold mb-3">Instructions</h3>
              <p className="text-white/80 leading-relaxed">{currentExercise?.instructions}</p>
            </div>

            {/* Timer */}
            <div className="text-center mb-8">
              <div className="text-5xl font-bold font-mono">{formatTime(elapsedTime)}</div>
              <div className="text-white/60 mt-2">Elapsed time</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-dark-surface border-t border-dark-border p-4 md:p-6">
          <div className="max-w-md mx-auto flex items-center justify-between gap-3 md:gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentExerciseIndex === 0}
              className={`
                min-h-11 min-w-11 p-3 md:p-4 rounded-full transition-colors flex items-center justify-center
                ${currentExerciseIndex === 0
                  ? 'bg-dark-elevated text-white/30'
                  : 'bg-dark-elevated hover:bg-dark-hover'
                }
              `}
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              onClick={() => setIsPaused(!isPaused)}
              className="min-h-11 min-w-11 p-3 md:p-4 bg-dark-elevated hover:bg-dark-hover rounded-full flex items-center justify-center"
            >
              {isPaused ? <Play className="w-5 h-5 md:w-6 md:h-6" /> : <Pause className="w-5 h-5 md:w-6 md:h-6" />}
            </button>

            {isPlaying ? (
              <button
                onClick={handleNext}
                className="flex-1 min-h-11 py-3 md:py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-bold text-sm md:text-base"
              >
                {currentExerciseIndex === workout.exercises.length - 1 ? 'Finish' : 'Next'}
              </button>
            ) : (
              <button
                onClick={handleStart}
                className="flex-1 min-h-11 py-3 md:py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-bold text-sm md:text-base"
              >
                Start Exercise
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}