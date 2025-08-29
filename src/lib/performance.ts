/**
 * Performance monitoring and optimization utilities
 */

import config from '../config/environment'

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
}

interface ComponentPerformance {
  name: string
  renderTime: number
  rerenderCount: number
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = []
  private componentMetrics: Map<string, ComponentPerformance> = new Map()
  private isMonitoring: boolean = config.features.enablePerformanceMonitoring

  constructor() {
    if (this.isMonitoring && typeof window !== 'undefined') {
      this.initializeWebVitals()
      this.initializeNavigationTiming()
    }
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private initializeWebVitals(): void {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.recordMetric('LCP', lastEntry.startTime)
      })
      
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      } catch (e) {
        console.warn('LCP monitoring not supported')
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          this.recordMetric('FID', entry.processingStart - entry.startTime)
        })
      })
      
      try {
        fidObserver.observe({ entryTypes: ['first-input'] })
      } catch (e) {
        console.warn('FID monitoring not supported')
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0
      const clsObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.recordMetric('CLS', clsValue)
          }
        })
      })
      
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] })
      } catch (e) {
        console.warn('CLS monitoring not supported')
      }
    }
  }

  /**
   * Initialize Navigation Timing monitoring
   */
  private initializeNavigationTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
          
          if (navigation) {
            this.recordMetric('DNS_LOOKUP', navigation.domainLookupEnd - navigation.domainLookupStart)
            this.recordMetric('TCP_CONNECT', navigation.connectEnd - navigation.connectStart)
            this.recordMetric('REQUEST_RESPONSE', navigation.responseEnd - navigation.requestStart)
            this.recordMetric('DOM_CONTENT_LOADED', navigation.domContentLoadedEventEnd - navigation.navigationStart)
            this.recordMetric('LOAD_COMPLETE', navigation.loadEventEnd - navigation.navigationStart)
          }
        }, 0)
      })
    }
  }

  /**
   * Record a performance metric
   */
  recordMetric(name: string, value: number): void {
    if (!this.isMonitoring) return

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now()
    }

    this.metrics.push(metric)

    // Keep only recent metrics (last 100)
    if (this.metrics.length > 100) {
      this.metrics = this.metrics.slice(-100)
    }

    // Log important metrics in development
    if (config.app.environment === 'development') {
      console.log(`Performance Metric: ${name} = ${value.toFixed(2)}ms`)
    }
  }

  /**
   * Start timing a component render
   */
  startComponentTiming(componentName: string): () => void {
    if (!this.isMonitoring) return () => {}

    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      const existing = this.componentMetrics.get(componentName) || {
        name: componentName,
        renderTime: 0,
        rerenderCount: 0
      }
      
      existing.renderTime = renderTime
      existing.rerenderCount += 1
      
      this.componentMetrics.set(componentName, existing)
      
      // Warn about slow renders in development
      if (config.app.environment === 'development' && renderTime > 16) {
        console.warn(`Slow render detected: ${componentName} took ${renderTime.toFixed(2)}ms`)
      }
    }
  }

  /**
   * Measure function execution time
   */
  measureFunction<T>(name: string, fn: () => T): T {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    this.recordMetric(name, end - start)
    return result
  }

  /**
   * Measure async function execution time
   */
  async measureAsyncFunction<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    this.recordMetric(name, end - start)
    return result
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    metrics: PerformanceMetric[]
    components: ComponentPerformance[]
    summary: {
      averageLoadTime: number
      slowestComponents: ComponentPerformance[]
      recentMetrics: PerformanceMetric[]
    }
  } {
    const components = Array.from(this.componentMetrics.values())
    const slowestComponents = components
      .sort((a, b) => b.renderTime - a.renderTime)
      .slice(0, 5)

    const loadMetrics = this.metrics.filter(m => m.name === 'LOAD_COMPLETE')
    const averageLoadTime = loadMetrics.length > 0
      ? loadMetrics.reduce((sum, m) => sum + m.value, 0) / loadMetrics.length
      : 0

    const recentMetrics = this.metrics.slice(-20)

    return {
      metrics: this.metrics,
      components,
      summary: {
        averageLoadTime,
        slowestComponents,
        recentMetrics
      }
    }
  }

  /**
   * Monitor memory usage
   */
  getMemoryUsage(): any {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        usagePercentage: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2)
      }
    }
    return null
  }

  /**
   * Check if app performance is degraded
   */
  isPerformanceDegraded(): boolean {
    const report = this.getPerformanceReport()
    
    // Check if load time is too high
    if (report.summary.averageLoadTime > 5000) return true
    
    // Check if too many components are slow
    const slowComponents = report.components.filter(c => c.renderTime > 50)
    if (slowComponents.length > 5) return true
    
    // Check memory usage
    const memory = this.getMemoryUsage()
    if (memory && parseFloat(memory.usagePercentage) > 80) return true
    
    return false
  }

  /**
   * Get optimization suggestions
   */
  getOptimizationSuggestions(): string[] {
    const suggestions: string[] = []
    const report = this.getPerformanceReport()
    
    if (report.summary.averageLoadTime > 3000) {
      suggestions.push('Consider implementing code splitting to reduce initial bundle size')
    }
    
    const slowComponents = report.components.filter(c => c.renderTime > 16)
    if (slowComponents.length > 0) {
      suggestions.push(`Optimize slow components: ${slowComponents.map(c => c.name).join(', ')}`)
    }
    
    const memory = this.getMemoryUsage()
    if (memory && parseFloat(memory.usagePercentage) > 70) {
      suggestions.push('Monitor memory usage - consider implementing virtualization for large lists')
    }
    
    const recentCLS = this.metrics.filter(m => m.name === 'CLS').slice(-5)
    if (recentCLS.some(m => m.value > 0.1)) {
      suggestions.push('Reduce Cumulative Layout Shift by setting image dimensions and avoiding dynamic content')
    }
    
    return suggestions
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = []
    this.componentMetrics.clear()
  }

  /**
   * Enable/disable monitoring
   */
  setMonitoring(enabled: boolean): void {
    this.isMonitoring = enabled
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor()

// React hook for component performance monitoring
export const usePerformanceMonitoring = (componentName: string) => {
  if (!config.features.enablePerformanceMonitoring) {
    return { startTiming: () => () => {}, isEnabled: false }
  }

  const startTiming = () => performanceMonitor.startComponentTiming(componentName)
  
  return {
    startTiming,
    isEnabled: true
  }
}

export default performanceMonitor