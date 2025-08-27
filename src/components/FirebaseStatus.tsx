import { useState, useEffect } from 'react'
import { Badge } from './ui/badge'
import { Wifi, WifiOff } from '@phosphor-icons/react'

interface FirebaseStatusProps {
  loading: boolean
  error: string | null
}

export const FirebaseStatus: React.FC<FirebaseStatusProps> = ({ loading, error }) => {
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    // Only show status if there's an error or during initial loading
    setShowStatus(loading || !!error)
    
    // Hide after 5 seconds if no error
    if (!error && !loading) {
      const timer = setTimeout(() => setShowStatus(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [loading, error])

  if (!showStatus) return null

  return (
    <div className="fixed top-4 right-4 z-50">
      <Badge 
        variant={error ? "destructive" : loading ? "secondary" : "default"}
        className="flex items-center gap-2"
      >
        {error ? (
          <>
            <WifiOff size={16} />
            Offline Mode
          </>
        ) : loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wifi size={16} />
            Connected
          </>
        )}
      </Badge>
    </div>
  )
}