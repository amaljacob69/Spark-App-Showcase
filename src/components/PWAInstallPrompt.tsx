import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { X, Download, Smartphone, Wifi, WifiSlash, ShareNetwork, Plus } from '@phosphor-icons/react'
import { usePWA } from '@/hooks/usePWA'
import { IOSInstallInstructions } from './IOSInstallInstructions'
import { SparkleButton } from './SparkleButton'
import { toast } from 'sonner'

// Platform detection utilities
const detectPlatform = () => {
  const userAgent = navigator.userAgent.toLowerCase()
  const isIOS = /iphone|ipad|ipod/.test(userAgent)
  const isAndroid = /android/.test(userAgent)
  const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent)
  const isChrome = /chrome/.test(userAgent)
  
  return {
    isIOS,
    isAndroid,
    isSafari,
    isChrome,
    isMobile: isIOS || isAndroid
  }
}

export function PWAInstallPrompt() {
  const { isInstalled, isInstallable, isOnline, isIOS, isAndroid, installApp, updateAvailable, updateApp } = usePWA()
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [showIOSInstructions, setShowIOSInstructions] = useState(false)
  const [platform] = useState(detectPlatform())

  // Show install prompt after user has interacted with the app
  useEffect(() => {
    // Check if user has already dismissed permanently
    const permanentlyDismissed = localStorage.getItem('pwa-install-dismissed')
    
    if ((isInstallable || platform.isIOS) && !isInstalled && !dismissed && !permanentlyDismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true)
      }, 8000) // Show after 8 seconds

      return () => clearTimeout(timer)
    }
  }, [isInstallable, isInstalled, dismissed, platform.isIOS])

  const handleInstall = async () => {
    if (platform.isAndroid && isInstallable) {
      await installApp()
      setShowPrompt(false)
    } else if (platform.isIOS) {
      // Show detailed iOS instructions
      setShowIOSInstructions(true)
    } else {
      await installApp()
      setShowPrompt(false)
    }
  }

  const handleDismiss = (permanent = false) => {
    setDismissed(true)
    setShowPrompt(false)
    
    if (permanent) {
      localStorage.setItem('pwa-install-dismissed', 'true')
      toast.info('You can always install from your browser menu later')
    } else {
      toast.info('Install prompt will show again next time')
    }
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
    // Android install prompt
    if (platform.isAndroid && isInstallable) {
      return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-8 duration-500">
          <Card className="border-accent/30 bg-card/98 backdrop-blur-md shadow-2xl pwa-install-bounce">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center gap-3 text-base font-semibold">
                  <div className="relative">
                    <Smartphone size={20} className="text-accent pwa-phone-wiggle" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  Install Paradise Restaurant
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 -mt-1 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDismiss(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-foreground font-medium">
                  🎉 Install our app for the best experience!
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Get faster loading, offline menu access, and native Android experience. One tap to install!
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="secondary" className="text-xs justify-center py-1 pwa-badge-float">
                  ⚡ Lightning Fast
                </Badge>
                <Badge variant="secondary" className="text-xs justify-center py-1 pwa-badge-float-delayed">
                  📱 Native Feel
                </Badge>
                <Badge variant="secondary" className="text-xs justify-center py-1 pwa-badge-float">
                  🔄 Works Offline
                </Badge>
                <Badge variant="secondary" className="text-xs justify-center py-1 pwa-badge-float-delayed">
                  🍽️ Quick Access
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <SparkleButton className="flex-1">
                  <Button
                    onClick={handleInstall}
                    className="w-full bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-accent-foreground font-semibold pwa-install-button"
                  >
                    <Download size={16} className="mr-2 pwa-download-bounce" />
                    Install Now
                  </Button>
                </SparkleButton>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDismiss(true)}
                  className="px-3"
                >
                  Never
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }
    
    // iOS install prompt  
    if (platform.isIOS) {
      return (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-8 duration-500">
          <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50/95 to-white/98 backdrop-blur-md shadow-2xl pwa-install-bounce">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="flex items-center gap-3 text-base font-semibold text-blue-900">
                  <div className="relative">
                    <Smartphone size={20} className="text-blue-600 pwa-phone-wiggle" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  Add to Home Screen
                </CardTitle>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 -mt-1 hover:bg-red-100 hover:text-red-600"
                  onClick={() => handleDismiss(false)}
                >
                  <X size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-blue-900 font-medium">
                  🍎 Add Paradise Restaurant to your iPhone!
                </p>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Install our app for faster access and a native iOS experience. Follow these simple steps:
                </p>
              </div>
              
              <div className="bg-white/60 rounded-lg p-3 space-y-2 border border-blue-100">
                <div className="flex items-center gap-3 text-xs text-blue-800">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">1</div>
                  <span>Tap the <ShareNetwork size={14} className="inline pwa-share-bounce text-blue-600" /> Share button below</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-blue-800">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">2</div>
                  <span>Select "Add to Home Screen" <Plus size={14} className="inline pwa-plus-spin text-blue-600" /></span>
                </div>
                <div className="flex items-center gap-3 text-xs text-blue-800">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center font-semibold text-blue-600">3</div>
                  <span>Tap "Add" to install! 🎉</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <Badge variant="secondary" className="text-xs justify-center py-1 bg-blue-50 text-blue-700 border-blue-200 pwa-badge-float">
                  ⚡ iOS Native
                </Badge>
                <Badge variant="secondary" className="text-xs justify-center py-1 bg-blue-50 text-blue-700 border-blue-200 pwa-badge-float-delayed">
                  📱 Home Screen
                </Badge>
                <Badge variant="secondary" className="text-xs justify-center py-1 bg-blue-50 text-blue-700 border-blue-200 pwa-badge-float">
                  🔄 Works Offline
                </Badge>
                <Badge variant="secondary" className="text-xs justify-center py-1 bg-blue-50 text-blue-700 border-blue-200 pwa-badge-float-delayed">
                  🍽️ Quick Access
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <SparkleButton className="flex-1">
                  <Button
                    onClick={handleInstall}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold pwa-install-button"
                  >
                    <ShareNetwork size={16} className="mr-2 pwa-share-bounce" />
                    Show Instructions
                  </Button>
                </SparkleButton>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDismiss(true)}
                  className="px-3 border-blue-200 hover:bg-blue-50"
                >
                  Later
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* iOS Instructions Dialog */}
          <IOSInstallInstructions
            open={showIOSInstructions}
            onOpenChange={setShowIOSInstructions}
          />
        </div>
      )
    }
    
    // Generic/Desktop install prompt
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-8 duration-500">
        <Card className="border-accent/20 bg-card/95 backdrop-blur-sm shadow-lg pwa-install-bounce">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Smartphone size={16} className="text-accent pwa-phone-wiggle" />
                Install Paradise Restaurant
              </CardTitle>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 -mt-1"
                onClick={() => handleDismiss(false)}
              >
                <X size={14} />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <p className="text-xs text-muted-foreground">
              Install our app for faster access, offline menu viewing, and a better experience.
            </p>
            
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary" className="text-xs pwa-badge-float">
                ⚡ Faster Loading
              </Badge>
              <Badge variant="secondary" className="text-xs pwa-badge-float-delayed">
                📱 Native Feel  
              </Badge>
              <Badge variant="secondary" className="text-xs pwa-badge-float">
                🔄 Offline Menu
              </Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleInstall}
                className="flex-1 pwa-install-button"
              >
                <Download size={14} className="mr-2 pwa-download-bounce" />
                Install App
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDismiss(true)}
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