import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, User, Target, Zap, Calendar, Heart, Clock, Moon, CheckCircle } from 'lucide-react'
import { UserProfile } from '../types'
import { useAppStore } from '../store/appStore'

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void
}

type StepComponentProps = {
  data: Partial<UserProfile>
  onChange: (field: string, value: any) => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [generating, setGenerating] = useState(false)
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    goal: '',
    secondaryGoals: [],
    fitnessLevel: 'beginner',
    activityLevel: 'lightly_active',
    scheduleChangesFrequently: true,
  })

  const totalSteps = 8

  const updateProfile = (field: string, value: any) => {
    setProfile(prev => ({ ...prev, [field]: value }))
  }

  const finishOnboarding = () => {
    const finalProfile: UserProfile = {
      id: `user_${Date.now()}`,
      name: profile.name || '',
      age: profile.age || 20,
      height: profile.height || 0,
      weight: profile.weight || 0,
      goal: profile.goal || '',
      secondaryGoals: profile.secondaryGoals || [],
      fitnessLevel: profile.fitnessLevel || 'beginner',
      activityLevel: profile.activityLevel || 'lightly_active',
      availableTimePerSession: profile.availableTimePerSession || '20-30',
      workoutsPerWeek: profile.workoutsPerWeek || 3,
      preferredDays: profile.preferredDays || [],
      scheduleChangesFrequently: profile.scheduleChangesFrequently ?? true,
      workoutType: profile.workoutType || 'mixed',
      equipment: profile.equipment || [],
      workoutLocation: profile.workoutLocation || 'home',
      preferredExercises: profile.preferredExercises || [],
      dislikedExercises: profile.dislikedExercises || [],
      typicalBedtime: profile.typicalBedtime || '23:00',
      typicalWakeTime: profile.typicalWakeTime || '07:00',
      averageSleep: profile.averageSleep || 7,
      stressLevel: profile.stressLevel || 'moderate',
      recoveryQuality: profile.recoveryQuality || 'fair',
      preferredIntensity: profile.preferredIntensity || 'moderate',
      morningVsEvening: profile.morningVsEvening || 'flexible',
      shortVsLong: profile.shortVsLong || 'mixed',
      recoveryDayPreference: profile.recoveryDayPreference || 'active_recovery',
      scheduleBlocks: profile.scheduleBlocks || [],
      onboardingComplete: true,
    }
    onComplete(finalProfile)
  }

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      setGenerating(true)
      setTimeout(() => {
        finishOnboarding()
      }, 2200)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const progress = (step / totalSteps) * 100

  if (generating) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-sm px-4">
          <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center mx-auto mb-6 shadow-glow animate-pulse">
            <Zap className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">Building your personal plan...</h2>
          <p className="text-white/45 text-sm mb-8">Analyzing your schedule, goals, and preferences</p>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full animate-[loading_2s_ease-in-out_forwards]" style={{ width: '0%' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4 bg-mesh">
      <div className="mb-6 md:mb-7 text-center animate-slide-up">
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-gradient-to-br from-accent-primary to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-glow-sm">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">FitTrack</h1>
        <p className="text-white/40 text-xs md:text-[13px] mt-1">Personal fitness planner for students</p>
      </div>

      <div className="w-full max-w-md mb-4 md:mb-5 px-2">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs md:text-sm text-white/60">Step {step} of {totalSteps}</span>
          <span className="text-xs md:text-sm font-semibold text-accent-primary tabular-nums">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-primary to-indigo-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl p-4 md:p-5 lg:p-6 animate-slide-up shadow-soft">
        {step === 1 && (
          <Step1 data={profile} onChange={updateProfile} />
        )}
        {step === 2 && (
          <Step2 data={profile} onChange={updateProfile} />
        )}
        {step === 3 && (
          <Step3 data={profile} onChange={updateProfile} />
        )}
        {step === 4 && (
          <Step4 data={profile} onChange={updateProfile} />
        )}
        {step === 5 && (
          <Step5 data={profile} onChange={updateProfile} />
        )}
        {step === 6 && (
          <Step6 data={profile} onChange={updateProfile} />
        )}
        {step === 7 && (
          <Step7 data={profile} onChange={updateProfile} />
        )}
        {step === 8 && (
          <Step8 data={profile} onChange={updateProfile} />
        )}

        <div className="flex justify-between mt-5 md:mt-6 pt-4 md:pt-5 border-t border-white/[0.06]">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`min-h-10 px-4 py-2 text-sm md:text-base border border-dark-border hover:bg-dark-hover rounded-lg font-medium transition-colors flex items-center gap-2 ${step === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <button onClick={nextStep} className="min-h-10 px-5 md:px-6 py-2 text-sm md:text-base bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg font-bold transition-all hover:shadow-medium flex items-center gap-2">
            {step === totalSteps ? 'Get Your Plan' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-1.5 md:gap-2 mt-6 md:mt-8">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`
              w-2 h-2 rounded-full transition-all duration-200
              ${i + 1 === step
                ? 'bg-accent-primary scale-125'
                : 'bg-white/20'
              }
            `}
          />
        ))}
      </div>
    </div>
  )
}

// Step 1 - Basic Profile
function Step1({ data, onChange }: StepComponentProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Basic Profile</h2>
      </div>
      <p className="text-white/60 mb-6">Let's start with the basics.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            value={data.name || ''}
            onChange={(e) => onChange('name', e.target.value)}
            className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary"
            placeholder="Your name"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              value={data.age || ''}
              onChange={(e) => onChange('age', parseInt(e.target.value) || 0)}
              className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="20"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Weight (lbs)</label>
            <input
              type="number"
              value={data.weight || ''}
              onChange={(e) => onChange('weight', parseInt(e.target.value) || 0)}
              className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary"
              placeholder="150"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 2 - Fitness Goal
function Step2({ data, onChange }: StepComponentProps) {
  const goals = [
    { id: 'build_consistency', label: 'Build consistency', emoji: '📅' },
    { id: 'improve_fitness', label: 'Improve overall fitness', emoji: '🏋️' },
    { id: 'lose_body_fat', label: 'Lose body fat', emoji: '💪' },
    { id: 'build_muscle', label: 'Build muscle', emoji: '🔥' },
    { id: 'improve_strength', label: 'Improve strength', emoji: '⚡' },
    { id: 'improve_endurance', label: 'Improve endurance', emoji: '🏃' },
    { id: 'improve_mobility', label: 'Improve mobility/flexibility', emoji: '🧘' },
    { id: 'athletic_performance', label: 'Improve athletic performance', emoji: '🏆' },
    { id: 'maintain_fitness', label: 'Maintain current fitness', emoji: '🔄' },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Fitness Goal</h2>
      </div>
      <p className="text-white/60 mb-6">What do you want to achieve?</p>

      <div className="space-y-3">
        {goals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => onChange('goal', goal.id)}
            className={`
              w-full p-4 rounded-xl border text-left transition-all duration-200
              ${data.goal === goal.id
                ? 'border-accent-primary bg-accent-primary/10'
                : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{goal.emoji}</span>
              <span className="font-medium">{goal.label}</span>
              {data.goal === goal.id && (
                <CheckCircle className="w-5 h-5 ml-auto text-accent-primary" />
              )}
            </div>
          </button>
        ))}
      </div>

      {data.goal && (
        <div className="mt-5">
          <h3 className="font-medium mb-2 text-sm text-white/60">Secondary goals (optional)</h3>
          <div className="flex flex-wrap gap-2">
            {goals.filter(g => g.id !== data.goal).map((goal) => {
              const selected = (data.secondaryGoals || []).includes(goal.id)
              return (
                <button
                  key={goal.id}
                  onClick={() => {
                    const current = data.secondaryGoals || []
                    const next = selected
                      ? current.filter(g => g !== goal.id)
                      : [...current, goal.id]
                    onChange('secondaryGoals', next)
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selected
                      ? 'border-accent-primary/40 bg-accent-primary/10 text-accent-primary'
                      : 'border-white/[0.08] bg-white/[0.03] text-white/50 hover:text-white/80'
                  }`}
                >
                  {goal.label}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// Step 3 - Fitness Level
function Step3({ data, onChange }: StepComponentProps) {
  const levels = [
    { id: 'beginner', label: 'Beginner', desc: 'New to regular exercise' },
    { id: 'novice', label: 'Novice', desc: 'Some experience, irregular' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Consistent training experience' },
    { id: 'advanced', label: 'Advanced', desc: 'Years of training experience' },
  ]

  const activity = [
    { id: 'mostly_inactive', label: 'Mostly inactive', desc: 'Little to no exercise' },
    { id: 'lightly_active', label: 'Lightly active', desc: 'Light exercise 1-2 days/week' },
    { id: 'moderately_active', label: 'Moderately active', desc: 'Moderate exercise 3-4 days/week' },
    { id: 'very_active', label: 'Very active', desc: 'Hard exercise 5+ days/week' },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Current Fitness Level</h2>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Fitness experience</h3>
          <div className="grid grid-cols-2 gap-3">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => onChange('fitnessLevel', level.id)}
                className={`
                  p-3 rounded-lg border transition-all duration-200
                  ${data.fitnessLevel === level.id
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                <div className="font-medium">{level.label}</div>
                <div className="text-xs text-white/60 mt-1">{level.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Current activity level</h3>
          <div className="space-y-2">
            {activity.map((act) => (
              <button
                key={act.id}
                onClick={() => onChange('activityLevel', act.id)}
                className={`
                  w-full p-3 rounded-lg border text-left transition-all duration-200
                  ${data.activityLevel === act.id
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                <div className="font-medium">{act.label}</div>
                <div className="text-xs text-white/60">{act.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 4 - Availability
function Step4({ data, onChange }: StepComponentProps) {
  const times = [
    { id: '10-15', label: '10-15 minutes' },
    { id: '20-30', label: '20-30 minutes' },
    { id: '30-45', label: '30-45 minutes' },
    { id: '45-60', label: '45-60 minutes' },
    { id: '60+', label: '60+ minutes' },
  ]

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Availability</h2>
      </div>
      <p className="text-white/60 mb-6">When can you realistically exercise?</p>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Time per session</h3>
          <div className="space-y-2">
            {times.map((time) => (
              <button
                key={time.id}
                onClick={() => onChange('availableTimePerSession', time.id)}
                className={`
                  w-full p-3 rounded-lg border text-left transition-all duration-200
                  ${data.availableTimePerSession === time.id
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                {time.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Days per week</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onChange('workoutsPerWeek', Math.max(1, (data.workoutsPerWeek || 3) - 1))}
              className="w-10 h-10 rounded-full border border-dark-border flex items-center justify-center hover:bg-dark-hover"
            >
              -
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.workoutsPerWeek || 3}</div>
              <div className="text-sm text-white/60">workouts per week</div>
            </div>
            <button
              onClick={() => onChange('workoutsPerWeek', Math.min(7, (data.workoutsPerWeek || 3) + 1))}
              className="w-10 h-10 rounded-full border border-dark-border flex items-center justify-center hover:bg-dark-hover"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Preferred days</h3>
          <div className="grid grid-cols-3 gap-3">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => {
                  const current = data.preferredDays || []
                  const newDays = current.includes(day)
                    ? current.filter(d => d !== day)
                    : [...current, day]
                  onChange('preferredDays', newDays)
                }}
                className={`
                  p-3 rounded-lg border transition-all duration-200
                  ${(data.preferredDays || []).includes(day)
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
                  }
                `}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => onChange('scheduleChangesFrequently', !data.scheduleChangesFrequently)}
          className={`w-full p-4 rounded-xl border text-left transition-all ${
            data.scheduleChangesFrequently
              ? 'border-accent-primary bg-accent-primary/10'
              : 'border-white/[0.08] bg-white/[0.03]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm">My schedule changes frequently</p>
              <p className="text-xs text-white/45 mt-0.5">We'll build a more flexible plan for you</p>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors ${data.scheduleChangesFrequently ? 'bg-accent-primary' : 'bg-white/10'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow mt-0.5 transition-transform ${data.scheduleChangesFrequently ? 'translate-x-4.5 ml-0.5' : 'translate-x-0.5'}`} />
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}

// Step 5 - Workout Preferences
function Step5({ data, onChange }: StepComponentProps) {
  const types = [
    { id: 'strength', label: 'Strength', emoji: '💪' },
    { id: 'cardio', label: 'Cardio', emoji: '🏃' },
    { id: 'mobility', label: 'Mobility', emoji: '🧘' },
    { id: 'mixed', label: 'Mixed', emoji: '🔀' },
  ]

  const equipment = [
    { id: 'none', label: 'None', emoji: '✨' },
    { id: 'dumbbells', label: 'Dumbbells', emoji: '🏋️' },
    { id: 'resistance_bands', label: 'Resistance bands', emoji: '🎗️' },
    { id: 'full_gym', label: 'Full gym', emoji: '🏋️‍♂️' },
  ]

  const locations = [
    { id: 'home', label: 'Home', emoji: '🏠' },
    { id: 'dorm', label: 'Dorm', emoji: '🏢' },
    { id: 'gym', label: 'Gym', emoji: '🏋️‍♀️' },
    { id: 'outdoors', label: 'Outdoors', emoji: '🌳' },
  ]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Workout Preferences</h2>
      </div>
      <p className="text-white/60 mb-6">What kind of workouts do you enjoy?</p>

      <div className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Preferred workout type</h3>
          <div className="grid grid-cols-2 gap-3">
            {types.map((type) => (
              <button
                key={type.id}
                onClick={() => onChange('workoutType', type.id)}
                className={`
                  p-3 rounded-lg border transition-all duration-200 flex items-center gap-2 justify-center
                  ${data.workoutType === type.id
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                <span className="text-xl">{type.emoji}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Equipment available</h3>
          <div className="grid grid-cols-2 gap-3">
            {equipment.map((eq) => (
              <button
                key={eq.id}
                onClick={() => {
                  const current = data.equipment || []
                  const newEq = current.includes(eq.id)
                    ? current.filter(e => e !== eq.id)
                    : [...current, eq.id]
                  onChange('equipment', newEq)
                }}
                className={`p-3 rounded-lg border transition-all duration-200 flex items-center gap-2 justify-center ${(data.equipment || []).includes(eq.id) ? 'border-accent-primary bg-accent-primary/10' : 'border-dark-border bg-dark-elevated hover:border-white/30'}`}
              >
                <span className="text-xl">{eq.emoji}</span>
                {eq.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Workout location</h3>
          <div className="grid grid-cols-2 gap-3">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => onChange('workoutLocation', loc.id)}
                className={`
                  p-3 rounded-lg border transition-all duration-200 flex items-center gap-2 justify-center
                  ${data.workoutLocation === loc.id
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                <span className="text-xl">{loc.emoji}</span>
                {loc.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 6 - Schedule Builder
function Step6({ data, onChange }: StepComponentProps) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const types = ['class', 'study', 'work', 'other'] as const
  const blocks = data.scheduleBlocks || []

  const addBlock = () => {
    onChange('scheduleBlocks', [
      ...blocks,
      { day: 'Monday', startTime: '09:00', endTime: '12:00', type: 'class', title: 'Class' },
    ])
  }

  const updateBlock = (index: number, field: string, value: string) => {
    const updated = blocks.map((b, i) => i === index ? { ...b, [field]: value } : b)
    onChange('scheduleBlocks', updated)
  }

  const removeBlock = (index: number) => {
    onChange('scheduleBlocks', blocks.filter((_, i) => i !== index))
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Student Schedule</h2>
      </div>
      <p className="text-white/50 text-sm mb-4">Add your classes, study blocks, and commitments so we can find workout windows.</p>

      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
        {blocks.map((block, i) => (
          <div key={i} className="p-3 bg-white/[0.03] border border-white/[0.07] rounded-xl space-y-2">
            <div className="flex gap-2">
              <select
                value={block.day}
                onChange={(e) => updateBlock(i, 'day', e.target.value)}
                className="flex-1 whop-input !py-2 text-xs"
              >
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <select
                value={block.type}
                onChange={(e) => updateBlock(i, 'type', e.target.value)}
                className="flex-1 whop-input !py-2 text-xs"
              >
                {types.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <input
              value={block.title}
              onChange={(e) => updateBlock(i, 'title', e.target.value)}
              placeholder="Title (e.g. Calculus)"
              className="whop-input !py-2 text-xs"
            />
            <div className="flex gap-2 items-center">
              <input type="time" value={block.startTime} onChange={(e) => updateBlock(i, 'startTime', e.target.value)} className="whop-input !py-2 text-xs flex-1" />
              <span className="text-white/30 text-xs">to</span>
              <input type="time" value={block.endTime} onChange={(e) => updateBlock(i, 'endTime', e.target.value)} className="whop-input !py-2 text-xs flex-1" />
              <button onClick={() => removeBlock(i)} className="text-accent-danger text-xs px-2">✕</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={addBlock} className="mt-3 w-full py-2.5 border border-dashed border-white/[0.12] rounded-xl text-sm text-white/50 hover:text-white/80 hover:border-white/25 transition-colors">
        + Add commitment
      </button>

      {blocks.length > 0 && (
        <div className="mt-4 p-3 bg-accent-primary/10 border border-accent-primary/20 rounded-xl">
          <p className="text-xs text-accent-primary/80 font-medium">We'll find workout windows around your schedule</p>
        </div>
      )}
    </div>
  )
}

// Step 7 - Sleep & Recovery
function Step7({ data, onChange }: StepComponentProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Moon className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Sleep & Recovery</h2>
      </div>
      <p className="text-white/60 mb-6">Understanding your recovery helps us plan better.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Typical bedtime</label>
            <input
              type="time"
              value={data.typicalBedtime || '23:00'}
              onChange={(e) => onChange('typicalBedtime', e.target.value)}
              className="whop-input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Typical wake time</label>
            <input
              type="time"
              value={data.typicalWakeTime || '07:00'}
              onChange={(e) => onChange('typicalWakeTime', e.target.value)}
              className="whop-input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Average sleep (hours)</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onChange('averageSleep', Math.max(4, (data.averageSleep || 7) - 0.5))}
              className="w-10 h-10 rounded-full border border-dark-border flex items-center justify-center hover:bg-dark-hover"
            >
              -
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold">{data.averageSleep || 7}</div>
              <div className="text-sm text-white/60">hours per night</div>
            </div>
            <button
              onClick={() => onChange('averageSleep', Math.min(12, (data.averageSleep || 7) + 0.5))}
              className="w-10 h-10 rounded-full border border-dark-border flex items-center justify-center hover:bg-dark-hover"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stress level</label>
          <div className="space-y-2">
            {['low', 'moderate', 'high'].map((level) => (
              <button
                key={level}
                onClick={() => onChange('stressLevel', level)}
                className={`
                  w-full p-3 rounded-lg border text-left transition-all duration-200
                  ${data.stressLevel === level
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Recovery quality</label>
          <div className="space-y-2">
            {['poor', 'fair', 'good', 'excellent'].map((quality) => (
              <button
                key={quality}
                onClick={() => onChange('recoveryQuality', quality)}
                className={`
                  w-full p-3 rounded-lg border text-left transition-all duration-200
                  ${data.recoveryQuality === quality
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                {quality.charAt(0).toUpperCase() + quality.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Step 8 - Final Personalization
function Step8({ data, onChange }: StepComponentProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Almost There!</h2>
      </div>
      <p className="text-white/60 mb-6">Just a few more preferences.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Preferred intensity</label>
          <div className="grid grid-cols-3 gap-3">
            {['low', 'moderate', 'high'].map((intensity) => (
              <button
                key={intensity}
                onClick={() => onChange('preferredIntensity', intensity)}
                className={`
                  p-3 rounded-lg border transition-all duration-200
                  ${data.preferredIntensity === intensity
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                {intensity.charAt(0).toUpperCase() + intensity.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Morning vs Evening</label>
          <div className="grid grid-cols-3 gap-3">
            {['morning', 'evening', 'flexible'].map((time) => (
              <button
                key={time}
                onClick={() => onChange('morningVsEvening', time)}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  data.morningVsEvening === time
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-white/[0.08] bg-white/[0.03] hover:border-white/20'
                }`}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Workout length preference</label>
          <div className="grid grid-cols-3 gap-3">
            {[{ id: 'short', label: 'Short' }, { id: 'mixed', label: 'Mixed' }, { id: 'long', label: 'Longer' }].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('shortVsLong', opt.id)}
                className={`p-3 rounded-lg border transition-all ${
                  data.shortVsLong === opt.id
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-white/[0.08] bg-white/[0.03]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Recovery day preference</label>
          <div className="grid grid-cols-2 gap-3">
            {[{ id: 'rest', label: 'Full rest' }, { id: 'active_recovery', label: 'Active recovery' }].map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange('recoveryDayPreference', opt.id)}
                className={`p-3 rounded-lg border transition-all text-sm ${
                  data.recoveryDayPreference === opt.id
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-white/[0.08] bg-white/[0.03]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white/[0.03] rounded-xl border border-white/[0.07]">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-accent-success" />
            <span className="font-medium">Ready to generate your personal plan</span>
          </div>
          <p className="text-sm text-white/60">
            Based on your responses, we'll create a fitness plan designed specifically for your
            student schedule, goals, and preferences.
          </p>
        </div>
      </div>
    </div>
  )
}
