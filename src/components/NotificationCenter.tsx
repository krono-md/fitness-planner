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
    <div className="absolute right-0 top-full mt-2 w-80 bg-dark-panel border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <p className="text-2xs text-accent-primary font-medium">{unreadCount} unread</p>
            )}
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 hover:bg-white/[0.05] rounded-lg text-white/40 hover:text-white/70 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Notifications List */}
      <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
        {notifications.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 bg-dark-elevated rounded-full flex items-center justify-center mx-auto mb-3">
              <Bell className="w-6 h-6 text-white/20" />
            </div>
            <p className="text-[13px] text-white/50">All caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => {
            const isRead = notification.read
            const config = typeConfig[notification.type] ?? typeConfig.completion
            return (
              <div
                key={notification.id}
                onClick={() => markNotificationRead(notification.id)}
                className={`p-3 rounded-xl border transition-all group ${
                  isRead
                    ? 'bg-dark-elevated border-dark-border hover:bg-dark-hover'
                    : 'bg-accent-primary/[0.06] border-accent-primary/20 hover:bg-accent-primary/[0.09]'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${config.tile}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`font-semibold text-[13px] leading-tight ${isRead ? 'text-white/80' : 'text-white'}`}>
                        {notification.title}
                      </h4>
                      <span className={`text-2xs flex-shrink-0 ${isRead ? 'text-white/40' : 'text-accent-primary'}`}>
                        {new Date(notification.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={`text-[12px] mt-0.5 line-clamp-2 leading-relaxed ${isRead ? 'text-white/50' : 'text-white/70'}`}>
                      {notification.message}
                    </p>
                    {!isRead && <div className="w-1.5 h-1.5 bg-accent-primary rounded-full mt-2" />}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-white/[0.06] bg-dark-elevated">
          <button
            onClick={clearNotifications}
            className="w-full py-2 text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.05] rounded-lg transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
