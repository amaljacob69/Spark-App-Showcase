import { useEffect } from 'react'
import { MenuType } from '../types'

export const menuThemes = {
  'dinein-non-ac': {
    name: '',
    colors: {
      '--background': 'oklch(0.96 0.02 50)',
      '--foreground': 'oklch(0.2 0.01 50)',
      '--card': 'oklch(0.98 0.01 50)',
      '--card-foreground': 'oklch(0.2 0.01 50)',
      '--popover': 'oklch(0.98 0.01 50)',
      '--popover-foreground': 'oklch(0.2 0.01 50)',
      '--primary': 'oklch(0.45 0.18 35)', // Warm orange-red
      '--primary-foreground': 'oklch(1 0 0)',
      '--secondary': 'oklch(0.94 0.03 45)',
      '--secondary-foreground': 'oklch(0.2 0.01 50)',
      '--accent': 'oklch(0.6 0.15 25)', // Warm amber
      '--accent-foreground': 'oklch(1 0 0)',
      '--destructive': 'oklch(0.577 0.245 27.325)',
      '--destructive-foreground': 'oklch(1 0 0)',
      '--muted': 'oklch(0.94 0.03 45)',
      '--muted-foreground': 'oklch(0.5 0.01 50)',
      '--border': 'oklch(0.89 0.03 45)',
      '--input': 'oklch(0.89 0.03 45)',
      '--ring': 'oklch(0.45 0.18 35)'
    }
  },
  'dinein-ac': {
    name: 'Cool Elegance',
    colors: {
      '--background': 'oklch(0.95 0.02 220)',
      '--foreground': 'oklch(0.2 0.01 220)',
      '--card': 'oklch(0.98 0.01 220)',
      '--card-foreground': 'oklch(0.2 0.01 220)',
      '--popover': 'oklch(0.98 0.01 220)',
      '--popover-foreground': 'oklch(0.2 0.01 220)',
      '--primary': 'oklch(0.4 0.15 210)', // Cool blue
      '--primary-foreground': 'oklch(1 0 0)',
      '--secondary': 'oklch(0.93 0.02 220)',
      '--secondary-foreground': 'oklch(0.2 0.01 220)',
      '--accent': 'oklch(0.55 0.12 190)', // Cool cyan
      '--accent-foreground': 'oklch(1 0 0)',
      '--destructive': 'oklch(0.577 0.245 27.325)',
      '--destructive-foreground': 'oklch(1 0 0)',
      '--muted': 'oklch(0.93 0.02 220)',
      '--muted-foreground': 'oklch(0.5 0.01 220)',
      '--border': 'oklch(0.88 0.02 220)',
      '--input': 'oklch(0.88 0.02 220)',
      '--ring': 'oklch(0.4 0.15 210)'
    }
  },
  'takeaway': {
    name: 'Fresh Energy',
    colors: {
      '--background': 'oklch(0.96 0.02 130)',
      '--foreground': 'oklch(0.2 0.01 130)',
      '--card': 'oklch(0.98 0.01 130)',
      '--card-foreground': 'oklch(0.2 0.01 130)',
      '--popover': 'oklch(0.98 0.01 130)',
      '--popover-foreground': 'oklch(0.2 0.01 130)',
      '--primary': 'oklch(0.42 0.16 140)', // Fresh green
      '--primary-foreground': 'oklch(1 0 0)',
      '--secondary': 'oklch(0.94 0.02 130)',
      '--secondary-foreground': 'oklch(0.2 0.01 130)',
      '--accent': 'oklch(0.58 0.14 110)', // Lime green
      '--accent-foreground': 'oklch(1 0 0)',
      '--destructive': 'oklch(0.577 0.245 27.325)',
      '--destructive-foreground': 'oklch(1 0 0)',
      '--muted': 'oklch(0.94 0.02 130)',
      '--muted-foreground': 'oklch(0.5 0.01 130)',
      '--border': 'oklch(0.89 0.02 130)',
      '--input': 'oklch(0.89 0.02 130)',
      '--ring': 'oklch(0.42 0.16 140)'
    }
  }
}

export const useTheme = (menuType: MenuType) => {
  useEffect(() => {
    const theme = menuThemes[menuType]
    const root = document.documentElement
    
    // Apply theme colors
    Object.entries(theme.colors).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
    
    // Add theme class to body for additional styling
    document.body.className = document.body.className.replace(/theme-\w+/g, '')
    document.body.classList.add(`theme-${menuType}`)
    
    // Update document title to reflect current theme
    const menuTypeName = menuType === 'dinein-non-ac' ? 'Dine-in Non-AC' : 
                        menuType === 'dinein-ac' ? 'Dine-in AC' : 'Takeaway'
    const titleSuffix = theme.name ? ` (${theme.name})` : ''
    document.title = `Paradise Family Restaurant - ${menuTypeName} Menu${titleSuffix}`
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme.colors['--primary'])
    } else {
      const meta = document.createElement('meta')
      meta.name = 'theme-color'
      meta.content = theme.colors['--primary']
      document.head.appendChild(meta)
    }
    
    // Cleanup function
    return () => {
      document.body.className = document.body.className.replace(/theme-\w+/g, '')
      document.title = 'Paradise Family Restaurant - Menu'
    }
  }, [menuType])
  
  return menuThemes[menuType]
}