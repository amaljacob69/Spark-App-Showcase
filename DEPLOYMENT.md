# Firebase Deployment Guide for Paradise Family Restaurant

## Prerequisites
- Node.js installed on your system
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Access to the Firebase project: `paradise-family`

## Quick Deployment Commands
```bash
# Full deployment (recommended for first deployment)
npm run deploy

# Deploy only hosting (faster for code changes)
npm run deploy:hosting

# Deploy only Firestore rules (for security rule changes)
npm run deploy:rules
```

## Manual Step-by-Step Deployment

### Step 1: Build the Application
```bash
npm run build
```
This creates a `dist` folder with production-ready files.

### Step 2: Login to Firebase
```bash
firebase login
```
Select your Google account that has access to the `paradise-family` project.

### Step 3: Verify Project Configuration
```bash
firebase projects:list
```
Ensure `paradise-family` is listed and active.

### Step 4: Deploy Everything
```bash
firebase deploy
```

### Step 5: Verify Deployment
Visit your deployed application at:
- **Primary URL**: https://paradise-family.web.app
- **Secondary URL**: https://paradise-family.firebaseapp.com

## Configuration Files Created
- `.firebaserc` - Project configuration
- `firebase.json` - Hosting and Firestore configuration  
- `firestore.rules` - Database security rules
- `firestore.indexes.json` - Database performance indexes
- `.env.production` - Production environment variables

## Direct Menu Links for QR Codes
Once deployed, generate QR codes for these specific menu URLs:

### Dine-in Non-AC Menu
```
https://paradise-family.web.app?menu=dinein-non-ac
```

### Dine-in AC Menu  
```
https://paradise-family.web.app?menu=dinein-ac
```

### Takeaway Menu
```
https://paradise-family.web.app?menu=takeaway
```

## First-Time Admin Setup
After deployment, you need to add the first admin user:

### Option 1: Manual Firestore Entry
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select `paradise-family` project
3. Navigate to Firestore Database
4. Create a new collection called `admins`
5. Add a document with your email as the document ID
6. Add fields:
   - `email`: your-email@example.com
   - `isActive`: true
   - `addedAt`: current timestamp
   - `role`: "super-admin"

### Option 2: Using Admin Setup Script
1. Open your deployed app in browser
2. Open browser console (F12)
3. Edit `admin-setup.js` with your email address
4. Copy and paste the script code in console
5. Uncomment the last line and run it

## Environment Variables
Production environment variables are configured in `.env.production`:
- Firebase configuration
- Application settings

## Security Configuration
The Firestore security rules ensure:
- ✅ Public read access to menu items
- ✅ Only authenticated admins can modify menu items  
- ✅ Admin access controlled through `/admins` collection
- ✅ Users can only read their own admin status

## Performance Optimizations
- Static asset caching (1 year)
- Gzip compression
- Single Page Application routing
- Firestore indexes for optimal queries

## Monitoring & Analytics
Firebase Analytics is configured to track:
- Page views
- User engagement
- Menu interaction patterns
- Performance metrics

## Troubleshooting Common Issues

### Build Errors
```bash
# Clear node modules and rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Authentication Issues
```bash
# Re-login to Firebase
firebase logout
firebase login
```

### Permission Errors
1. Verify you have Editor/Owner role in Firebase project
2. Check project ID in `.firebaserc` matches your project

### Deployment Failures
1. Check internet connection
2. Verify Firebase project quota limits
3. Review Firebase Console for error messages

## Post-Deployment Checklist
- [ ] App loads at both URLs
- [ ] All three menu types display correctly
- [ ] QR code links work for specific menus
- [ ] Admin login functionality works
- [ ] Menu items can be added/edited/deleted by admin
- [ ] Firestore data persists correctly
- [ ] Mobile responsive design works
- [ ] Performance is acceptable (< 3s load time)

## Maintenance Commands
```bash
# View deployment history
firebase hosting:clone

# Rollback to previous version if needed  
firebase hosting:rollback

# Monitor real-time usage
firebase hosting:channel:open live
```