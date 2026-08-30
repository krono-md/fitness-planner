import React from 'react'
import TopBar from './TopBar'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: React.ReactNode
  onDemoSwitch?: (userId: string) => void
  demoMode?: boolean
  onMoreClick?: () => void
  moreMenuOpen?: boolean
}

const defaultOnMoreClick = () => {}

export default function Layout({ children, onDemoSwitch, demoMode, onMoreClick = defaultOnMoreClick, moreMenuOpen }: LayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-dark-bg text-white/90">
      {/* Top Bar */}
      <TopBar
        onMenuClick={onMoreClick}
        demoMode={demoMode}
        onDemoSwitch={onDemoSwitch}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav onMoreClick={onMoreClick} />
    </div>
  )
}
