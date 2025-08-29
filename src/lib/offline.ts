/**
 * Offline Support and Service Worker Management
 */

import config from '../config/environment'

interface CacheEntry {
  data: any
  timestamp: number
  expiry?: number
}

class OfflineManager {
  private isOnline: boolean = navigator.onLine
  private cacheName: string = `paradise-restaurant-v${config.app.version}`
  private syncQueue: Array<{ action: string; data: any; timestamp: number }> = []

  constructor() {
    if (config.features.enableOfflineMode) {
      this.initializeOfflineSupport()
    }
  }

  /**
   * Initialize offline support
   */
  private initializeOfflineSupport(): void {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this))
    window.addEventListener('offline', this.handleOffline.bind(this))
    
    // Register service worker if supported
    if ('serviceWorker' in navigator) {
      this.registerServiceWorker()
    }
    
    // Initialize cache cleanup
    this.scheduleCleanup()
  }

  /**
   * Register service worker
   */
  private async registerServiceWorker(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })
      
      console.log('Service Worker registered successfully:', registration.scope)
      
      // Listen for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Show update available notification
              this.notifyUpdate()
            }
          })
        }
      })
      
    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  /**
   * Handle coming back online
   */
  private handleOnline(): void {
    console.log('App is online')
    this.isOnline = true
    
    // Sync queued changes
    this.syncQueuedChanges()
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('app:online'))
  }

  /**
   * Handle going offline
   */
  private handleOffline(): void {
    console.log('App is offline')
    this.isOnline = false
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('app:offline'))
  }

  /**
   * Check if app is online
   */
  isAppOnline(): boolean {
    return this.isOnline
  }

  /**
   * Cache data with expiry
   */
  async cacheData(key: string, data: any, expiryMinutes: number = 60): Promise<void> {
    try {
      const entry: CacheEntry = {
        data,
        timestamp: Date.now(),
        expiry: expiryMinutes > 0 ? Date.now() + (expiryMinutes * 60 * 1000) : undefined
      }
      
      localStorage.setItem(`cache_${key}`, JSON.stringify(entry))
    } catch (error) {
      console.error('Failed to cache data:', error)
    }
  }

  /**
   * Get cached data
   */
  getCachedData(key: string): any | null {
    try {
      const cached = localStorage.getItem(`cache_${key}`)
      if (!cached) return null
      
      const entry: CacheEntry = JSON.parse(cached)
      
      // Check if expired
      if (entry.expiry && Date.now() > entry.expiry) {
        localStorage.removeItem(`cache_${key}`)
        return null
      }
      
      return entry.data
    } catch (error) {
      console.error('Failed to get cached data:', error)
      return null
    }
  }

  /**
   * Queue action for sync when online
   */
  queueForSync(action: string, data: any): void {
    const queueItem = {
      action,
      data,
      timestamp: Date.now()
    }
    
    this.syncQueue.push(queueItem)
    
    // Try to persist in localStorage
    try {
      localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue))
    } catch (error) {
      console.error('Failed to persist sync queue:', error)
    }
  }

  /**
   * Sync queued changes when back online
   */
  private async syncQueuedChanges(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return
    
    console.log(`Syncing ${this.syncQueue.length} queued changes`)
    
    const queue = [...this.syncQueue]
    this.syncQueue = []
    
    try {
      localStorage.removeItem('sync_queue')
    } catch (error) {
      console.error('Failed to clear sync queue:', error)
    }
    
    for (const item of queue) {
      try {
        await this.processSyncItem(item)
      } catch (error) {
        console.error('Failed to sync item:', error)
        // Re-queue failed items
        this.queueForSync(item.action, item.data)
      }
    }
  }

  /**
   * Process individual sync item
   */
  private async processSyncItem(item: { action: string; data: any; timestamp: number }): Promise<void> {
    switch (item.action) {
      case 'menu_update':
        // Handle menu updates
        window.dispatchEvent(new CustomEvent('sync:menu_update', { detail: item.data }))
        break
      case 'analytics_event':
        // Handle analytics events
        this.sendAnalyticsEvent(item.data)
        break
      default:
        console.warn('Unknown sync action:', item.action)
    }
  }

  /**
   * Send analytics event
   */
  private sendAnalyticsEvent(eventData: any): void {
    // Implement analytics sending logic
    console.log('Sending analytics event:', eventData)
  }

  /**
   * Clear expired cache entries
   */
  private clearExpiredCache(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('cache_'))
    
    for (const key of keys) {
      try {
        const cached = localStorage.getItem(key)
        if (cached) {
          const entry: CacheEntry = JSON.parse(cached)
          if (entry.expiry && Date.now() > entry.expiry) {
            localStorage.removeItem(key)
          }
        }
      } catch (error) {
        // Remove corrupted cache entries
        localStorage.removeItem(key)
      }
    }
  }

  /**
   * Schedule periodic cleanup
   */
  private scheduleCleanup(): void {
    // Clean up every 5 minutes
    setInterval(() => {
      this.clearExpiredCache()
    }, 5 * 60 * 1000)
  }

  /**
   * Notify about app update
   */
  private notifyUpdate(): void {
    window.dispatchEvent(new CustomEvent('app:update-available'))
  }

  /**
   * Load sync queue from localStorage
   */
  loadSyncQueue(): void {
    try {
      const saved = localStorage.getItem('sync_queue')
      if (saved) {
        this.syncQueue = JSON.parse(saved)
        
        // Remove old items (older than 24 hours)
        const dayAgo = Date.now() - (24 * 60 * 60 * 1000)
        this.syncQueue = this.syncQueue.filter(item => item.timestamp > dayAgo)
        
        localStorage.setItem('sync_queue', JSON.stringify(this.syncQueue))
      }
    } catch (error) {
      console.error('Failed to load sync queue:', error)
      this.syncQueue = []
    }
  }

  /**
   * Get offline status info
   */
  getOfflineStatus(): {
    isOnline: boolean
    queuedItems: number
    cachedItemsCount: number
    lastSyncTime?: number
  } {
    const cachedItems = Object.keys(localStorage)
      .filter(key => key.startsWith('cache_'))
      .length
    
    return {
      isOnline: this.isOnline,
      queuedItems: this.syncQueue.length,
      cachedItemsCount: cachedItems,
      lastSyncTime: this.syncQueue.length > 0 
        ? Math.max(...this.syncQueue.map(item => item.timestamp))
        : undefined
    }
  }

  /**
   * Force sync
   */
  async forcSync(): Promise<void> {
    if (this.isOnline) {
      await this.syncQueuedChanges()
    } else {
      throw new Error('Cannot sync while offline')
    }
  }

  /**
   * Clear all offline data
   */
  clearOfflineData(): void {
    // Clear cache
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('cache_') || key === 'sync_queue'
    )
    
    for (const key of keys) {
      localStorage.removeItem(key)
    }
    
    // Clear sync queue
    this.syncQueue = []
  }
}

// Create singleton instance
const offlineManager = new OfflineManager()

// Load existing sync queue on startup
offlineManager.loadSyncQueue()

export default offlineManager

// React hook for offline status
import { useState, useEffect } from 'react'

export const useOfflineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])
  
  return {
    isOnline,
    offlineStatus: offlineManager.getOfflineStatus()
  }
}