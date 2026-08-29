import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import { mockUsers } from './data/mockUsers'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import MyPlan from './pages/MyPlan'
import Workouts from './pages/Workouts'
import Calendar from './pages/Calendar'
import WorkoutPlayer from './pages/WorkoutPlayer'
import Recovery from './pages/Recovery'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import Insights from './pages/Insights'
import ExerciseLibrary from './pages/ExerciseLibrary'
import Goals from './pages/Goals'
import NotificationCenter from './components/NotificationCenter'

function App() {
  const { user, setUser, demoMode, setDemoMode } = useAppStore()
  const [notificationOpen, setNotificationOpen] = useState(false)

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

  if (!user || !user.onboardingComplete) {
    return <Onboarding onComplete={setUser} />
  }

  return (
    <BrowserRouter>
      <NotificationCenter open={notificationOpen} onClose={() => setNotificationOpen(false)} />
      <Layout
        onDemoSwitch={handleDemoUserSwitch}
        demoMode={demoMode}
        onNotificationOpen={() => setNotificationOpen(true)}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<MyPlan />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/workout/:workoutId" element={<WorkoutPlayer />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/exercises" element={<ExerciseLibrary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
