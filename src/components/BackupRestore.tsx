import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Textarea } from './ui/textarea'
import { useKV } from '@/hooks/useKV'
import { MenuItem } from '../App'
import { 
  Download, 
  Upload, 
  FileText, 
  Database,
  CheckCircle,
  Warning,
  Copy
} from '@phosphor-icons/react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface BackupRestoreProps {
  menuItems: MenuItem[]
  onRestoreItems: (items: MenuItem[]) => void
  className?: string
}

export function BackupRestore({ menuItems, onRestoreItems, className }: BackupRestoreProps) {
  const [importData, setImportData] = useState('')
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [importStatus, setImportStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle')

  // Create backup data
  const createBackup = () => {
    const backupData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      itemCount: menuItems.length,
      data: menuItems,
      categories: Array.from(new Set(menuItems.map(item => item.category))),
      metadata: {
        exportedBy: 'Paradise Family Restaurant',
        totalItems: menuItems.length,
        availableItems: menuItems.filter(item => item.available).length
      }
    }
    return JSON.stringify(backupData, null, 2)
  }

  // Download backup file
  const downloadBackup = () => {
    try {
      const backupData = createBackup()
      const blob = new Blob([backupData], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `paradise-menu-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      toast.success('Backup downloaded successfully!')
    } catch (error) {
      toast.error('Failed to create backup file')
    }
  }

  // Copy backup to clipboard
  const copyBackupToClipboard = async () => {
    try {
      const backupData = createBackup()
      await navigator.clipboard.writeText(backupData)
      toast.success('Backup data copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  // Validate import data
  const validateImportData = (data: string) => {
    try {
      const parsed = JSON.parse(data)
      
      // Check if it's a valid backup format
      if (!parsed.data || !Array.isArray(parsed.data)) {
        throw new Error('Invalid backup format: missing data array')
      }

      // Validate each menu item
      for (const item of parsed.data) {
        if (!item.id || !item.name || !item.prices) {
          throw new Error('Invalid menu item format')
        }
        
        if (!item.prices['dinein-non-ac'] === undefined || 
            !item.prices['dinein-ac'] === undefined || 
            !item.prices['takeaway'] === undefined) {
          throw new Error('Invalid pricing structure')
        }
      }

      return {
        isValid: true,
        data: parsed.data,
        metadata: parsed.metadata || {},
        itemCount: parsed.data.length
      }
    } catch (error) {
      return {
        isValid: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  // Handle import
  const handleImport = () => {
    setImportStatus('validating')
    
    const validation = validateImportData(importData)
    
    if (!validation.isValid) {
      setImportStatus('error')
      toast.error(`Import failed: ${validation.error}`)
      return
    }

    try {
      onRestoreItems(validation.data)
      setImportStatus('success')
      toast.success(`Successfully imported ${validation.itemCount} menu items!`)
      
      setTimeout(() => {
        setIsImportDialogOpen(false)
        setImportData('')
        setImportStatus('idle')
      }, 2000)
    } catch (error) {
      setImportStatus('error')
      toast.error('Failed to restore menu items')
    }
  }

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/json') {
      toast.error('Please select a JSON file')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setImportData(content)
      
      // Auto-validate
      const validation = validateImportData(content)
      if (validation.isValid) {
        toast.success(`Valid backup file with ${validation.itemCount} items`)
      } else {
        toast.error(`Invalid backup file: ${validation.error}`)
      }
    }
    reader.readAsText(file)
  }

  const getStatusIcon = () => {
    switch (importStatus) {
      case 'validating':
        return <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
      case 'success':
        return <CheckCircle className="text-green-600" size={16} />
      case 'error':
        return <Warning className="text-red-600" size={16} />
      default:
        return null
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Database className="text-primary" size={24} />
          Backup & Restore
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Export your menu data or restore from a backup
        </p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Export Section */}
          <Card className="border-dashed border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Download className="text-green-600" size={20} />
                Export Menu
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Create a backup of your current menu
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Total Items:</span>
                  <span className="font-medium">{menuItems.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Available:</span>
                  <span className="font-medium text-green-600">
                    {menuItems.filter(item => item.available).length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Categories:</span>
                  <span className="font-medium">
                    {Array.from(new Set(menuItems.map(item => item.category))).length}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={downloadBackup}
                  className="w-full gap-2"
                  variant="default"
                >
                  <Download size={16} />
                  Download Backup
                </Button>
                
                <Button 
                  onClick={copyBackupToClipboard}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <Copy size={16} />
                  Copy to Clipboard
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Import Section */}
          <Card className="border-dashed border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="text-blue-600" size={20} />
                Import Menu
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Restore menu from a backup file
              </p>
            </CardHeader>
            <CardContent>
              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="default" className="w-full gap-2">
                    <Upload size={16} />
                    Import Backup
                  </Button>
                </DialogTrigger>
                
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Upload size={20} />
                      Import Menu Backup
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Upload Backup File
                      </label>
                      <input
                        type="file"
                        accept=".json"
                        onChange={handleFileUpload}
                        className="block w-full text-sm text-muted-foreground
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-medium
                          file:bg-primary file:text-primary-foreground
                          hover:file:bg-primary/90"
                      />
                    </div>

                    {/* Or paste data */}
                    <div className="relative">
                      <label className="block text-sm font-medium mb-2">
                        Or Paste Backup Data
                      </label>
                      <Textarea
                        value={importData}
                        onChange={(e) => setImportData(e.target.value)}
                        placeholder="Paste your backup JSON data here..."
                        className="min-h-40 font-mono text-xs"
                      />
                      {getStatusIcon() && (
                        <div className="absolute top-8 right-3">
                          {getStatusIcon()}
                        </div>
                      )}
                    </div>

                    {/* Preview */}
                    {importData && (
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="text-sm space-y-1">
                          {(() => {
                            const validation = validateImportData(importData)
                            return validation.isValid ? (
                              <>
                                <div className="flex items-center gap-2 text-green-600 font-medium">
                                  <CheckCircle size={14} />
                                  Valid backup detected
                                </div>
                                <div>Items to import: {validation.itemCount}</div>
                                {validation.metadata?.exportedBy && (
                                  <div className="text-muted-foreground">
                                    Source: {validation.metadata.exportedBy}
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="flex items-center gap-2 text-red-600 font-medium">
                                <Warning size={14} />
                                {validation.error}
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsImportDialogOpen(false)
                          setImportData('')
                          setImportStatus('idle')
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleImport}
                        disabled={!importData || importStatus === 'validating' || !validateImportData(importData).isValid}
                        className="gap-2"
                      >
                        {importStatus === 'validating' && (
                          <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        )}
                        Import Menu
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-yellow-800 text-sm">
            <Warning size={16} />
            <span className="font-medium">Important:</span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Importing a backup will replace all current menu items. Make sure to export your current menu first if you want to keep it.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}