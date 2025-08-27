import { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { LoadingSpinner } from './ui/loading-spinner'

interface FirebaseAuthProviderProps {
  children: ReactNode
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <LoadingSpinner className="h-8 w-8" />
          <p className="text-muted-foreground text-sm">Loading authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}