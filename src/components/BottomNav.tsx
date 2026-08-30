import React from 'react'
import { Home, Dumbbell, Moon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

const navItems = [
  { id: 'dashboard', label: 'Home', icon: Home, path: '/' },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell, path: '/workouts' },
  { id: 'recovery', label: 'Sleep', icon: Moon, path: '/recovery' },
]

export default function BottomNav() {
  const location = useLocation()
  const { user } = useAppStore()

  if (!user) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-panel/90 backdrop-blur-xl border-t border-white/[0.06] z-40">
      <div className="max-w-6xl mx-auto px-2">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`
                  relative flex flex-col items-center justify-center flex-1 h-full transition-colors
                  ${isActive ? 'text-accent-primary' : 'text-white/40 hover:text-white/70'}
                `}
              >
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                <span className={`text-[11px] font-medium mt-0.5 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                  {item.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 bg-accent-primary rounded-full" />
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
