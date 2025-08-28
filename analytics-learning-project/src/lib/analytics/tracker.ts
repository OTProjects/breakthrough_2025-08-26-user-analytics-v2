import { AnalyticsEvent, EventName, EventPropertiesMap } from './event-schema'
import { generateSessionId, hashEmail } from './utils'

class AnalyticsTracker {
  private sessionId: string
  private events: AnalyticsEvent[] = []
  
  constructor() {
    this.sessionId = generateSessionId()
    this.trackAppOpen()
  }

  private createBaseProperties() {
    return {
      timestamp: new Date().toISOString(),
      session_id: this.sessionId,
      page_url: typeof window !== 'undefined' ? window.location.href : ''
    }
  }

  track<T extends EventName>(
    eventName: T, 
    properties: EventPropertiesMap[T]
  ): void {
    const event = {
      event: eventName,
      ...this.createBaseProperties(),
      properties
    } as AnalyticsEvent

    this.events.push(event)
    
    // Log to console for Phase 1 verification
    console.log('📊 Analytics Event:', event)
    
    // In Phase 2, we'll also store to database
    this.persistEvent(event)
  }

  private trackAppOpen(): void {
    if (typeof window !== 'undefined') {
      this.track('app_open', {
        referrer: document.referrer,
        user_agent: navigator.userAgent
      })
    }
  }

  private persistEvent(event: AnalyticsEvent): void {
    // Phase 1: localStorage for immediate verification
    try {
      const stored = localStorage.getItem('analytics_events') || '[]'
      const events = JSON.parse(stored)
      events.push(event)
      localStorage.setItem('analytics_events', JSON.stringify(events))
    } catch (error) {
      console.error('Failed to persist to localStorage:', error)
    }

    // Phase 2: Also persist to database via API
    if (typeof window !== 'undefined') {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      }).catch(error => {
        console.error('Failed to persist to database:', error)
      })
    }
  }

  getEvents(): AnalyticsEvent[] {
    return [...this.events]
  }

  getStoredEvents(): AnalyticsEvent[] {
    try {
      const stored = localStorage.getItem('analytics_events') || '[]'
      return JSON.parse(stored)
    } catch {
      return []
    }
  }

  clearEvents(): void {
    this.events = []
    localStorage.removeItem('analytics_events')
  }
}

// Singleton instance
let tracker: AnalyticsTracker | null = null

export function getTracker(): AnalyticsTracker {
  if (!tracker) {
    tracker = new AnalyticsTracker()
  }
  return tracker
}

// Convenience function for easier usage
export function track<T extends EventName>(
  eventName: T, 
  properties: EventPropertiesMap[T]
): void {
  getTracker().track(eventName, properties)
}