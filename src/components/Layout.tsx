import React from 'react'
import { Menu, X, Bell, User, Zap } from 'lucide-react'
import { useAppStore } from '../store/appStore'
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
  const { user } = useAppStore()

  return (
    <div className="flex h-screen bg-dark-bg text-white/90">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          demoMode={demoMode}
          onDemoSwitch={onDemoSwitch}
          onNotificationOpen={onNotificationOpen}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
