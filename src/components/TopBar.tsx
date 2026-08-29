import React from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, Bell, Flame, Search } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { calculateStreak } from '../utils/stats'
import { getRouteMeta } from '../utils/routeMeta'

interface TopBarProps {
  onMenuClick: () => void
  demoMode?: boolean
  onDemoSwitch?: (userId: string) => void
  onNotificationOpen?: () => void
}

export default function TopBar({ onMenuClick, onDemoSwitch, onNotificationOpen }: TopBarProps) {
  const { pathname } = useLocation()
  const { user, notifications, workoutSessions } = useAppStore()
  const [showDemoMenu, setShowDemoMenu] = React.useState(false)

  const meta = getRouteMeta(pathname)
  const unreadNotifications = notifications.filter(n => !n.read).length
  const streak = calculateStreak(workoutSessions)

  const demoUsers = [
    { id: 'beginner', label: 'Beginner Student' },
    { id: 'busy', label: 'Busy Student' },
    { id: 'gym', label: 'Gym Student' },
    { id: 'home', label: 'Home Student' },
    { id: 'intermediate', label: 'Intermediate Student' },
  ]

  return (
    <header className="h-[52px] flex-shrink-0 bg-dark-panel/90 backdrop-blur-xl border-b border-white/[0.055] px-4 lg:px-5 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-white/45 hover:text-white p-1.5 hover:bg-white/[0.05] rounded-lg flex-shrink-0"
        >
          <Menu className="w-[18px] h-[18px]" />
        </button>

        {/* Breadcrumb — Whop-style inline page context */}
        <div className="hidden sm:flex items-center gap-1.5 min-w-0 text-[13px]">
          <span className="text-white/30 font-medium">{meta.section}</span>
          <span className="text-white/20">/</span>
          <span className="text-white/75 font-semibold truncate">{meta.title}</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 ml-2 bg-white/[0.03] border border-white/[0.07] rounded-xl w-52 xl:w-64">
          <Search className="w-3.5 h-3.5 text-white/25 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-[12px] focus:outline-none placeholder-white/20 text-white/70"
          />
          <kbd className="hidden xl:inline text-2xs text-white/20 border border-white/[0.08] rounded px-1 py-px">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="relative">
          <button
            onClick={() => setShowDemoMenu(!showDemoMenu)}
            className="px-2.5 py-1.5 rounded-lg text-2xs font-semibold text-accent-primary/90 bg-accent-primary/8 hover:bg-accent-primary/14 border border-accent-primary/15 transition-colors"
          >
            Demo · {user?.name?.split(' ')[0] || 'User'}
          </button>
          {showDemoMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowDemoMenu(false)} />
              <div className="absolute right-0 mt-1.5 w-48 bg-dark-elevated border border-white/[0.08] rounded-xl shadow-large z-50 overflow-hidden py-1">
                {demoUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => { onDemoSwitch?.(u.id); setShowDemoMenu(false) }}
                    className="block w-full text-left px-3 py-2 hover:bg-white/[0.05] text-[12px] text-white/75"
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.07]">
          <Flame className="w-3.5 h-3.5 text-accent-warning" />
          <span className="font-semibold text-2xs text-white/70 tabular-nums">{streak}d</span>
        </div>

        <button
          onClick={onNotificationOpen}
          className="relative p-2 text-white/45 hover:text-white/80 hover:bg-white/[0.05] rounded-lg transition-colors"
        >
          <Bell className="w-[17px] h-[17px]" />
          {unreadNotifications > 0 && (
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-danger rounded-full ring-2 ring-dark-panel" />
          )}
        </button>
      </div>
    </header>
  )
}
