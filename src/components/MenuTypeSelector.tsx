import { House, AirConditioner, Package } from '@phosphor-icons/react'
import { Button } from './ui/button'
import { MenuType } from '../App'

interface MenuTypeSelectorProps {
  selectedType: MenuType
  onTypeSelect: (type: MenuType) => void
}

const menuTypes = [
  {
    type: 'dinein-non-ac' as MenuType,
    label: 'Dine-in Non-AC',
    icon: House,
    description: '10% off base price'
  },
  {
    type: 'dinein-ac' as MenuType,
    label: 'Dine-in AC',
    icon: AirConditioner,
    description: 'Standard pricing'
  },
  {
    type: 'takeaway' as MenuType,
    label: 'Take Away',
    icon: Package,
    description: '20% off base price'
  }
]

export function MenuTypeSelector({ selectedType, onTypeSelect }: MenuTypeSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <span className="text-sm font-medium text-muted-foreground self-center mb-2 sm:mb-0 sm:mr-3">
        Menu Type:
      </span>
      <div className="flex gap-2">
        {menuTypes.map(({ type, label, icon: Icon, description }) => (
          <Button
            key={type}
            variant={selectedType === type ? "default" : "outline"}
            size="sm"
            onClick={() => onTypeSelect(type)}
            className="gap-2 text-xs"
            title={description}
          >
            <Icon size={16} />
            {label}
          </Button>
        ))}
      </div>
    </div>
  )
}