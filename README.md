# 🍽️ Paradise Family Restaurant - Digital Menu System

A comprehensive restaurant menu application with admin panel, featuring three distinct pricing tiers and Firebase integration for secure data management.

## 🌟 Features

### 🍴 Multi-Tier Menu System
- **Dine-in Non-AC**: Pricing for non-air-conditioned dining area
- **Dine-in AC**: Premium pricing for air-conditioned dining area  
- **Takeaway**: Optimized pricing for pickup orders

### 👑 Admin Management
- Secure Firebase Authentication with Google Sign-In
- Complete menu item management (add, edit, delete)
- Multi-admin support with role management
- Real-time synchronization across devices

### 🔒 Enterprise Security
- Production-ready Firestore security rules
- Comprehensive data validation
- Admin access controls and protection
- Email verification requirements

### 📱 Customer Experience
- Direct QR code access to specific menu types
- Mobile-responsive design
- Clean, elegant interface with Playfair Display typography
- Real-time menu updates

## 🚀 Live Application

- **Main Application**: https://paradise-family.web.app
- **Non-AC Menu**: https://paradise-family.web.app?menu=dinein-non-ac
- **AC Menu**: https://paradise-family.web.app?menu=dinein-ac
- **Takeaway Menu**: https://paradise-family.web.app?menu=takeaway

## 🔧 Technical Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui v4 + Tailwind CSS
- **Backend**: Firebase (Firestore + Authentication)
- **Hosting**: Firebase Hosting
- **Icons**: Phosphor Icons
- **Fonts**: Playfair Display + Inter

## 📋 Security Documentation

### 🔒 Security Features
- **Authentication**: Google OAuth with email verification
- **Data Validation**: Complete menu item and pricing validation
- **Access Control**: Role-based admin permissions
- **Rate Limiting**: Protection against abuse
- **Audit Trails**: Timestamped data changes

### 📚 Security Resources
- [`FIRESTORE-SECURITY.md`](FIRESTORE-SECURITY.md) - Comprehensive security rules documentation
- [`SECURITY-DEPLOYMENT-CHECKLIST.md`](SECURITY-DEPLOYMENT-CHECKLIST.md) - Production deployment guide
- [`validate-security-rules.js`](validate-security-rules.js) - Security testing and validation

## 🛠️ Development

### Local Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start Firebase emulators (optional)
firebase emulators:start
```

### Firebase Configuration
```bash
# Login to Firebase
firebase login

# Deploy application
firebase deploy

# Deploy security rules only  
firebase deploy --only firestore:rules
```

## 🏗️ Architecture

### Data Structure
```typescript
interface MenuItem {
  id: string
  name: string
  description: string
  prices: {
    'dinein-non-ac': number
    'dinein-ac': number
    'takeaway': number
  }
  category: string
  available: boolean
}
```

### Security Rules Summary
- Public read access to menu data
- Admin-only write access with validation
- Comprehensive data structure validation
- Price range validation (0-10,000)
- Admin self-protection (cannot delete own account)

## 📱 QR Code Integration

The application supports direct menu access via QR codes:
1. Generate QR codes pointing to specific menu URLs
2. Place QR codes in respective dining areas
3. Customers scan to access area-specific pricing
4. No menu switching - focused experience per location

## 🎨 Design System

### Color Palette
- **Background**: Light warm tones for comfortable reading
- **Primary**: Deep blue for admin actions and navigation
- **Accent**: Warm gold for highlights and call-to-action
- **Text**: High contrast dark colors for accessibility

### Typography
- **Headers**: Playfair Display (elegant serif)
- **Body**: Inter (clean sans-serif)
- **Hierarchy**: Clear size and weight relationships

## 📄 Additional Documentation

- [`PRD.md`](PRD.md) - Product Requirements Document
- [`ADMIN-SETUP.md`](ADMIN-SETUP.md) - Admin user management guide
- [`FIREBASE-SETUP.md`](FIREBASE-SETUP.md) - Firebase configuration guide
- [`DEPLOYMENT.md`](DEPLOYMENT.md) - Deployment instructions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Paradise Family Restaurant** - Bringing fine dining experiences to the digital age with secure, scalable menu management.