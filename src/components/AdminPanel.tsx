import { useState } from 'react'
import { Plus, Gear } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AddItemDialog } from './AddItemDialog'
import { QRCodeManager } from './QRCodeManager'
import { FirebaseSetup } from './FirebaseSetup'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { MenuItem } from '../App'

interface AdminPanelProps {
  onAddItem: (item: Omit<MenuItem, 'id'>) => void
}

export function AdminPanel({ onAddItem }: AdminPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSetupDialog, setShowSetupDialog] = useState(false)

  const handleAddItem = (item: Omit<MenuItem, 'id'>) => {
    onAddItem(item)
    setShowAddDialog(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardHeader>
            <CardTitle className="font-display text-center">Add New Menu Item</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="gap-2"
              size="lg"
            >
              <Plus size={20} />
              Add Item
            </Button>
          </CardContent>
        </Card>

        <Card className="border-dashed border-2 border-muted-foreground/25">
          <CardHeader>
            <CardTitle className="font-display text-center">Firebase Setup</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Dialog open={showSetupDialog} onOpenChange={setShowSetupDialog}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="gap-2"
                  size="lg"
                >
                  <Gear size={20} />
                  Configure Firebase
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Firebase Authentication Setup</DialogTitle>
                </DialogHeader>
                <FirebaseSetup />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      <QRCodeManager />

      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddItem={handleAddItem}
      />
    </>
  )
}