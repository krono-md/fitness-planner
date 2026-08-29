import React from 'react'
import { Bell, X, Zap, Clock, CheckCircle, Flame, Target } from 'lucide-react'
import { useAppStore } from '../store/appStore'

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
}

export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const { notifications, markNotificationRead, clearNotifications } = useAppStore()

  if (!open) return null

  const unreadCount = notifications.filter(n => !n.read).length

  const typeConfig: Record<string, { icon: React.ReactNode; tile: string }> = {
    workout_reminder: { icon: <Clock className="w-3.5 h-3.5" />, tile: 'bg-indigo-500/15 text-indigo-400' },
    streak: { icon: <Flame className="w-3.5 h-3.5" />, tile: 'bg-amber-500/15 text-amber-400' },
    achievement: { icon: <CheckCircle className="w-3.5 h-3.5" />, tile: 'bg-emerald-500/15 text-emerald-400' },
    plan_adjustment: { icon: <Zap className="w-3.5 h-3.5" />, tile: 'bg-violet-500/15 text-violet-400' },
    completion: { icon: <Target className="w-3.5 h-3.5" />, tile: 'bg-sky-500/15 text-sky-400' },
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="flex-1 bg-black/65 backdrop-blur-[2px]" onClick={onClose} />

      <div className="w-full sm:w-[360px] bg-dark-surface border-l border-white/[0.06] h-full shadow-large flex flex-col max-w-full animate-slide-up">
        <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="whop-icon-tile w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold">Notifications</h2>
              {unreadCount > 0 && (
                <p className="text-2xs text-accent-primary font-medium">{unreadCount} unread</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-white/[0.05] rounded-lg text-white/40 hover:text-white/70">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {notifications.length === 0 ? (
            <div className="text-center py-16 text-white/30">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-25" />
              <p className="text-[13px]">All caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isRead = notification.read
              const config = typeConfig[notification.type] ?? typeConfig.completion
              return (
                <div
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isRead
                      ? 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                      : 'bg-accent-primary/[0.04] border-accent-primary/15 hover:bg-accent-primary/[0.07]'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={`whop-icon-tile w-7 h-7 rounded-lg flex-shrink-0 ${config.tile}`}>
                      {config.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-[13px] leading-tight">{notification.title}</h4>
                        <span className="text-2xs text-white/30 flex-shrink-0">
                          {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-[12px] text-white/50 mt-0.5 line-clamp-2 leading-relaxed">{notification.message}</p>
                      {!isRead && <div className="w-1.5 h-1.5 bg-accent-primary rounded-full mt-1.5" />}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="p-3 border-t border-white/[0.06]">
          <button
            onClick={clearNotifications}
            className="w-full py-2.5 text-2xs font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.04] rounded-xl transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}
