import React from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
  onDemoSwitch?: (userId: string) => void
  demoMode?: boolean
  onProfileClick?: () => void
}

export default function Layout({ children, onDemoSwitch, demoMode, onProfileClick }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white/90">
      {/* Top Bar */}
      <TopBar
        onProfileClick={onProfileClick}
        demoMode={demoMode}
        onDemoSwitch={onDemoSwitch}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  )
}
