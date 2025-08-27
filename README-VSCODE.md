# VS Code Development Setup

## Quick Start for VS Code Users

This guide will help you run the Paradise Family Restaurant Menu application in VS Code with full debugging and development capabilities.

## 🚀 One-Click Setup

### Method 1: Using the Start Script
1. **Windows**: Double-click `start-dev.bat`
2. **Mac/Linux**: Open terminal and run `bash start-dev.sh`

### Method 2: VS Code Tasks
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "Tasks: Run Task"
3. Select "Start Development Server"

### Method 3: Debug Mode
1. Press `F5` or go to Run & Debug panel
2. Select "Launch Chrome - Development"
3. This will start the dev server AND open Chrome with debugging

## 🔧 VS Code Configuration

The project includes pre-configured VS Code settings:

### Tasks (Ctrl+Shift+P → Tasks: Run Task)
- **Install Dependencies** - Runs npm install
- **Start Development Server** - Starts the app at localhost:5173
- **Build for Production** - Creates production build
- **Preview Production Build** - Test production build locally
- **Deploy to Firebase** - Deploys to hosting
- **Start Firebase Emulators** - Local Firebase testing
- **Kill Port 5173** - Stop server if port is busy

### Launch Configurations (F5 or Run & Debug)
- **Launch Chrome - Development** - Debug main app
- **Launch Chrome - Non-AC Menu** - Debug non-AC menu directly
- **Launch Chrome - AC Menu** - Debug AC menu directly
- **Launch Chrome - Takeaway Menu** - Debug takeaway menu directly

## 🎯 Testing Different Menus

Once the dev server is running, test these URLs:

1. **Main Menu**: `http://localhost:5173`
2. **Non-AC Dine-in**: `http://localhost:5173?menu=dinein-non-ac`
3. **AC Dine-in**: `http://localhost:5173?menu=dinein-ac`
4. **Takeaway**: `http://localhost:5173?menu=takeaway`
5. **Admin Panel**: Login through the main menu interface

## 🐛 Debugging Features

### Breakpoints
- Set breakpoints in any `.tsx` file by clicking line numbers
- Use F5 to launch with debugging enabled
- Variables, call stack, and console available in Debug panel

### Hot Reload
- Changes automatically refresh the browser
- State is preserved when possible
- Error overlay shows build issues instantly

### Developer Tools Integration
- React Developer Tools supported
- Full Chrome DevTools access
- Network tab for monitoring Firebase calls
- Console for debugging output

## 📁 Recommended Folder Structure in VS Code

```
📁 PARADISE-FAMILY-RESTAURANT/
├── 📁 src/
│   ├── 📄 App.tsx              ← Main app logic & routing
│   ├── 📄 index.css            ← Global styles & theme
│   ├── 📁 components/
│   │   ├── 📄 Header.tsx       ← Navigation & menu type selector
│   │   ├── 📄 MenuGrid.tsx     ← Menu items display
│   │   ├── 📄 AdminPanel.tsx   ← Admin CRUD operations
│   │   ├── 📄 LoginDialog.tsx  ← Firebase auth dialog
│   │   └── 📁 ui/              ← Shadcn UI components
│   ├── 📁 lib/
│   │   ├── 📄 firebase.ts      ← Firebase configuration
│   │   └── 📄 utils.ts         ← Utility functions
│   └── 📁 assets/              ← Images and static files
├── 📄 package.json             ← Dependencies & scripts
├── 📄 .env.local              ← Environment variables
├── 📄 firebase.json           ← Firebase hosting config
├── 📄 start-dev.bat           ← Windows quick start
└── 📄 start-dev.sh            ← Mac/Linux quick start
```

## 💡 VS Code Tips & Extensions

### Essential Extensions (Auto-suggested)
- **Tailwind CSS IntelliSense** - CSS class autocompletion
- **ES7+ React/Redux Snippets** - React code snippets  
- **TypeScript Importer** - Auto import management
- **Prettier** - Code formatting
- **Firebase** - Firebase project integration
- **Auto Rename Tag** - HTML/JSX tag syncing
- **Path Intellisense** - File path autocompletion

### Useful Shortcuts
- `Ctrl+`` - Toggle integrated terminal
- `Ctrl+Shift+P` - Open command palette
- `F5` - Start debugging session
- `Ctrl+Shift+F5` - Restart debugging session
- `F12` - Go to definition
- `Alt+Shift+F` - Format document
- `Ctrl+/` - Toggle line comment

### React Snippets (type in .tsx files)
- `rafce` - React arrow function component export
- `useState` - useState hook template
- `useEffect` - useEffect hook template
- `useCallback` - useCallback hook template

## 🔥 Firebase Development

### Local Testing with Emulators
```bash
# Start Firebase emulators (run in terminal)
npm run emulator:start

