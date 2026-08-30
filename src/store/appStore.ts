import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile, Workout, WorkoutSession, SleepRecord, Goal, Notification } from '../types'
import { PersonalizationEngine, AdjustReason, ADJUST_REASON_META } from '../engine/personalizationEngine'

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
  adjustTodayWorkout: (reason: AdjustReason) => void
  rescheduleWorkout: (workoutId: string, newDay: string) => void
  skipWorkout: (workoutId: string) => void
  markWorkoutSkipped: (workoutId: string) => void
  addWorkoutSession: (session: WorkoutSession) => void
  updateWorkoutSession: (session: WorkoutSession) => void
  logSkippedWorkout: (workoutId: string, opts?: { rescheduleTo?: string; reason?: string }) => void
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

      adjustTodayWorkout: (reason: AdjustReason) => {
        const { user, userPlan } = get()
        if (!user) return
        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
        const idx = userPlan.findIndex(w => w.dayOfWeek === today)
        if (idx === -1) return
        const todayWorkout = userPlan[idx]
        const adjusted = PersonalizationEngine.adjustWorkout(todayWorkout, reason, user)
        const next = [...userPlan]
        next[idx] = adjusted
        set({ userPlan: next })
        get().addNotification({
          id: `notif_${Date.now()}`,
          userId: user.id,
          type: 'plan_adjustment',
          title: `Adjusted: ${ADJUST_REASON_META[reason].label}`,
          message: ADJUST_REASON_META[reason].description,
          read: false,
          createdAt: new Date().toISOString(),
        })
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

      markWorkoutSkipped: (workoutId) => {
        const workout = get().userPlan.find(w => w.id === workoutId)
        const fromDay = workout?.dayOfWeek
        set((state) => ({
          userPlan: state.userPlan.map(w =>
            w.id === workoutId ? { ...w, skipped: true } : w
          ),
        }))
        // Also write a session so Progress / AdaptiveEngine can see the skip
        get().logSkippedWorkout(workoutId, { reason: fromDay ? `Skipped on ${fromDay}` : undefined })
      },

      addWorkoutSession: (session) => {
        set((state) => {
          const sessions = [...state.workoutSessions, session]
          // Only completed sessions count toward the weekly workout goal
          if (session.completed) {
            const weeklyGoal = state.goals.find(g => g.category === 'workouts' && !g.completed)
            if (weeklyGoal) {
              const newCurrent = Math.min(weeklyGoal.current + 1, weeklyGoal.target)
              const goals = state.goals.map(g =>
                g.id === weeklyGoal.id
                  ? { ...g, current: newCurrent, completed: newCurrent >= weeklyGoal.target }
                  : g
              )
              return { workoutSessions: sessions, goals }
            }
          }
          return { workoutSessions: sessions }
        })
        // Post a completion notification (only for completed sessions — skipped ones
        // post their own notification at the call site so we can include the reschedule info)
        if (session.completed) {
          get().addNotification({
            id: `notif_${Date.now()}`,
            userId: get().user?.id || '',
            type: 'completion',
            title: 'Workout complete',
            message: `${session.exercisesCompleted} exercises logged · rated ${session.difficulty}${session.wasAdjusted ? ' (after adjust)' : ''}.`,
            read: false,
            createdAt: new Date().toISOString(),
          })
        }
      },

      updateWorkoutSession: (session) => set((state) => ({
        workoutSessions: state.workoutSessions.map(s => s.id === session.id ? session : s),
      })),

      logSkippedWorkout: (workoutId, opts) => {
        const { user, userPlan } = get()
        const workout = userPlan.find(w => w.id === workoutId)
        if (!workout) return
        const now = new Date().toISOString()
        const session: WorkoutSession = {
          id: `session_${Date.now()}`,
          workoutId: workout.id,
          userId: user?.id || '',
          date: now,
          completed: false,
          exercisesCompleted: 0,
          duration: 0,
          difficulty: 'moderate',
          notes: opts?.reason,
          rescheduledFrom: opts?.rescheduleTo ? workout.dayOfWeek : undefined,
        }
        get().addWorkoutSession(session)
        get().addNotification({
          id: `notif_${Date.now()}`,
          userId: user?.id || '',
          type: 'plan_adjustment',
          title: 'Workout skipped',
          message: opts?.rescheduleTo
            ? `Moved to ${opts.rescheduleTo} — we'll see you then.`
            : `Logged as skipped. Don't sweat it — pick it up tomorrow.`,
          read: false,
          createdAt: now,
        })
      },

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
