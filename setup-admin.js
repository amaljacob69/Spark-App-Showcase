// Firebase Admin Setup Script
// Run this in the browser console after authenticating with your Google account

// Instructions to set yourself as the first admin user:
// 1. Go to https://paradise-family.web.app (or your deployed URL)
// 2. Open browser developer tools (F12)
// 3. Go to Console tab
// 4. Sign in with Google first (use the login button)
// 5. Copy and paste this entire script into the console
// 6. Press Enter to execute

(async function setupFirstAdmin() {
  console.log('🔧 Setting up first admin user...');
  
  // Check if Firebase is available
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase not loaded. Make sure you are on the deployed site.');
    return;
  }
  
  // Get current user
  const auth = firebase.auth();
  const user = auth.currentUser;
  
  if (!user) {
    console.error('❌ No user signed in. Please sign in with Google first.');
    console.log('👆 Click the "Sign in with Google" button on the page, then run this script again.');
    return;
  }
  
  console.log('👤 Current user:', user.email);
  
  try {
    // Initialize Firestore
    const db = firebase.firestore();
    
    // Add current user as admin
    const adminRef = db.collection('admins').doc(user.email);
    await adminRef.set({
      email: user.email,
      addedAt: new Date(),
      isActive: true
    });
    
    console.log('✅ Successfully added', user.email, 'as admin user!');
    console.log('🔄 Please refresh the page to see admin features.');
    
    // Optional: Verify the admin was added
    const adminDoc = await adminRef.get();
    if (adminDoc.exists) {
      console.log('✅ Verification: Admin record exists in Firestore');
      console.log('📄 Admin data:', adminDoc.data());
    }
    
  } catch (error) {
    console.error('❌ Error setting up admin user:', error);
    console.log('💡 Make sure Firestore rules allow writes or you have proper permissions.');
  }
})();

// Alternative method using direct Firestore REST API (if the above doesn't work):
console.log(`
🔧 Alternative Setup Method:
If the above script doesn't work, you can manually add yourself as admin:

1. Go to Firebase Console: https://console.firebase.google.com/project/paradise-family/firestore
2. Create a new collection called "admins"  
3. Add a document with ID: your-email@gmail.com
4. Add these fields:
   - email: "your-email@gmail.com" (string)
   - addedAt: (timestamp) - current date/time
   - isActive: true (boolean)
5. Save and refresh your app

Your current email: ${firebase.auth().currentUser?.email || 'Not signed in'}
`);