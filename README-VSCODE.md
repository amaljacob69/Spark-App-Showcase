# VS Code Setup for Paradise Family Restaurant Menu

## Quick Start

### Method 1: VS Code Command Palette
1. Open VS Code in this project folder
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Tasks: Run Task"
4. Select "Start Development Server"
5. The app will open at http://localhost:5173

### Method 2: Integrated Terminal
1. Open VS Code terminal: `Ctrl+`` (backtick)
2. Run: `npm install` (first time only)
3. Run: `npm run dev`
4. Open http://localhost:5173 in your browser

### Method 3: Debug Mode
1. Go to Run and Debug (Ctrl+Shift+D)
2. Select "Launch Development Server"
3. Press F5 to start with debugging

## Menu Access URLs
- **Main Menu**: http://localhost:5173
- **Non-AC Menu**: http://localhost:5173?menu=dinein-non-ac
- **AC Menu**: http://localhost:5173?menu=dinein-ac  
- **Takeaway Menu**: http://localhost:5173?menu=takeaway

## Admin Access
1. Click the lock icon in the header
2. Sign in with your Firebase admin account
3. You can add/edit menu items once authenticated

## Project Structure
```
src/
├── components/         # React components
├── lib/               # Firebase & utilities
├── App.tsx            # Main application
└── index.css          # Styles & theme
```

## Available Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Firebase Integration
The app automatically syncs with Firebase Firestore for menu data persistence and Firebase Auth for admin authentication.

## Troubleshooting
- If you see import errors, run `npm install`
- If Firebase doesn't work, check your internet connection
- For styling issues, ensure Tailwind CSS is properly configured