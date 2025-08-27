import { useState, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Upload, Image as ImageIcon, X, Eye } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface ImageManagerProps {
  currentImage?: string
  onImageChange: (imageUrl: string | undefined) => void
  className?: string
}

export function ImageManager({ currentImage, onImageChange, className }: ImageManagerProps) {
  const [dragActive, setDragActive] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    // Create object URL for preview
    const imageUrl = URL.createObjectURL(file)
    onImageChange(imageUrl)
    toast.success('Image uploaded successfully')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files?.[0]) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files?.[0]) {
      handleFileSelect(files[0])
    }
  }

  const removeImage = () => {
    onImageChange(undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    toast.success('Image removed')
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <Label className="text-sm font-medium">Menu Item Image</Label>
        <p className="text-xs text-muted-foreground mt-1">
          Upload an appetizing photo of your dish (max 5MB, JPG/PNG)
        </p>
      </div>

      {currentImage ? (
        <Card className="relative group">
          <CardContent className="p-4">
            <div className="relative rounded-lg overflow-hidden bg-muted">
              <img
                src={currentImage}
                alt="Menu item preview"
                className="w-full h-48 object-cover"
              />
              
              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setIsPreviewOpen(true)}
                  className="gap-2"
                >
                  <Eye size={16} />
                  Preview
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={removeImage}
                  className="gap-2"
                >
                  <X size={16} />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-200 cursor-pointer hover:border-primary/50 hover:bg-muted/25",
            dragActive && "border-primary bg-primary/5"
          )}
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <div className={cn(
              "rounded-full p-4 transition-colors duration-200",
              dragActive ? "bg-primary/20" : "bg-muted"
            )}>
              <Upload size={24} className={dragActive ? "text-primary" : "text-muted-foreground"} />
            </div>
            
            <div className="mt-4 space-y-2">
              <p className="font-medium">
                {dragActive ? "Drop your image here" : "Upload menu item image"}
              </p>
              <p className="text-sm text-muted-foreground">
                Drag & drop or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports JPG, PNG up to 5MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        aria-label="Upload menu item image"
      />

      {/* URL Input as Alternative */}
      <div className="space-y-2">
        <Label htmlFor="image-url" className="text-sm text-muted-foreground">
          Or enter image URL
        </Label>
        <div className="flex gap-2">
          <Input
            id="image-url"
            placeholder="https://example.com/image.jpg"
            onChange={(e) => {
              if (e.target.value.trim()) {
                onImageChange(e.target.value.trim())
              }
            }}
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const input = document.getElementById('image-url') as HTMLInputElement
              if (input?.value.trim()) {
                onImageChange(input.value.trim())
                toast.success('Image URL added')
              }
            }}
          >
            Add
          </Button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {isPreviewOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={currentImage}
              alt="Full size preview"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}