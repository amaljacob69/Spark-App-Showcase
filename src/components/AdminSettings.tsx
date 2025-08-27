import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Settings, Users, Shield } from '@phosphor-icons/react'
import { AdminUserManager } from './AdminUserManager'
import { useAuth } from './FirebaseAuthProvider'

interface AdminSettingsProps {
  onClose: () => void
}

export function AdminSettings({ onClose }: AdminSettingsProps) {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState<'overview' | 'users'>('overview')

  if (activeSection === 'users') {
    return <AdminUserManager onClose={() => setActiveSection('overview')} />
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Admin Settings
              </CardTitle>
              <CardDescription>
                Manage administrative settings and user access
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Current Admin Info */}
          <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <p className="font-medium">Logged in as Admin</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Badge className="ml-auto">Admin</Badge>
          </div>

          {/* Settings Options */}
          <div className="grid gap-4">
            <Button
              variant="outline"
              className="justify-start h-auto p-4"
              onClick={() => setActiveSection('users')}
            >
              <div className="flex items-center gap-3 w-full">
                <Users className="h-5 w-5" />
                <div className="text-left">
                  <p className="font-medium">Manage Admin Users</p>
                  <p className="text-sm text-muted-foreground">
                    Add or remove users who can access the admin panel
                  </p>
                </div>
              </div>
            </Button>
          </div>

          {/* Quick Instructions */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
              Quick Setup Guide
            </h3>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p><strong>To add admin users:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Click "Manage Admin Users" above</li>
                <li>Enter the user's email address</li>
                <li>The user must sign in with Google first</li>
                <li>They'll then have admin access to manage the menu</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}