/**
 * Global error handler for unhandled promise rejections and errors
 */

import { toast } from 'sonner'
import config from '../config/environment'

class GlobalErrorHandler {
  private errorCount: number = 0
  private lastErrorTime: number = 0
  private maxErrorsPerMinute: number = 10

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeErrorHandling()
    }
  }

  private initializeErrorHandling(): void {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection.bind(this))
    
    // Handle global JavaScript errors
    window.addEventListener('error', this.handleGlobalError.bind(this))
    
    // Handle resource loading errors
    window.addEventListener('error', this.handleResourceError.bind(this), true)
  }

  private handleUnhandledRejection(event: PromiseRejectionEvent): void {
    console.error('Unhandled promise rejection:', event.reason)
    
    this.logError({
      type: 'unhandled_promise_rejection',
      message: event.reason?.message || 'Unhandled promise rejection',
      stack: event.reason?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    })

    // Prevent the default browser console error
    event.preventDefault()

    // Show user-friendly error message
    if (this.shouldShowErrorToUser()) {
      toast.error('Something went wrong. Please try refreshing the page.')
    }
  }

  private handleGlobalError(event: ErrorEvent): void {
    console.error('Global error:', event.error)
    
    this.logError({
      type: 'global_error',
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      stack: event.error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href
    })

    if (this.shouldShowErrorToUser()) {
      toast.error('An unexpected error occurred. Please try again.')
    }
  }

  private handleResourceError(event: Event): void {
    const target = event.target as HTMLElement
    
    if (target && (target.tagName === 'IMG' || target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
      console.warn('Resource failed to load:', target)
      
      this.logError({
        type: 'resource_error',
        message: `Failed to load ${target.tagName.toLowerCase()}`,
        resource: (target as any).src || (target as any).href,
        timestamp: new Date().toISOString(),
        url: window.location.href
      })

      // Don't show toast for resource errors as they're usually not critical
    }
  }

  private shouldShowErrorToUser(): boolean {
    const now = Date.now()
    
    // Reset error count every minute
    if (now - this.lastErrorTime > 60000) {
      this.errorCount = 0
    }
    
    this.errorCount++
    this.lastErrorTime = now
    
    // Don't spam the user with error messages
    return this.errorCount <= this.maxErrorsPerMinute
  }

  private logError(errorInfo: any): void {
    if (config.features.enableErrorReporting) {
      // In production, send to error reporting service
      // For now, just log to console
      console.error('Production Error:', errorInfo)
      
      // You could send to services like:
      // - Sentry: Sentry.captureException(errorInfo)
      // - LogRocket: LogRocket.captureException(errorInfo)
      // - Custom analytics endpoint
    }
  }

  public reportError(error: Error, context?: any): void {
    this.logError({
      type: 'manual_report',
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
      url: window.location.href
    })
  }
}

// Create and initialize global error handler
const globalErrorHandler = new GlobalErrorHandler()

export default globalErrorHandler