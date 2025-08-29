# Paradise Family Restaurant & Bake Shop - Digital Menu System

A modern, mobile-responsive restaurant menu application with separate pricing for different dining experiences (Non-AC, A/C, and Take Away). Built for Paradise Family Restaurant & Bake Shop in Chalakudy, Kerala - famous for authentic Kerala, Arabic, and Chinese cuisine.

## 🍴 Features

### Customer Experience
- **Multi-Menu Support**: Separate QR-accessible menus for Non-AC dining, A/C dining, and Take Away
- **Dynamic Pricing**: Different prices automatically displayed based on menu type
- **Mobile-First Design**: Optimized for mobile devices with responsive design
- **Advanced Search & Filtering**: Search by name, description, category, or dietary preferences
- **PWA Support**: Installable app with offline capabilities
- **Shopping Cart**: Add items to cart with quantity management
- **Social Integration**: Quick access to Google Reviews, Instagram, and location

### Menu Categories
- **Kerala Cuisine**: Traditional Kerala dishes including Fish Curry, Biriyani, Beef Fry
- **Arabic Cuisine**: Authentic Arabic specialties like Shawarma, Kabsa, Hummus
- **Chinese Cuisine**: Popular Chinese dishes including Fried Rice, Chilli Chicken, Hakka Noodles
- **Bakery Items**: Fresh baked goods from the in-house bake shop

### Dietary Preferences Filtering
- Vegetarian
- Egg-based dishes
- Chicken
- Meat (Beef/Mutton/Pork)
- Fish/Seafood

### Technical Features
- **Theme System**: Different visual themes for each menu type
- **Performance Monitoring**: Built-in performance tracking
- **Security**: Input sanitization and admin access controls
- **Offline Support**: Works without internet connection
- **SEO Optimized**: Enhanced for local search and discoverability

## 🚀 Live Demo

- **Dine-in Non-AC Menu**: [https://paradise-family.web.app?menu=dinein-non-ac](https://paradise-family.web.app?menu=dinein-non-ac)
- **Dine-in A/C Menu**: [https://paradise-family.web.app?menu=dinein-ac](https://paradise-family.web.app?menu=dinein-ac)
- **Take Away Menu**: [https://paradise-family.web.app?menu=takeaway](https://paradise-family.web.app?menu=takeaway)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **UI Components**: Shadcn/ui components
- **Build Tool**: Vite
- **PWA**: Service Worker with caching strategies
- **Icons**: Phosphor Icons React
- **Animations**: Custom CSS animations with mobile optimization
- **Performance**: Built-in performance monitoring and optimization

## 📱 Mobile Responsiveness

- **Touch-Optimized**: All interactions designed for touch devices
- **Safe Area Support**: Respects device notches and home indicators
- **Optimized Loading**: Progressive loading with skeleton screens
- **Gesture Support**: Natural mobile gestures for navigation
- **PWA Installation**: Native app-like experience when installed

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Shadcn UI components
│   ├── Header.tsx      # App header with navigation
│   ├── MenuGrid.tsx    # Menu items display
│   ├── CartDialog.tsx  # Shopping cart functionality
│   └── ...
├── hooks/              # Custom React hooks
│   ├── useKV.ts       # Persistent storage hook
│   ├── usePWA.ts      # PWA functionality
│   └── useTheme.ts    # Theme management
├── lib/               # Utility libraries
│   ├── security.ts    # Security utilities
│   ├── performance.ts # Performance monitoring
│   └── offline.ts     # Offline functionality
├── App.tsx            # Main application component
└── index.css         # Global styles and theme definitions
```

## ⚡ Quick Start

### Prerequisites
- Node.js (16+ recommended)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/[your-username]/paradise-restaurant-menu.git
   cd paradise-restaurant-menu
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## 🎨 Customization

### Menu Items
Edit the `sampleMenuItems` array in `src/App.tsx` to customize menu items, pricing, and categories.

### Themes
Modify theme colors in `src/index.css` under the `:root` section. Each menu type has its own color scheme:

- **Non-AC Theme**: Warm orange tones for cozy atmosphere
- **A/C Theme**: Cool blue tones for premium experience  
- **Take Away Theme**: Fresh green tones for quick service

### Social Media Links
Update social media and business information in:
- `src/components/FloatingActionButton.tsx` for social links
- `index.html` for SEO and business schema

## 📊 Menu Analytics

The application includes built-in analytics for:
- Popular menu items
- Category preferences
- User interaction patterns
- Performance metrics

## 🔧 Configuration

### Environment Variables
Create a `.env` file for local development:

```env
VITE_APP_NAME=Paradise Family Restaurant
VITE_RESTAURANT_NAME=Paradise Family Restaurant & Bake Shop
VITE_LOCATION=Chalakudy, Kerala
```

### PWA Configuration
PWA settings can be modified in:
- `public/manifest.json` - App manifest
- `public/sw.js` - Service worker configuration

## 📱 QR Code Implementation

The application supports direct menu access via QR codes:

1. **Generate QR codes** for each menu URL
2. **Print and place** QR codes in respective dining areas
3. **Customers scan** to access the appropriate menu with correct pricing

## 🎯 Performance

- **Lighthouse Score**: 95+ on mobile performance
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

## 🔒 Security

- Input sanitization for all user data
- XSS protection
- Rate limiting for admin operations
- Secure session management

## 🌐 SEO Features

- Structured data for restaurant information
- Local business schema
- Optimized meta tags for social sharing
- Mobile-first indexing ready

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- **Restaurant**: Paradise Family Restaurant & Bake Shop
- **Location**: Chalakudy, Kerala, India
- **Specialties**: Kerala, Arabic & Chinese Cuisine + Fresh Bakery

## 🙏 Acknowledgments

- Built with React and modern web technologies
- UI components from Shadcn/ui
- Icons from Phosphor Icons
- Fonts from Google Fonts (Playfair Display, Inter)

---

**Made with ❤️ for Paradise Family Restaurant & Bake Shop**