import { useState, useEffect } from 'react'
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  AuthError
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { toast } from 'sonner'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthState(prev => ({
        ...prev,
        user,
        loading: false
      }))
    })

    return unsubscribe
  }, [])

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Welcome!', {
        description: 'Successfully signed in as admin'
      })
      return true
    } catch (error) {
      const authError = error as AuthError
      let errorMessage = 'Failed to sign in'
      
      switch (authError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          errorMessage = 'Invalid email or password'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later.'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.'
          break
        default:
          errorMessage = authError.message || 'Authentication failed'
      }
      
      setAuthState(prev => ({ ...prev, error: errorMessage, loading: false }))
      toast.error('Sign In Failed', {
        description: errorMessage
      })
      return false
    }
  }

  const signOutUser = async (): Promise<void> => {
    setAuthState(prev => ({ ...prev, loading: true }))
    
    try {
      await signOut(auth)
      toast.success('Signed Out', {
        description: 'You have been successfully signed out'
      })
    } catch (error) {
      const authError = error as AuthError
      toast.error('Sign Out Failed', {
        description: authError.message || 'Failed to sign out'
      })
    }
    
    setAuthState(prev => ({ ...prev, loading: false }))
  }

  const isAdmin = authState.user !== null

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    isAdmin,
    signIn,
    signOut: signOutUser
  }
}