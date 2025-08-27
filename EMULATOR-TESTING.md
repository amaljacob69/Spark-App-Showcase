# Security Rules Testing with Firebase Emulator

This guide explains how to test Firestore security rules using Firebase emulators for the Paradise Family Restaurant application.

## Overview

The Firebase Emulator Suite allows you to test security rules locally without affecting production data. This ensures your rules work correctly before deployment.

## Setup

### 1. Prerequisites

Make sure you have Firebase CLI installed:
```bash
npm install -g firebase-tools
```

### 2. Project Configuration

The emulator configuration is already set up in `firebase.json`:
- **Firestore**: Port 8080
- **Auth**: Port 9099  
- **Emulator UI**: Port 4000

## Running Tests

### Method 1: Start Emulator and Run Tests Separately

1. **Start the Firebase emulators:**
   ```bash
   npm run emulator:start
   ```

2. **In another terminal, run the security tests:**
   ```bash
   npm run test:rules
   ```

3. **View the Emulator UI:**
   Open http://localhost:4000 to see the Firebase Emulator UI

### Method 2: Run Tests with Auto-Started Emulators

Run tests with emulators starting/stopping automatically:
```bash
npm run test:emulator
```

## Test Coverage

The security rules tests cover:

### ✅ Menu Read Access
- ✅ Unauthenticated users can read menu
- ✅ Authenticated users can read menu  
- ✅ Admins can read menu

### ✅ Menu Write Access
- ✅ Unauthenticated users cannot write menu
- ✅ Regular users cannot write menu
- ✅ Admins can write valid menu data
- ✅ Admins cannot write invalid menu data

### ✅ Admin Access Controls  
- ✅ Regular users cannot read admin records
- ✅ Admins can read their own admin record
- ✅ Admins can create new admin accounts
- ✅ Invalid email formats are rejected

### ✅ Data Validation
- ✅ Menu with too many items rejected (>100 items)
- ✅ Menu items with negative prices rejected
- ✅ Menu items with excessive prices rejected (>$10,000)
- ✅ Invalid menu data structure rejected

### ✅ Fallback Rules
- ✅ Access to undefined collections denied
- ✅ Unauthorized writes denied

## Security Rules Structure

The Firestore security rules are organized as follows:

### Menu Data (`/restaurant/menu`)
- **Read**: Public access (for customers)
- **Write**: Admin only + valid data structure

### Admin Users (`/admins/{email}`)
- **Read**: Admin only or self-read
- **Write**: Admin only + valid email format
- **Delete**: Admin only (cannot delete self)

### Data Validation
- Menu items limited to 100 items
- Prices must be numbers between 0-10,000
- Admin emails must be valid format
- All required fields must be present

## Emulator UI Features

When running emulators, visit http://localhost:4000 to access:

1. **Firestore**: View/edit documents and test queries
2. **Authentication**: Manage test users and tokens
3. **Logs**: See real-time rule evaluation logs
4. **Security Rules Playground**: Test rules interactively

## Production Deployment

After testing locally:

1. **Deploy rules to production:**
   ```bash
   npm run deploy:rules
   ```

2. **Deploy full application:**
   ```bash
   npm run deploy
   ```

## Troubleshooting

### Port Conflicts
If you get port conflicts, modify ports in `firebase.json`:
```json
{
  "emulators": {
    "firestore": { "port": 8081 },
    "auth": { "port": 9100 }
  }
}
```

### Rules Not Loading
1. Ensure `firestore.rules` exists in project root
2. Check `firebase.json` points to correct rules file
3. Restart emulators after rule changes

### Test Failures
1. Check console output for specific error messages
2. Verify test data matches rule requirements
3. Use Emulator UI to inspect rule evaluation logs

## Security Best Practices

✅ **Always test rules locally before deploying**
✅ **Use principle of least privilege**  
✅ **Validate all input data**
✅ **Implement proper authentication checks**
✅ **Log and monitor rule violations**
✅ **Regular security rule audits**

## Next Steps

1. Run the test suite: `npm run test:emulator`
2. Review test results and fix any failures
3. Explore the Emulator UI for additional testing
4. Deploy rules when satisfied: `npm run deploy:rules`

The emulator provides a safe environment to thoroughly test your security rules before affecting production users.