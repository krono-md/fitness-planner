import React from 'react'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

interface LayoutProps {
  children: React.ReactNode
  onDemoSwitch?: (userId: string) => void
  demoMode?: boolean
  onNotificationOpen?: () => void
}

export default function Layout({ children, onDemoSwitch, demoMode, onNotificationOpen }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <div className="flex h-screen bg-dark-bg text-white/90 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main panel — Whop content area separation */}
      <div className="flex-1 flex flex-col min-w-0 lg:rounded-tl-2xl lg:border-l lg:border-t border-white/[0.055] bg-dark-panel overflow-hidden">
        <TopBar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          demoMode={demoMode}
          onDemoSwitch={onDemoSwitch}
          onNotificationOpen={onNotificationOpen}
        />

        <main className="flex-1 overflow-auto bg-mesh">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
