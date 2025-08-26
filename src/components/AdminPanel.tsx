import { useState } from 'react'
import { Plus } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { AddItemDialog } from './AddItemDialog'
import { QRCodeManager } from './QRCodeManager'
import { MenuItem } from '../App'

interface AdminPanelProps {
  onAddItem: (item: Omit<MenuItem, 'id'>) => void
}

export function AdminPanel({ onAddItem }: AdminPanelProps) {
  const [showAddDialog, setShowAddDialog] = useState(false)

  const handleAddItem = (item: Omit<MenuItem, 'id'>) => {
    onAddItem(item)
    setShowAddDialog(false)
  }

  return (
    <>
      <Card className="mt-8 border-dashed border-2 border-muted-foreground/25">
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

      <QRCodeManager />

      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onAddItem={handleAddItem}
      />
    </>
  )
}