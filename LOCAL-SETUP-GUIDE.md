# Local Development Setup Guide

## 📋 Prerequisites

Before running this Paradise Family Restaurant menu application locally, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **Firebase CLI** (optional, for Firebase features) - `npm install -g firebase-tools`
- **VS Code** (recommended) - [Download here](https://code.visualstudio.com/)

## 🚀 Quick Start

### 1. Download/Clone the Repository
```bash
# If using Git
git clone [your-repository-url]
cd spark-template

# Or download as ZIP and extract
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```env
VITE_FIREBASE_API_KEY=AIzaSyAYuSiwMkEJoTeNrvmUGh0GovPrMACRg
VITE_FIREBASE_AUTH_DOMAIN=paradise-family.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=paradise-family
VITE_FIREBASE_STORAGE_BUCKET=paradise-family.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=477641412672
VITE_FIREBASE_APP_ID=1:477641412672:web:140084cd4275aab3b34fa5
VITE_FIREBASE_MEASUREMENT_ID=G-XWQXEJXV71
```

### 4. Run the Development Server
```bash
npm run dev
```

The application will start at `http://localhost:5173`

## 🔧 Development Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy to Firebase (requires auth) |
| `npm run emulator:start` | Start Firebase emulators |

## 🍽️ Application Features

### Menu Types
The application supports three menu types with different pricing:

1. **Dine-in Non-AC** - `http://localhost:5173?menu=dinein-non-ac`
2. **Dine-in AC** - `http://localhost:5173?menu=dinein-ac`
3. **Takeaway** - `http://localhost:5173?menu=takeaway`

### Admin Panel
- Firebase Authentication required
- Add, edit, delete menu items
- Manage three different price points per item
- Real-time sync with Firestore database

## 🔐 Admin Access Setup

### For Development (Local Testing)
1. Start the app: `npm run dev`
2. Navigate to the admin login
3. Use Firebase Console to add your email as an admin user

### Setting Up Firebase Admin Users
1. Go to [Firebase Console](https://console.firebase.google.com/project/paradise-family)
2. Navigate to Firestore Database
3. Create/edit the `admins` collection
4. Add documents with `email` field matching user emails

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Shadcn UI components
│   ├── Header.tsx       # Main navigation
│   ├── MenuGrid.tsx     # Menu display
│   ├── AdminPanel.tsx   # Admin interface
│   └── ...
├── lib/                 # Utilities and Firebase config
├── assets/              # Images, fonts, etc.
├── App.tsx             # Main app component
└── main.tsx            # App entry point
```

## 🏃‍♂️ Running in VS Code

### Method 1: Terminal
1. Open VS Code
2. Open terminal: `Ctrl+` `
3. Run: `npm run dev`

### Method 2: Tasks
1. Press `Ctrl+Shift+P`
2. Type "Tasks: Run Task"
3. Select "npm: dev"

### Method 3: Debug
1. Set breakpoints in your code
2. Press `F5` or go to Run & Debug panel
3. Select "Launch Chrome"

## 🧪 Testing

### Local Testing
```bash
# Start development server
npm run dev

# Test different menu types
# Non-AC: http://localhost:5173?menu=dinein-non-ac
# AC: http://localhost:5173?menu=dinein-ac
# Takeaway: http://localhost:5173?menu=takeaway
```

### Firebase Emulator Testing
```bash
# Start emulators
npm run emulator:start

# Test security rules
npm run test:rules
```

## 🔥 Firebase Configuration

### Local Development
- The app works with local state by default
- Firebase features require authentication
- Emulators can be used for offline testing

### Production Deployment
- Configured for Firebase Hosting
- Firestore for data persistence
- Firebase Auth for admin access

## 🎨 Customization

### Styling
- Uses Tailwind CSS
- Custom theme in `src/index.css`
- Components in `src/components/ui/`

### Menu Items
- Default sample items in `src/App.tsx`
- Editable through admin panel
- Syncs with Firestore when authenticated

## 🚨 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5173
npm run kill
# Or manually: npx kill-port 5173
```

### Node Version Issues
```bash
# Check Node version
node --version
# Should be v18 or higher
```

### Firebase Connection Issues
- Check `.env.local` configuration
- Verify Firebase project settings
- Ensure internet connection for Firebase features

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Mobile Testing

### Local Network Access
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. Access via: `http://[YOUR-IP]:5173`
3. Test QR code functionality with your phone

## 🔄 Updates and Deployment

### Local Changes
1. Make your changes
2. Test locally: `npm run dev`
3. Build: `npm run build`
4. Deploy: `npm run deploy` (requires Firebase auth)

### Version Control
- Commit changes regularly
- Use descriptive commit messages
- Test before deploying to production

## 📞 Support

For issues or questions:
1. Check this guide first
2. Review Firebase Console for errors
3. Check browser developer tools
4. Verify all dependencies are installed

## 🎯 Next Steps

After setup:
1. Test all menu types locally
2. Set up admin access
3. Customize menu items
4. Test QR code workflows
5. Deploy to production when ready

---

**Happy Coding! 🍴**