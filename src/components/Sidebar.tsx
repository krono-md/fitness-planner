import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Zap, ChevronDown, X, type LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, CalendarDays, Dumbbell, Moon, TrendingUp,
  Target, Lightbulb, Settings as SettingsIcon, BookOpen,
} from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { getInitials } from '../utils/stats'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

interface NavItem {
  icon: LucideIcon
  label: string
  path: string
  color: string
}

interface NavSection {
  label: string
  items: NavItem[]
}

/** Sections mirror routeMeta.ts grouping so the sidebar and the page
 *  titles always read the same. We duplicate the icon list here because
 *  Sidebar is a render-tree concern, not a routing concern, and the
 *  module already depends on lucide-react directly. */
const navSections: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/', color: 'bg-indigo-500/15 text-indigo-400' },
      { icon: CalendarDays, label: 'My Plan', path: '/plan', color: 'bg-violet-500/15 text-violet-400' },
      { icon: Dumbbell, label: 'Workouts', path: '/workouts', color: 'bg-amber-500/15 text-amber-400' },
      { icon: CalendarDays, label: 'Calendar', path: '/calendar', color: 'bg-sky-500/15 text-sky-400' },
    ],
  },
  {
    label: 'Health',
    items: [
      { icon: Moon, label: 'Sleep & Recovery', path: '/recovery', color: 'bg-blue-500/15 text-blue-400' },
      { icon: TrendingUp, label: 'Progress', path: '/progress', color: 'bg-emerald-500/15 text-emerald-400' },
    ],
  },
  {
    label: 'Library',
    items: [
      { icon: Target, label: 'Goals', path: '/goals', color: 'bg-rose-500/15 text-rose-400' },
      { icon: BookOpen, label: 'Exercises', path: '/exercises', color: 'bg-orange-500/15 text-orange-400' },
      { icon: Lightbulb, label: 'Insights', path: '/insights', color: 'bg-yellow-500/15 text-yellow-400' },
    ],
  },
  {
    label: 'Account',
    items: [
      { icon: SettingsIcon, label: 'Settings', path: '/settings', color: 'bg-white/10 text-white/50' },
    ],
  },
]

/** Active-match helper: '/' is exact (don't highlight Overview on /plan),
 *  but /workout/:id should still light up the Workouts entry. */
function isItemActive(pathname: string, itemPath: string): boolean {
  if (itemPath === '/') return pathname === '/'
  if (itemPath === '/workouts') return pathname.startsWith('/workouts') || pathname.startsWith('/workout/')
  return pathname === itemPath || pathname.startsWith(itemPath + '/')
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation()
  const { user } = useAppStore()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/75 z-40 lg:hidden backdrop-blur-[2px]"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky inset-y-0 left-0 w-[248px] flex flex-col z-50
          bg-dark-surface border-r border-white/[0.055]
          transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Workspace selector — Whop-style */}
        <div className="px-3 pt-3 pb-2 relative">
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl hover:bg-white/[0.04] transition-colors group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-glow-sm flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-[13px] font-semibold text-white/90 truncate leading-tight">FitTrack</p>
              <p className="text-2xs text-white/35 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-success inline-block" />
                Student Fitness
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-white/25 group-hover:text-white/50 flex-shrink-0" />
          </button>
          <button
            onClick={onClose}
            className="lg:hidden absolute top-3 right-3 p-1.5 text-white/40 hover:text-white rounded-lg hover:bg-white/[0.06]"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="whop-divider mx-3" />

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-1">
          {navSections.map((section, sIdx) => (
            <div key={section.label} className={sIdx > 0 ? 'mt-1' : ''}>
              <p className="whop-section-label">{section.label}</p>
              <div className="space-y-px">
                {section.items.map((item) => {
                  const Icon = item.icon
                  const isActive = isItemActive(location.pathname, item.path)
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
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
          ))}
        </nav>

        {/* User card — links to Settings (Stage 7 routing fix) */}
        <Link
          to="/settings"
          onClick={onClose}
          className="p-2.5 border-t border-white/[0.055] block"
        >
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-xl hover:bg-white/[0.035] transition-colors">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-primary/70 to-accent-secondary/70 flex items-center justify-center text-2xs font-bold flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[12px] truncate text-white/85">{user?.name || 'Student'}</p>
              <p className="text-2xs text-white/35 capitalize">{user?.fitnessLevel || 'Beginner'}</p>
            </div>
          </div>
        </Link>
      </aside>
    </>
  )
}
