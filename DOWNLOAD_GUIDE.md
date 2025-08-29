# Paradise Family Restaurant - Complete File Structure

## 📁 Project Root Files
```
paradise-family-restaurant/
├── package.json              # Dependencies and scripts
├── package-lock.json         # Dependency lock file
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Build configuration
├── components.json           # UI components config
├── index.html               # Main HTML file
└── README.md                # Project documentation
```

## 📁 Source Code (`src/`)
```
src/
├── App.tsx                   # 🎯 Main application component
├── main.tsx                  # ⚠️  Entry point (DO NOT MODIFY)
├── main.css                  # ⚠️  Core CSS (DO NOT MODIFY)  
├── index.css                 # 🎨 Custom styles & themes
└── prd.md                    # 📋 Product requirements
```

## 📁 Components (`src/components/`)
```
components/
├── Header.tsx                # Navigation header
├── MenuGrid.tsx             # Menu items display
├── MenuItemCard.tsx         # Individual menu cards
├── AdminPanel.tsx           # Admin dashboard
├── Footer.tsx               # App footer
├── SearchBar.tsx            # Search functionality
├── AdvancedSearch.tsx       # Enhanced search
├── DietaryFilter.tsx        # Dietary preferences
├── CategorySection.tsx      # Category browsing
├── FloatingActionButton.tsx # Mobile action buttons
├── CartDialog.tsx           # Shopping cart
├── OffersSection.tsx        # Special offers
├── HorizontalMenuSection.tsx # Featured items
├── QRCodeManager.tsx        # QR code generation
├── LoginDialog.tsx          # Admin login
├── PWAInstallPrompt.tsx     # App install prompts
├── PWAFloatingNotification.tsx # PWA notifications
├── LoadingSkeleton.tsx      # Loading states
├── ErrorBoundary.tsx        # Error handling
└── ThemePreview.tsx         # Theme wrapper
```

## 📁 UI Components (`src/components/ui/`)
```
ui/ (Shadcn/UI Library - Pre-installed)
├── button.tsx               # Button component
├── card.tsx                 # Card component
├── dialog.tsx               # Dialog component
├── input.tsx                # Input component
├── label.tsx                # Label component
├── select.tsx               # Select component
├── textarea.tsx             # Textarea component
├── tooltip.tsx              # Tooltip component
├── badge.tsx                # Badge component
├── skeleton.tsx             # Skeleton loader
├── sonner.tsx               # Toast notifications
└── [40+ more UI components] # Complete UI library
```

## 📁 Hooks (`src/hooks/`)
```
hooks/
├── useKV.ts                 # 💾 Data persistence
├── usePWA.ts                # 📱 PWA functionality
├── useTheme.ts              # 🎨 Theme management
├── useAuth.ts               # 🔐 Authentication (disabled)
└── use-mobile.ts            # 📱 Mobile detection
```

## 📁 Libraries (`src/lib/`)
```
lib/
├── utils.ts                 # 🛠️  Utility functions
├── currency.ts              # 💰 Rupee formatting
├── security.ts              # 🔒 Security utilities
├── performance.ts           # ⚡ Performance monitoring
├── offline.ts               # 📴 Offline support
├── errorHandler.ts          # 🚨 Error handling
└── analytics.ts             # 📊 Analytics utilities
```

## 📁 Configuration (`src/config/`)
```
config/
├── environment.ts           # Environment settings
└── firebase.ts              # Firebase config (disabled)
```

## 📁 Documentation Files
```
docs/
├── README.md                # 📖 Main documentation
├── DEPLOYMENT-GUIDE.md      # 🚀 Deployment guide
├── PRODUCTION_READY.md      # ✅ Production checklist
├── PWA_ENHANCEMENTS.md      # 📱 PWA features
├── MOBILE-RESPONSIVE-UPDATES.md # 📱 Mobile updates
├── UPDATES_SUMMARY.md       # 📝 Recent changes
├── ADMIN-SETUP.md          # ⚙️  Admin setup
└── SECURITY.md             # 🔒 Security guide
```

## 🎯 Key Features

### ✅ Multi-Menu System
- 3 menu types: Non-AC (₹), A/C (₹), Take Away (₹)
- QR code direct access for each menu type
- Theme-based visual distinction

### ✅ Admin Dashboard
- Add/edit/delete menu items
- Three-price input system
- Category management
- Secure password protection

### ✅ Mobile-First Design
- Responsive across all devices
- Touch-optimized interactions
- Progressive Web App (PWA)
- Offline capability

### ✅ Advanced Features
- Search with dietary filters (Veg, Chicken, Meat, Fish)
- Shopping cart functionality
- Social media integration
- Google Maps location
- Special offers section

## 📱 PWA Features

### Installation Prompts
- Android: Native install banner
- iOS: Custom install instructions
- Desktop: Browser install prompt

### Offline Support
- Service worker caching
- Offline menu browsing
- Data synchronization

## 🎨 Theme System

### Non-AC Theme
- Warm orange/amber tones
- Cozy, traditional feel
- Target: Budget-conscious customers

### A/C Theme  
- Cool blue tones
- Modern, premium feel
- Target: Comfort-seeking customers

### Take Away Theme
- Fresh green tones
- Quick, efficient feel
- Target: On-the-go customers

## 🏪 Restaurant Details

**Paradise Family Restaurant & Bake Shop**
- 📍 Location: Chalakudy, Kerala, India
- 🍽️ Specialties: Kerala, Arabic, Chinese cuisine + Bakery
- 💰 Currency: Indian Rupee (₹)
- 🌟 Google Business: ChIJGcnxTmwCCDsRbR1By6fYbFc
- 📷 Instagram: @chalakudy-paradise-restaurant

## 🔧 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Components**: Shadcn/UI
- **Icons**: Phosphor Icons
- **Notifications**: Sonner
- **PWA**: Workbox Service Worker
- **Storage**: Local Storage with KV abstraction

## 📥 Download Instructions

1. **For Development**:
   - Download all `src/` files
   - Include `package.json`, `tsconfig.json`, `vite.config.ts`
   - Run `npm install` to install dependencies

2. **For Production**:
   - Include all source files
   - Add `manifest.json` for PWA
   - Configure hosting (Netlify, Vercel, Firebase)

3. **For Customization**:
   - Modify themes in `src/index.css`
   - Update restaurant details in relevant components
   - Customize menu items in `src/App.tsx`

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📞 Support

This is a complete, production-ready restaurant menu application with:
- ✅ Mobile-responsive design
- ✅ PWA capabilities
- ✅ Admin management
- ✅ Multi-menu pricing
- ✅ QR code integration
- ✅ SEO optimization
- ✅ Security features
- ✅ Performance optimization

Perfect for restaurants wanting a modern, efficient digital menu system!