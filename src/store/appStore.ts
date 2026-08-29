import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile, Workout, WorkoutSession, SleepRecord, Goal, Notification } from '../types'
import { PersonalizationEngine } from '../engine/personalizationEngine'

const defaultNotifications: Notification[] = [
  {
    id: 'notif_1',
    userId: '',
    type: 'streak',
    title: '5-day consistency streak!',
    message: "You're on a roll. Keep the momentum going this week.",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'notif_2',
    userId: '',
    type: 'workout_reminder',
    title: 'Workout reminder',
    message: 'Your workout starts in 30 minutes. Ready to go?',
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif_3',
    userId: '',
    type: 'completion',
    title: 'Weekly progress',
    message: "You've completed 3 of 4 planned workouts this week.",
    read: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
]

interface AppState {
  user: UserProfile | null
  userPlan: Workout[]
  workoutSessions: WorkoutSession[]
  sleepRecords: SleepRecord[]
  goals: Goal[]
  notifications: Notification[]
  demoMode: boolean

  setUser: (user: UserProfile) => void
  setUserPlan: (plan: Workout[]) => void
  regeneratePlan: () => void
  rescheduleWorkout: (workoutId: string, newDay: string) => void
  skipWorkout: (workoutId: string) => void
  addWorkoutSession: (session: WorkoutSession) => void
  updateWorkoutSession: (session: WorkoutSession) => void
  addSleepRecord: (record: SleepRecord) => void
  addGoal: (goal: Goal) => void
  updateGoal: (goal: Goal) => void
  addNotification: (notification: Notification) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  setDemoMode: (enabled: boolean) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      userPlan: [],
      workoutSessions: [],
      sleepRecords: [],
      goals: [],
      notifications: defaultNotifications,
      demoMode: false,

      setUser: (user) => {
        const plan = PersonalizationEngine.generatePlan(user)
        set({ user, userPlan: plan })
      },

      setUserPlan: (plan) => set({ userPlan: plan }),

      regeneratePlan: () => {
        const { user } = get()
        if (user) {
          set({ userPlan: PersonalizationEngine.generatePlan(user) })
        }
      },

      rescheduleWorkout: (workoutId, newDay) => {
        set((state) => ({
          userPlan: state.userPlan.map(w =>
            w.id === workoutId ? { ...w, dayOfWeek: newDay } : w
          ),
        }))
        get().addNotification({
          id: `notif_${Date.now()}`,
          userId: get().user?.id || '',
          type: 'plan_adjustment',
          title: 'Workout rescheduled',
          message: `Your workout was moved to ${newDay}.`,
          read: false,
          createdAt: new Date().toISOString(),
        })
      },

      skipWorkout: (workoutId) => {
        const workout = get().userPlan.find(w => w.id === workoutId)
        if (!workout) return
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        const idx = days.indexOf(workout.dayOfWeek)
        const nextDay = days[(idx + 1) % 7]
        get().rescheduleWorkout(workoutId, nextDay)
      },

      addWorkoutSession: (session) => set((state) => {
        const sessions = [...state.workoutSessions, session]
        const weeklyGoal = state.goals.find(g => g.category === 'workouts' && !g.completed)
        const goals = weeklyGoal
          ? state.goals.map(g =>
              g.id === weeklyGoal.id
                ? { ...g, current: Math.min(g.current + 1, g.target) }
                : g
            )
          : state.goals
        return { workoutSessions: sessions, goals }
      }),

      updateWorkoutSession: (session) => set((state) => ({
        workoutSessions: state.workoutSessions.map(s => s.id === session.id ? session : s),
      })),

      addSleepRecord: (record) => set((state) => ({
        sleepRecords: [...state.sleepRecords, record],
      })),

      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, goal],
      })),

      updateGoal: (goal) => set((state) => ({
        goals: state.goals.map(g => g.id === goal.id ? goal : g),
      })),

      addNotification: (notification) => set((state) => ({
        notifications: [notification, ...state.notifications],
      })),

      markNotificationRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n),
      })),

      clearNotifications: () => set({ notifications: [] }),

      setDemoMode: (enabled) => set({ demoMode: enabled }),

      reset: () => {
        localStorage.removeItem('fittrack-storage')
        set({
        user: null,
        userPlan: [],
        workoutSessions: [],
        sleepRecords: [],
        goals: [],
        notifications: defaultNotifications,
        demoMode: false,
        })
      },
    }),
    {
      name: 'fittrack-storage',
      partialize: (state) => ({
        user: state.user,
        userPlan: state.userPlan,
        workoutSessions: state.workoutSessions,
        sleepRecords: state.sleepRecords,
        goals: state.goals,
        notifications: state.notifications,
        demoMode: state.demoMode,
      }),
    }
  )
)
