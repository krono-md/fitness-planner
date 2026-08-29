import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Calendar,
  Zap,
  TrendingUp,
  Moon,
  Dumbbell,
  Target,
  Lightbulb,
  Settings,
  X
} from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Calendar, label: 'My Plan', path: '/plan' },
  { icon: Dumbbell, label: 'Workouts', path: '/workouts' },
  { icon: Moon, label: 'Sleep & Recovery', path: '/recovery' },
  { icon: TrendingUp, label: 'Progress', path: '/progress' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Lightbulb, label: 'Insights', path: '/insights' },
  { icon: Settings, label: 'Settings', path: '/settings' },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()

  return (
    <>
      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 w-72 bg-dark-surface border-r border-dark-border
        transition-transform duration-300 transform z-50
        ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-8 flex items-center justify-between border-b border-dark-border">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
              FitTrack
            </h1>
            <p className="text-xs text-white/40 mt-1">Student Fitness</p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white p-2 hover:bg-dark-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group
                  ${isActive
                    ? 'bg-accent-primary/10 text-accent-primary shadow-soft'
                    : 'text-white/70 hover:text-white hover:bg-dark-hover'
                  }
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center transition-colors
                  ${isActive
                    ? 'bg-accent-primary/20'
                    : 'bg-white/5 group-hover:bg-white/10'
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-[15px]">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-border">
          <div className="px-4 py-3 bg-dark-elevated rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center text-sm font-bold">
                AR
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">Alex Reyes</p>
                <p className="text-xs text-white/40">Beginner</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
