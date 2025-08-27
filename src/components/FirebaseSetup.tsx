import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { Badge } from './ui/badge'
import { useAuth } from './FirebaseAuthProvider'
import { addAdminUser } from '../lib/firebase'
import { toast } from 'sonner'
import { Shield, Plus, Check, X } from '@phosphor-icons/react'

const INITIAL_ADMINS = [
  'your-email@gmail.com', // Replace with your actual admin email
]

export function FirebaseSetup() {
  const { user, isAdmin } = useAuth()
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAddAdmin = async () => {
    if (!newAdminEmail.trim()) {
      toast.error('Please enter an email address')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAdminEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    try {
      await addAdminUser(newAdminEmail.trim())
      toast.success(`Added ${newAdminEmail} as admin`)
      setNewAdminEmail('')
    } catch (error) {
      console.error('Error adding admin:', error)
      toast.error('Failed to add admin user')
    } finally {
      setIsLoading(false)
    }
  }

  const setupInitialAdmins = async () => {
    setIsLoading(true)
    try {
      for (const email of INITIAL_ADMINS) {
        await addAdminUser(email)
      }
      toast.success('Initial admin users setup complete')
    } catch (error) {
      console.error('Error setting up initial admins:', error)
      toast.error('Failed to setup initial admin users')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Firebase Setup
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Please sign in with Google to access Firebase setup options.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Firebase Authentication Setup
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge variant={user ? "default" : "secondary"}>
              {user ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
              Authentication
            </Badge>
            <span className="text-sm text-muted-foreground">
              {user ? `Signed in as ${user.displayName || user.email}` : 'Not signed in'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? <Check className="h-3 w-3 mr-1" /> : <X className="h-3 w-3 mr-1" />}
              Admin Access
            </Badge>
            <span className="text-sm text-muted-foreground">
              {isAdmin ? 'Admin privileges granted' : 'No admin privileges'}
            </span>
          </div>
        </CardContent>
      </Card>

      {user && (
        <Card>
          <CardHeader>
            <CardTitle>Admin User Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                <strong>Important:</strong> Only add trusted users as admins. Admin users can:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Add, edit, and delete menu items</li>
                  <li>Manage restaurant menu data</li>
                  <li>Access all admin features</li>
                </ul>
              </AlertDescription>
            </Alert>

            {!isAdmin && (
              <Alert>
                <AlertDescription>
                  You need admin privileges to manage other admin users. 
                  <br />
                  Contact your system administrator to be granted admin access.
                </AlertDescription>
              </Alert>
            )}

            {isAdmin && (
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="Enter email address for new admin"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddAdmin()}
                  />
                  <Button 
                    onClick={handleAddAdmin} 
                    disabled={isLoading}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Admin
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Quick Setup</h4>
                  <Button 
                    variant="outline" 
                    onClick={setupInitialAdmins}
                    disabled={isLoading}
                  >
                    Setup Initial Admin Users
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    This will add predefined admin users to the system.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Firebase Configuration Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Project ID:</strong>
              <br />
              <code className="text-xs bg-muted px-1 rounded">paradise-family</code>
            </div>
            <div>
              <strong>Auth Domain:</strong>
              <br />
              <code className="text-xs bg-muted px-1 rounded">paradise-family.firebaseapp.com</code>
            </div>
            <div>
              <strong>Hosting URLs:</strong>
              <br />
              <code className="text-xs bg-muted px-1 rounded">paradise-family.web.app</code>
              <br />
              <code className="text-xs bg-muted px-1 rounded">paradise-family.firebaseapp.com</code>
            </div>
            <div>
              <strong>Authentication:</strong>
              <br />
              <Badge variant="default" className="text-xs">
                <Check className="h-3 w-3 mr-1" />
                Google Sign-In Enabled
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}