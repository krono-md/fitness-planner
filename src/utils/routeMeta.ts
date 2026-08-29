import {
  LayoutDashboard, CalendarDays, Dumbbell, Moon, TrendingUp,
  BookOpen, Target, Lightbulb, Settings, type LucideIcon,
} from 'lucide-react'

export interface RouteMeta {
  title: string
  section: string
  icon: LucideIcon
  iconClass: string
}

export const routeMeta: Record<string, RouteMeta> = {
  '/': {
    title: 'Dashboard',
    section: 'Overview',
    icon: LayoutDashboard,
    iconClass: 'bg-indigo-500/15 text-indigo-400',
  },
  '/plan': {
    title: 'My Plan',
    section: 'Overview',
    icon: CalendarDays,
    iconClass: 'bg-violet-500/15 text-violet-400',
  },
  '/workouts': {
    title: 'Workouts',
    section: 'Overview',
    icon: Dumbbell,
    iconClass: 'bg-amber-500/15 text-amber-400',
  },
  '/calendar': {
    title: 'Calendar',
    section: 'Overview',
    icon: CalendarDays,
    iconClass: 'bg-sky-500/15 text-sky-400',
  },
  '/recovery': {
    title: 'Sleep & Recovery',
    section: 'Health',
    icon: Moon,
    iconClass: 'bg-blue-500/15 text-blue-400',
  },
  '/progress': {
    title: 'Progress',
    section: 'Health',
    icon: TrendingUp,
    iconClass: 'bg-emerald-500/15 text-emerald-400',
  },
  '/exercises': {
    title: 'Exercise Library',
    section: 'Library',
    icon: BookOpen,
    iconClass: 'bg-orange-500/15 text-orange-400',
  },
  '/goals': {
    title: 'Goals',
    section: 'Library',
    icon: Target,
    iconClass: 'bg-rose-500/15 text-rose-400',
  },
  '/insights': {
    title: 'Insights',
    section: 'Library',
    icon: Lightbulb,
    iconClass: 'bg-yellow-500/15 text-yellow-400',
  },
  '/settings': {
    title: 'Settings',
    section: 'Account',
    icon: Settings,
    iconClass: 'bg-white/10 text-white/50',
  },
}

export function getRouteMeta(pathname: string): RouteMeta {
  if (pathname.startsWith('/workout/')) {
    return {
      title: 'Workout',
      section: 'Overview',
      icon: Dumbbell,
      iconClass: 'bg-amber-500/15 text-amber-400',
    }
  }
  return routeMeta[pathname] ?? routeMeta['/']
}
