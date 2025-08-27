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
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-6 sm:mt-8">
        <Card className="border-dashed border-2 border-muted-foreground/25 flex-1">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="font-display text-center text-base sm:text-lg">Add New Menu Item</CardTitle>
          </CardHeader>
          <CardContent className="text-center pt-0">
            <Button 
              onClick={() => setShowAddDialog(true)}
              className="gap-2 w-full sm:w-auto"
              size="lg"
            >
              <Plus size={18} className="sm:size-5" />
              Add Item
            </Button>
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