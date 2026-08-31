import React, { useState } from 'react'
import { Home, Dumbbell, CalendarDays, TrendingUp, Menu, X, Target, Lightbulb, BookOpen, Settings as SettingsIcon, Moon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/appStore'

/** Primary 5 items that show as icons. The rest live behind the "More"
 *  sheet — keeps the bar readable on small screens. */
const primaryItems = [
  { id: 'dashboard', label: 'Home', icon: Home, path: '/' },
  { id: 'plan', label: 'Plan', icon: CalendarDays, path: '/plan' },
  { id: 'workouts', label: 'Workouts', icon: Dumbbell, path: '/workouts' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, path: '/progress' },
]

/** Items reachable from the More sheet — everything not in the primary 5. */
const moreItems = [
  { id: 'calendar', label: 'Calendar', icon: CalendarDays, path: '/calendar', color: 'bg-sky-500/15 text-sky-400' },
  { id: 'recovery', label: 'Sleep & Recovery', icon: Moon, path: '/recovery', color: 'bg-blue-500/15 text-blue-400' },
  { id: 'goals', label: 'Goals', icon: Target, path: '/goals', color: 'bg-rose-500/15 text-rose-400' },
  { id: 'exercises', label: 'Exercises', icon: BookOpen, path: '/exercises', color: 'bg-orange-500/15 text-orange-400' },
  { id: 'insights', label: 'Insights', icon: Lightbulb, path: '/insights', color: 'bg-yellow-500/15 text-yellow-400' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings', color: 'bg-white/10 text-white/50' },
]

/** True if `pathname` should highlight the More button. */
function moreIsActive(pathname: string): boolean {
  return moreItems.some(i => i.path === pathname || pathname.startsWith(i.path + '/'))
}

export default function BottomNav() {
  const location = useLocation()
  const { user } = useAppStore()
  const [moreOpen, setMoreOpen] = useState(false)

  if (!user) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-dark-panel/95 backdrop-blur-xl border-t border-white/[0.06] z-40 lg:hidden">
        <div className="max-w-6xl mx-auto px-2">
          <div className="flex items-center justify-around h-14">
            {primaryItems.map((item) => {
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
                  {isActive && (
                    <span className="absolute bottom-1 w-1 h-1 bg-accent-primary rounded-full" />
                  )}
                </Link>
              )
            })}

            <button
              onClick={() => setMoreOpen(true)}
              className={`
                relative flex flex-col items-center justify-center flex-1 h-full transition-colors
                ${moreIsActive(location.pathname) ? 'text-accent-primary' : 'text-white/40 hover:text-white/70'}
              `}
            >
              <Menu className={`w-6 h-6 ${moreIsActive(location.pathname) ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              <span className="text-[11px] font-medium mt-0.5 opacity-80">More</span>
              {moreIsActive(location.pathname) && (
                <span className="absolute bottom-1 w-1 h-1 bg-accent-primary rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {moreOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-[2px] z-50 lg:hidden"
            onClick={() => setMoreOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 lg:hidden animate-in slide-in-from-bottom duration-200">
            <div className="bg-dark-surface border-t border-white/[0.08] rounded-t-2xl p-4 pb-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="whop-page-title text-base">More</h3>
                <button
                  onClick={() => setMoreOpen(false)}
                  className="p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.06]"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1">
                {moreItems.map((item) => {
                  const Icon = item.icon
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setMoreOpen(false)}
                      className={`whop-nav-item ${isActive ? 'whop-nav-active' : ''}`}
                    >
                      <div className={`whop-icon-tile ${item.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
