/**
 * Global Error Handler for Production
 * Provides graceful error handling and user feedback
 */

import config from '../config/environment'

interface ErrorReport {
  message: string
  stack?: string
  url: string
  timestamp: number
  userAgent: string
  userId?: string
  sessionId: string
  additionalInfo?: Record<string, any>
}

class GlobalErrorHandler {
  private sessionId: string
  private errorQueue: ErrorReport[] = []
  private isInitialized: boolean = false

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  private initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return
    }

    // Global error handler
    window.addEventListener('error', this.handleError.bind(this))
    
    // Promise rejection handler
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this))
    
    // React error boundary fallback
    window.addEventListener('react-error', this.handleReactError.bind(this))

    this.isInitialized = true
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private handleError(event: ErrorEvent): void {
    try {
      const errorReport: ErrorReport = {
        message: event.message || 'Unknown error',
        stack: event.error?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      }

      this.reportError(errorReport)
    } catch (reportingError) {
      console.error('Error reporting failed:', reportingError)
    }
  }

  private handlePromiseRejection(event: PromiseRejectionEvent): void {
    try {
      const errorReport: ErrorReport = {
        message: `Promise rejection: ${event.reason?.message || event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        additionalInfo: {
          type: 'promise_rejection',
          reason: event.reason
        }
      }

      this.reportError(errorReport)
      
      // Prevent the default browser behavior
      event.preventDefault()
    } catch (reportingError) {
      console.error('Promise rejection reporting failed:', reportingError)
    }
  }

  private handleReactError(event: CustomEvent): void {
    try {
      const { error, errorInfo } = event.detail
      
      const errorReport: ErrorReport = {
        message: `React error: ${error?.message || 'React component error'}`,
        stack: error?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        additionalInfo: {
          type: 'react_error',
          errorInfo,
          componentStack: errorInfo?.componentStack
        }
      }

      this.reportError(errorReport)
    } catch (reportingError) {
      console.error('React error reporting failed:', reportingError)
    }
  }

  private reportError(errorReport: ErrorReport): void {
    // Always log to console in development
    if (config.app.environment === 'development') {
      console.error('Error Report:', errorReport)
      return
    }

    // In production, queue errors for batched reporting
    if (config.features.enableErrorReporting) {
      this.errorQueue.push(errorReport)
      
      // Process queue with debouncing
      this.processErrorQueue()
    }
  }

  private processErrorQueue = this.debounce((): void => {
    if (this.errorQueue.length === 0) {
      return
    }

    try {
      // In a real implementation, send to error reporting service
      // For now, just log and clear the queue
      console.warn(`Processed ${this.errorQueue.length} error reports`)
      
      // Clear processed errors
      this.errorQueue = []
    } catch (error) {
      console.error('Error queue processing failed:', error)
    }
  }, 2000)

  private debounce(func: Function, wait: number): () => void {
    let timeout: NodeJS.Timeout | null = null
    
    return (): void => {
      if (timeout) {
        clearTimeout(timeout)
      }
      
      timeout = setTimeout(func, wait)
    }
  }

  public captureException(error: Error, additionalInfo?: Record<string, any>): void {
    try {
      const errorReport: ErrorReport = {
        message: error.message || 'Manual exception capture',
        stack: error.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId,
        additionalInfo: {
          ...additionalInfo,
          type: 'manual_capture'
        }
      }

      this.reportError(errorReport)
    } catch (reportingError) {
      console.error('Manual exception capture failed:', reportingError)
    }
  }

  public setUserId(userId: string): void {
    // This would be called after user authentication
    // For now, we'll just store it for future error reports
    try {
      sessionStorage.setItem('error-handler-user-id', userId)
    } catch (error) {
      console.warn('Could not store user ID for error reporting:', error)
    }
  }

  public getSessionInfo(): { sessionId: string; timestamp: number } {
    return {
      sessionId: this.sessionId,
      timestamp: Date.now()
    }
  }
}

// Create global instance
const globalErrorHandler = new GlobalErrorHandler()

// Export for manual error capturing
export const captureException = (error: Error, additionalInfo?: Record<string, any>) => {
  globalErrorHandler.captureException(error, additionalInfo)
}

export const setUserId = (userId: string) => {
  globalErrorHandler.setUserId(userId)
}

export const getSessionInfo = () => {
  return globalErrorHandler.getSessionInfo()
}

// Initialize immediately
export default globalErrorHandler