import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner'

interface PWAInstallPrompt extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: PWAInstallPrompt
  }
}

export interface PWAHookReturn {
  isInstalled: boolean
  isInstallable: boolean
  isOnline: boolean
  isIOS: boolean
  isAndroid: boolean
  isMobile: boolean
  installApp: () => Promise<void>
  updateAvailable: boolean
  updateApp: () => Promise<void>
}

export function usePWA(): PWAHookReturn {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  
  // Platform detection
  const [platform] = useState(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    const isMobile = isIOS || isAndroid
    
    return { isIOS, isAndroid, isMobile }
  })

  // Check if app is already installed
  useEffect(() => {
    const checkInstalled = () => {
      // Check if running in standalone mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches
      const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches
      
      // Check for iOS Safari standalone mode
      const isIOSStandalone = (window.navigator as any).standalone === true
      
      setIsInstalled(isStandalone || isFullscreen || isMinimalUI || isIOSStandalone)
    }

    checkInstalled()
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    mediaQuery.addEventListener('change', checkInstalled)
    
    return () => mediaQuery.removeEventListener('change', checkInstalled)
  }, [])

  // Handle install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: PWAInstallPrompt) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
      
      // Show subtle notification about installability
      setTimeout(() => {
        if (!isInstalled) {
          toast.info('📱 Install Paradise Restaurant app for a better experience!', {
            duration: 5000,
            action: {
              label: 'Install',
              onClick: () => installApp()
            }
          })
        }
      }, 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [isInstalled])

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      toast.success('🟢 Back online! All features available')
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('🔴 Offline mode - Limited features available')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Handle service worker registration and updates
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          setRegistration(reg)
          
          // Check for updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setUpdateAvailable(true)
                  toast.info('🔄 App update available!', {
                    duration: 10000,
                    action: {
                      label: 'Update',
                      onClick: () => updateApp()
                    }
                  })
                }
              })
            }
          })
          
          // Listen for messages from service worker
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (event.data && event.data.type === 'CACHE_UPDATED') {
              toast.success('📦 Menu cached for offline viewing')
            }
          })
        })
        .catch((error) => {
          console.warn('Service worker registration failed:', error)
        })
    }
  }, [])

  const installApp = useCallback(async () => {
    // Handle iOS install instructions
    if (platform.isIOS) {
      const isInSafari = /safari/.test(navigator.userAgent.toLowerCase()) && !/chrome|crios|fxios/.test(navigator.userAgent.toLowerCase())
      
      if (isInSafari) {
        toast.success('🍎 Install Instructions', {
          description: '1. Tap the Share button (📤)\n2. Scroll and tap "Add to Home Screen"\n3. Tap "Add" to install!',
          duration: 10000,
        })
      } else {
        toast.info('📱 To install on iOS:', {
          description: 'Please open this website in Safari browser, then follow the installation steps.',
          duration: 8000,
        })
      }
      return
    }
    
    // Handle Android/Chrome install
    if (!installPrompt) {
      if (platform.isAndroid) {
        toast.info('📱 To install on Android:', {
          description: 'Open Chrome browser → Menu (⋮) → "Add to Home screen"',
          duration: 8000,
        })
      } else {
        toast.error('Installation not available on this browser')
      }
      return
    }

    try {
      await installPrompt.prompt()
      const { outcome } = await installPrompt.userChoice
      
      if (outcome === 'accepted') {
        toast.success('🎉 Paradise Restaurant app installed successfully!', {
          description: 'You can now access the app from your home screen!',
          duration: 5000,
        })
        setIsInstallable(false)
        setInstallPrompt(null)
      } else {
        toast.info('Installation cancelled - you can install anytime later!')
      }
    } catch (error) {
      console.error('Installation failed:', error)
      toast.error('Installation failed. Please try again or use your browser menu.')
    }
  }, [installPrompt, platform])

  const updateApp = useCallback(async () => {
    if (!registration) return

    try {
      if (registration.waiting) {
        // Tell the waiting service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        
        // Listen for the new service worker to take control
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          window.location.reload()
        })
        
        toast.success('🔄 Updating app...')
      }
    } catch (error) {
      console.error('Update failed:', error)
      toast.error('Update failed. Please refresh the page.')
    }
  }, [registration])

  return {
    isInstalled,
    isInstallable,
    isOnline,
    isIOS: platform.isIOS,
    isAndroid: platform.isAndroid,
    isMobile: platform.isMobile,
    installApp,
    updateAvailable,
    updateApp
  }
}