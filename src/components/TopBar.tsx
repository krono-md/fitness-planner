import React from 'react'
import { Menu, Bell, Flame, User, Search } from 'lucide-react'
import { useAppStore } from '../store/appStore'

interface TopBarProps {
  onMenuClick: () => void
  demoMode?: boolean
  onDemoSwitch?: (userId: string) => void
  onNotificationOpen?: () => void
}

export default function TopBar({ onMenuClick, demoMode, onDemoSwitch, onNotificationOpen }: TopBarProps) {
  const { user, notifications } = useAppStore()
  const [showDemoMenu, setShowDemoMenu] = React.useState(false)

  const unreadNotifications = notifications.filter(n => !n.read).length

  const demoUsers = [
    { id: 'beginner', label: 'Beginner Student' },
    { id: 'busy', label: 'Busy Student' },
    { id: 'gym', label: 'Gym Student' },
    { id: 'home', label: 'Home Student' },
  ]

  return (
    <div className="h-20 bg-dark-surface border-b border-dark-border px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left */}
      <div className="flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white/60 hover:text-white p-2 hover:bg-dark-hover rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-dark-elevated border border-dark-border rounded-xl max-w-xs">
          <Search className="w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search workouts..."
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder-white/30"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {/* Demo Mode Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors border border-accent-primary/20"
          >
            Demo: {user?.name?.split(' ')[0] || 'User'}
          </button>
          {showDemoMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-xl shadow-lg z-50 overflow-hidden">
              {demoUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => {
                    onDemoSwitch?.(u.id)
                    setShowDemoMenu(false)
                  }}
                  className="block w-full text-left px-4 py-3 hover:bg-dark-hover text-sm text-white/90 border-b border-dark-border last:border-b-0 transition-colors"
                >
                  {u.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Streak */}
        <div className="flex items-center gap-2 px-4 py-2 bg-dark-elevated border border-dark-border rounded-xl hover:bg-dark-hover transition-colors cursor-pointer">
          <Flame className="w-5 h-5 text-accent-warning" />
          <span className="font-semibold text-sm">5 day</span>
        </div>

        {/* Notifications */}
        <button
          onClick={onNotificationOpen}
          className="relative p-2.5 text-white/60 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-danger rounded-full animate-pulse" />
          )}
        </button>

        {/* Profile */}
        <button className="p-2.5 text-white/60 hover:text-white hover:bg-dark-hover rounded-lg transition-colors">
          <User className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}
