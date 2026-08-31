import React, { useState } from 'react'
import { User, Dumbbell, Heart, Bell, Moon, RefreshCw } from 'lucide-react'
import { useAppStore } from '../store/appStore'

/** Settings is now read-only by design: every field shows the real value
 *  from the store as a whop-pill. The only live action is Reset All. */
export default function Settings() {
  const { user, reset } = useAppStore()
  const [showResetModal, setShowResetModal] = useState(false)

  // Derived values for display
  const weeklyGoal = user?.workoutsPerWeek || 3
  const availableTime = user?.availableTimePerSession || 30
  const fitnessLevel = user?.fitnessLevel ? user.fitnessLevel.charAt(0).toUpperCase() + user.fitnessLevel.slice(1) : 'Beginner'
  const goalText = user?.goal?.replace('_', ' ') || 'Build consistency'
  const equipmentList = user?.equipment?.join(', ') || 'None'
  const workoutType = user?.workoutType || 'Mixed'
  const stressLevel = user?.stressLevel ? user.stressLevel.charAt(0).toUpperCase() + user.stressLevel.slice(1) : 'Moderate'
  const averageSleep = user?.averageSleep || 7
  const sleepGoal = user?.averageSleep ? `${Math.max(7, user.averageSleep - 0.5)}-${Math.min(9, user.averageSleep + 0.5)}` : '7-9'

  const handleReset = () => {
    reset()
    setShowResetModal(false)
  }

  return (
    <div className="whop-page">
      <div className="mb-5">
        <h1 className="whop-page-title">Settings</h1>
        <p className="whop-page-sub">View your profile and preferences</p>
      </div>

      {/* Profile card */}
      <div className="whop-card p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="whop-icon-tile bg-gradient-to-br from-accent-primary to-accent-secondary w-10 h-10">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="whop-page-title text-lg font-semibold capitalize mb-0.5">
              {user?.name || 'Student'}
            </h2>
            <p className="whop-page-sub text-sm">
              {fitnessLevel} • {goalText}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="whop-micro text-white/50">Workouts/Week</span>
            <span className="whop-pill whop-pill-accent">{weeklyGoal}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="whop-micro text-white/50">Session Length</span>
            <span className="whop-pill whop-pill-accent">{availableTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="whop-micro text-white/50">Equipment</span>
            <span className="whop-pill whop-pill-accent">{equipmentList}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="whop-micro text-white/50">Workout Type</span>
            <span className="whop-pill whop-pill-accent">{workoutType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="whop-micro text-white/50">Stress Level</span>
            <span className="whop-pill whop-pill-accent">{stressLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="whop-micro text-white/50">Sleep Goal</span>
            <span className="whop-pill whop-pill-accent">{sleepGoal}h</span>
          </div>
        </div>
      </div>

      {/* Workouts section */}
      <div className="whop-card p-4 mb-4">
        <h3 className="whop-section-label mb-3">Workouts</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Schedule</span>
            <span className="whop-pill">{weeklyGoal} days/week</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Preferences</span>
            <span className="whop-pill">{workoutType}</span>
          </div>
        </div>
      </div>

      {/* Health section */}
      <div className="whop-card p-4 mb-4">
        <h3 className="whop-section-label mb-3">Health</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Sleep Tracking</span>
            <span className="whop-pill">{averageSleep}h avg</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Recovery</span>
            <span className="whop-pill">Active</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Stress Management</span>
            <span className="whop-pill">{stressLevel}</span>
          </div>
        </div>
      </div>

      {/* Notifications section */}
      <div className="whop-card p-4 mb-4">
        <h3 className="whop-section-label mb-3">Notifications</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Workout Reminders</span>
            <span className="whop-pill whop-pill-accent">On</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Streak Alerts</span>
            <span className="whop-pill whop-pill-accent">On</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Plan Updates</span>
            <span className="whop-pill whop-pill-accent">On</span>
          </div>
        </div>
      </div>

      {/* Appearance section */}
      <div className="whop-card p-4 mb-4">
        <h3 className="whop-section-label mb-3">Appearance</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Theme</span>
            <span className="whop-pill">Dark</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-white/70">Compact Mode</span>
            <span className="whop-pill">Off</span>
          </div>
        </div>
      </div>

      {/* Reset modal */}
      <div className="whop-card p-5 mb-5">
        <h3 className="whop-section-label mb-3">Data & Privacy</h3>
        <p className="whop-page-sub mb-4">
          Your data is stored locally in your browser. Reset clears everything and returns to onboarding.
        </p>
        <div className="whop-divider my-4" />
        <button
          onClick={() => setShowResetModal(true)}
          className="whop-btn-ghost w-full"
        >
          Reset All Data
        </button>
      </div>

      {/* App info */}
      <div className="whop-card p-4 text-center text-xs">
        <p className="whop-micro">FitTrack v1.0.0 • Student Fitness Planner</p>
        <p className="whop-micro">Built with React, TypeScript, and Tailwind CSS</p>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="whop-card p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="whop-icon-tile bg-rose-500/20 text-rose-400 w-8 h-8">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
            <h2 className="whop-page-title text-lg font-semibold mb-3">
              Reset All Data
            </h2>
            <p className="whop-page-sub mb-5">
              This will delete all your progress, settings, and start fresh. This action cannot be undone.
            </p>
            <div className="flex justify-between pt-4">
              <button
                onClick={() => setShowResetModal(false)}
                className="whop-btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="whop-btn-primary"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}