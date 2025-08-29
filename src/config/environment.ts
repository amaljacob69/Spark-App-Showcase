/**
 * Environment Configuration
 * Centralized configuration for production deployment
 */

export interface AppConfig {
  app: {
    name: string
    version: string
    environment: 'development' | 'staging' | 'production'
    baseUrl: string
  }
  restaurant: {
    name: string
    phone: string
    address: string
    placeId: string
    coordinates: {
      lat: number
      lng: number
    }
    hours: string
    socialMedia: {
      instagram: string
      googleBusiness: string
    }
  }
  features: {
    enableAnalytics: boolean
    enableErrorReporting: boolean
    enablePerformanceMonitoring: boolean
    maxMenuItems: number
    maxImageSize: number // MB
    enableOfflineMode: boolean
  }
  security: {
    sessionTimeout: number // minutes
    maxLoginAttempts: number
    rateLimitWindow: number // seconds
  }
}

export const config: AppConfig = {
  app: {
    name: 'Paradise Family Restaurant & Bake Shop',
    version: '2.0.0',
    environment: (import.meta.env.MODE as 'development' | 'staging' | 'production') || 'production',
    baseUrl: import.meta.env.VITE_APP_BASE_URL || 'https://paradise-family.web.app'
  },
  restaurant: {
    name: 'Paradise Family Restaurant & Bake Shop',
    phone: '+91-XXX-XXX-XXXX', // Update with actual phone number
    address: 'Chalakudy, Kerala, India',
    placeId: 'ChIJGcnxTmwCCDsRbR1By6fYbFc',
    coordinates: {
      lat: 10.311468467596864,
      lng: 76.3343773754989
    },
    hours: 'Mo-Su 08:00-22:00',
    socialMedia: {
      instagram: 'https://www.instagram.com/explore/locations/1026441532/chalakudy-paradise-restaurant/',
      googleBusiness: `https://www.google.com/maps/place/?q=place_id:ChIJGcnxTmwCCDsRbR1By6fYbFc`
    }
  },
  features: {
    enableAnalytics: true,
    enableErrorReporting: true,
    enablePerformanceMonitoring: true,
    maxMenuItems: 500,
    maxImageSize: 5, // 5MB max per image
    enableOfflineMode: true
  },
  security: {
    sessionTimeout: 30, // 30 minutes
    maxLoginAttempts: 3,
    rateLimitWindow: 60 // 1 minute
  }
}

// Environment-specific overrides
if (config.app.environment === 'development') {
  config.features.enableAnalytics = false
  config.features.enableErrorReporting = false
}

export default config