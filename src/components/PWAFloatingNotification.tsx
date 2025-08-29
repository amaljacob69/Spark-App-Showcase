import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { X, Smartphone, Download } from '@phosphor-icons/react'
import { usePWA } from '@/hooks/usePWA'

export function PWAFloatingNotification() {
  const { isInstalled, isInstallable, isIOS, isAndroid, isMobile, installApp } = usePWA()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Don't show if already installed, dismissed, or not mobile
    if (isInstalled || isDismissed || !isMobile) return

    // Check if user has permanently dismissed
    const permanentlyDismissed = localStorage.getItem('pwa-floating-dismissed')
    if (permanentlyDismissed) return

    // Show notification after a longer delay to not be annoying
    const timer = setTimeout(() => {
      // Only show if user can install (Android with installable or iOS)
      if ((isAndroid && isInstallable) || isIOS) {
        setIsVisible(true)
      }
    }, 15000) // Show after 15 seconds

    return () => clearTimeout(timer)
  }, [isInstalled, isDismissed, isMobile, isAndroid, isInstallable, isIOS])

  const handleInstall = () => {
    installApp()
    setIsVisible(false)
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
    localStorage.setItem('pwa-floating-dismissed', 'true')
  }

  if (!isVisible) return null

  return (
    <div className="fixed top-4 left-4 right-4 z-[60] pointer-events-none">
      <div className="max-w-sm mx-auto pointer-events-auto">
        <div className="bg-gradient-to-r from-accent to-accent/90 text-accent-foreground rounded-lg shadow-lg p-3 animate-in slide-in-from-top-8 duration-500 pwa-floating-glow">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <Smartphone size={20} className="pwa-phone-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {isIOS ? '📱 Add to Home Screen' : '📥 Install App'}
              </p>
              <p className="text-xs opacity-90 truncate">
                {isIOS ? 'Quick access from home screen' : 'Faster & offline-ready'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                onClick={handleInstall}
                className="h-7 px-2 text-xs bg-white/20 hover:bg-white/30 text-accent-foreground border-0"
              >
                {isIOS ? '📖' : <Download size={12} />}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="h-7 w-7 p-0 hover:bg-white/20 text-accent-foreground"
              >
                <X size={12} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}