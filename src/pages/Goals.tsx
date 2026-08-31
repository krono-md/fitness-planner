import React, { useState } from 'react'
import { Target, Plus, CheckCircle, Clock, TrendingUp, Award, ChevronRight } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { Goal } from '../types'

export default function Goals() {
  const { goals, addGoal, updateGoal } = useAppStore()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'workouts' as const,
    target: 1,
    unit: 'workouts',
    deadline: ''
  })

  const handleCreateGoal = () => {
    const goal: Goal = {
      id: `goal_${Date.now()}`,
      userId: '',
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      target: newGoal.target,
      current: 0,
      unit: newGoal.unit,
      deadline: newGoal.deadline || undefined,
      completed: false
    }
    addGoal(goal)
    setShowCreateModal(false)
    setNewGoal({ title: '', description: '', category: 'workouts', target: 1, unit: 'workouts', deadline: '' })
  }

  const categories = [
    { id: 'workouts', label: 'Workouts', icon: Target, color: 'text-accent-primary', bg: 'bg-accent-primary/15' },
    { id: 'consistency', label: 'Consistency', icon: TrendingUp, color: 'text-accent-secondary', bg: 'bg-accent-secondary/15' },
    { id: 'strength', label: 'Strength', icon: Award, color: 'text-accent-success', bg: 'bg-accent-success/15' },
    { id: 'endurance', label: 'Endurance', icon: Clock, color: 'text-accent-warning', bg: 'bg-accent-warning/15' },
  ]

  const activeGoals = goals.filter(g => !g.completed)
  const completedGoals = goals.filter(g => g.completed)

  return (
    <div className="whop-page">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="whop-page-title">Goals</h1>
          <p className="whop-page-sub">Set and track your fitness objectives</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="whop-btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Empty state — prominent CTA when there are no goals at all */}
      {goals.length === 0 && (
        <div className="whop-card p-10 text-center max-w-md mx-auto mb-5">
          <div className="whop-icon-tile bg-accent-primary/15 text-accent-primary w-14 h-14 mx-auto mb-4">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="whop-page-title text-lg mb-2">No goals yet</h2>
          <p className="whop-page-sub mb-5">Pick a category below to set your first objective and start tracking your progress.</p>
          <div className="grid grid-cols-2 gap-2.5">
            {categories.map(cat => {
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  onClick={() => { setNewGoal({ ...newGoal, category: cat.id as 'workouts' }); setShowCreateModal(true) }}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04] transition-colors"
                >
                  <div className={`whop-icon-tile ${cat.bg} w-8 h-8`}>
                    <Icon className={`w-4 h-4 ${cat.color}`} />
                  </div>
                  <span className="text-xs text-white/70">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Category tabs */}
      {goals.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-5">
          {categories.map(cat => {
            const Icon = cat.icon
            const count = activeGoals.filter(g => g.category === cat.id).length
            return (
              <div key={cat.id} className="whop-card p-3 flex flex-col items-center gap-1.5">
                <div className={`whop-icon-tile ${cat.bg} w-8 h-8`}>
                  <Icon className={`w-4 h-4 ${cat.color}`} />
                </div>
                <span className="text-xs text-white/75 font-medium">{cat.label}</span>
                <span className="whop-pill">{count}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="space-y-3 mb-5">
          <h2 className="whop-page-sub">Active Goals</h2>
          {activeGoals.map((goal) => {
            const progress = (goal.current / goal.target) * 100
            const category = categories.find(c => c.id === goal.category)
            return (
              <div key={goal.id} className="whop-card p-4">
                <div className="flex items-start justify-between mb-3 gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    {category && (
                      <div className={`whop-icon-tile ${category.bg} w-8 h-8 flex-shrink-0`}>
                        {React.createElement(category.icon, { className: `w-4 h-4 ${category.color}` })}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[15px] mb-0.5">{goal.title}</h3>
                      <p className="text-sm text-white/60">{goal.description}</p>
                      {goal.deadline && (
                        <p className="text-xs text-white/50 mt-1 flex items-center gap-1">
                          Due {new Date(goal.deadline).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className="text-xl font-bold">{goal.current}<span className="text-white/40 text-sm">/{goal.target}</span></p>
                    <p className="text-xs text-white/50">{goal.unit}</p>
                  </div>
                </div>

                <div className="space-y-1.5 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-3 border-t border-white/[0.05]">
                  <button
                    onClick={() => updateGoal({ ...goal, current: Math.min(goal.current + 1, goal.target) })}
                    className="flex-1 whop-btn-ghost"
                  >
                    +1 {goal.unit}
                  </button>
                  <button
                    onClick={() => {
                      if (goal.current >= goal.target) {
                        updateGoal({ ...goal, completed: true })
                      }
                    }}
                    disabled={goal.current < goal.target}
                    className={`flex-1 rounded-lg font-medium text-xs transition-colors ${
                      goal.current >= goal.target
                        ? 'bg-accent-success/20 text-accent-success hover:bg-accent-success/30'
                        : 'bg-white/[0.03] text-white/30 border border-white/[0.05] cursor-not-allowed'
                    }`}
                  >
                    Complete Goal
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="whop-page-sub mb-3">Completed Goals</h2>
          <div className="space-y-2">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="whop-card p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="whop-icon-tile bg-accent-success/15 text-accent-success w-7 h-7">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">{goal.title}</h3>
                    <p className="text-xs text-white/50">{goal.target} {goal.unit}</p>
                  </div>
                </div>
                <span className="whop-pill whop-pill-accent">Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="whop-card p-5 max-w-lg w-full max-h-[85vh] overflow-y-auto">
            <h2 className="whop-page-title text-lg mb-5">Create New Goal</h2>

            <div className="space-y-3">
              <div>
                <label className="whop-section-label block mb-1.5">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="whop-input"
                  placeholder="e.g., Complete 20 workouts this month"
                />
              </div>

              <div>
                <label className="whop-section-label block mb-1.5">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="whop-input min-h-[60px]"
                  placeholder="Why is this goal important to you?"
                />
              </div>

              <div>
                <label className="whop-section-label block mb-1.5">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setNewGoal({ ...newGoal, category: cat.id as 'workouts' })}
                      className={`whop-card p-2.5 text-left text-xs transition-colors ${
                        newGoal.category === cat.id ? 'whop-nav-active' : ''
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="whop-section-label block mb-1.5">Target</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 1 })}
                    className="whop-input"
                    min="1"
                  />
                </div>
                <div>
                  <label className="whop-section-label block mb-1.5">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="whop-input"
                    placeholder="workouts"
                  />
                </div>
              </div>

              <div>
                <label className="whop-section-label block mb-1.5">Deadline (Optional)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="whop-input"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-4 border-t border-white/[0.05]">
              <button onClick={() => setShowCreateModal(false)} className="flex-1 whop-btn-ghost">Cancel</button>
              <button
                onClick={handleCreateGoal}
                disabled={!newGoal.title}
                className="flex-1 whop-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}