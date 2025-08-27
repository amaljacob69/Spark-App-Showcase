#!/usr/bin/env node

/**
 * Comprehensive Security Rules Test Suite
 * 
 * This script tests Firestore security rules for the Paradise Family Restaurant application.
 * It verifies admin access controls, menu data validation, and public read permissions.
 */

const { initializeTestEnvironment, assertFails, assertSucceeds } = require('@firebase/rules-unit-testing');
const { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, getDocs } = require('firebase/firestore');

// Test configuration
const PROJECT_ID = 'paradise-family-test';
let testEnv;
let adminContext;
let userContext;
let unauthenticatedContext;

// Sample test data
const validMenuItem = {
  id: "test-1",
  name: "Test Dish",
  description: "A delicious test dish",
  prices: {
    "dinein-non-ac": 25.99,
    "dinein-ac": 28.99,
    "takeaway": 22.99
  },
  category: "Mains",
  available: true
};

const validMenuData = {
  items: [validMenuItem],
  updatedAt: new Date()
};

const validAdminData = {
  email: "admin@paradise-family.com",
  addedAt: new Date(),
  isActive: true
};

async function setupTestEnvironment() {
  console.log('🔧 Setting up test environment...');
  
  testEnv = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: require('fs').readFileSync('firestore.rules', 'utf8'),
    },
  });

  // Create contexts for different user types
  adminContext = testEnv.authenticatedContext('admin@paradise-family.com', {
    email: 'admin@paradise-family.com',
    email_verified: true,
  });

  userContext = testEnv.authenticatedContext('user@example.com', {
    email: 'user@example.com',
    email_verified: true,
  });

  unauthenticatedContext = testEnv.unauthenticatedContext();

  // Setup admin in database
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'admins', 'admin@paradise-family.com'), validAdminData);
  });

  console.log('✅ Test environment setup complete');
}

async function testMenuReadAccess() {
  console.log('\n📖 Testing menu read access...');
  
  // Setup test menu data
  await testEnv.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), 'restaurant', 'menu'), validMenuData);
  });

  // Test: Unauthenticated users can read menu
  try {
    await assertSucceeds(
      getDoc(doc(unauthenticatedContext.firestore(), 'restaurant', 'menu'))
    );
    console.log('✅ Unauthenticated users can read menu');
  } catch (error) {
    console.log('❌ Unauthenticated menu read failed:', error.message);
  }

  // Test: Authenticated users can read menu
  try {
    await assertSucceeds(
      getDoc(doc(userContext.firestore(), 'restaurant', 'menu'))
    );
    console.log('✅ Authenticated users can read menu');
  } catch (error) {
    console.log('❌ Authenticated menu read failed:', error.message);
  }

  // Test: Admins can read menu
  try {
    await assertSucceeds(
      getDoc(doc(adminContext.firestore(), 'restaurant', 'menu'))
    );
    console.log('✅ Admins can read menu');
  } catch (error) {
    console.log('❌ Admin menu read failed:', error.message);
  }
}

async function testMenuWriteAccess() {
  console.log('\n✏️ Testing menu write access...');

  // Test: Unauthenticated users cannot write menu
  try {
    await assertFails(
      setDoc(doc(unauthenticatedContext.firestore(), 'restaurant', 'menu'), validMenuData)
    );
    console.log('✅ Unauthenticated users cannot write menu');
  } catch (error) {
    console.log('❌ Unauthenticated write test failed:', error.message);
  }

  // Test: Regular users cannot write menu
  try {
    await assertFails(
      setDoc(doc(userContext.firestore(), 'restaurant', 'menu'), validMenuData)
    );
    console.log('✅ Regular users cannot write menu');
  } catch (error) {
    console.log('❌ Regular user write test failed:', error.message);
  }

  // Test: Admins can write valid menu data
  try {
    await assertSucceeds(
      setDoc(doc(adminContext.firestore(), 'restaurant', 'menu'), validMenuData)
    );
    console.log('✅ Admins can write valid menu data');
  } catch (error) {
    console.log('❌ Admin valid write failed:', error.message);
  }

  // Test: Admins cannot write invalid menu data
  const invalidMenuData = {
    items: [{
      ...validMenuItem,
      prices: {
        "dinein-non-ac": "invalid", // Should be number
        "dinein-ac": 28.99,
        "takeaway": 22.99
      }
    }],
    updatedAt: new Date()
  };

  try {
    await assertFails(
      setDoc(doc(adminContext.firestore(), 'restaurant', 'menu'), invalidMenuData)
    );
    console.log('✅ Admins cannot write invalid menu data');
  } catch (error) {
    console.log('❌ Invalid menu data test failed:', error.message);
  }
}

