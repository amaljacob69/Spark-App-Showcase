# Firebase Integration Setup

This restaurant menu application now includes Firebase Firestore integration for persistent data storage and real-time updates.

## Firebase Configuration

The application is configured to use your Firebase project with the following details:
- Project ID: `paradise-family`
- Auth Domain: `paradise-family.firebaseapp.com`
- Storage Bucket: `paradise-family.firebasestorage.app`

## Features

### 🔥 Real-time Data Sync
- Menu items sync in real-time across all devices
- Instant updates when admin makes changes
- Offline fallback with local sample data

### 📱 QR Code Support
- Three separate menu URLs for different pricing:
  - `?menu=dinein-non-ac` - Non-AC dining menu
  - `?menu=dinein-ac` - AC dining menu  
  - `?menu=takeaway` - Takeaway menu

### 🔐 Admin Panel
- Add, edit, and delete menu items
- Real-time updates to Firebase
- Three separate price points per item

## Setup Instructions

### 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your `paradise-family` project
3. Enable Firestore Database
4. Set up authentication (if needed)

### 2. Firestore Security Rules

Copy the rules from `firebase-rules.md` into your Firestore Rules tab in the Firebase Console.

### 3. Environment Variables (Optional)

Create a `.env.local` file with your Firebase config (already created) or modify the existing one.

### 4. Initialize Sample Data

The application will automatically populate Firestore with sample menu items on first load.

## File Structure

```
src/
├── lib/
│   ├── firebase.ts          # Firebase configuration
│   └── firebaseService.ts   # Firestore operations
├── hooks/
│   └── useFirebaseMenu.ts   # Firebase menu hook
└── components/
    ├── FirebaseStatus.tsx   # Connection status indicator
    └── LoadingSkeleton.tsx  # Loading UI components
```

## Data Structure

### Menu Items Collection (`menuItems`)

```typescript
{
  id: string (auto-generated)
  name: string
  description: string
  prices: {
    "dinein-non-ac": number
    "dinein-ac": number  
    "takeaway": number
  }
  category: string
  available: boolean
  image?: string
  createdAt: Firebase Timestamp
  updatedAt: Firebase Timestamp
}
```

## Usage

### For Customers
- Scan QR code to view specific menu (Non-AC, AC, or Takeaway)
- Browse menu items with appropriate pricing
- Real-time updates when items change

### For Admin
1. Click "Admin" in header
2. Login with credentials
3. Add/edit/delete menu items
4. Changes sync instantly to all devices

## Troubleshooting

### Connection Issues
- Check Firebase project configuration
- Verify Firestore is enabled
- Check browser console for errors
- Application falls back to offline mode automatically

### Authentication Issues  
- Ensure Firebase Auth is enabled
- Check security rules allow appropriate access
- Verify admin credentials

### Performance
- Uses real-time listeners for instant updates
- Implements loading skeletons for better UX
- Graceful fallback to local data if Firebase unavailable

## Security Considerations

⚠️ **Important**: The current setup uses basic authentication. For production:

1. Implement proper admin role management
2. Add custom claims for admin users
3. Update Firestore rules for enhanced security
4. Consider implementing audit logging
5. Add field validation in security rules

## Cost Optimization

- Uses Firestore real-time listeners efficiently
- Minimal read/write operations
- Consider implementing pagination for large menus
- Monitor usage in Firebase Console