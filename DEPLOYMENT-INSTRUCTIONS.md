# Paradise Family Restaurant - Firebase Deployment Instructions

## Current Issue
The "site not found" error occurs because the project hasn't been built and deployed to Firebase Hosting yet.

## Quick Deployment Steps

### 1. Build the Project
```bash
npm run build
```
This creates the `dist` folder with your compiled application.

### 2. Deploy to Firebase
```bash
npm run deploy
```
or 
```bash
firebase deploy
```

### 3. Alternative: Use the deployment script
```bash
chmod +x deploy.sh
./deploy.sh
```

## Firebase Project Configuration ✅

Your Firebase project is already configured:
- **Project ID**: `paradise-family`
- **Domains**: 
  - `paradise-family.web.app` (primary)
  - `paradise-family.firebaseapp.com` (secondary)

## What's Already Set Up ✅

1. **Firebase Configuration**: All Firebase services are configured
2. **Authentication**: Google Auth is set up for admin access
3. **Firestore**: Database rules and menu data persistence
4. **Build Configuration**: Vite build is configured to output to `dist/`
5. **Firebase Hosting**: Configured to serve from `dist/` folder

## After Successful Deployment

Once deployed, your app will be available at:
- **Main URL**: https://paradise-family.web.app
- **Alt URL**: https://paradise-family.firebaseapp.com

### Direct Menu Links (for QR codes):
- **Non-AC Menu**: https://paradise-family.web.app?menu=dinein-non-ac
- **AC Menu**: https://paradise-family.web.app?menu=dinein-ac  
- **Takeaway Menu**: https://paradise-family.web.app?menu=takeaway

## Admin Access Setup

1. Deploy the application first
2. Visit the deployed URL
3. Use the "Admin Login" button to sign in with Google
4. The first admin user needs to be manually added to Firestore:
   - Go to Firebase Console → Firestore Database
   - Create collection: `admins`
   - Add document with email as document ID
   - Set fields: `{ email: "your@email.com", isActive: true, addedAt: timestamp }`

## Troubleshooting

If you encounter issues:

1. **Build fails**: Check for TypeScript errors in the console
2. **Deploy fails**: Ensure you're logged into Firebase CLI: `firebase login`
3. **Site not found**: Wait 5-10 minutes after deployment for DNS propagation
4. **Admin access denied**: Check Firestore `admins` collection

## Firebase CLI Commands

```bash
# Login to Firebase (if not already logged in)
firebase login

# Check project status
firebase projects:list

# Deploy only hosting
firebase deploy --only hosting

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# View deployment logs
firebase hosting:channel:list
```

## Project Structure

```
dist/                 # Built files (created by npm run build)
├── index.html        # Main HTML file
├── assets/           # CSS, JS, and asset files
└── ...

firebase.json         # Firebase configuration
.firebaserc          # Project mapping
firestore.rules      # Database security rules
```

## Current Status
- ❌ Project not built (no `dist` folder)
- ❌ Not deployed to Firebase Hosting
- ✅ Firebase project configured
- ✅ Authentication set up
- ✅ Firestore configured
- ✅ All code ready for deployment

**Next Step**: Run `npm run build` followed by `firebase deploy`