async function testAdminAccess() {
  console.log('\n👤 Testing admin access controls...');

  // Test: Regular users cannot read admin list
  try {
    await assertFails(
      getDoc(doc(userContext.firestore(), 'admins', 'admin@paradise-family.com'))
    );
    console.log('✅ Regular users cannot read admin records');
  } catch (error) {
    console.log('❌ Regular user admin read test failed:', error.message);
  }

  // Test: Users can read their own admin record (if they are admin)
  try {
    await assertSucceeds(
      getDoc(doc(adminContext.firestore(), 'admins', 'admin@paradise-family.com'))
    );
    console.log('✅ Admins can read their own admin record');
  } catch (error) {
    console.log('❌ Admin self-read failed:', error.message);
  }

  // Test: Admins can create new admin accounts
  const newAdminData = {
    email: 'newadmin@paradise-family.com',
    addedAt: new Date(),
    isActive: true
  };

  try {
    await assertSucceeds(
      setDoc(doc(adminContext.firestore(), 'admins', 'newadmin@paradise-family.com'), newAdminData)
    );
    console.log('✅ Admins can create new admin accounts');
  } catch (error) {
    console.log('❌ Admin creation failed:', error.message);
  }

  // Test: Admins cannot create accounts with invalid email format
  const invalidAdminData = {
    email: 'invalid-email',
    addedAt: new Date(),
    isActive: true
  };

  try {
    await assertFails(
      setDoc(doc(adminContext.firestore(), 'admins', 'invalid-email'), invalidAdminData)
    );
    console.log('✅ Admins cannot create accounts with invalid email');
  } catch (error) {
    console.log('❌ Invalid email validation failed:', error.message);
  }
}

async function testDataValidation() {
  console.log('\n🔍 Testing data validation...');

  // Test: Menu with too many items (over limit)
  const tooManyItems = Array(101).fill(0).map((_, i) => ({
    ...validMenuItem,
    id: `item-${i}`
  }));

  try {
    await assertFails(
      setDoc(doc(adminContext.firestore(), 'restaurant', 'menu'), {
        items: tooManyItems,
        updatedAt: new Date()
      })
    );
    console.log('✅ Menu with too many items rejected');
  } catch (error) {
    console.log('❌ Menu item limit test failed:', error.message);
  }

  // Test: Menu item with negative prices
  const negativePrice = {
    ...validMenuData,
    items: [{
      ...validMenuItem,
      prices: {
        "dinein-non-ac": -10, // Negative price
        "dinein-ac": 28.99,
        "takeaway": 22.99
      }
    }]
  };

  try {
    await assertFails(
      setDoc(doc(adminContext.firestore(), 'restaurant', 'menu'), negativePrice)
    );
    console.log('✅ Menu items with negative prices rejected');
  } catch (error) {
    console.log('❌ Negative price validation failed:', error.message);
  }

  // Test: Menu item with excessive prices
  const excessivePrice = {
    ...validMenuData,
    items: [{
      ...validMenuItem,
      prices: {
        "dinein-non-ac": 15000, // Over limit
        "dinein-ac": 28.99,
        "takeaway": 22.99
      }
    }]
  };

  try {
    await assertFails(
      setDoc(doc(adminContext.firestore(), 'restaurant', 'menu'), excessivePrice)
    );
    console.log('✅ Menu items with excessive prices rejected');
  } catch (error) {
    console.log('❌ Excessive price validation failed:', error.message);
  }
}

async function testFallbackRules() {
  console.log('\n🚫 Testing fallback security rules...');

  // Test: Access to undefined collection should fail
  try {
    await assertFails(
      getDoc(doc(unauthenticatedContext.firestore(), 'undefined-collection', 'some-doc'))
    );
    console.log('✅ Access to undefined collections denied');
  } catch (error) {
    console.log('❌ Fallback rule test failed:', error.message);
  }

  // Test: Writing to unauthorized location should fail
  try {
    await assertFails(
      setDoc(doc(userContext.firestore(), 'unauthorized', 'doc'), { data: 'test' })
    );
    console.log('✅ Unauthorized writes denied');
  } catch (error) {
    console.log('❌ Unauthorized write test failed:', error.message);
  }
}

async function runAllTests() {
  console.log('🧪 Paradise Family Restaurant - Security Rules Test Suite');
  console.log('==================================================\n');

  try {
    await setupTestEnvironment();
    await testMenuReadAccess();
    await testMenuWriteAccess();
    await testAdminAccess();
    await testDataValidation();
    await testFallbackRules();

    console.log('\n🎉 Security rules testing completed!');
    console.log('\nTo run these tests with the Firebase emulator:');
    console.log('1. npm run emulator:start');
    console.log('2. In another terminal: node test-security-rules.js');
    console.log('\nEmulator UI available at: http://localhost:4000');

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  } finally {
    if (testEnv) {
      await testEnv.cleanup();
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  runAllTests();
}

module.exports = {
  runAllTests,
  setupTestEnvironment,
  testMenuReadAccess,
  testMenuWriteAccess,
  testAdminAccess,
  testDataValidation,
  testFallbackRules
};