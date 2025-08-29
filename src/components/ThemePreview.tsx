import { useEffect, useState } from 'react'
import { MenuType } from '@/types'
import { menuThemes } from '../hooks/useTheme'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'

interface ThemePreviewProps {
  menuType: MenuType
}

export function ThemePreview({ menuType }: ThemePreviewProps) {
  const [isVisible, setIsVisible] = useState(false)
  const theme = menuThemes[menuType]

  useEffect(() => {
    setIsVisible(true)
    const timer = setTimeout(() => setIsVisible(false), 3000)
    return () => clearTimeout(timer)
  }, [menuType])

  if (!isVisible) return null

  return (
    <div className="fixed top-20 right-4 z-50 pointer-events-none">
      <Card className={cn(
        "p-4 min-w-[200px] shadow-lg border-2 transition-all duration-500",
        "animate-in slide-in-from-right-4 fade-in"
      )} style={{
        borderColor: theme.colors['--primary'],
        background: `linear-gradient(135deg, ${theme.colors['--card']} 0%, ${theme.colors['--background']} 100%)`
      }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: theme.colors['--primary'] }}
          />
          <div>
            <div className="font-semibold text-sm" style={{ color: theme.colors['--foreground'] }}>
              Theme Changed
            </div>
            {theme.name && (
              <div className="text-xs opacity-75" style={{ color: theme.colors['--muted-foreground'] }}>
                {theme.name}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}