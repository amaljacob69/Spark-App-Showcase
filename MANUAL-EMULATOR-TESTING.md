# Manual Testing with Firebase Emulator UI

This guide walks you through manual testing of the Paradise Family Restaurant application using the Firebase Emulator UI.

## Prerequisites

Before starting, ensure you have:
1. **Java 11+** installed (required for Firebase emulators)
2. **Firebase CLI** (already included in project dependencies)
3. **Project built** (`npm run build`)

## Starting the Emulator

### Method 1: Using npm scripts
```bash
npm run emulator:start
```

### Method 2: Using Firebase CLI directly
```bash
npx firebase emulators:start --project=paradise-family
```

### Method 3: With data import/export
```bash
npx firebase emulators:start --import=./emulator-data --export-on-exit=./emulator-data
```

## Accessing the Emulator UI

Once emulators are running, visit: **http://localhost:4000**

The emulator UI provides:
- **Firestore Database**: View/edit documents
- **Authentication**: Manage test users
- **Real-time Logs**: See security rule evaluations
- **Rules Playground**: Test rules interactively

## Manual Testing Scenarios

### 1. Testing Menu Access (Public)

#### Test: Unauthenticated Menu Reading
1. **Open Firestore tab** in emulator UI
2. **Navigate to** `restaurant/menu` collection
3. **Create test menu document**:
   ```json
   {
     "items": [
       {
         "id": "test-1",
         "name": "Test Dish",
         "description": "A delicious test dish",
         "prices": {
           "dinein-non-ac": 25.99,
           "dinein-ac": 28.99,
           "takeaway": 22.99
         },
         "category": "Mains",
         "available": true
       }
     ],
     "updatedAt": "2024-01-01T00:00:00Z"
   }
   ```

4. **Test reading without authentication**:
   - Should **succeed** ✅
   - Check logs for rule evaluation

#### Test: Unauthenticated Menu Writing
1. **Try to edit** the menu document without authentication
2. **Expected result**: Should **fail** ❌
3. **Check logs**: Should show "PERMISSION_DENIED"

### 2. Testing Admin Authentication

#### Setup Test Admin User
1. **Go to Authentication tab**
2. **Add test user**:
   - Email: `admin@paradise-family.com`
   - Password: `testpassword123`
   - Email verified: `true`

3. **Go to Firestore tab**
4. **Create admin document**: `admins/admin@paradise-family.com`
   ```json
   {
     "email": "admin@paradise-family.com",
     "addedAt": "2024-01-01T00:00:00Z",
     "isActive": true
   }
   ```

#### Test Admin Menu Writing
1. **Get authentication token**:
   - Go to Authentication tab
   - Click on the test admin user
   - Copy the authentication token

2. **Test menu writing**:
   - Go to Firestore tab
   - Try to edit `restaurant/menu` document
   - Use the authentication token
   - Should **succeed** ✅

### 3. Testing Security Rule Validations

#### Test: Invalid Price Data
1. **Try to save menu** with invalid price:
   ```json
   {
     "items": [
       {
         "id": "test-1",
         "name": "Test Dish",
         "prices": {
           "dinein-non-ac": "invalid_string",  // Should be number
           "dinein-ac": 28.99,
           "takeaway": 22.99
         }
       }
     ]
   }
   ```

2. **Expected result**: Should **fail** ❌
3. **Check logs**: Should show validation error

#### Test: Excessive Menu Items
1. **Try to save menu** with >100 items
2. **Expected result**: Should **fail** ❌
3. **Check logs**: Should show "Menu cannot have more than 100 items"

#### Test: Negative Prices
1. **Try to save menu** with negative price:
   ```json
   {
     "items": [
       {
         "prices": {
           "dinein-non-ac": -10,  // Negative price
           "dinein-ac": 28.99,
           "takeaway": 22.99
         }
       }
     ]
   }
   ```

2. **Expected result**: Should **fail** ❌

