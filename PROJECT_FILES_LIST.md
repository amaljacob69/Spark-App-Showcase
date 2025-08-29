# Paradise Family Restaurant & Bake Shop - Project Files

This document lists all the files in the Paradise Family Restaurant & Bake Shop menu application project.

## Root Configuration Files

- `package.json` - Project dependencies and scripts
- `package-lock.json` - Dependency lock file
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `components.json` - Shadcn/UI component configuration
- `index.html` - Main HTML entry point
- `manifest.json` - PWA manifest file
- `firebase.json` - Firebase hosting configuration
- `firestore.indexes.json` - Firestore database indexes

## Source Code (`src/`)

### Main Application Files
- `src/App.tsx` - Main React application component
- `src/main.tsx` - Application entry point (DO NOT MODIFY)
- `src/main.css` - Core CSS file (DO NOT MODIFY)
- `src/index.css` - Custom styles and theme definitions
- `src/prd.md` - Product requirements document

### Components (`src/components/`)

#### Core Components
- `src/components/Header.tsx` - Application header with navigation
- `src/components/MenuGrid.tsx` - Menu items display grid
- `src/components/MenuCard.tsx` - Individual menu item cards
- `src/components/AdminPanel.tsx` - Admin dashboard interface
- `src/components/Footer.tsx` - Application footer with links
- `src/components/ErrorBoundary.tsx` - Error handling component
- `src/components/LoadingSkeleton.tsx` - Loading state displays
- `src/components/ThemePreview.tsx` - Theme application wrapper

#### Feature Components
- `src/components/SearchBar.tsx` - Search functionality
- `src/components/AdvancedSearch.tsx` - Enhanced search with filters
- `src/components/DietaryFilter.tsx` - Dietary preference filtering
- `src/components/CategorySection.tsx` - Category-based browsing
- `src/components/FloatingActionButton.tsx` - Mobile action buttons
- `src/components/CartDialog.tsx` - Shopping cart functionality
- `src/components/OffersSection.tsx` - Special offers display
- `src/components/HorizontalMenuSection.tsx` - Featured/popular items
- `src/components/QRCodeManager.tsx` - QR code generation

#### Auth & Admin Components
- `src/components/LoginDialog.tsx` - Admin login interface
- `src/components/AdminUserManager.tsx` - Admin user management

#### PWA Components
- `src/components/PWAInstallPrompt.tsx` - App installation prompts
- `src/components/PWAFloatingNotification.tsx` - PWA notifications
- `src/components/SparkleButton.tsx` - Enhanced UI buttons

#### UI Components Library (`src/components/ui/`)
All Shadcn/UI components (pre-installed):
- `alert-dialog.tsx`, `alert.tsx`, `avatar.tsx`, `badge.tsx`
- `button.tsx`, `card.tsx`, `checkbox.tsx`, `dialog.tsx`
- `dropdown-menu.tsx`, `form.tsx`, `input.tsx`, `label.tsx`
- `loading-spinner.tsx`, `popover.tsx`, `scroll-area.tsx`
- `select.tsx`, `sheet.tsx`, `skeleton.tsx`, `sonner.tsx`
- `switch.tsx`, `table.tsx`, `tabs.tsx`, `textarea.tsx`
- `tooltip.tsx` + many more standard UI components

### Hooks (`src/hooks/`)
- `src/hooks/useKV.ts` - Key-value storage hook
- `src/hooks/usePWA.ts` - Progressive Web App functionality
- `src/hooks/useTheme.ts` - Theme management
- `src/hooks/useAuth.ts` - Authentication (Firebase, disabled)
- `src/hooks/useFirebaseMenu.ts` - Firebase integration (disabled)
- `src/hooks/use-mobile.ts` - Mobile device detection

### Libraries (`src/lib/`)
- `src/lib/utils.ts` - Utility functions and Shadcn helpers
- `src/lib/currency.ts` - Indian Rupee formatting
- `src/lib/security.ts` - Security utilities
- `src/lib/performance.ts` - Performance monitoring
- `src/lib/offline.ts` - Offline functionality
- `src/lib/errorHandler.ts` - Global error handling
- `src/lib/analytics.ts` - Analytics utilities
- `src/lib/productionChecker.ts` - Production environment checks

### Configuration (`src/config/`)
- `src/config/environment.ts` - Environment configuration
- `src/config/firebase.ts` - Firebase config (disabled)

### Type Definitions
- `src/spark.d.ts` - Spark runtime type definitions
- `src/vite-env.d.ts` - Vite environment types

## Documentation Files

### Setup & Deployment
- `README.md` - Main project documentation
- `DEPLOYMENT-GUIDE.md` - Deployment instructions
- `PRODUCTION_READY.md` - Production readiness checklist
- `PWA_ENHANCEMENTS.md` - PWA feature documentation

### Development Documentation
- `MOBILE-RESPONSIVE-UPDATES.md` - Mobile optimization details
- `UPDATES_SUMMARY.md` - Recent changes summary
- `GITHUB_SETUP_COMPLETE.md` - Repository setup guide

### Security & Admin
- `ADMIN-SETUP.md` - Admin configuration guide
- `SECURITY.md` - Security best practices
- `FIREBASE_REMOVAL.md` - Firebase removal documentation

## Asset Structure (`public/` - if exists)
- PWA icons and splash screens
- Service worker files
- Favicon and branding assets

## Features Overview

### Core Functionality
✅ **Multi-Menu System**: 3 menu types (Non-AC, A/C, Take Away) with different pricing
✅ **QR Code Access**: Direct links for each menu type
✅ **Admin Dashboard**: Add, edit, delete menu items
✅ **Mobile Responsive**: Optimized for all screen sizes
✅ **Progressive Web App**: Installable, offline-capable
✅ **Search & Filters**: Advanced search with dietary preferences
✅ **Shopping Cart**: Add items, manage quantities
✅ **Social Integration**: Google Reviews, Instagram, Maps

### Technical Features
✅ **Theme System**: Different themes for each menu type
✅ **Security**: Input validation, rate limiting
✅ **Performance**: Caching, lazy loading, optimized assets
✅ **SEO Optimized**: Meta tags, structured data
✅ **Offline Support**: Service worker, data caching
✅ **Error Handling**: Comprehensive error boundaries

### Restaurant Details
- **Name**: Paradise Family Restaurant & Bake Shop
- **Location**: Chalakudy, Kerala, India
- **Specialties**: Kerala, Arabic, Chinese cuisine + Bakery
- **Currency**: Indian Rupee (₹)
- **Target**: Family restaurant with AC/Non-AC dining and takeaway

## How to Use These Files

1. **For Development**: All source files are in `src/` directory
2. **For Deployment**: Use configuration files in root directory
3. **For Documentation**: Reference markdown files for setup and features
4. **For Customization**: Modify theme in `src/index.css` and components as needed

## File Dependencies

- **React + TypeScript**: Core framework
- **Vite**: Build tool and development server
- **Tailwind CSS**: Styling framework
- **Shadcn/UI**: Component library
- **Sonner**: Toast notifications
- **Phosphor Icons**: Icon library
- **Framer Motion**: Animations (minimal usage)

This is a complete, production-ready restaurant menu application with PWA capabilities, mobile optimization, and comprehensive admin features.