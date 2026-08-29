import { create } from 'zustand'
import { UserProfile, WorkoutSession, SleepRecord, Goal, Notification } from '../types'

interface AppState {
  user: UserProfile | null
  workoutSessions: WorkoutSession[]
  sleepRecords: SleepRecord[]
  goals: Goal[]
  notifications: Notification[]
  demoMode: boolean

  setUser: (user: UserProfile) => void
  addWorkoutSession: (session: WorkoutSession) => void
  updateWorkoutSession: (session: WorkoutSession) => void
  addSleepRecord: (record: SleepRecord) => void
  addGoal: (goal: Goal) => void
  updateGoal: (goal: Goal) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  setDemoMode: (enabled: boolean) => void
  switchDemoUser: (userId: string) => void
  reset: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  workoutSessions: [],
  sleepRecords: [],
  goals: [],
  notifications: [],
  demoMode: false,

  setUser: (user) => set({ user }),
  addWorkoutSession: (session) => set((state) => ({
    workoutSessions: [...state.workoutSessions, session]
  })),
  updateWorkoutSession: (session) => set((state) => ({
    workoutSessions: state.workoutSessions.map(s => s.id === session.id ? session : s)
  })),
  addSleepRecord: (record) => set((state) => ({
    sleepRecords: [...state.sleepRecords, record]
  })),
  addGoal: (goal) => set((state) => ({
    goals: [...state.goals, goal]
  })),
  updateGoal: (goal) => set((state) => ({
    goals: state.goals.map(g => g.id === goal.id ? goal : g)
  })),
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications]
  })),
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
  })),
  setDemoMode: (enabled) => set({ demoMode: enabled }),
  switchDemoUser: (userId) => {
    // This will be implemented with mock data
    set({ user: null })
  },
  reset: () => set({
    user: null,
    workoutSessions: [],
    sleepRecords: [],
    goals: [],
    notifications: [],
  }),
}))
