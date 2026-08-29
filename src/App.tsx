import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import { PersonalizationEngine } from './engine/personalizationEngine'
import { mockUsers } from './data/mockUsers'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import MyPlan from './pages/MyPlan'
import WorkoutPlayer from './pages/WorkoutPlayer'
import Recovery from './pages/Recovery'
import Progress from './pages/Progress'
import Settings from './pages/Settings'
import Insights from './pages/Insights'
import ExerciseLibrary from './pages/ExerciseLibrary'
import Goals from './pages/Goals'
import NotificationCenter from './components/NotificationCenter'

function App() {
  const { user, setUser, demoMode } = useAppStore()
  const [notificationOpen, setNotificationOpen] = useState(false)

  React.useEffect(() => {
    const savedUser = localStorage.getItem('fitnessUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (e) {
        console.error('Failed to parse saved user', e)
      }
    }
  }, [setUser])

  const handleDemoUserSwitch = (userId: string) => {
    const demoUserMap: Record<string, any> = {
      beginner: mockUsers.beginner_student,
      busy: mockUsers.busy_student,
      gym: mockUsers.gym_student,
      home: mockUsers.home_student,
    }

    const selectedUser = demoUserMap[userId]
    if (selectedUser) {
      const plan = PersonalizationEngine.generatePlan(selectedUser)
      setUser(selectedUser)
      localStorage.setItem('fitnessUser', JSON.stringify(selectedUser))
      localStorage.setItem('userPlan', JSON.stringify(plan))
    }
  }

  if (!user || !user.onboardingComplete) {
    return <Onboarding onComplete={setUser} />
  }

  return (
    <BrowserRouter>
      <NotificationCenter open={notificationOpen} onClose={() => setNotificationOpen(false)} />
      <Layout onDemoSwitch={handleDemoUserSwitch} demoMode={demoMode} onNotificationOpen={() => setNotificationOpen(true)}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/plan" element={<MyPlan />} />
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
