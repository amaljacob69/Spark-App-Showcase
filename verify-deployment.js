// Post-Deployment Verification Script
// Run this in browser console to verify all functionality works

async function verifyDeployment() {
  console.log('🔍 Starting deployment verification...\n');
  
  const tests = [];
  
  // Test 1: Check if Firebase is loaded
  try {
    if (typeof firebase !== 'undefined' || window.firebase) {
      tests.push('✅ Firebase SDK loaded');
    } else {
      tests.push('❌ Firebase SDK not loaded');
    }
  } catch (e) {
    tests.push('❌ Firebase SDK error: ' + e.message);
  }
  
  // Test 2: Check menu items load
  try {
    const menuItems = document.querySelectorAll('[data-testid="menu-item"]');
    if (menuItems.length > 0) {
      tests.push(`✅ Menu items loaded (${menuItems.length} items)`);
    } else {
      tests.push('❌ No menu items found');
    }
  } catch (e) {
    tests.push('❌ Menu items check failed: ' + e.message);
  }
  
  // Test 3: Check URL parameters work
  const urlParams = new URLSearchParams(window.location.search);
  const menuParam = urlParams.get('menu');
  if (menuParam && ['dinein-non-ac', 'dinein-ac', 'takeaway'].includes(menuParam)) {
    tests.push(`✅ URL parameter detected: ${menuParam}`);
  } else {
    tests.push('ℹ️  No menu URL parameter (this is OK for admin access)');
  }
  
  // Test 4: Check responsive design
  const isMobile = window.innerWidth < 768;
  tests.push(`ℹ️  Device type: ${isMobile ? 'Mobile' : 'Desktop'} (${window.innerWidth}px)`);
  
  // Test 5: Check admin panel visibility
  const adminPanel = document.querySelector('[data-testid="admin-panel"]');
  if (adminPanel) {
    tests.push('✅ Admin panel detected (user is admin)');
  } else {
    tests.push('ℹ️  Admin panel not visible (user is not admin)');
  }
  
  // Test 6: Performance check
  if (performance && performance.navigation) {
    const loadTime = performance.navigation.loadEventEnd - performance.navigation.navigationStart;
    const loadTimeSeconds = (loadTime / 1000).toFixed(2);
    if (loadTime < 3000) {
      tests.push(`✅ Page load time: ${loadTimeSeconds}s (Good)`);
    } else {
      tests.push(`⚠️  Page load time: ${loadTimeSeconds}s (Consider optimization)`);
    }
  }
  
  // Display results
  console.log('📋 Verification Results:');
  console.log('========================');
  tests.forEach(test => console.log(test));
  console.log('\n🎯 Direct Menu URLs to test:');
  console.log('- Non-AC: ' + window.location.origin + '?menu=dinein-non-ac');
  console.log('- AC: ' + window.location.origin + '?menu=dinein-ac');
  console.log('- Takeaway: ' + window.location.origin + '?menu=takeaway');
  
  return tests;
}

// Auto-run verification
console.log('Paradise Family Restaurant - Deployment Verification');
console.log('====================================================');
verifyDeployment();