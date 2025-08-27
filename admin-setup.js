// Admin Setup Script
// Run this in the browser console after deployment to add the first admin user

// Replace with your email address
const ADMIN_EMAIL = 'your-email@example.com';

// Function to add admin user
async function addFirstAdmin() {
  try {
    // Import Firebase functions
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
    
    // Your Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyAYuSiwMkEJoTeNrvmkmUGh0GovPrMACRg",
      authDomain: "paradise-family.firebaseapp.com",
      projectId: "paradise-family",
      storageBucket: "paradise-family.firebasestorage.app",
      messagingSenderId: "477641412672",
      appId: "1:477641412672:web:140084cd4275aab3b34fa5",
      measurementId: "G-XWQXEJXV71"
    };
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Add admin user
    await setDoc(doc(db, 'admins', ADMIN_EMAIL), {
      email: ADMIN_EMAIL,
      addedAt: new Date(),
      isActive: true,
      role: 'super-admin'
    });
    
    console.log('✅ Admin user added successfully:', ADMIN_EMAIL);
    
  } catch (error) {
    console.error('❌ Error adding admin user:', error);
  }
}

// Uncomment the line below and run this script
// addFirstAdmin();