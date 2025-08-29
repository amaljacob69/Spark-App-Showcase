/**
 * Production analytics and monitoring
 */

import config from '../config/environment'
import performanceMonitor from './performance'

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
}

class Analytics {
  private sessionId: string
  private userId?: string
  private eventQueue: AnalyticsEvent[] = []
  private isEnabled: boolean = config.features.enableAnalytics

  constructor() {
    this.sessionId = this.generateSessionId()
    
    if (this.isEnabled) {
      this.initializeAnalytics()
    }
  }

  private initializeAnalytics(): void {
    // Track page views
    this.trackPageView()
    
    // Track user engagement
    this.trackUserEngagement()
    
    // Track performance metrics
    this.trackPerformanceMetrics()
    
    // Flush events periodically
    this.scheduleEventFlush()
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private trackPageView(): void {
    this.track('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title,
      userAgent: navigator.userAgent
    })
  }

  private trackUserEngagement(): void {
    let startTime = Date.now()
    let isActive = true
    
    // Track time on page
    const trackTimeOnPage = () => {
      if (isActive) {
        const timeSpent = Date.now() - startTime
        this.track('time_on_page', { duration: timeSpent })
      }
    }
    
    // Track when user becomes active/inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        isActive = false
        trackTimeOnPage()
      } else {
        isActive = true
        startTime = Date.now()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('beforeunload', trackTimeOnPage)
    
    // Track scroll depth
    let maxScrollPercent = 0
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      )
      
      if (scrollPercent > maxScrollPercent) {
        maxScrollPercent = scrollPercent
        
        // Track milestones
        if ([25, 50, 75, 100].includes(scrollPercent)) {
          this.track('scroll_depth', { percent: scrollPercent })
        }
      }
    }
    
    window.addEventListener('scroll', trackScrollDepth, { passive: true })
  }

  private trackPerformanceMetrics(): void {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (entry.entryType === 'largest-contentful-paint') {
            this.track('core_web_vital', {
              metric: 'LCP',
              value: entry.startTime,
              rating: entry.startTime <= 2500 ? 'good' : entry.startTime <= 4000 ? 'needs_improvement' : 'poor'
            })
          } else if (entry.entryType === 'first-input') {
            this.track('core_web_vital', {
              metric: 'FID',
              value: entry.processingStart - entry.startTime,
              rating: entry.processingStart - entry.startTime <= 100 ? 'good' : 
                     entry.processingStart - entry.startTime <= 300 ? 'needs_improvement' : 'poor'
            })
          }
        })
      })
      
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
      } catch (e) {
        console.warn('Performance observer not fully supported')
      }
    }
  }

  private scheduleEventFlush(): void {
    // Flush events every 30 seconds
    setInterval(() => {
      this.flushEvents()
    }, 30000)
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flushEvents()
    })
  }

  public track(eventName: string, properties?: Record<string, any>): void {
    if (!this.isEnabled) return
    
    const event: AnalyticsEvent = {
      name: eventName,
      properties,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    this.eventQueue.push(event)
    
    // If queue is getting large, flush immediately
    if (this.eventQueue.length >= 50) {
      this.flushEvents()
    }
  }

  public identify(userId: string, traits?: Record<string, any>): void {
    if (!this.isEnabled) return
    
    this.userId = userId
    this.track('identify', { userId, traits })
  }

  public trackMenuInteraction(action: string, menuType: string, itemId?: string): void {
    this.track('menu_interaction', {
      action,
      menu_type: menuType,
      item_id: itemId
    })
  }

  public trackSearch(query: string, resultsCount: number): void {
    this.track('search', {
      query: query.toLowerCase(),
      results_count: resultsCount,
      has_results: resultsCount > 0
    })
  }

  public trackError(error: string, context?: Record<string, any>): void {
    this.track('error', {
      error_message: error,
      context,
      url: window.location.href
    })
  }

  public trackCartAction(action: string, itemId?: string, quantity?: number): void {
    this.track('cart_action', {
      action,
      item_id: itemId,
      quantity
    })
  }

  public trackAdminAction(action: string, details?: Record<string, any>): void {
    this.track('admin_action', {
      action,
      details
    })
  }

  private async flushEvents(): Promise<void> {
    if (this.eventQueue.length === 0) return
    
    const eventsToSend = [...this.eventQueue]
    this.eventQueue = []
    
    try {
      // In production, send to your analytics service
      // For now, just log to console in development
      if (config.app.environment === 'development') {
        console.log('Analytics Events:', eventsToSend)
      }
      
      // Example: Send to Google Analytics 4
      // if (window.gtag) {
      //   eventsToSend.forEach(event => {
      //     window.gtag('event', event.name, event.properties)
      //   })
      // }
      
      // Example: Send to custom endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventsToSend)
      // })
      
    } catch (error) {
      console.error('Failed to send analytics events:', error)
      
      // Re-queue events if sending failed
      this.eventQueue.unshift(...eventsToSend)
    }
  }

  public getAnalyticsReport(): {
    sessionId: string
    userId?: string
    queuedEvents: number
    isEnabled: boolean
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      queuedEvents: this.eventQueue.length,
      isEnabled: this.isEnabled
    }
  }

  public setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
    
    if (!enabled) {
      this.eventQueue = []
    }
  }

  public clearQueue(): void {
    this.eventQueue = []
  }
}

// Create singleton instance
const analytics = new Analytics()

export default analytics

// React hook for analytics
export const useAnalytics = () => {
  return {
    track: analytics.track.bind(analytics),
    identify: analytics.identify.bind(analytics),
    trackMenuInteraction: analytics.trackMenuInteraction.bind(analytics),
    trackSearch: analytics.trackSearch.bind(analytics),
    trackError: analytics.trackError.bind(analytics),
    trackCartAction: analytics.trackCartAction.bind(analytics),
    trackAdminAction: analytics.trackAdminAction.bind(analytics)
  }
}