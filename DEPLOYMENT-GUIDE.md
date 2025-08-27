# Firebase Deployment Guide

## Prerequisites Complete ✅
- Firebase project configured: `paradise-family`
- Firebase tools installed
- Authentication set up
- Firestore configured
- Build configuration ready

## Deploy to Firebase Hosting

### Option 1: Using NPM Scripts (Recommended)
```bash
# Build and deploy in one command
npm run deploy

# Or deploy only hosting
npm run deploy:hosting
```

### Option 2: Using Individual Commands
```bash
# Build the application
npm run build

# Deploy to Firebase
npx firebase deploy
```

### Option 3: Using the Deployment Script
```bash
# Run the deployment script
./deploy.sh
```

## Your Application URLs
After successful deployment, your app will be available at:
- **Primary:** https://paradise-family.web.app
- **Secondary:** https://paradise-family.firebaseapp.com

## Direct Menu Access URLs
Your QR codes should point to:
- **Non-AC Menu:** https://paradise-family.web.app?menu=dinein-non-ac
- **AC Menu:** https://paradise-family.web.app?menu=dinein-ac  
- **Takeaway Menu:** https://paradise-family.web.app?menu=takeaway

## Admin Access
- Admin panel accessible after Google sign-in
- Admin emails must be pre-configured in Firestore `admins` collection

## Troubleshooting

### If "Site Not Found" Error:
1. Wait 5-10 minutes for DNS propagation
2. Try the .firebaseapp.com domain
3. Check Firebase console hosting section

### If Build Fails:
1. Clear node_modules: `rm -rf node_modules && npm install`
2. Clear build cache: `rm -rf dist`
3. Try building again: `npm run build`

## Post-Deployment Verification
Run the verification script to test all functionality:
```bash
node verify-deployment.js
```

## Firebase Console Access
Monitor your app at: https://console.firebase.google.com/project/paradise-family