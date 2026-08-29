import React, { useState } from 'react'
import { Moon, Sun, Bed, Clock, TrendingUp, Plus, Calendar, Zap } from 'lucide-react'
import { useAppStore } from '../store/appStore'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

export default function Recovery() {
  const { user, sleepRecords, addSleepRecord } = useAppStore()
  const [showLogModal, setShowLogModal] = useState(false)
  const [newSleep, setNewSleep] = useState({
    bedtime: '23:00',
    wakeTime: '07:00',
    duration: 8,
    quality: 'good' as const
  })

  // Generate mock sleep data if none exists
  const mockSleepData = sleepRecords.length > 0 ? sleepRecords : [
    { id: '1', date: '2024-08-22', bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 'good' },
    { id: '2', date: '2024-08-23', bedtime: '23:30', wakeTime: '07:00', duration: 7.5, quality: 'good' },
    { id: '3', date: '2024-08-24', bedtime: '00:00', wakeTime: '07:30', duration: 7.5, quality: 'fair' },
    { id: '4', date: '2024-08-25', bedtime: '22:30', wakeTime: '06:30', duration: 8, quality: 'excellent' },
    { id: '5', date: '2024-08-26', bedtime: '23:00', wakeTime: '07:00', duration: 8, quality: 'good' },
    { id: '6', date: '2024-08-27', bedtime: '23:15', wakeTime: '07:00', duration: 7.75, quality: 'good' },
    { id: '7', date: '2024-08-28', bedtime: '00:00', wakeTime: '07:30', duration: 7.5, quality: 'fair' },
  ]

  const chartData = mockSleepData.map((record: any) => ({
    day: new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' }),
    hours: record.duration,
    quality: record.quality === 'excellent' ? 4 : record.quality === 'good' ? 3 : record.quality === 'fair' ? 2 : 1
  }))

  const avgSleep = mockSleepData.reduce((sum: number, r: any) => sum + r.duration, 0) / mockSleepData.length
  const avgBedtime = mockSleepData[mockSleepData.length - 1]?.bedtime || '23:00'
  const avgWakeTime = mockSleepData[mockSleepData.length - 1]?.wakeTime || '07:00'

  const handleLogSleep = () => {
    const record = {
      id: `sleep_${Date.now()}`,
      userId: user?.id || '',
      date: new Date().toISOString().split('T')[0],
      bedtime: newSleep.bedtime,
      wakeTime: newSleep.wakeTime,
      duration: newSleep.duration,
      quality: newSleep.quality,
    }
    addSleepRecord(record)
    setShowLogModal(false)
  }

  const qualityColors: Record<string, string> = {
    excellent: 'text-accent-success',
    good: 'text-accent-primary',
    fair: 'text-accent-warning',
    poor: 'text-accent-danger'
  }

  return (
    <div className="p-4 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Sleep & Recovery</h1>
          <p className="text-white/60">Track your rest and recovery patterns</p>
        </div>
        <button
          onClick={() => setShowLogModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg font-medium flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Sleep
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent-primary/20 text-accent-primary">
              <Moon className="w-5 h-5" />
            </div>
            <span className="text-sm text-white/60">Avg Sleep</span>
          </div>
          <div className="text-2xl font-bold">{avgSleep.toFixed(1)}h</div>
          <div className="text-sm text-white/60">per night</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent-secondary/20 text-accent-secondary">
              <Bed className="w-5 h-5" />
            </div>
            <span className="text-sm text-white/60">Avg Bedtime</span>
          </div>
          <div className="text-2xl font-bold">{avgBedtime}</div>
          <div className="text-sm text-white/60">last week</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent-warning/20 text-accent-warning">
              <Sun className="w-5 h-5" />
            </div>
            <span className="text-sm text-white/60">Avg Wake</span>
          </div>
          <div className="text-2xl font-bold">{avgWakeTime}</div>
          <div className="text-sm text-white/60">last week</div>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent-success/20 text-accent-success">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-sm text-white/60">Quality Trend</span>
          </div>
          <div className="text-2xl font-bold">Stable</div>
          <div className="text-sm text-white/60">past 7 days</div>
        </div>
      </div>

      {/* Sleep Chart */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
        <h2 className="text-xl font-bold mb-6">Weekly Sleep Pattern</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#666"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[5, 10]}
                ticks={[5, 6, 7, 8, 9, 10]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #262626',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: '#fff' }}
              />
              <Area
                type="monotone"
                dataKey="hours"
                stroke="#6366f1"
                strokeWidth={2}
                fill="url(#sleepGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recovery Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tips */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Recovery Tips for Students</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent-primary/20 rounded-lg">
                <Zap className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Consistent Sleep Schedule</h3>
                <p className="text-sm text-white/60">Try to go to bed and wake up at the same time every day, even on weekends.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent-secondary/20 rounded-lg">
                <Moon className="w-5 h-5 text-accent-secondary" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Limit Screen Time</h3>
                <p className="text-sm text-white/60">Avoid screens 30 minutes before bed for better sleep quality.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-accent-success/20 rounded-lg">
                <Calendar className="w-5 h-5 text-accent-success" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Active Recovery</h3>
                <p className="text-sm text-white/60">Light walking or stretching on rest days helps recovery without adding stress.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Goal */}
        <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Sleep Goal</h2>
          <div className="bg-dark-elevated rounded-xl p-6 text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#262626"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#6366f1"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(avgSleep / 8) * 352} 352`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-2xl font-bold">{Math.round((avgSleep / 8) * 100)}%</div>
                  <div className="text-xs text-white/60">of goal</div>
                </div>
              </div>
            </div>
            <h3 className="font-bold text-lg mb-1">8 Hours/night</h3>
            <p className="text-white/60">Your target sleep duration</p>
          </div>
        </div>
      </div>

      {/* Sleep Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-surface border border-dark-border rounded-2xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-6">Log Last Night's Sleep</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Bedtime</label>
                <input
                  type="time"
                  value={newSleep.bedtime}
                  onChange={(e) => setNewSleep({ ...newSleep, bedtime: e.target.value })}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Wake time</label>
                <input
                  type="time"
                  value={newSleep.wakeTime}
                  onChange={(e) => setNewSleep({ ...newSleep, wakeTime: e.target.value })}
                  className="w-full bg-dark-elevated border border-dark-border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Sleep quality</label>
                <div className="grid grid-cols-4 gap-2">
                  {['poor', 'fair', 'good', 'excellent'].map((q) => (
                    <button
                      key={q}
                      onClick={() => setNewSleep({ ...newSleep, quality: q as any })}
                      className={`
                        py-2 rounded-lg text-sm font-medium transition-colors capitalize
                        ${newSleep.quality === q
                          ? 'bg-accent-primary text-white'
                          : 'bg-dark-elevated border border-dark-border hover:bg-dark-hover'
                        }
                      `}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowLogModal(false)}
                className="flex-1 px-4 py-3 border border-dark-border hover:bg-dark-hover rounded-lg font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogSleep}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-lg font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}