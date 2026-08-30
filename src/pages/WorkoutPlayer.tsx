import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  Play,
  Pause,
  CheckCircle,
  X,
  Volume2,
  LogOut,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { WorkoutSession } from '../types'

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
  const [showQuitConfirm, setShowQuitConfirm] = useState(false)

  // Exercises the user has actually completed in this session.
  // Tapping "Next" adds the current exercise to the set. Tapping "Previous"
  // does NOT remove it (once done, done).
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set())

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
    if (!workout?.exercises) return
    // Mark the just-finished exercise as done
    const justFinished = workout.exercises[currentExerciseIndex]
    if (justFinished) {
      setCompletedExercises(prev => {
        const next = new Set(prev)
        next.add(justFinished.id)
        return next
      })
    }
    if (currentExerciseIndex < workout.exercises.length - 1) {
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

  // Build a session from current state. Used by both "Finish" and "Quit" paths.
  const buildSession = (completed: boolean): WorkoutSession => {
    const total = workout?.exercises.length || 0
    const done = completedExercises.size
    const missed = (workout?.exercises || [])
      .filter((e: any) => !completedExercises.has(e.id))
      .map((e: any) => e.name)
    return {
      id: `session_${Date.now()}`,
      workoutId: workout?.id || '',
      userId: user?.id || '',
      date: new Date().toISOString(),
      startTime: new Date(Date.now() - elapsedTime * 1000).toISOString(),
      endTime: new Date().toISOString(),
      completed,
      // Always reflect what was actually done — the set is the source of truth.
      // (The "Finish" path is only reachable after the user tapped Next on the
      // last exercise, so `done === total` in that case. But we never inflate
      // the count from the flag.)
      exercisesCompleted: done,
      duration: Math.max(1, Math.floor(elapsedTime / 60)),
      difficulty: (difficultyRating || 'moderate') as WorkoutSession['difficulty'],
      missedExercises: missed.length > 0 ? missed : undefined,
      wasAdjusted: !!workout?.adjustedReason,
      adjustReason: workout?.adjustedReason,
    }
  }

  const handleFinish = () => {
    if (!difficultyRating) return // button is disabled, but guard anyway
    addWorkoutSession(buildSession(true))
    navigate('/')
  }

  const handleQuitConfirm = () => {
    addWorkoutSession(buildSession(false))
    setShowQuitConfirm(false)
    navigate('/')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Real-time progress for the player (how many of the workout's exercises done)
  const progressDone = useMemo(() => completedExercises.size, [completedExercises])
  const progressTotal = workout?.exercises?.length || 0

  if (!workout) {
    return (
      <div className="p-8 text-center">
        <p className="text-white/60">Loading workout...</p>
      </div>
    )
  }

  if (showCompletion) {
    const isAdjusted = !!workout.adjustedReason
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-surface border border-dark-border rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-success to-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Workout Complete!</h1>
          <p className="text-white/60 mb-2">Great job on finishing your workout.</p>
          {isAdjusted && (
            <p className="text-2xs text-accent-primary/80 font-medium mb-6">
              Logged after an Adjust — your history will show this.
            </p>
          )}

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

          {/* Difficulty Rating — required to finish */}
          <div className="mb-8">
            <p className="font-medium mb-1">How was this workout?</p>
            <p className="text-2xs text-white/40 mb-3">Pick a rating so we can tune future plans.</p>
            <div className="flex justify-center gap-2 flex-wrap">
              {[
                { v: 'too_easy', l: 'too easy' },
                { v: 'easy', l: 'easy' },
                { v: 'moderate', l: 'moderate' },
                { v: 'hard', l: 'hard' },
                { v: 'very_hard', l: 'very hard' },
              ].map((rating) => (
                <button
                  key={rating.v}
                  onClick={() => setDifficultyRating(rating.v)}
                  className={`
                    px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${difficultyRating === rating.v
                      ? 'bg-accent-primary text-white'
                      : 'bg-dark-elevated border border-dark-border hover:bg-dark-hover'
                    }
                  `}
                >
                  {rating.l}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleFinish}
            disabled={!difficultyRating}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              difficultyRating
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary hover:from-accent-primary/90 hover:to-accent-secondary/90'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {difficultyRating ? 'Finish' : 'Pick a rating to finish'}
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
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors flex items-center gap-1.5"
            aria-label="Quit workout"
          >
            <LogOut className="w-4 h-4 text-white/50" />
            <span className="text-2xs text-white/50 hidden sm:inline">Quit</span>
          </button>
          <div className="text-center">
            <h1 className="font-bold">{workout.name}</h1>
            <p className="text-sm text-white/60">
              Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
              {progressDone > 0 && (
                <span className="text-emerald-400 ml-2">· {progressDone} done</span>
              )}
            </p>
          </div>
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Progress Bar with gradient — driven by completed-exercises set, not just current index */}
        <div className="mt-4 h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary transition-all duration-500 ease-out"
            style={{
              width: `${Math.max(8, ((currentExerciseIndex + 1) / workout.exercises.length) * 100)}%`,
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite'
            }}
          />
        </div>
      </div>

      {/* Quit confirmation overlay */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-dark-surface border border-white/10 rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-1">Quit this workout?</h2>
            <p className="text-2xs text-white/45 mb-4">
              We'll log what you did so far ({progressDone} of {progressTotal} exercises).
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-sm font-medium"
              >
                Keep going
              </button>
              <button
                onClick={handleQuitConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 text-sm font-semibold"
              >
                Quit & log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 flex flex-col">
        {/* Rest Overlay with premium animation */}
        {isResting && (
          <div className="fixed inset-0 bg-dark-bg/98 backdrop-blur-sm flex items-center justify-center z-40 p-4">
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
              aria-label={isPaused ? 'Resume' : 'Pause'}
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
