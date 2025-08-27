# Firebase Admin Setup Guide

## Quick Setup (Recommended)

1. **Deploy and Access Your Site**
   - Go to your deployed URL: `https://paradise-family.web.app`
   - Sign in with Google using the login button

2. **Run Admin Setup Script**
   - Open browser developer tools (F12)
   - Go to Console tab
   - Copy and paste the entire content of `setup-admin.js` 
   - Press Enter to execute
   - Refresh the page to see admin features

## Manual Setup (Alternative)

If the script doesn't work, manually add admin through Firebase Console:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/paradise-family/firestore

2. **Create Admin Collection**
   - Click "Start collection" 
   - Collection ID: `admins`

3. **Add Your Admin Document**
   - Document ID: `your-email@gmail.com` (use your actual email)
   - Add fields:
     - `email`: `"your-email@gmail.com"` (string)
     - `addedAt`: (timestamp) - current date/time  
     - `isActive`: `true` (boolean)

4. **Save and Test**
   - Save the document
   - Refresh your restaurant app
   - You should now see admin features

## Verification

After setup, you should see:
- ✅ Admin panel at bottom of menu
- ✅ Add/Edit/Delete menu item buttons
- ✅ Menu type selector in header
- ✅ Success toast: "Signed in as admin"

## Firestore Security Rules

Make sure your Firestore rules allow admin operations. Example rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow admin users to read/write admins collection
    match /admins/{email} {
      allow read, write: if request.auth != null && request.auth.token.email == email;
    }
    
    // Allow admin users to manage menu
    match /restaurant/{document} {
      allow read: if true; // Public read for menu
      allow write: if request.auth != null && 
        exists(/databases/$(database)/documents/admins/$(request.auth.token.email)) &&
        get(/databases/$(database)/documents/admins/$(request.auth.token.email)).data.isActive == true;
    }
  }
}
```

## Troubleshooting

**Script not working?**
- Make sure you're on the deployed site (not localhost)
- Ensure you're signed in with Google first
- Check browser console for error messages

**Still no admin access?**
- Verify the admin document exists in Firestore
- Check that `isActive` field is set to `true`
- Try signing out and signing back in

**Permission errors?**
- Update Firestore security rules as shown above
- Make sure Firebase Authentication is enabled