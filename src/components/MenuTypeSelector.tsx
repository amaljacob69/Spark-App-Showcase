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
    label: 'Take Away',
    icon: Package,
    description: '20% off base price',
    themeColor: 'bg-green-500'
  }
]

export function MenuTypeSelector({ selectedType, onTypeSelect }: MenuTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <div className="flex items-center gap-2">
        <Palette size={16} className="text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">
          Menu Type:
        </span>
        <span className="text-xs text-primary font-medium">
          {menuThemes[selectedType].name}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {menuTypes.map(({ type, label, icon: Icon, description, themeColor }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeSelect(type)}
            className={cn(
              "gap-1.5 text-xs px-2.5 py-1.5 min-w-0 flex-1 sm:flex-initial sm:px-3 sm:py-2 transition-all duration-300",
              selectedType === type && "shadow-md"
            )}
            title={`${description} • ${menuThemes[type].name} Theme`}
          >
            <div className={cn("w-2 h-2 rounded-full", themeColor)} />
            <Icon size={14} className="flex-shrink-0" />
            <span className="truncate text-xs sm:text-sm">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}