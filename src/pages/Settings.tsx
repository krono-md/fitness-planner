import React, { useState } from 'react'
import { User, Bell, Lock, Moon, Heart, Clock, Dumbbell, Calendar, ChevronRight, Save, RefreshCw, UserCheck } from 'lucide-react'
import { useAppStore } from '../store/appStore'

export default function Settings() {
  const { user, setUser, reset } = useAppStore()
  const [showResetModal, setShowResetModal] = useState(false)

  const sections = [
    {
      icon: User,
      label: 'Profile',
      items: [
        { label: 'Personal info', desc: 'Name, age, contact', value: user?.name || 'Not set' },
        { label: 'Fitness profile', desc: 'Goals, preferences, experience', value: 'Configured' },
        { label: 'Measurements', desc: 'Height, weight, body stats', value: user?.weight ? `${user.weight} lbs` : 'Not set' },
      ]
    },
    {
      icon: Dumbbell,
      label: 'Workouts',
      items: [
        { label: 'Schedule', desc: 'Available days and times', value: `${user?.workoutsPerWeek || 0} days/week` },
        { label: 'Equipment', desc: 'Available equipment', value: user?.equipment?.join(', ') || 'None' },
        { label: 'Workout preferences', desc: 'Types, intensity, location', value: user?.workoutType || 'Mixed' },
      ]
    },
    {
      icon: Heart,
      label: 'Health',
      items: [
        { label: 'Sleep settings', desc: 'Bedtime, wake time, goals', value: `${user?.averageSleep || 7}h/night` },
        { label: 'Recovery tracking', desc: 'Log and monitor recovery', value: 'Active' },
        { label: 'Stress management', desc: 'Track and manage stress', value: user?.stressLevel || 'Moderate' },
      ]
    },
    {
      icon: Bell,
      label: 'Notifications',
      items: [
        { label: 'Workout reminders', desc: 'Get notified before workouts', value: 'On' },
        { label: 'Streak alerts', desc: 'Stay motivated with streak info', value: 'On' },
        { label: 'Plan updates', desc: 'Updates when plans change', value: 'On' },
      ]
    },
    {
      icon: Moon,
      label: 'Appearance',
      items: [
        { label: 'Theme', desc: 'Dark mode, colors', value: 'Dark' },
        { label: 'Compact mode', desc: ' denser interface', value: 'Off' },
      ]
    },
  ]

  const handleReset = () => {
    reset()
    setShowResetModal(false)
    localStorage.removeItem('fitnessUser')
    localStorage.removeItem('userPlan')
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-white/60">Manage your profile and preferences</p>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-gradient-to-br from-dark-surface to-dark-elevated border border-dark-border rounded-2xl p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl flex items-center justify-center">
            <UserCheck className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{user?.name || 'Student'}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-white/60">Fitness Level</span>
                <p className="font-medium capitalize">{user?.fitnessLevel || 'Beginner'}</p>
              </div>
              <div>
                <span className="text-white/60">Goal</span>
                <p className="font-medium capitalize">{user?.goal?.replace('_', ' ') || 'Build consistency'}</p>
              </div>
              <div>
                <span className="text-white/60">Workouts/Week</span>
                <p className="font-medium">{user?.workoutsPerWeek || 3}</p>
              </div>
              <div>
                <span className="text-white/60">Session Length</span>
                <p className="font-medium">{user?.availableTimePerSession || '30'} min</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowResetModal(true)}
            className="px-4 py-2 border border-dark-border hover:bg-dark-hover rounded-lg text-sm text-accent-danger"
          >
            Reset All
          </button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {sections.map((section, idx) => {
          const Icon = section.icon
          return (
            <div key={idx} className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-dark-border flex items-center gap-3">
                <Icon className="w-5 h-5 text-accent-primary" />
                <h2 className="font-bold">{section.label}</h2>
              </div>
              <div className="divide-y divide-dark-border">
                {section.items.map((item, itemIdx) => (
                  <button
                    key={itemIdx}
                    className="w-full p-4 flex items-center justify-between hover:bg-dark-hover transition-colors"
                  >
                    <div className="text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-white/60">{item.desc}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/40">{item.value}</span>
                      <ChevronRight className="w-5 h-5 text-white/40" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Data & Privacy */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-4">Data & Privacy</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-elevated rounded-lg">
            <div>
              <h3 className="font-medium mb-1">Export Data</h3>
              <p className="text-sm text-white/60">Download your fitness data</p>
            </div>
            <button className="px-4 py-2 border border-dark-border hover:bg-dark-hover rounded-lg text-sm">
              Export
            </button>
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-elevated rounded-lg">
            <div>
              <h3 className="font-medium mb-1">Delete Account</h3>
              <p className="text-sm text-white/60">Permanently remove all data</p>
            </div>
            <button className="px-4 py-2 border border-accent-danger/50 text-accent-danger hover:bg-accent-danger/10 rounded-lg text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="text-center text-white/40 text-sm">
        <p>FitTrack v1.0.0 • Student Fitness Planner</p>
        <p className="mt-1">Built with React, TypeScript, and Tailwind CSS</p>
      </div>

      {/* Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl max-w-md w-full p-6">
            <div className="p-3 bg-accent-danger/20 rounded-xl w-fit mb-4">
              <RefreshCw className="w-6 h-6 text-accent-danger" />
            </div>
            <h2 className="text-xl font-bold mb-2">Reset All Data</h2>
            <p className="text-white/60 mb-6">
              This will delete all your progress, settings, and start fresh. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetModal(false)}
                className="flex-1 px-4 py-3 border border-dark-border hover:bg-dark-hover rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-3 bg-accent-danger text-white rounded-lg font-bold"
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