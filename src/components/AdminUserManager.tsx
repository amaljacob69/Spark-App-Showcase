import { useState, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Trash2, UserPlus, Shield, AlertCircle } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { addAdminUser, removeAdminUser, getAdminUsers, type AdminUser } from '../lib/firebase'
import { useAuth } from './FirebaseAuthProvider'

interface AdminUserManagerProps {
  onClose: () => void
}

export function AdminUserManager({ onClose }: AdminUserManagerProps) {
  const { user } = useAuth()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingUsers, setLoadingUsers] = useState(true)

  useEffect(() => {
    loadAdminUsers()
  }, [])

  const loadAdminUsers = async () => {
    try {
      setLoadingUsers(true)
      const users = await getAdminUsers()
      setAdminUsers(users)
    } catch (error) {
      console.error('Failed to load admin users:', error)
      toast.error('Failed to load admin users')
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminEmail.trim()) return

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newAdminEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    try {
      setLoading(true)
      await addAdminUser(newAdminEmail.toLowerCase().trim())
      toast.success(`Added ${newAdminEmail} as admin`)
      setNewAdminEmail('')
      await loadAdminUsers()
    } catch (error) {
      console.error('Failed to add admin user:', error)
      toast.error('Failed to add admin user')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveAdmin = async (email: string) => {
    if (email === user?.email) {
      toast.error("You cannot remove yourself as admin")
      return
    }

    try {
      await removeAdminUser(email)
      toast.success(`Removed ${email} as admin`)
      await loadAdminUsers()
    } catch (error) {
      console.error('Failed to remove admin user:', error)
      toast.error('Failed to remove admin user')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Admin User Management
              </CardTitle>
              <CardDescription>
                Manage who has admin access to the restaurant menu system
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Add New Admin Form */}
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                className="flex-1"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !newAdminEmail.trim()}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin
              </Button>
            </div>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p>The user must first sign in with Google at least once before being granted admin access.</p>
                <p className="mt-1">Admin users can add/edit/delete menu items and manage other admins.</p>
              </div>
            </div>
          </form>

          {/* Current Admin Users List */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Current Admin Users ({adminUsers.length})
            </h3>
            
            {loadingUsers ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading admin users...
              </div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No admin users found
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {adminUsers.map((admin) => (
                  <div
                    key={admin.email}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <Shield className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium">{admin.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Added {admin.addedAt.toLocaleDateString()}
                          {admin.email === user?.email && (
                            <span className="ml-2 text-primary">(You)</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={admin.isActive ? "default" : "secondary"}>
                        {admin.isActive ? "Active" : "Inactive"}
                      </Badge>
                      {admin.email !== user?.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAdmin(admin.email)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Firebase Console Instructions */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Alternative: Firebase Console Method
            </h3>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p>You can also add admin users directly through the Firebase Console:</p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Go to <a href="https://console.firebase.google.com/project/paradise-family/firestore" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Firebase Console → Firestore</a></li>
                <li>Navigate to the <code className="bg-muted px-1 rounded">admins</code> collection</li>
                <li>Click "Add document"</li>
                <li>Set Document ID to the user's email address</li>
                <li>Add fields:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li><code className="bg-muted px-1 rounded">email</code> (string): User's email</li>
                    <li><code className="bg-muted px-1 rounded">isActive</code> (boolean): true</li>
                    <li><code className="bg-muted px-1 rounded">addedAt</code> (timestamp): Current date</li>
                  </ul>
                </li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}