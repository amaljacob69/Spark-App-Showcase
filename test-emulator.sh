#!/bin/bash

# Firebase Emulator Testing Script
# This script starts the Firebase emulators and runs security rule tests

set -e

echo "🔧 Paradise Family Restaurant - Security Rules Testing"
echo "======================================================"

# Check if Firebase CLI is available
if ! command -v npx &> /dev/null; then
    echo "❌ npx not found. Please install Node.js and npm."
    exit 1
fi

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
    echo "❌ firebase.json not found. Please run this script from the project root."
    exit 1
fi

# Check if firestore.rules exists
if [ ! -f "firestore.rules" ]; then
    echo "❌ firestore.rules not found. Security rules file is missing."
    exit 1
fi

echo "📁 Project files validated"
echo "🚀 Starting Firebase emulators..."

# Function to cleanup on exit
cleanup() {
    echo "🧹 Stopping emulators..."
    npx firebase emulators:stop 2>/dev/null || true
    echo "✅ Cleanup complete"
}

# Set trap to cleanup on script exit
trap cleanup EXIT

# Start emulators in background
npx firebase emulators:start &
EMULATOR_PID=$!

echo "⏳ Waiting for emulators to start..."
sleep 10

# Check if emulators are running
if kill -0 $EMULATOR_PID 2>/dev/null; then
    echo "✅ Emulators started successfully"
    echo "🌐 Emulator UI available at: http://localhost:4000"
    
    # Run security rules tests
    echo "🧪 Running security rules tests..."
    node test-security-rules.js
    
    echo ""
    echo "🎉 Testing completed successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Review test results above"
    echo "2. Check Emulator UI at http://localhost:4000"
    echo "3. Deploy rules when ready: npm run deploy:rules"
    
else
    echo "❌ Failed to start emulators"
    exit 1
fi

# Keep emulators running until user stops
echo ""
echo "Emulators are running. Press Ctrl+C to stop."
wait $EMULATOR_PID