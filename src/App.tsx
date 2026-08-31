import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import { mockUsers } from './data/mockUsers'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import WorkoutPlayer from './pages/WorkoutPlayer'
import Recovery from './pages/Recovery'
import Workouts from './pages/Workouts'
import MyPlan from './pages/MyPlan'
import Calendar from './pages/Calendar'
import Progress from './pages/Progress'
import Goals from './pages/Goals'
import Insights from './pages/Insights'
import Settings from './pages/Settings'
import ExerciseLibrary from './pages/ExerciseLibrary'
import NotFound from './pages/NotFound'

function App() {
  const { user, setUser, demoMode, setDemoMode } = useAppStore()
  const [hydrated, setHydrated] = useState(false)

  // Wait for Zustand persist to rehydrate before rendering the onboarding
  // gate, otherwise a hard refresh on an onboarded user flashes the
  // onboarding screen for one frame.
  useEffect(() => {
    if (useAppStore.persist.hasHydrated()) {
      setHydrated(true)
    } else {
      const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true))
      return unsub
    }
  }, [])

  const handleDemoUserSwitch = (userId: string) => {
    const demoUserMap: Record<string, keyof typeof mockUsers> = {
      beginner: 'beginner_student',
      busy: 'busy_student',
      gym: 'gym_student',
      home: 'home_student',
      intermediate: 'intermediate_student',
    }

    const key = demoUserMap[userId]
    const selectedUser = key ? mockUsers[key] : null
    if (selectedUser) {
      setUser(selectedUser)
      setDemoMode(true)
    }
  }

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="whop-card p-8 text-center max-w-sm">
          <div className="whop-icon-tile bg-accent-primary/15 text-accent-primary w-10 h-10 mx-auto mb-3">
            <div className="w-4 h-4 rounded-full border-2 border-accent-primary border-t-transparent animate-spin" />
          </div>
          <p className="whop-page-sub">Loading your plan…</p>
        </div>
      </div>
    )
  }

  if (!user || !user.onboardingComplete) {
    return <Onboarding onComplete={setUser} />
  }

  return (
    <BrowserRouter>
      <Layout
        onDemoSwitch={handleDemoUserSwitch}
        demoMode={demoMode}
        onProfileClick={() => {
          // Profile clicks are handled by the Sidebar user card now;
          // Settings lives at /settings.
        }}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<MyPlan />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/workout/:workoutId" element={<WorkoutPlayer />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
