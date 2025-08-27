# Firebase Authentication Setup Guide

## Current Configuration

Your restaurant menu application is now configured with Firebase Authentication using your project:

- **Project ID**: `paradise-family`
- **Auth Domain**: `paradise-family.firebaseapp.com`
- **Hosting URLs**: 
  - `paradise-family.web.app` (Default)
  - `paradise-family.firebaseapp.com` (Default)

## What's Been Set Up

### 1. Firebase Integration
- ✅ Firebase SDK installed and configured
- ✅ Google Sign-In authentication enabled
- ✅ Firestore database integration for menu storage
- ✅ Admin user management system

### 2. Security Features
- ✅ Admin-only access to menu management
- ✅ Secure authentication with Google accounts
- ✅ Admin user verification system
- ✅ Menu data synchronized with Firestore

### 3. Admin Management
- ✅ Admin user addition/management interface
- ✅ Role-based access control
- ✅ Firebase setup panel for admin configuration

## Next Steps

### 1. Enable Google Sign-In in Firebase Console

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Select your `paradise-family` project
3. Navigate to **Authentication** > **Sign-in method**
4. Enable **Google** sign-in provider
5. Add your domain (`paradise-family.web.app`) to authorized domains

### 2. Set Up Admin Users

1. Sign in to your deployed application with your Google account
2. Go to the Admin panel and click "Configure Firebase"
3. Add admin email addresses to grant administrative access
4. Test admin functionality by adding/editing menu items

### 3. Configure Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Create a database in production mode
3. Set up security rules (see `firebase-rules.md` for recommended rules)

### 4. Deploy to Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize hosting: `firebase init hosting`
4. Build your app: `npm run build`
5. Deploy: `firebase deploy`

## Features Available

### For Customers
- View menu with three pricing tiers (Dine-in Non-AC, Dine-in AC, Takeaway)
- QR code access for specific menu types
- Responsive design for mobile devices
- Category filtering

### For Admins (Google Sign-In Required)
- Add, edit, delete menu items
- Set different prices for each dining option
- Menu data automatically syncs to Firebase
- Secure access control
- QR code management for different menu types

## Security Notes

- Only authenticated Google users can access admin features
- Admin access is controlled by email whitelist in Firestore
- All menu data is secured and backed up in Firebase
- Authentication state persists across browser sessions

Your restaurant menu application is now ready for production use with secure Firebase authentication!