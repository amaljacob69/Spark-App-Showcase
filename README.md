# 🍽️ Paradise Family Restaurant Menu

A modern restaurant menu application with Firebase integration, admin panel, and different pricing tiers for dine-in AC, non-AC, and takeaway options.

![Restaurant Menu App](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Latest-FFCA28?style=flat-square&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite)

## 📂 Save to GitHub Repository

**Ready to save your project to GitHub?** Choose your preferred method:

- 🚀 **Step-by-Step Guide**: [CREATE-GITHUB-REPOSITORY.md](./CREATE-GITHUB-REPOSITORY.md) - *Complete walkthrough with VS Code*
- ✅ **Interactive Checklist**: [GITHUB-REPOSITORY-CHECKLIST.md](./GITHUB-REPOSITORY-CHECKLIST.md) - *Guided checklist format*
- ⚡ **Quick Commands**: [GIT-QUICK-START.md](./GIT-QUICK-START.md) - *Copy-paste commands for experienced users*
- 📋 **Detailed Guide**: [GITHUB-SETUP.md](./GITHUB-SETUP.md) - *Comprehensive explanation with tips*

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- VS Code (recommended)
- Firebase account (for deployment)

### Installation & Setup

1. **Open in VS Code**
   ```bash
   code .
   ```

2. **Install Dependencies**
   Open VS Code terminal (`Ctrl/Cmd + ``) and run:
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   - The app will run at `http://localhost:5173`
   - VS Code will show the URL in terminal

### 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check
```

### 🎯 Features

- **Three Menu Types**: Dine-in Non-AC, Dine-in AC, and Takeaway with different pricing
- **Admin Panel**: Add, edit, delete menu items (requires Firebase authentication)
- **Firebase Integration**: Real-time data sync and authentication
- **QR Code Ready**: Direct links for each menu type
- **Responsive Design**: Works on all devices

### 📱 Direct Menu URLs

Once running, access specific menus:
- **Non-AC Dine-in**: `http://localhost:5173?menu=dinein-non-ac`
- **AC Dine-in**: `http://localhost:5173?menu=dinein-ac`
- **Takeaway**: `http://localhost:5173?menu=takeaway`

### 🔐 Admin Access

1. Click "Admin Login" in the header
2. Sign in with your Firebase Google account
3. Ensure your email is added as an admin in Firebase Console

### 🚀 Deployment

The app is configured for Firebase Hosting:

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**:
   ```bash
   firebase deploy
   ```

### 🛠️ VS Code Tips

- Use `Ctrl/Cmd + Shift + P` → "TypeScript: Restart TS Server" if you see type errors
- Install "ES7+ React/Redux/React-Native snippets" extension for faster coding
- Use `Ctrl/Cmd + ` to open/close the integrated terminal

### 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # App header with navigation
│   ├── MenuGrid.tsx    # Menu items display
│   └── AdminPanel.tsx  # Admin management interface
├── lib/                # Utilities and Firebase config
├── App.tsx             # Main application component
└── index.css           # Global styles
```

### 🔧 Troubleshooting

**If the app won't start:**
1. Delete `node_modules` folder
2. Delete `package-lock.json`
3. Run `npm install` again
4. Run `npm run dev`

**If Firebase features don't work:**
- Check Firebase config in `src/lib/firebase.ts`
- Ensure Firestore security rules are properly configured
- Verify authentication setup in Firebase Console