# Admin Setup Instructions

After deploying your Paradise Family Restaurant app, you need to set up admin access:

## Step 1: Deploy the Application
```bash
npm run deploy
```

## Step 2: Set Up Your First Admin User

### Option A: Using Firebase Console (Recommended)
1. Go to [Firebase Console](https://console.firebase.google.com/project/paradise-family)
2. Navigate to **Firestore Database**
3. Click **Start collection**
4. Collection ID: `admins`
5. Document ID: Your Gmail address (e.g., `your.email@gmail.com`)
6. Add fields:
   ```
   email: your.email@gmail.com (string)
   addedAt: [current timestamp]
   isActive: true (boolean)
   ```
7. Click **Save**

### Option B: Using the Admin Setup Script
```bash
node admin-setup.js your.email@gmail.com
```

## Step 3: Test Admin Access
1. Visit your deployed app: https://paradise-family.web.app
2. Click the login button (should appear in header)
3. Sign in with the Google account you added as admin
4. You should now see the "Add New Item" button and admin features

## Step 4: Add Additional Admins
Once you're logged in as admin, you can add more admin users through the admin panel, or repeat the Firebase Console steps above.

## Important Notes:
- Only Google accounts can be admins (configured in the authentication system)
- Admin emails must be exactly as they appear in Google (case-sensitive)
- Changes to admin status may take a few minutes to propagate

## Troubleshooting:
- If admin features don't appear, check browser console for errors
- Verify the email in Firestore matches exactly with your Google account
- Clear browser cache and try again
- Check Firebase Authentication logs in the console