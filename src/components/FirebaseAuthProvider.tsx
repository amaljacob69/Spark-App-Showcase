import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from 'firebase/auth'
import { auth, onAuthStateChange, checkAdminAccess } from '../lib/firebase'
import { LoadingSpinner } from './ui/loading-spinner'

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface FirebaseAuthProviderProps {
  children: ReactNode
}

export function FirebaseAuthProvider({ children }: FirebaseAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user)
      
      if (user) {
        // Check if user is admin
        const adminAccess = await checkAdminAccess(user.email || '')
        setIsAdmin(adminAccess)
      } else {
        setIsAdmin(false)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

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

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseAuthProvider')
  }
  return context
}