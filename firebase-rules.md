# Firebase Firestore Security Rules

Place the following rules in your Firebase console under Firestore Database > Rules:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Menu items collection - public read, admin write
    match /menuItems/{document} {
      // Allow public read access for all menu items
      allow read: if true;
      
      // Allow write access for authenticated admin users
      // Note: You'll need to implement proper admin authentication
      allow write: if request.auth != null;
    }
    
    // Admin configuration (optional)
    match /adminConfig/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Block all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Important Security Notes:

1. **Authentication**: Currently, any authenticated user can write to the database. In production, you should:
   - Implement proper admin role management
   - Add custom claims to distinguish admin users
   - Update rules to check for admin privileges

2. **Public Access**: Menu items are publicly readable, which is appropriate for a restaurant menu.

3. **Enhanced Security**: Consider adding:
   - Field validation in rules
   - Rate limiting
   - Admin user management
   - Audit logging

## Firestore Collections Structure:

### menuItems
```
{
  name: string,
  description: string,
  prices: {
    "dinein-non-ac": number,
    "dinein-ac": number,
    "takeaway": number
  },
  category: string,
  available: boolean,
  image?: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```