import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { UserProfile, Workout, WorkoutSession, SleepRecord, Goal, Notification } from '../types'
import { PersonalizationEngine, AdjustReason, ADJUST_REASON_META } from '../engine/personalizationEngine'
import { AdaptiveEngine } from '../engine/adaptiveEngine'

/** Format a Date as YYYY-MM-DD in the local timezone. We use this in the
 *  store (and the rest of the app) so that any new "what day did this happen
 *  on" stamp survives being persisted and re-read across timezones. */
function localDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

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
  /** Keys of adaptive suggestions already applied so we don't double-fire.
   *  Key format: `${adaptationType}:${localDateKey(date)}`. */
  lastAppliedAdaptations: string[]

  setUser: (user: UserProfile) => void
  setUserPlan: (plan: Workout[]) => void
  regeneratePlan: () => void
  regeneratePlanWithSleep: () => void
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
  /** Apply non-destructive adaptive patterns the engine has detected
   *  (skip pattern → reschedule, hard streak → soften next workout, time
   *  pressure → shrink duration). Idempotent on the same date+type pair. */
  applyAdaptiveSuggestions: () => void
  /** Dismiss a single suggestion without applying it. */
  dismissAdaptiveSuggestion: (key: string) => void
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
      lastAppliedAdaptations: [],

      setUser: (user) => {
        const plan = PersonalizationEngine.generatePlan(user, [])
        set({ user, userPlan: plan })
      },

      setUserPlan: (plan) => set({ userPlan: plan }),

      regeneratePlan: () => {
        const { user, sleepRecords } = get()
        if (user) {
          set({ userPlan: PersonalizationEngine.generatePlan(user, sleepRecords) })
        }
      },

      regeneratePlanWithSleep: () => {
        const { user, sleepRecords } = get()
        if (user) {
          set({ userPlan: PersonalizationEngine.generatePlan(user, sleepRecords) })
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
        // Re-run the adaptive engine — the new session may have just crossed
        // the threshold for a skip / hard-streak / time-pressure pattern.
        get().applyAdaptiveSuggestions()
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
        // addWorkoutSession already calls applyAdaptiveSuggestions; this is
        // belt-and-suspenders for callers that bypass it.
        get().applyAdaptiveSuggestions()
      },

      addSleepRecord: (record) => {
        set((state) => ({
          sleepRecords: [...state.sleepRecords, record],
        }))
        // Regenerate plan so the new sleep data influences future workouts
        get().regeneratePlanWithSleep()
      },

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

      applyAdaptiveSuggestions: () => {
        const { user, workoutSessions, userPlan, lastAppliedAdaptations } = get()
        if (!user) return
        const adaptations = AdaptiveEngine.analyzePatterns(workoutSessions, user)
        if (adaptations.length === 0) return

        const today = localDateKey(new Date())
        const newKeys: string[] = []
        let nextPlan = userPlan
        const notifications: Notification[] = []

        for (const adapt of adaptations) {
          // Dedup: skip if we've already applied this same (type, date) pair.
          const key = `${adapt.adaptationType}:${today}`
          if (lastAppliedAdaptations.includes(key)) continue

          switch (adapt.adaptationType) {
            case 'skip_pattern': {
              // Find the recurring slot for the bad day and shift it two days later.
              // The engine's reason text uses the full weekday name (e.g. "on Wednesdays").
              const dayMatch = adapt.reason.match(/on (\w+)s/)
              const dayFull = dayMatch ? dayMatch[1] : null
              if (dayFull) {
                const target = nextPlan.find(w => w.dayOfWeek === dayFull && w.exercises.length > 0)
                if (target) {
                  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
                  const idx = days.indexOf(target.dayOfWeek)
                  const newDay = days[(idx + 2) % 7]
                  nextPlan = nextPlan.map(w => w.id === target.id ? { ...w, dayOfWeek: newDay } : w)
                  notifications.push({
                    id: `notif_${Date.now()}_${adapt.adaptationType}`,
                    userId: user.id,
                    type: 'plan_adjustment',
                    title: 'Plan adapted',
                    message: `You keep skipping ${dayFull}s — moved your ${target.name} to ${newDay}. You can change it back anytime.`,
                    read: false,
                    createdAt: new Date().toISOString(),
                  })
                  newKeys.push(key)
                }
              }
              break
            }
            case 'difficulty_adjustment': {
              // Soften the next planned (non-recovery) workout that hasn't already been adjusted.
              const target = nextPlan.find(w => w.exercises.length > 0 && !w.adjustedReason)
              if (target) {
                const softened = PersonalizationEngine.adjustWorkout(target, 'more_tired', user)
                nextPlan = nextPlan.map(w => w.id === target.id ? softened : w)
                notifications.push({
                  id: `notif_${Date.now()}_${adapt.adaptationType}`,
                  userId: user.id,
                  type: 'plan_adjustment',
                  title: 'Plan adapted',
                  message: `Your last 3 sessions felt hard — softened the next one (${target.name}) to give you a breather.`,
                  read: false,
                  createdAt: new Date().toISOString(),
                })
                newKeys.push(key)
              }
              break
            }
            case 'schedule_conflict': {
              // Pre-emptively shrink the next planned workout to 70% of its duration.
              const target = nextPlan.find(w => w.exercises.length > 0 && w.duration > 0)
              if (target) {
                const newDuration = Math.max(10, Math.round(target.duration * 0.7))
                const trimmed: Workout = {
                  ...target,
                  duration: newDuration,
                  estimatedCalories: Math.round(newDuration * 6),
                  notes: target.notes
                    ? `${target.notes} · Trimmed to ${newDuration} min based on your recent session lengths.`
                    : `Trimmed to ${newDuration} min based on your recent session lengths.`,
                }
                nextPlan = nextPlan.map(w => w.id === target.id ? trimmed : w)
                notifications.push({
                  id: `notif_${Date.now()}_${adapt.adaptationType}`,
                  userId: user.id,
                  type: 'plan_adjustment',
                  title: 'Plan adapted',
                  message: `Workouts have been running short — trimmed ${target.name} to ${newDuration} min to fit the time you're actually putting in.`,
                  read: false,
                  createdAt: new Date().toISOString(),
                })
                newKeys.push(key)
              }
              break
            }
            case 'progression':
              // Reserved for future use; no mutation today.
              break
          }
        }

        if (newKeys.length === 0) return
        set((state) => ({
          userPlan: nextPlan,
          lastAppliedAdaptations: [...state.lastAppliedAdaptations, ...newKeys],
          notifications: [...notifications, ...state.notifications],
        }))
      },

      dismissAdaptiveSuggestion: (key) => {
        set((state) => ({
          lastAppliedAdaptations: state.lastAppliedAdaptations.includes(key)
            ? state.lastAppliedAdaptations
            : [...state.lastAppliedAdaptations, key],
        }))
      },

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
        lastAppliedAdaptations: [],
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
        lastAppliedAdaptations: state.lastAppliedAdaptations,
      }),
    }
  )
)
