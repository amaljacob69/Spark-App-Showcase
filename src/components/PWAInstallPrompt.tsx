import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { X, Download, Smartphone, Wifi, WifiSlash } from '@phosphor-icons/react'
import { usePWA } from '@/hooks/usePWA'
import { toast } from 'sonner'

export function PWAInstallPrompt() {
  const { isInstalled, isInstallable, isOnline, installApp, updateAvailable, updateApp } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Show install prompt after user has interacted with the app
  useEffect(() => {
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 10000) // Show after 10 seconds

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled, dismissed])

  const handleInstall = async () => {
    await installApp()
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setDismissed(true)
    setShowPrompt(false)
    toast.info('You can install the app later from your browser menu')
  }

  const handleUpdate = async () => {
    await updateApp()
  }

  // Show update notification
  if (updateAvailable) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <Card className="border-primary/20 bg-card/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Download size={16} className="text-primary" />
              App Update Available
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-muted-foreground">
              A new version of Paradise Restaurant app is available with improvements and new features.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleUpdate}
                className="flex-1"
              >
                Update Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Show install prompt
  if (showPrompt && !isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm">
        <Card className="border-accent/20 bg-card/95 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Smartphone size={16} className="text-accent" />
                Install Paradise Restaurant
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 -mt-1"
                onClick={handleDismiss}
              >
                <X size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-muted-foreground">
              Install our app for faster access, offline menu viewing, and a better ordering experience.
            </p>
            
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs">
                ⚡ Faster Loading
              </Badge>
              <Badge variant="secondary" className="text-xs">
                📱 Native Feel
              </Badge>
              <Badge variant="secondary" className="text-xs">
                🔄 Offline Menu
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="flex-1"
              >
                <Download size={14} className="mr-2" />
                Install App
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleDismiss}
              >
                Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

export function PWAStatusIndicator() {
  const { isInstalled, isOnline } = usePWA()

  if (!isInstalled) return null

  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="flex items-center gap-2">
        {/* Online/Offline indicator */}
        <Badge 
          variant={isOnline ? "default" : "secondary"}
          className={`text-xs ${
            isOnline 
              ? "bg-green-100 text-green-800 border-green-200" 
              : "bg-red-100 text-red-800 border-red-200"
          }`}
        >
          {isOnline ? (
            <>
              <Wifi size={12} className="mr-1" />
              Online
            </>
          ) : (
            <>
              <WifiSlash size={12} className="mr-1" />
              Offline
            </>
          )}
        </Badge>

        {/* PWA indicator */}
        <Badge variant="outline" className="text-xs">
          <Smartphone size={12} className="mr-1" />
          PWA
        </Badge>
      </div>
    </div>
  )
}