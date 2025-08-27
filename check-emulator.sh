#!/bin/bash

# Emulator Status and Testing Helper
# This script helps check emulator status and provides testing guidance

echo "🔧 Paradise Family Restaurant - Emulator Testing Helper"
echo "====================================================="

# Check if Java is available (required for emulators)
echo "🔍 Checking system requirements..."

if command -v java &> /dev/null; then
    JAVA_VERSION=$(java -version 2>&1 | head -n1 | cut -d'"' -f2)
    echo "✅ Java found: $JAVA_VERSION"
else
    echo "❌ Java not found - required for Firebase emulators"
    echo "   Install Java 11+ to run emulators"
    echo "   On Ubuntu: sudo apt install openjdk-11-jdk"
    echo "   On macOS: brew install openjdk@11"
    echo ""
fi

# Check if Firebase CLI is available
if [ -f "node_modules/.bin/firebase" ] || command -v firebase &> /dev/null; then
    echo "✅ Firebase CLI found"
else
    echo "❌ Firebase CLI not found"
    echo "   Run: npm install to install dependencies"
    echo ""
fi

# Check if required files exist
echo ""
echo "📁 Checking project files..."

if [ -f "firebase.json" ]; then
    echo "✅ firebase.json found"
else
    echo "❌ firebase.json missing"
fi

if [ -f "firestore.rules" ]; then
    echo "✅ firestore.rules found"
else
    echo "❌ firestore.rules missing"
fi

if [ -f "test-security-rules.js" ]; then
    echo "✅ test-security-rules.js found"
else
    echo "❌ test-security-rules.js missing"
fi

# Check emulator status
echo ""
echo "🔍 Checking emulator status..."

# Try to check if emulators are running by checking ports
if lsof -i :4000 >/dev/null 2>&1; then
    echo "✅ Emulator UI running on port 4000"
    echo "   Access at: http://localhost:4000"
else
    echo "❌ Emulator UI not running on port 4000"
fi

if lsof -i :8080 >/dev/null 2>&1; then
    echo "✅ Firestore emulator running on port 8080"
else
    echo "❌ Firestore emulator not running on port 8080"
fi

if lsof -i :9099 >/dev/null 2>&1; then
    echo "✅ Auth emulator running on port 9099"
else
    echo "❌ Auth emulator not running on port 9099"
fi

echo ""
echo "🚀 How to start emulators:"
echo "   Method 1: npm run emulator:start"
echo "   Method 2: npx firebase emulators:start"
echo ""

echo "🧪 How to run tests:"
echo "   Method 1 (with running emulators): npm run test:rules"
echo "   Method 2 (auto-start emulators): npm run test:emulator"
echo ""

echo "📋 Manual Testing Checklist:"
echo ""
echo "1. 🌐 Open Emulator UI (http://localhost:4000)"
echo "   - Firestore: Test data read/write operations"
echo "   - Authentication: Create test users"
echo "   - Logs: Monitor security rule evaluations"
echo ""

echo "2. 📖 Test Menu Access:"
echo "   - ✅ Public can read menu (restaurant/menu)"
echo "   - ❌ Public cannot write menu"
echo "   - ✅ Admin can read/write menu"
echo "   - ❌ Regular users cannot write menu"
echo ""

echo "3. 👤 Test Admin Access:"
echo "   - Create admin user: admin@paradise-family.com"
echo "   - Create admin document: admins/admin@paradise-family.com"
echo "   - ✅ Admin can access admin functions"
echo "   - ❌ Regular users cannot access admin data"
echo ""

echo "4. 🔍 Test Data Validation:"
echo "   - ❌ Negative prices rejected"
echo "   - ❌ Excessive prices (>$10,000) rejected"
echo "   - ❌ Too many menu items (>100) rejected"
echo "   - ❌ Invalid data types rejected"
echo ""

echo "5. 🔗 Test Direct Menu Links:"
echo "   - http://localhost:5173?menu=dinein-non-ac"
echo "   - http://localhost:5173?menu=dinein-ac"
echo "   - http://localhost:5173?menu=takeaway"
echo ""

echo "📚 For detailed testing instructions, see:"
echo "   - MANUAL-EMULATOR-TESTING.md"
echo "   - EMULATOR-TESTING.md"
echo ""

echo "🔒 Security Rules Coverage:"
echo "   ✅ Public menu access"
echo "   ✅ Admin authentication"
echo "   ✅ Data validation"
echo "   ✅ Write permissions"
echo "   ✅ Admin management"
echo ""

if command -v java &> /dev/null && [ -f "firebase.json" ]; then
    echo "🎯 Ready to test! Start emulators with: npm run emulator:start"
else
    echo "⚠️  Install missing requirements before testing"
fi

echo ""
echo "=========================================="