import { WorkoutSession, UserProfile, DailyAdaptation } from '../types'

export class AdaptiveEngine {
  /**
   * Analyzes user behavior patterns and generates adaptation suggestions
   */
  static analyzePatterns(
    sessions: WorkoutSession[],
    profile: UserProfile
  ): DailyAdaptation[] {
    const adaptations: DailyAdaptation[] = []

    // Analyze skip patterns
    const skipPattern = this.detectSkipPattern(sessions)
    if (skipPattern) {
      adaptations.push({
        userId: profile.id,
        date: new Date().toISOString().split('T')[0],
        adaptationType: 'skip_pattern',
        reason: `You've skipped ${skipPattern.count} workouts on ${skipPattern.day}s recently`,
        suggestion: `Move ${skipPattern.day} workouts to ${skipPattern.suggestedDay}?`,
        applied: false
      })
    }

    // Analyze difficulty feedback
    const difficultyPattern = this.detectDifficultyPattern(sessions)
    if (difficultyPattern) {
      adaptations.push({
        userId: profile.id,
        date: new Date().toISOString().split('T')[0],
        adaptationType: 'difficulty_adjustment',
        reason: `Recent workouts rated as "${difficultyPattern.rating}"`,
        suggestion: difficultyPattern.suggestion,
        applied: false
      })
    }

    // Analyze time constraints
    const timePattern = this.detectTimePattern(sessions, profile)
    if (timePattern) {
      adaptations.push({
        userId: profile.id,
        date: new Date().toISOString().split('T')[0],
        adaptationType: 'schedule_conflict',
        reason: timePattern.reason,
        suggestion: timePattern.suggestion,
        applied: false
      })
    }

    return adaptations
  }

  /**
   * Detects if user consistently skips workouts on specific days
   */
  private static detectSkipPattern(sessions: WorkoutSession[]): {
    day: string
    count: number
    suggestedDay: string
  } | null {
    const daySkipCount: Record<string, number> = {}

    sessions.forEach(session => {
      if (!session.completed && session.rescheduledFrom) {
        const day = new Date(session.date).toLocaleDateString('en-US', { weekday: 'long' })
        daySkipCount[day] = (daySkipCount[day] || 0) + 1
      }
    })

    // Find day with most skips
    let maxSkipDay = ''
    let maxSkipCount = 0
    Object.entries(daySkipCount).forEach(([day, count]) => {
      if (count > maxSkipCount && count >= 2) {
        maxSkipDay = day
        maxSkipCount = count
      }
    })

    if (maxSkipDay && maxSkipCount >= 2) {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      const currentIndex = days.indexOf(maxSkipDay)
      const suggestedDay = days[(currentIndex + 2) % 7]

      return {
        day: maxSkipDay,
        count: maxSkipCount,
        suggestedDay
      }
    }

    return null
  }

  /**
   * Detects if workouts are consistently rated as too hard or too easy
   */
  private static detectDifficultyPattern(sessions: WorkoutSession[]): {
    rating: string
    suggestion: string
  } | null {
    const recentSessions = sessions.slice(-5)
    if (recentSessions.length < 3) return null

    const hardCount = recentSessions.filter(s => s.difficulty === 'hard' || s.difficulty === 'very_hard').length
    const easyCount = recentSessions.filter(s => s.difficulty === 'too_easy' || s.difficulty === 'easy').length

    if (hardCount >= 3) {
      return {
        rating: 'too hard',
        suggestion: 'Reduce workout intensity or increase rest time between sets'
      }
    }

    if (easyCount >= 3) {
      return {
        rating: 'too easy',
        suggestion: 'Increase workout intensity or add more challenging exercises'
      }
    }

    return null
  }

  /**
   * Detects time-based patterns that suggest schedule conflicts
   */
  private static detectTimePattern(
    sessions: WorkoutSession[],
    profile: UserProfile
  ): { reason: string; suggestion: string } | null {
    // Check if user has inconsistent schedule preference
    if (profile.scheduleChangesFrequently) {
      const avgDuration = sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length

      if (avgDuration < 20 && profile.availableTimePerSession !== '10-15') {
        return {
          reason: 'Workouts are shorter than planned time availability',
          suggestion: 'Would you like shorter, more focused workout sessions?'
        }
      }
    }

    return null
  }

  /**
   * Generates personalized recommendations based on user data
   */
  static generateRecommendations(
    sessions: WorkoutSession[],
    profile: UserProfile
  ): string[] {
    const recommendations: string[] = []

    const completedCount = sessions.filter(s => s.completed).length
    const totalSessions = sessions.length || 1
    const completionRate = completedCount / totalSessions

    if (completionRate < 0.5) {
      recommendations.push('Consider reducing workout frequency to build consistency')
    } else if (completionRate > 0.9) {
      recommendations.push('Great consistency! Ready to increase workout intensity?')
    }

    if (profile.averageSleep < 7) {
      recommendations.push('Your sleep is below recommended levels. Consider adjusting your schedule')
    }

    if (profile.stressLevel === 'high') {
      recommendations.push('High stress detected. Recovery days might help')
    }

    const recentDays = sessions.slice(-7)
    const activeDays = new Set(recentDays.map(s => s.date)).size
    if (activeDays < 3) {
      recommendations.push('Try to maintain at least 3 active days per week')
    }

    return recommendations
  }

  /**
   * Calculates optimal workout time based on user patterns
   */
  static suggestOptimalTime(
    sessions: WorkoutSession[],
    profile: UserProfile
  ): { startTime: string; endTime: string; reason: string } | null {
    if (profile.morningVsEvening === 'morning') {
      return {
        startTime: '06:30',
        endTime: '07:30',
        reason: 'Based on your morning preference'
      }
    }

    if (profile.morningVsEvening === 'evening') {
      return {
        startTime: '18:00',
        endTime: '19:00',
        reason: 'Based on your evening preference'
      }
    }

    // Analyze actual workout times if available
    const workoutTimes = sessions
      .filter(s => s.startTime)
      .map(s => s.startTime!)

    if (workoutTimes.length > 0) {
      // Find most common time range
      const hourCounts: Record<number, number> = {}
      workoutTimes.forEach(time => {
        const hour = parseInt(time.split(':')[0])
        hourCounts[hour] = (hourCounts[hour] || 0) + 1
      })

      let mostCommonHour = 18
      let maxCount = 0
      Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxCount) {
          mostCommonHour = parseInt(hour)
          maxCount = count
        }
      })

      return {
        startTime: `${mostCommonHour}:00`,
        endTime: `${mostCommonHour + 1}:00`,
        reason: 'Based on your workout history'
      }
    }

    return null
  }
}
