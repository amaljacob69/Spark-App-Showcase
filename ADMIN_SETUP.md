# Firebase Admin User Setup Guide

## Overview
This guide explains how to add additional admin users to your Paradise Family Restaurant menu system through both the web interface and Firebase Console.

## Method 1: Using the Web Interface (Recommended)

### Prerequisites
- You must already be logged in as an admin user
- The new user must have a Google account

### Steps
1. **Access Admin Settings**
   - Log into the restaurant menu system as an admin
   - Click the "Settings" button in the top-right header
   - Select "Manage Admin Users"

2. **Add New Admin**
   - Enter the user's Gmail address in the email field
   - Click "Add Admin" button
   - The system will create the admin record

3. **User First Login**
   - The new admin user must visit the site and sign in with Google first
   - After signing in, they will automatically have admin privileges
   - They can then access the admin panel to manage menu items

## Method 2: Using Firebase Console (Alternative)

### Prerequisites
- Access to the Firebase Console for the `paradise-family` project
- Understanding of Firestore database structure

### Steps
1. **Access Firebase Console**
   - Visit [Firebase Console](https://console.firebase.google.com/project/paradise-family/firestore)
   - Navigate to Firestore Database

2. **Navigate to Admin Collection**
   - Click on the `admins` collection in Firestore
   - If the collection doesn't exist, create it

3. **Add New Admin Document**
   - Click "Add document"
   - Set the **Document ID** to the user's email address (e.g., `user@gmail.com`)
   - Add the following fields:
     ```
     email (string): user@gmail.com
     isActive (boolean): true
     addedAt (timestamp): [current date/time]
     ```

4. **Save the Document**
   - Click "Save" to create the admin user record

## Admin User Management Features

### Through Web Interface
- **View All Admins**: See all current admin users with their status
- **Add New Admins**: Add users by email address
- **Remove Admins**: Remove admin privileges (except for yourself)
- **Real-time Updates**: Changes are immediately reflected

### Admin Privileges
Once a user is added as an admin, they can:
- Add new menu items with pricing for all three menu types
- Edit existing menu items and their prices
- Delete menu items
- Toggle item availability
- Manage other admin users
- View admin settings and documentation

## Security Features

### Authentication
- Only Google-authenticated users can become admins
- Users must sign in at least once before admin access is granted
- Firebase Authentication handles all security aspects

### Authorization
- Admin status is checked on every page load
- Admin privileges are required for all management functions
- Users cannot grant admin privileges to themselves

### Data Protection
- All admin operations are logged and timestamped
- Menu data is automatically backed up to Firebase Firestore
- Changes are synchronized across all users in real-time

## Troubleshooting

### Common Issues

**"User doesn't have admin access after being added"**
- Ensure the user has signed in with Google at least once
- Check that the email address matches exactly (case-sensitive)
- Verify the document exists in the `admins` collection

**"Cannot add admin user"**
- Ensure you're logged in as an existing admin
- Check internet connection for Firebase access
- Verify the email format is correct

**"Admin settings not visible"**
- Confirm you're logged in as an admin user
- Refresh the page to reload authentication status
- Check browser console for any errors

### Direct Database Verification
To verify admin users in Firebase Console:
1. Go to Firestore Database
2. Navigate to the `admins` collection
3. Each document should have:
   - Document ID matching the user's email
   - `isActive: true`
   - `addedAt: [timestamp]`
   - `email: [user's email]`

## Support
For additional support or issues:
1. Check the browser console for error messages
2. Verify Firebase project settings
3. Ensure proper internet connectivity
4. Contact the system administrator

## Production URLs
- **Main Application**: https://paradise-family.web.app
- **Non-AC Menu**: https://paradise-family.web.app?menu=dinein-non-ac
- **AC Menu**: https://paradise-family.web.app?menu=dinein-ac  
- **Takeaway Menu**: https://paradise-family.web.app?menu=takeaway