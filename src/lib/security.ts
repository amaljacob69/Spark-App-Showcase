/**
 * Security utilities for production deployment
 * Handles authentication, rate limiting, and input sanitization
 */

import { toast } from 'sonner'
import config from '../config/environment'

// Types for security
interface LoginAttempt {
  timestamp: number
  count: number
}

interface RateLimitEntry {
  count: number
  resetTime: number
}

class SecurityManager {
  private loginAttempts: Map<string, LoginAttempt> = new Map()
  private rateLimits: Map<string, RateLimitEntry> = new Map()
  private sessionStartTime: number = Date.now()

  /**
   * Sanitize user input to prevent XSS attacks
   */
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return ''
    
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;')
      .trim()
  }

  /**
   * Validate and sanitize menu item data
   */
  sanitizeMenuItem(item: any): any {
    if (!item || typeof item !== 'object') {
      throw new Error('Invalid menu item data')
    }

    return {
      name: this.sanitizeInput(item.name || ''),
      description: this.sanitizeInput(item.description || ''),
      category: this.sanitizeInput(item.category || ''),
      prices: this.validatePrices(item.prices),
      dietary: Array.isArray(item.dietary) 
        ? item.dietary.map((d: any) => this.sanitizeInput(String(d))).filter(Boolean)
        : [],
      available: Boolean(item.available),
      image: item.image ? this.sanitizeInput(item.image) : undefined
    }
  }

  /**
   * Validate menu item prices
   */
  private validatePrices(prices: any): any {
    if (!prices || typeof prices !== 'object') {
      throw new Error('Invalid price data')
    }

    const validPrices: any = {}
    const menuTypes = ['dinein-non-ac', 'dinein-ac', 'takeaway']

    for (const type of menuTypes) {
      const price = Number(prices[type])
      if (isNaN(price) || price < 0 || price > 10000) {
        throw new Error(`Invalid price for ${type}: ${prices[type]}`)
      }
      validPrices[type] = price
    }

    return validPrices
  }

  /**
   * Check if user has exceeded login attempts
   */
  checkLoginAttempts(identifier: string = 'default'): boolean {
    const now = Date.now()
    const attempt = this.loginAttempts.get(identifier)

    if (!attempt) return true

    // Reset counter after 15 minutes
    if (now - attempt.timestamp > 15 * 60 * 1000) {
      this.loginAttempts.delete(identifier)
      return true
    }

    return attempt.count < config.security.maxLoginAttempts
  }

  /**
   * Record a failed login attempt
   */
  recordLoginAttempt(identifier: string = 'default', success: boolean = false): void {
    const now = Date.now()
    
    if (success) {
      this.loginAttempts.delete(identifier)
      return
    }

    const attempt = this.loginAttempts.get(identifier) || { timestamp: now, count: 0 }
    
    // Reset if more than 15 minutes have passed
    if (now - attempt.timestamp > 15 * 60 * 1000) {
      attempt.count = 0
      attempt.timestamp = now
    }

    attempt.count += 1
    this.loginAttempts.set(identifier, attempt)

    if (attempt.count >= config.security.maxLoginAttempts) {
      toast.error(`Too many login attempts. Please try again in 15 minutes.`)
    }
  }

  /**
   * Rate limiting for API calls
   */
  checkRateLimit(key: string, maxRequests: number = 10): boolean {
    const now = Date.now()
    const windowMs = config.security.rateLimitWindow * 1000

    const entry = this.rateLimits.get(key)

    if (!entry) {
      this.rateLimits.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (now > entry.resetTime) {
      this.rateLimits.set(key, { count: 1, resetTime: now + windowMs })
      return true
    }

    if (entry.count >= maxRequests) {
      return false
    }

    entry.count += 1
    return true
  }

  /**
   * Check if session has expired
   */
  isSessionValid(): boolean {
    const now = Date.now()
    const sessionAge = (now - this.sessionStartTime) / (1000 * 60) // minutes
    return sessionAge < config.security.sessionTimeout
  }

  /**
   * Refresh session timestamp
   */
  refreshSession(): void {
    this.sessionStartTime = Date.now()
  }

  /**
   * Validate password strength (basic check)
   */
  validatePassword(password: string): { valid: boolean; message?: string } {
    if (!password || typeof password !== 'string') {
      return { valid: false, message: 'Password is required' }
    }

    if (password.length < 6) {
      return { valid: false, message: 'Password must be at least 6 characters long' }
    }

    // In production, implement more robust password requirements
    return { valid: true }
  }

  /**
   * Generate secure random string for IDs
   */
  generateSecureId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    
    for (let i = 0; i < array.length; i++) {
      result += chars[array[i] % chars.length]
    }
    
    return result
  }

  /**
   * Hash sensitive data (basic implementation)
   */
  async hashData(data: string): Promise<string> {
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  /**
   * Validate menu operation permissions
   */
  validateMenuOperation(operation: 'create' | 'update' | 'delete', data?: any): boolean {
    // Check rate limiting
    if (!this.checkRateLimit(`menu_${operation}`, 20)) {
      toast.error('Too many requests. Please try again later.')
      return false
    }

    // Validate session
    if (!this.isSessionValid()) {
      toast.error('Session expired. Please log in again.')
      return false
    }

    // Validate data for create/update operations
    if ((operation === 'create' || operation === 'update') && data) {
      try {
        this.sanitizeMenuItem(data)
      } catch (error) {
        toast.error(`Invalid data: ${error instanceof Error ? error.message : 'Unknown error'}`)
        return false
      }
    }

    return true
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now()
    
    // Clean up old login attempts
    for (const [key, attempt] of this.loginAttempts.entries()) {
      if (now - attempt.timestamp > 15 * 60 * 1000) {
        this.loginAttempts.delete(key)
      }
    }

    // Clean up old rate limit entries
    for (const [key, entry] of this.rateLimits.entries()) {
      if (now > entry.resetTime) {
        this.rateLimits.delete(key)
      }
    }
  }
}

// Create singleton instance
const securityManager = new SecurityManager()

// Clean up expired entries every 5 minutes
setInterval(() => {
  securityManager.cleanup()
}, 5 * 60 * 1000)

export default securityManager