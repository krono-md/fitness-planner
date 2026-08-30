import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAppStore } from './store/appStore'
import { mockUsers } from './data/mockUsers'
import Layout from './components/Layout'
import NotificationCenter from './components/NotificationCenter'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'
import WorkoutPlayer from './pages/WorkoutPlayer'
import Recovery from './pages/Recovery'
import Workouts from './pages/Workouts'

function App() {
  const { user, setUser, demoMode, setDemoMode } = useAppStore()
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
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
        onMoreClick={() => setMoreMenuOpen(!moreMenuOpen)}
        moreMenuOpen={moreMenuOpen}
      >
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workout/:workoutId" element={<WorkoutPlayer />} />
          <Route path="/recovery" element={<Recovery />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* More Menu Dropdown */}
        {moreMenuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMoreMenuOpen(false)} />
            <div className="fixed bottom-20 right-4 w-48 bg-dark-elevated border border-white/[0.08] rounded-xl shadow-large z-50 overflow-hidden py-1">
              <button
                onClick={() => { setMoreMenuOpen(false); setNotificationOpen(true) }}
                className="block w-full text-left px-4 py-3 hover:bg-white/[0.05] text-sm text-white/75 flex items-center gap-2"
              >
                <span>Notifications</span>
              </button>
              <button
                onClick={() => { setMoreMenuOpen(false); localStorage.removeItem('fittrack-storage'); window.location.reload() }}
                className="block w-full text-left px-4 py-3 hover:bg-white/[0.05] text-sm text-white/75 flex items-center gap-2"
              >
                <span>Log Out</span>
              </button>
            </div>
          </>
        )}
      </Layout>

      {/* Notification Center */}
      <NotificationCenter open={notificationOpen} onClose={() => setNotificationOpen(false)} />
    </BrowserRouter>
  )
}

export default App
