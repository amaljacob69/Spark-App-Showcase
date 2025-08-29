import { useEffect } from 'react'
import { MenuType } from '../types'

export const menuThemes = {
  'dinein-non-ac': {
    name: 'Cozy Warmth',
    colors: {
      '--background': 'oklch(0.97 0.015 40)',
      '--foreground': 'oklch(0.15 0.02 40)',
      '--card': 'oklch(0.99 0.008 40)',
      '--card-foreground': 'oklch(0.15 0.02 40)',
      '--popover': 'oklch(0.99 0.008 40)',
      '--popover-foreground': 'oklch(0.15 0.02 40)',
      '--primary': 'oklch(0.48 0.2 35)', // Warm terracotta
      '--primary-foreground': 'oklch(0.99 0.005 40)',
      '--secondary': 'oklch(0.94 0.02 45)',
      '--secondary-foreground': 'oklch(0.2 0.02 40)',
      '--accent': 'oklch(0.62 0.18 25)', // Rich amber
      '--accent-foreground': 'oklch(0.99 0.005 40)',
      '--destructive': 'oklch(0.58 0.25 25)',
      '--destructive-foreground': 'oklch(0.99 0.005 40)',
      '--muted': 'oklch(0.94 0.015 45)',
      '--muted-foreground': 'oklch(0.45 0.02 40)',
      '--border': 'oklch(0.9 0.02 45)',
      '--input': 'oklch(0.9 0.02 45)',
      '--ring': 'oklch(0.48 0.2 35)'
    }
  },
  'dinein-ac': {
    name: 'Arctic Cool',
    colors: {
      '--background': 'oklch(0.97 0.015 220)',
      '--foreground': 'oklch(0.15 0.02 220)',
      '--card': 'oklch(0.99 0.008 220)',
      '--card-foreground': 'oklch(0.15 0.02 220)',
      '--popover': 'oklch(0.99 0.008 220)',
      '--popover-foreground': 'oklch(0.15 0.02 220)',
      '--primary': 'oklch(0.45 0.18 215)', // Cool sapphire
      '--primary-foreground': 'oklch(0.99 0.005 220)',
      '--secondary': 'oklch(0.94 0.015 220)',
      '--secondary-foreground': 'oklch(0.2 0.02 220)',
      '--accent': 'oklch(0.58 0.16 200)', // Ice blue
      '--accent-foreground': 'oklch(0.99 0.005 220)',
      '--destructive': 'oklch(0.58 0.25 25)',
      '--destructive-foreground': 'oklch(0.99 0.005 220)',
      '--muted': 'oklch(0.94 0.012 220)',
      '--muted-foreground': 'oklch(0.45 0.02 220)',
      '--border': 'oklch(0.9 0.015 220)',
      '--input': 'oklch(0.9 0.015 220)',
      '--ring': 'oklch(0.45 0.18 215)'
    }
  },
  'takeaway': {
    name: 'Fresh Mint',
    colors: {
      '--background': 'oklch(0.97 0.015 140)',
      '--foreground': 'oklch(0.15 0.02 140)',
      '--card': 'oklch(0.99 0.008 140)',
      '--card-foreground': 'oklch(0.15 0.02 140)',
      '--popover': 'oklch(0.99 0.008 140)',
      '--popover-foreground': 'oklch(0.15 0.02 140)',
      '--primary': 'oklch(0.46 0.18 145)', // Fresh emerald
      '--primary-foreground': 'oklch(0.99 0.005 140)',
      '--secondary': 'oklch(0.94 0.015 140)',
      '--secondary-foreground': 'oklch(0.2 0.02 140)',
      '--accent': 'oklch(0.6 0.16 120)', // Vibrant mint
      '--accent-foreground': 'oklch(0.99 0.005 140)',
      '--destructive': 'oklch(0.58 0.25 25)',
      '--destructive-foreground': 'oklch(0.99 0.005 140)',
      '--muted': 'oklch(0.94 0.012 140)',
      '--muted-foreground': 'oklch(0.45 0.02 140)',
      '--border': 'oklch(0.9 0.015 140)',
      '--input': 'oklch(0.9 0.015 140)',
      '--ring': 'oklch(0.46 0.18 145)'
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