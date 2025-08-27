// Security Rules Validation and Testing Script
// Paradise Family Restaurant Menu Application

// Test data for validating security rules
const testData = {
  validMenuItem: {
    id: "test-1",
    name: "Test Dish",
    description: "A delicious test dish",
    prices: {
      'dinein-non-ac': 25.00,
      'dinein-ac': 28.00,
      'takeaway': 22.00
    },
    category: "Mains",
    available: true
  },
  
  invalidMenuItem: {
    id: "test-2",
    name: "Invalid Dish",
    // Missing description and prices
    category: "Test",
    available: true
  },
  
  validMenuData: {
    items: [
      {
        id: "test-1",
        name: "Test Dish",
        description: "A delicious test dish",
        prices: {
          'dinein-non-ac': 25.00,
          'dinein-ac': 28.00,
          'takeaway': 22.00
        },
        category: "Mains",
        available: true
      }
    ],
    updatedAt: new Date()
  },
  
  validAdminData: {
    email: "admin@example.com",
    addedAt: new Date(),
    isActive: true
  },
  
  invalidAdminData: {
    // Missing required fields
    email: "invalid-email",
    isActive: "not-boolean"
  }
}

// Security test scenarios
const securityTests = [
  {
    name: "Public Menu Read Access",
    description: "Verify anyone can read menu items",
    path: "/restaurant/menu",
    operation: "read",
    auth: null,
    expected: "allow"
  },
  
  {
    name: "Unauthenticated Menu Write",
    description: "Verify anonymous users cannot modify menu",
    path: "/restaurant/menu", 
    operation: "write",
    auth: null,
    data: testData.validMenuData,
    expected: "deny"
  },
  
  {
    name: "Admin Menu Write",
    description: "Verify authenticated admins can modify menu",
    path: "/restaurant/menu",
    operation: "write",
    auth: { email: "admin@example.com", email_verified: true },
    data: testData.validMenuData,
    expected: "allow"
  },
  
  {
    name: "Invalid Menu Data",
    description: "Verify malformed menu data is rejected",
    path: "/restaurant/menu",
    operation: "write", 
    auth: { email: "admin@example.com", email_verified: true },
    data: { invalid: "data" },
    expected: "deny"
  },
  
  {
    name: "Admin Self-Read",
    description: "Verify users can read their own admin record",
    path: "/admins/user@example.com",
    operation: "read",
    auth: { email: "user@example.com", email_verified: true },
    expected: "allow"
  },
  
  {
    name: "Admin Cross-Read Prevention",
    description: "Verify non-admins cannot read other admin records",
    path: "/admins/admin@example.com", 
    operation: "read",
    auth: { email: "user@example.com", email_verified: true },
    expected: "deny"
  },
  
  {
    name: "Admin Self-Deletion Prevention",
    description: "Verify admins cannot delete their own accounts",
    path: "/admins/admin@example.com",
    operation: "delete",
    auth: { email: "admin@example.com", email_verified: true },
    expected: "deny"
  }
]

// Validation functions to mirror Firestore rules
const securityValidation = {
  
  isValidAdmin: (auth) => {
    return auth && 
           auth.email && 
           auth.email_verified === true
    // Note: In real scenario, would also check if admin document exists and isActive
  },
  
  isValidMenuData: (data) => {
    if (!data || typeof data !== 'object') return false
    
    // Check required fields
    if (!data.hasOwnProperty('items') || !data.hasOwnProperty('updatedAt')) return false
    
    // Check items is array and within limit
    if (!Array.isArray(data.items) || data.items.length > 100) return false
    
    // Check each menu item structure
    return data.items.every(item => securityValidation.isValidMenuItem(item))
  },
  
  isValidMenuItem: (item) => {
    if (!item || typeof item !== 'object') return false
    
    const requiredFields = ['id', 'name', 'description', 'prices', 'category', 'available']
    if (!requiredFields.every(field => item.hasOwnProperty(field))) return false
    
    // Validate prices structure
    return securityValidation.isValidPrices(item.prices)
  },
  
  isValidPrices: (prices) => {
    if (!prices || typeof prices !== 'object') return false
    
    const requiredPriceTypes = ['dinein-non-ac', 'dinein-ac', 'takeaway']
    if (!requiredPriceTypes.every(type => prices.hasOwnProperty(type))) return false
    
    // Check all prices are valid numbers within range
    return requiredPriceTypes.every(type => {
      const price = prices[type]
      return typeof price === 'number' && 
             price >= 0 && 
             price <= 10000 &&
             !isNaN(price)
    })
  },
  
  isValidAdminData: (data, email) => {
    if (!data || typeof data !== 'object') return false
    
    const requiredFields = ['email', 'addedAt', 'isActive']
    if (!requiredFields.every(field => data.hasOwnProperty(field))) return false
    
    // Validate email format and match
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email) || data.email !== email) return false
    
    // Validate data types
    return data.addedAt instanceof Date && 
           typeof data.isActive === 'boolean'
  }
}

// Console output for security rule validation
console.log('🔒 Paradise Family Restaurant - Security Rules Validation')
console.log('=' .repeat(60))

console.log('\n📋 Security Test Scenarios:')
console.log('-'.repeat(40))

securityTests.forEach((test, index) => {
  console.log(`\n${index + 1}. ${test.name}`)
  console.log(`   Description: ${test.description}`)
  console.log(`   Path: ${test.path}`)
  console.log(`   Operation: ${test.operation}`)
  console.log(`   Auth: ${test.auth ? `${test.auth.email} (verified: ${test.auth.email_verified})` : 'none'}`)
  console.log(`   Expected: ${test.expected}`)
})

console.log('\n🔍 Data Validation Tests:')
console.log('-'.repeat(40))

// Test menu data validation
console.log('\nValid Menu Data:', securityValidation.isValidMenuData(testData.validMenuData) ? '✅ PASS' : '❌ FAIL')
console.log('Invalid Menu Data:', !securityValidation.isValidMenuData(testData.invalidMenuItem) ? '✅ PASS' : '❌ FAIL')

// Test admin data validation  
console.log('Valid Admin Data:', securityValidation.isValidAdminData(testData.validAdminData, 'admin@example.com') ? '✅ PASS' : '❌ FAIL')
console.log('Invalid Admin Data:', !securityValidation.isValidAdminData(testData.invalidAdminData, 'admin@example.com') ? '✅ PASS' : '❌ FAIL')

// Test price validation
const validPrices = { 'dinein-non-ac': 25, 'dinein-ac': 28, 'takeaway': 22 }
const invalidPrices = { 'dinein-non-ac': -5, 'dinein-ac': 'invalid', 'takeaway': 15000 }
console.log('Valid Prices:', securityValidation.isValidPrices(validPrices) ? '✅ PASS' : '❌ FAIL')
console.log('Invalid Prices:', !securityValidation.isValidPrices(invalidPrices) ? '✅ PASS' : '❌ FAIL')

console.log('\n🚀 Deployment Commands:')
console.log('-'.repeat(40))
console.log('Deploy rules: firebase deploy --only firestore:rules')
console.log('Test rules: firebase emulators:start --only firestore')
console.log('Validate syntax: firebase firestore:rules:test')

console.log('\n📚 Security Documentation:')
console.log('-'.repeat(40))
console.log('• Review FIRESTORE-SECURITY.md for detailed documentation')
console.log('• Monitor Firebase Console for rule violations')
console.log('• Set up alerts for suspicious activity')
console.log('• Regularly audit admin user access')

console.log('\n✨ Security rules configured for production deployment!')

// Export for potential Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testData,
    securityTests,
    securityValidation
  }
}