### 4. Testing Regular User Restrictions

#### Setup Regular User
1. **Add another test user**:
   - Email: `user@example.com`
   - Password: `testpassword123`
   - **Don't create admin document**

#### Test Regular User Restrictions
1. **Try to read admin documents** with regular user token
   - Should **fail** ❌

2. **Try to write menu data** with regular user token
   - Should **fail** ❌

3. **Try to read menu data** with regular user token
   - Should **succeed** ✅

### 5. Testing Direct Menu Links

#### Test Menu Type URLs
1. **Start your development server**: `npm run dev`
2. **Test these URLs**:
   - Non-AC Menu: `http://localhost:5173?menu=dinein-non-ac`
   - AC Menu: `http://localhost:5173?menu=dinein-ac`
   - Takeaway Menu: `http://localhost:5173?menu=takeaway`

3. **Verify**:
   - Each shows only relevant pricing
   - Toast notification appears
   - Menu type selector is hidden (direct link mode)

## Logs Analysis

### Success Patterns
Look for logs showing:
```
✅ allow read: if resource == restaurant/menu
✅ allow write: if isAdmin(request.auth) && isValidMenuData(resource.data)
```

### Failure Patterns
Look for logs showing:
```
❌ deny write: if !isAdmin(request.auth)
❌ deny write: if !isValidMenuData(resource.data)
❌ deny read: if resource != restaurant/menu
```

## Rules Playground Testing

### Interactive Rule Testing
1. **Go to Rules Playground** in emulator UI
2. **Select operation**: read, write, create, update, delete
3. **Set document path**: e.g., `restaurant/menu`
4. **Set authentication**: Use test user tokens
5. **Add request data**: For write operations
6. **Run simulation**: See real-time rule evaluation

### Example Test Cases

#### Test Case 1: Public Menu Read
```javascript
// Path: restaurant/menu
// Operation: read
// Authentication: none
// Expected: Allow
```

#### Test Case 2: Admin Menu Write
```javascript
// Path: restaurant/menu
// Operation: write
// Authentication: admin@paradise-family.com
// Data: Valid menu structure
// Expected: Allow
```

#### Test Case 3: User Menu Write
```javascript
// Path: restaurant/menu
// Operation: write
// Authentication: user@example.com
// Data: Valid menu structure
// Expected: Deny
```

## Automated Testing

After manual verification, run automated tests:

### Method 1: With Running Emulators
```bash
# In terminal 1:
npm run emulator:start

# In terminal 2:
npm run test:rules
```

### Method 2: Auto-start Emulators
```bash
npm run test:emulator
```

## Deployment Verification

### Test Production Rules
1. **Deploy rules**: `npm run deploy:rules`
2. **Test with real Firebase project**
3. **Verify same behavior** as emulator

### Security Checklist
- ✅ Public can read menu
- ✅ Public cannot write menu
- ✅ Admins can read/write menu
- ✅ Users cannot access admin data
- ✅ Price validation works
- ✅ Menu item limits enforced
- ✅ Email format validation works

## Troubleshooting

### Emulator Won't Start
1. **Check Java version**: `java -version` (needs 11+)
2. **Check ports**: 4000, 8080, 9099 must be free
3. **Check firebase.json**: Ensure proper configuration

### Rules Not Working
1. **Restart emulators** after rule changes
2. **Check firestore.rules** file exists
3. **Verify rule syntax** in playground

### Authentication Issues
1. **Ensure email_verified**: `true` for test users
2. **Check admin document exists** in Firestore
3. **Use correct authentication token**

## Next Steps

1. ✅ **Complete manual testing** using this guide
2. ✅ **Run automated tests** for verification
3. ✅ **Deploy rules** to production
4. ✅ **Test production deployment**
5. ✅ **Monitor security** in Firebase Console

The emulator provides a safe environment to thoroughly test your security rules and application behavior before affecting production users.