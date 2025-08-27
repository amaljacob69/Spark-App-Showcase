# Firestore Security Rules Documentation

## Overview

This document describes the comprehensive security rules implemented for the Paradise Family Restaurant menu application. These rules ensure data integrity, prevent unauthorized access, and protect against common security vulnerabilities.

## Security Features

### 🔒 **Authentication & Authorization**

- **Admin Authentication**: Only verified Google accounts listed in the `admins` collection can modify menu data
- **Email Verification**: Requires `email_verified` token claim to prevent unverified account access
- **Active Status Check**: Admins must have `isActive: true` to perform write operations

### 📋 **Data Validation**

- **Menu Structure**: Validates complete menu data structure including required fields
- **Price Validation**: Ensures all three pricing tiers (non-AC, AC, takeaway) are present and within reasonable bounds (0-10,000)
- **Item Limits**: Restricts menu to maximum 100 items to prevent abuse
- **Type Safety**: Enforces strict data types (strings, numbers, booleans, timestamps)

### 🛡️ **Access Controls**

#### Public Access
- **Menu Reading**: Anyone can read menu items (for customer access)
- **No Anonymous Writes**: All write operations require authentication

#### Admin Access
- **Menu Management**: Only verified admins can create, update, or delete menu items
- **Admin Management**: Only existing admins can manage other admin accounts
- **Self-Protection**: Admins cannot delete their own accounts (prevents lockout)

### 🚫 **Security Restrictions**

- **Email Format Validation**: Ensures valid email format for admin accounts
- **Timestamp Validation**: Requires proper timestamp fields for audit trails
- **Default Deny**: All unspecified document access is denied by default
- **Input Sanitization**: Validates data structure before allowing writes

## Rule Structure

### 1. Menu Data (`/restaurant/menu`)

```javascript
// Public read, admin write only
allow read: if true;
allow write: if isValidAdmin() && isValidMenuData();
```

**Validation includes:**
- Required fields: `items`, `updatedAt`
- Items array with maximum 100 entries
- Proper pricing structure for all three menu types
- Price ranges between 0-10,000

### 2. Admin Users (`/admins/{email}`)

```javascript
// Admins can read all, users can read own record
allow read: if isValidAdmin() || (request.auth != null && request.auth.token.email == email);

// Only admins can manage admin accounts
allow create, update: if isValidAdmin() && isValidAdminData(email);
allow delete: if isValidAdmin() && email != request.auth.token.email;
```

**Protection features:**
- Prevents admin self-deletion (avoiding lockout)
- Validates admin data structure
- Requires active admin status for management operations

### 3. Security Functions

#### `isValidAdmin()`
- Checks authentication status
- Validates email verification
- Confirms admin record exists
- Verifies active status

#### `isValidMenuData()`
- Validates menu structure
- Checks item count limits
- Ensures proper pricing format
- Validates timestamps

#### `isValidAdminData()`
- Validates email format
- Ensures required fields
- Type-checks all data

## Deployment Commands

### Deploy Rules to Production

```bash
# Deploy security rules
firebase deploy --only firestore:rules

# Deploy with specific project
firebase deploy --only firestore:rules --project paradise-family
```

### Test Rules (Recommended)

```bash
# Run local emulator with rules
firebase emulators:start --only firestore

# Test specific rules
firebase firestore:rules:test --project paradise-family
```

## Common Security Scenarios

### ✅ **Allowed Operations**

1. **Customer reads menu**: Anyone can view menu items
2. **Admin adds menu item**: Authenticated admin creates properly structured item
3. **Admin updates prices**: Active admin modifies existing item with valid pricing
4. **Admin adds new admin**: Existing admin creates new admin account with proper structure
5. **User reads own admin status**: Users can check their own admin record

### ❌ **Blocked Operations**

1. **Anonymous menu changes**: Unauthenticated users cannot modify menu
2. **Invalid price ranges**: Items with prices outside 0-10,000 range rejected
3. **Malformed data**: Requests missing required fields are denied
4. **Self admin deletion**: Admins cannot remove their own access
5. **Unverified email access**: Accounts without verified emails cannot write
6. **Inactive admin writes**: Admins with `isActive: false` cannot make changes

## Security Best Practices

### 📱 **Application Level**

- Always validate data on client side before sending to Firestore
- Implement proper error handling for rule violations
- Use least-privilege principle for admin access
- Regularly audit admin user list

### 🏗️ **Infrastructure Level**

- Enable Firebase Security Rules monitoring
- Set up alerts for rule violations
- Regularly review and update rules
- Use Firebase App Check for additional DDoS protection

### 👥 **Admin Management**

- Regularly review admin user list
- Remove inactive admin accounts
- Use strong Google account authentication
- Monitor admin activity logs

## Monitoring & Alerts

### Firebase Console Monitoring

1. **Security Rules Tab**: Monitor rule performance and violations
2. **Usage Tab**: Track read/write operations
3. **Authentication Tab**: Monitor login attempts and user activity

### Recommended Alerts

- Multiple failed authentication attempts
- Unusual write operation patterns
- Large data uploads (potential abuse)
- Admin user changes

## Troubleshooting

### Common Issues

1. **"Permission denied" errors**: Check admin status and email verification
2. **Data validation failures**: Ensure all required fields are present
3. **Price validation errors**: Verify pricing structure and ranges
4. **Admin lockout**: Use Firebase Console to manually add admin users

### Debug Commands

```bash
# Check current rules
firebase firestore:rules:get

# Validate rules syntax
firebase firestore:rules:test
```

## Emergency Procedures

### Admin Lockout Recovery

If all admin accounts are locked out:

1. Use Firebase Console to manually add admin users
2. Go to Firestore Database > admins collection
3. Add document with email as ID and required fields:
   ```json
   {
     "email": "admin@example.com",
     "addedAt": "2024-01-01T00:00:00Z",
     "isActive": true
   }
   ```

### Rule Rollback

```bash
# Deploy previous rules version
firebase deploy --only firestore:rules --project paradise-family
```

## Updates & Maintenance

- Review rules quarterly for security updates
- Update validation limits as business grows
- Monitor Firebase security best practices
- Keep documentation updated with rule changes

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Contact**: Paradise Family Restaurant Tech Team