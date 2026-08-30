import React from 'react'
import { Home, Dumbbell, Moon, MoreHorizontal } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home, path: '/' },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell, path: '/workouts' },
  { id: 'recovery', label: 'Sleep', icon: Moon, path: '/recovery' },
]

interface BottomNavProps {
  onMoreClick?: () => void
}

export default function BottomNav({ onMoreClick }: BottomNavProps) {
  const location = useLocation()
  const { user } = useAppStore()

  if (!user) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-panel/90 backdrop-blur-xl border-t border-white/[0.06] z-40 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
              <span className="font-bold text-white text-xs">Fit</span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    relative flex flex-col items-center justify-center w-14 h-full transition-colors
                    ${isActive ? 'text-accent-primary' : 'text-white/40 hover:text-white/70'}
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                  <span className="text-[10px] font-medium mt-0.5">{item.label}</span>

                  {/* Active indicator dot */}
                  {isActive && (
                    <span className="absolute bottom-1.5 w-1 h-1 bg-accent-primary rounded-full" />
                  )}
                </Link>
              )
            })}

            {/* More menu */}
            <button
              onClick={onMoreClick}
              className="flex flex-col items-center justify-center w-14 h-full text-white/40 hover:text-white/70 transition-colors"
            >
              <MoreHorizontal className="w-6 h-6" />
              <span className="text-[10px] font-medium mt-0.5">More</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
