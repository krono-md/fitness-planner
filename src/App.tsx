import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import { mockUsers } from './data/mockUsers'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import WorkoutPlayer from './pages/WorkoutPlayer'
import Recovery from './pages/Recovery'
import Workouts from './pages/Workouts'

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
      <Layout
        onDemoSwitch={handleDemoUserSwitch}
        demoMode={demoMode}
        onNotificationOpen={() => setNotificationOpen(true)}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout/:workoutId" element={<WorkoutPlayer />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App
