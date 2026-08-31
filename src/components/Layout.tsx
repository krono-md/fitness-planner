import React, { useState } from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
  onDemoSwitch?: (userId: string) => void
  demoMode?: boolean
  onProfileClick?: () => void
}

/** App shell. The Sidebar is the primary navigation on lg+ (sticky left
 *  rail); on smaller screens it slides in from the left behind a backdrop
 *  when the hamburger in TopBar is pressed. TopBar + BottomNav stay so
 *  the user always has a way to reach the main actions. */
export default function Layout({ children, onDemoSwitch, demoMode, onProfileClick }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-dark-bg text-white/90">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={onProfileClick}
          demoMode={demoMode}
          onDemoSwitch={onDemoSwitch}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-4 py-6">
            {children}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  )
}
