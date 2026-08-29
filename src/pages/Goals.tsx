import React, { useState } from 'react'
import { Target, Plus, CheckCircle, Clock, TrendingUp, Calendar, Award, ChevronRight } from 'lucide-react'
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
    setNewGoal({
      title: '',
      description: '',
      category: 'workouts',
      target: 1,
      unit: 'workouts',
      deadline: ''
    })
  }

  const categories = [
    { id: 'workouts', label: 'Workouts', icon: Target, color: 'text-accent-primary', bg: 'bg-accent-primary/20' },
    { id: 'consistency', label: 'Consistency', icon: TrendingUp, color: 'text-accent-secondary', bg: 'bg-accent-secondary/20' },
    { id: 'strength', label: 'Strength', icon: Award, color: 'text-accent-success', bg: 'bg-accent-success/20' },
    { id: 'endurance', label: 'Endurance', icon: Clock, color: 'text-accent-warning', bg: 'bg-accent-warning/20' },
  ]

  const activeGoals = goals.filter(g => !g.completed)
  const completedGoals = goals.filter(g => g.completed)

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold mb-1 md:mb-2">Goals</h1>
          <p className="text-white/50 text-sm md:text-lg">Set and track your fitness objectives</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="min-h-11 px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-medium transition-all text-sm md:text-base"
        >
          <Plus className="w-5 h-5" />
          New Goal
        </button>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon
          const count = activeGoals.filter(g => g.category === cat.id).length
          return (
            <button
              key={cat.id}
              className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-5 hover:bg-dark-hover transition-all shadow-soft hover:shadow-medium"
            >
              <div className={`inline-flex p-2.5 md:p-3 rounded-xl ${cat.bg} mb-2 md:mb-3`}>
                <Icon className={`w-5 h-5 md:w-6 md:h-6 ${cat.color}`} />
              </div>
              <p className="font-bold text-sm md:text-lg">{cat.label}</p>
              <p className="text-xs md:text-sm text-white/50">{count} active</p>
            </button>
          )
        })}
      </div>

      {/* Active Goals */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Active Goals</h2>
        {activeGoals.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {activeGoals.map((goal) => {
              const progress = (goal.current / goal.target) * 100
              const category = categories.find(c => c.id === goal.category)
              return (
                <div key={goal.id} className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-4 md:p-6 shadow-soft hover:shadow-medium transition-all">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <div className="flex items-start gap-3 md:gap-4">
                      {category && (
                        <div className={`p-2.5 md:p-3 rounded-xl ${category.bg}`}>
                          {React.createElement(category.icon, { className: `w-5 h-5 md:w-6 md:h-6 ${category.color}` })}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-base md:text-lg mb-1">{goal.title}</h3>
                        <p className="text-sm text-white/60">{goal.description}</p>
                        {goal.deadline && (
                          <p className="text-xs md:text-sm text-white/50 mt-1.5 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            Due {new Date(goal.deadline).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xl md:text-3xl font-bold">{goal.current}<span className="text-white/40">/{goal.target}</span></p>
                      <p className="text-xs md:text-sm text-white/50">{goal.unit}</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 md:space-y-2">
                    <div className="flex justify-between text-xs md:text-sm">
                      <span className="text-white/60">Progress</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2.5 md:h-3 bg-dark-elevated rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 md:gap-3 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-dark-border">
                    <button
                      onClick={() => updateGoal({ ...goal, current: Math.min(goal.current + 1, goal.target) })}
                      className="flex-1 min-h-10 md:min-h-11 px-4 py-2.5 md:py-3 bg-dark-elevated hover:bg-dark-hover border border-dark-border rounded-lg font-medium text-xs md:text-sm transition-colors"
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
                      className={`flex-1 min-h-10 md:min-h-11 px-4 py-2.5 md:py-3 rounded-lg font-medium text-xs md:text-sm transition-colors ${
                        goal.current >= goal.target
                          ? 'bg-accent-success text-white hover:bg-accent-success/90'
                          : 'bg-dark-elevated text-white/30 border border-dark-border cursor-not-allowed'
                      }`}
                    >
                      Complete Goal
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-dark-surface border border-dark-border rounded-xl md:rounded-2xl p-8 md:p-12 text-center shadow-soft">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-dark-hover rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 md:w-8 md:h-8 text-white/30" />
            </div>
            <h3 className="font-bold text-lg md:text-xl mb-2">No active goals</h3>
            <p className="text-white/60 mb-6 text-sm md:text-base">Set your first goal to start tracking your progress</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg font-medium text-sm"
            >
              Create Your First Goal
            </button>
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Completed Goals</h2>
          <div className="space-y-2 md:space-y-3">
            {completedGoals.map((goal) => {
              const category = categories.find(c => c.id === goal.category)
              return (
                <div key={goal.id} className="bg-dark-surface border border-dark-border rounded-xl p-3 md:p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                    <div className="p-2 bg-accent-success/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-accent-success" />
                    </div>
                    <div>
                      <h3 className="font-medium text-sm md:text-base">{goal.title}</h3>
                      <p className="text-xs md:text-sm text-white/60">{goal.target} {goal.unit}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-accent-success/20 text-accent-success rounded-full text-xs md:text-sm font-medium">
                    Completed
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-dark-surface border border-dark-border rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-large max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl md:text-2xl font-bold mb-6">Create New Goal</h2>

            <div className="space-y-3 md:space-y-4">
              <div>
                <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">Goal Title</label>
                <input
                  type="text"
                  value={newGoal.title}
                  onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-sm md:text-base"
                  placeholder="e.g., Complete 20 workouts this month"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">Description</label>
                <textarea
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary min-h-[60px] md:min-h-[80px] text-sm md:text-base"
                  placeholder="Why is this goal important to you?"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setNewGoal({ ...newGoal, category: cat.id as any })}
                      className={`p-2.5 md:p-3 rounded-lg border text-left text-xs md:text-sm transition-colors ${
                        newGoal.category === cat.id
                          ? 'border-accent-primary bg-accent-primary/10'
                          : 'border-dark-border bg-dark-elevated hover:bg-dark-hover'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">Target</label>
                  <input
                    type="number"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: parseInt(e.target.value) || 1 })}
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-sm md:text-base"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">Unit</label>
                  <input
                    type="text"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({ ...newGoal, unit: e.target.value })}
                    className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-sm md:text-base"
                    placeholder="workouts"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium mb-1.5 md:mb-2">Deadline (Optional)</label>
                <input
                  type="date"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-2.5 md:py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary text-sm md:text-base"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6 md:mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 md:py-3 border border-dark-border hover:bg-dark-hover rounded-lg font-medium text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateGoal}
                disabled={!newGoal.title}
                className="flex-1 px-4 py-2.5 md:py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all"
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