# Your app will use local Firebase instead of production
# Access at: http://localhost:5173
# Firebase UI: http://localhost:4000
```

### Admin Setup in Development
1. Start the app: `F5` or run "Start Development Server" task
2. Navigate to admin login in the app
3. Set up admin user in Firebase Console:
   - Go to Firestore Database
   - Create `admins` collection
   - Add document with `email` field matching your email
4. Login and test all admin features

## 🚨 Troubleshooting in VS Code

### Port Already in Use
1. Run Task: "Kill Port 5173"
2. Or use terminal: `npm run kill`
3. Try different port: modify `vite.config.ts`

### TypeScript Errors
1. `Ctrl+Shift+P` → "TypeScript: Reload Projects"
2. Check Problems panel (`Ctrl+Shift+M`)
3. Verify `tsconfig.json` configuration
4. Restart VS Code if needed

### Firebase Connection Issues
1. Verify `.env.local` exists with correct Firebase config
2. Check internet connection
3. Verify Firebase project status in console
4. Check VS Code Output panel for detailed error logs

### Hot Reload Not Working
1. Save file manually (`Ctrl+S`)
2. Hard refresh browser (`Ctrl+F5`)
3. Restart development server
4. Check terminal for any error messages

### Build/Import Errors
1. Clear node_modules: delete folder and run `npm install`
2. Check import paths are correct
3. Verify all dependencies in package.json
4. Restart TypeScript service in VS Code

## 🎨 Development Workflow

### Making Style Changes
1. **Global Theme**: Edit `src/index.css` (colors, fonts, spacing)
2. **Component Styles**: Use Tailwind classes in `.tsx` files
3. **Custom Components**: Modify files in `src/components/ui/`

### Adding Features
1. **Menu Management**: Edit `AdminPanel.tsx` and related components
2. **New Menu Types**: Update types in `App.tsx`
3. **Firebase Functions**: Modify `src/lib/firebase.ts`

### Testing Workflow
1. Save changes (auto-reload triggers)
2. Check browser for visual updates
3. Test across all three menu types
4. Verify admin functionality works
5. Test mobile responsiveness

## 📱 Mobile Testing in VS Code

### Browser Dev Tools
1. Open Chrome DevTools (`F12`)
2. Click device toolbar icon (phone icon)
3. Select mobile device presets
4. Test touch interactions

### Network Testing
1. Find your local IP address
2. Ensure phone is on same WiFi network
3. Access via `http://[YOUR-IP]:5173`
4. Test QR code functionality with phone

### VS Code Mobile Simulator
1. Install "Mobile View" extension
2. Use Command Palette: "Mobile View: Show"
3. Test responsive design changes

## 🎯 Development Tasks

### Daily Development Routine
1. **Start**: Run "Start Development Server" task
2. **Code**: Make changes in VS Code
3. **Test**: Check browser auto-reload
4. **Debug**: Use F5 for breakpoint debugging
5. **Commit**: Use VS Code Git integration

### Before Deployment
1. Run "Build for Production" task
2. Run "Preview Production Build" task
3. Test all menu types in production build
4. Check Firebase configuration
5. Deploy using "Deploy to Firebase" task

## 📊 Monitoring & Analytics

### Development Monitoring
- Use VS Code terminal for build logs
- Check Problems panel for issues
- Monitor Network tab in browser for API calls
- Use React DevTools for component inspection

### Firebase Monitoring
- Check Firebase Console for database changes
- Monitor Authentication users
- Review Hosting deployment status
- Check Firestore security rules

## 🔧 Advanced VS Code Features

### Multi-cursor Editing
- `Alt+Click` - Add cursor
- `Ctrl+Alt+Down` - Add cursor below
- `Ctrl+D` - Select next occurrence

### Code Navigation
- `Ctrl+Click` - Go to definition
- `Alt+Left/Right` - Navigate back/forward
- `Ctrl+Shift+O` - Go to symbol in file
- `Ctrl+T` - Go to symbol in workspace

### Git Integration
- `Ctrl+Shift+G` - Open source control
- `Ctrl+Enter` - Commit staged changes
- View diffs inline
- Branch switching from status bar

## 📞 Getting Help

### VS Code Resources
1. **Help Menu** - Built-in documentation
2. **Command Palette** - Search all available commands
3. **Problems Panel** - Shows errors and warnings
4. **Output Panel** - Detailed logs from tools
5. **Debug Console** - Runtime debugging information

### Project-Specific Help
1. Check `LOCAL-SETUP-GUIDE.md` for general setup
2. Review `DOWNLOAD-INSTRUCTIONS.md` for installation
3. Check Firebase Console for backend issues
4. Use browser DevTools for frontend debugging

---

**Enjoy developing your restaurant menu app in VS Code! 🍴**

## Troubleshooting
- If you see import errors, run `npm install`
- If Firebase doesn't work, check your internet connection
- For styling issues, ensure Tailwind CSS is properly configured