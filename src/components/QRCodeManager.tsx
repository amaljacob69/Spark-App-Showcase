import React, { useState } from 'react'
import { House, Snowflake, Package, Link, Check, QrCode } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { toast } from 'sonner'
import { MenuType } from '../App'

interface QRCodeManagerProps {
  isVisible?: boolean
}

interface MenuTypeConfig {
  type: MenuType
  name: string
  description: string
  icon: React.ReactElement
  color: string
}

const menuConfigs: MenuTypeConfig[] = [
  {
    type: 'dinein-non-ac',
    name: 'Dine-in Non-AC Menu',
    description: 'For customers in non-AC dining area',
    icon: <House size={20} />,
    color: 'text-amber-600'
  },
  {
    type: 'dinein-ac',
    name: 'Dine-in A/C Menu',
    description: 'For customers in AC dining area',
    icon: <Snowflake size={20} />,
    color: 'text-blue-600'
  },
  {
    type: 'takeaway',
    name: 'Take Away Menu',
    description: 'For takeaway counter customers',
    icon: <Package size={20} />,
    color: 'text-green-600'
  }
]

export function QRCodeManager({ isVisible = true }: QRCodeManagerProps) {
  const [copiedLinks, setCopiedLinks] = useState<Set<MenuType>>(new Set())

  const handleCopyMenuLink = async (menuType: MenuType, menuName: string) => {
    const baseUrl = window.location.origin + window.location.pathname
    const menuUrl = `${baseUrl}?menu=${menuType}`
    
    try {
      await navigator.clipboard.writeText(menuUrl)
      setCopiedLinks(prev => new Set([...prev, menuType]))
      toast.success(`${menuName} QR link copied!`, {
        description: 'Use this URL to generate QR codes'
      })
      
      // Reset copied state after 3 seconds
      setTimeout(() => {
        setCopiedLinks(prev => {
          const updated = new Set(prev)
          updated.delete(menuType)
          return updated
        })
      }, 3000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  if (!isVisible) return null

  return (
    <Card className="mt-4 sm:mt-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <QrCode size={20} className="text-primary sm:size-6" />
          <span className="text-base sm:text-xl">QR Code Management</span>
        </CardTitle>
        <CardDescription className="text-sm">
          Generate QR codes for each menu type. Each QR code will show only the respective menu with appropriate pricing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {menuConfigs.map((config) => {
            const isCopied = copiedLinks.has(config.type)
            
            return (
              <div 
                key={config.type}
                className="flex flex-col items-center p-3 sm:p-4 border border-border rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className={`mb-2 sm:mb-3 ${config.color}`}>
                  {config.icon}
                </div>
                <h3 className="font-medium text-center mb-1 text-sm sm:text-base">{config.name}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground text-center mb-3 sm:mb-4">
                  {config.description}
                </p>
                <Button
                  variant={isCopied ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => handleCopyMenuLink(config.type, config.name)}
                  className="gap-1.5 sm:gap-2 w-full text-xs sm:text-sm"
                  disabled={isCopied}
                >
                  {isCopied ? (
                    <>
                      <Check size={14} className="sm:size-4" />
                      Link Copied!
                    </>
                  ) : (
                    <>
                      <Link size={14} className="sm:size-4" />
                      Copy QR Link
                    </>
                  )}
                </Button>
              </div>
            )
          })}
        </div>
        
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Instructions:</h4>
          <ol className="text-xs sm:text-sm text-muted-foreground space-y-1">
            <li>1. Copy the link for each menu type above</li>
            <li>2. Use a QR code generator (like qr-code-generator.com) to create QR codes</li>
            <li>3. Print and place QR codes in respective areas:</li>
            <li className="ml-4">• Non-AC dining area → Non-AC QR code</li>
            <li className="ml-4">• AC dining area → A/C QR code</li>
            <li className="ml-4">• Takeaway counter → Take Away QR code</li>
            <li>4. Customers will only see pricing for their specific dining option</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}