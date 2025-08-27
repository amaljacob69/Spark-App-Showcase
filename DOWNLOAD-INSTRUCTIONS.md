# Download Instructions for Local Development

## 📥 How to Download All Files

### Option 1: Direct Download (Recommended)
1. **Download as ZIP**: If you have access to the repository, click "Download ZIP" button
2. **Extract**: Unzip the downloaded file to your desired location
3. **Navigate**: Open terminal/command prompt and navigate to the extracted folder

### Option 2: Git Clone (If Available)
```bash
# Replace with your actual repository URL
git clone [repository-url]
cd spark-template
```

## 📂 Essential Files Checklist

After downloading, ensure you have these key files:

### Root Directory Files
- ✅ `package.json` - Dependencies and scripts
- ✅ `index.html` - Main HTML file
- ✅ `vite.config.ts` - Vite configuration
- ✅ `tailwind.config.js` - Tailwind CSS config
- ✅ `tsconfig.json` - TypeScript configuration
- ✅ `firebase.json` - Firebase configuration
- ✅ `.firebaserc` - Firebase project settings

### Source Files (`src/` directory)
- ✅ `src/App.tsx` - Main React application
- ✅ `src/index.css` - Global styles and theme
- ✅ `src/main.tsx` - Application entry point
- ✅ `src/components/` - All React components
- ✅ `src/lib/` - Utility functions and Firebase config
- ✅ `src/assets/` - Images and static assets

### Configuration Files
- ✅ `.env.local` - Environment variables (you'll create this)
- ✅ `components.json` - Shadcn UI configuration

## 🚀 Quick Start After Download

### 1. Install Node.js
Download and install Node.js (v18+) from [nodejs.org](https://nodejs.org/)

### 2. Open in Your Preferred Editor
**VS Code (Recommended):**
- Download from [code.visualstudio.com](https://code.visualstudio.com/)
- Install these extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - Firebase

### 3. Set Up Environment
Create `.env.local` file in root directory:
```env
VITE_FIREBASE_API_KEY=AIzaSyAYuSiwMkEJoTeNrvmUGh0GovPrMACRg
VITE_FIREBASE_AUTH_DOMAIN=paradise-family.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=paradise-family
VITE_FIREBASE_STORAGE_BUCKET=paradise-family.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=477641412672
VITE_FIREBASE_APP_ID=1:477641412672:web:140084cd4275aab3b34fa5
VITE_FIREBASE_MEASUREMENT_ID=G-XWQXEJXV71
```

### 4. Install Dependencies
```bash
npm install
```

### 5. Start Development Server
```bash
npm run dev
```

Application will be available at: `http://localhost:5173`

## 📱 Testing Menu Types

After starting the server, test these URLs:

1. **Non-AC Menu**: `http://localhost:5173?menu=dinein-non-ac`
2. **AC Menu**: `http://localhost:5173?menu=dinein-ac`  
3. **Takeaway Menu**: `http://localhost:5173?menu=takeaway`

## 🔧 Development Workflow

### Daily Development
```bash
# Start your development session
npm run dev

# Make your changes in VS Code or your preferred editor

# Build for production testing
npm run build

# Preview production build
npm run preview
```

### File Structure You'll Work With
```
your-project-folder/
├── src/
│   ├── App.tsx              # Main app logic
│   ├── components/
│   │   ├── Header.tsx       # Navigation bar
│   │   ├── MenuGrid.tsx     # Menu display
│   │   ├── AdminPanel.tsx   # Admin interface
│   │   └── ui/              # UI components
│   ├── lib/
│   │   ├── firebase.ts      # Firebase config
│   │   └── utils.ts         # Utilities
│   └── assets/              # Images, etc.
├── package.json
├── index.html
└── .env.local               # Your environment file
```

## 🎯 What You Can Do Locally

### ✅ Full Functionality Available
- ✅ View all three menu types
- ✅ Browse menu categories
- ✅ Test responsive design
- ✅ Admin login (with Firebase)
- ✅ Add/edit/delete menu items
- ✅ Real-time menu updates

### 🔄 Development Features
- ✅ Hot reload - changes appear instantly
- ✅ Error messages in browser
- ✅ Browser developer tools
- ✅ TypeScript intellisense
- ✅ Tailwind CSS autocomplete

## 🏗️ Building for Production

When ready to deploy:
```bash
# Create production build
npm run build

# Test production build locally
npm run preview

# Deploy to Firebase (requires authentication)
npm run deploy
```

## 📋 Pre-Development Checklist

Before starting development, verify:

- [ ] Node.js installed (v18+)
- [ ] All files downloaded correctly
- [ ] `.env.local` file created
- [ ] Dependencies installed (`npm install` completed)
- [ ] Development server starts (`npm run dev` works)
- [ ] All three menu URLs load correctly
- [ ] VS Code or preferred editor ready

## 🆘 Common Issues & Solutions

### Port 5173 Already in Use
```bash
# Kill existing process
npm run kill
# Or use different port
npm run dev -- --port 3000
```

### Missing Dependencies
```bash
# Clear and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Environment Variables Not Working
- Ensure `.env.local` is in root directory (same level as `package.json`)
- Restart development server after creating `.env.local`
- Variables must start with `VITE_`

### Firebase Not Connecting
- Check internet connection
- Verify Firebase configuration in `.env.local`
- Check Firebase Console for project status

## 🎉 You're Ready!

After following these steps, you'll have:
- ✅ Complete restaurant menu application running locally
- ✅ Three different menu types with QR code support
- ✅ Admin panel for menu management
- ✅ Firebase integration for data persistence
- ✅ Full development environment setup

**Start coding and customize your Paradise Family Restaurant menu! 🍴**