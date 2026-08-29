import React from 'react'
import { Bell, X, ChevronRight, Zap, Clock, CheckCircle, Flame, Target } from 'lucide-react'
import { useAppStore } from '../store/appStore'

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
}

export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const { notifications, markNotificationRead } = useAppStore()

  if (!open) return null

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="w-96 bg-dark-surface border-l border-dark-border h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-dark-border flex items-center justify-between bg-dark-surface">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent-primary/20 rounded-lg">
              <Bell className="w-5 h-5 text-accent-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Notifications</h2>
              {unreadCount > 0 && (
                <span className="text-xs text-accent-primary font-medium">{unreadCount} unread</span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-dark-hover rounded-lg transition-colors">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>All caught up!</p>
            </div>
          ) : (
            notifications.map((notification) => {
              const isRead = notification.read
              return (
                <div
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`
                    p-4 rounded-xl border transition-all cursor-pointer
                    ${isRead
                      ? 'bg-dark-elevated border-dark-border hover:bg-dark-hover'
                      : 'bg-accent-primary/5 border-accent-primary/20 hover:bg-accent-primary/10'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg mt-1 ${
                      notification.type === 'workout_reminder' ? 'bg-accent-primary/20' :
                      notification.type === 'streak' ? 'bg-accent-warning/20' :
                      notification.type === 'achievement' ? 'bg-accent-success/20' :
                      'bg-accent-secondary/20'
                    }`}>
                      {notification.type === 'workout_reminder' && <Clock className="w-4 h-4 text-accent-primary" />}
                      {notification.type === 'streak' && <Flame className="w-4 h-4 text-accent-warning" />}
                      {notification.type === 'achievement' && <CheckCircle className="w-4 h-4 text-accent-success" />}
                      {notification.type === 'plan_adjustment' && <Zap className="w-4 h-4 text-accent-secondary" />}
                      {notification.type === 'completion' && <Target className="w-4 h-4 text-accent-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-white/40">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{notification.message}</p>
                      {!isRead && (
                        <div className="w-2 h-2 bg-accent-primary rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-dark-border">
          <button
            onClick={() => {
              // Clear all notifications
              // Implementation would go here
            }}
            className="w-full py-3 text-sm text-white/60 hover:text-white hover:bg-dark-hover rounded-lg transition-colors"
          >
            Clear all notifications
          </button>
        </div>
      </div>
    </div>
  )
}
