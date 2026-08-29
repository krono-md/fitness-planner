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

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Submit onboarding
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
        scheduleChangesFrequently: profile.scheduleChangesFrequently || true,
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
        onboardingComplete: true
      }
      onComplete(finalProfile)
      localStorage.setItem('fitnessUser', JSON.stringify(finalProfile))
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const progress = (step / totalSteps) * 100

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
          FitTrack
        </h1>
        <p className="text-white/60 mt-2 text-center">Personal fitness planner for students</p>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-white/60">Step {step} of {totalSteps}</span>
          <span className="text-sm font-medium text-accent-primary">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-dark-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content Card */}
      <div className="w-full max-w-md bg-dark-surface border border-dark-border rounded-2xl p-6 shadow-xl">
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

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-dark-border">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg
              ${step === 1
                ? 'opacity-50 cursor-not-allowed'
                : 'text-white/60 hover:text-white hover:bg-dark-hover'
              }
            `}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>

          <button
            onClick={nextStep}
            className={`
              flex items-center gap-2 px-6 py-2 rounded-lg font-medium
              bg-gradient-to-r from-accent-primary to-accent-secondary
              hover:from-accent-primary/90 hover:to-accent-secondary/90
            `}
          >
            {step === totalSteps ? 'Get Your Plan' : 'Continue'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-2 mt-8">
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
                : 'border-dark-border bg-dark-elevated hover:border-white/30'
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
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                {day.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
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

// Step 6 - Schedule Builder (simplified)
function Step6({ data, onChange }: StepComponentProps) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-accent-primary" />
        <h2 className="text-xl font-bold">Student Schedule</h2>
      </div>
      <p className="text-white/60 mb-6">Help us understand your weekly commitments.</p>

      <div className="space-y-4">
        <p className="text-sm text-white/60">
          Based on your preferred workout days, we'll find windows that work with your schedule.
          You can always adjust your workout times later.
        </p>

        <div className="p-4 bg-dark-elevated rounded-lg border border-dark-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-accent-primary" />
            <span className="font-medium">Typical student week</span>
          </div>
          <p className="text-sm text-white/60">
            Classes and study time create natural breaks in your schedule. We'll find 30-60 minute windows
            between commitments.
          </p>
        </div>
      </div>
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
                className={`
                  p-3 rounded-lg border transition-all duration-200
                  ${data.morningVsEvening === time
                    ? 'border-accent-primary bg-accent-primary/10'
                    : 'border-dark-border bg-dark-elevated hover:border-white/30'
                  }
                `}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-dark-elevated rounded-lg border border-dark-border">
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
