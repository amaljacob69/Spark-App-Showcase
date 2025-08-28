import { House, Snowflake, Package, Palette } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { MenuType } from '../App'
import { menuThemes } from '../hooks/useTheme'
import { cn } from '@/lib/utils'

interface MenuTypeSelectorProps {
  selectedType: MenuType
  onTypeSelect: (type: MenuType) => void
}

const menuTypes = [
  {
    type: 'dinein-non-ac' as MenuType,
    label: 'Dine-in Non-AC',
    icon: House,
    description: '10% off base price',
    themeColor: 'bg-orange-500'
  },
  {
    type: 'dinein-ac' as MenuType,
    label: 'Dine-in AC',
    icon: Snowflake,
    description: 'Standard pricing',
    themeColor: 'bg-blue-500'
  },
  {
    type: 'takeaway' as MenuType,
    label: 'Takeaway',
    icon: Package,
    description: '20% off base price',
    themeColor: 'bg-green-500'
  }
]

export function MenuTypeSelector({ selectedType, onTypeSelect }: MenuTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      <div className="flex items-center gap-2">
        <Palette size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Menu Type & Pricing:
        </span>
        <span className="text-xs text-primary font-semibold px-2 py-1 bg-primary/10 rounded-full">
          {menuThemes[selectedType].name}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {menuTypes.map(({ type, label, icon: Icon, description, themeColor }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="lg"
            onClick={() => onTypeSelect(type)}
            className={cn(
              "gap-3 text-sm px-4 py-3 h-auto flex-col sm:flex-row transition-all duration-300 touch-target hover-lift",
              selectedType === type && "shadow-lg ring-2 ring-primary/30 scale-105"
            )}
            title={`${description} • ${menuThemes[type].name} Theme`}
          >
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={cn("w-3 h-3 rounded-full", themeColor)} />
              <Icon size={18} className="flex-shrink-0" />
              <span className="font-medium">{label}</span>
            </div>
            <div className="text-xs opacity-75 sm:ml-auto">
              {description}
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}