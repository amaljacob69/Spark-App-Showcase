# Paradise Family Restaurant Menu Application

A modern restaurant menu application with Firebase integration, featuring separate pricing for dine-in AC, non-AC, and takeaway options.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher)
- [VS Code](https://code.visualstudio.com/)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for deployment)

## Getting Started in VS Code

### 1. Install Dependencies

Open the integrated terminal in VS Code (`Ctrl+`` ` or `View > Terminal`) and run:

```bash
npm install
```

### 2. Development Server

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 3. VS Code Extensions (Recommended)

Install these VS Code extensions for better development experience:

- **ES7+ React/Redux/React-Native snippets** - React code snippets
- **Tailwind CSS IntelliSense** - Tailwind CSS autocomplete
- **Firebase** - Firebase syntax highlighting
- **TypeScript and JavaScript Language Features** - Built-in TS support
- **Prettier** - Code formatting
- **Auto Rename Tag** - HTML/JSX tag management

### 4. Firebase Setup (Already Configured)

The application is configured to connect to your Firebase project:
- Project ID: `paradise-family`
- Authentication is set up for admin access
- Firestore is used for menu data storage

### 5. Menu Access URLs

The application supports direct menu links via URL parameters:

- **Non-AC Menu**: `http://localhost:5173?menu=dinein-non-ac`
- **AC Menu**: `http://localhost:5173?menu=dinein-ac`
- **Takeaway Menu**: `http://localhost:5173?menu=takeaway`

### 6. Admin Access

- Navigate to the application
- Click the "Admin Login" button in the header
- Sign in with your Firebase authenticated account
- Add, edit, and manage menu items through the admin panel

## Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # shadcn UI components
│   ├── AdminPanel.tsx   # Admin interface
│   ├── Header.tsx       # Navigation header
│   ├── MenuGrid.tsx     # Menu display
│   └── ...
├── lib/                 # Utilities and Firebase config
├── assets/             # Static assets
├── App.tsx             # Main application component
└── index.css           # Global styles
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Firebase Deployment

To deploy to Firebase Hosting:

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

Your application will be available at:
- https://paradise-family.web.app
- https://paradise-family.firebaseapp.com

## Development Tips

1. **Hot Reload**: The dev server automatically reloads when you save changes
2. **Browser DevTools**: Use React DevTools extension for debugging
3. **Firebase Console**: Monitor data and authentication at https://console.firebase.google.com
4. **Responsive Design**: Test different screen sizes using browser dev tools

## Troubleshooting

If you encounter issues:

1. **Port already in use**: Kill the process or use a different port:
   ```bash
   npm run dev -- --port 3000
   ```

2. **Firebase connection issues**: Check your internet connection and Firebase config

3. **Node modules issues**: Clear cache and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

## Support

For Firebase-specific issues, refer to the [Firebase Documentation](https://firebase.google.com/docs).