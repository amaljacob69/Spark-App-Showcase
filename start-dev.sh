#!/bin/bash

echo "🚀 Paradise Family Restaurant Menu - VS Code Setup"
echo "================================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found! Please install Node.js from https://nodejs.org/"
    echo
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found! Make sure you're in the project root directory."
    echo
    exit 1
fi

echo "✅ Project files found"

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo
    echo "🔧 Creating .env.local file..."
    cat > .env.local << EOF
VITE_FIREBASE_API_KEY=AIzaSyAYuSiwMkEJoTeNrvmUGh0GovPrMACRg
VITE_FIREBASE_AUTH_DOMAIN=paradise-family.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=paradise-family
VITE_FIREBASE_STORAGE_BUCKET=paradise-family.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=477641412672
VITE_FIREBASE_APP_ID=1:477641412672:web:140084cd4275aab3b34fa5
VITE_FIREBASE_MEASUREMENT_ID=G-XWQXEJXV71
EOF
    echo "✅ .env.local created"
else
    echo "✅ .env.local already exists"
fi

# Install dependencies
echo
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies!"
    exit 1
fi

echo "✅ Dependencies installed successfully!"

# Start the development server
echo
echo "🎯 Starting development server..."
echo
echo "The application will open at: http://localhost:5173"
echo
echo "Test these menu URLs:"
echo "  • Non-AC: http://localhost:5173?menu=dinein-non-ac"
echo "  • AC: http://localhost:5173?menu=dinein-ac"
echo "  • Takeaway: http://localhost:5173?menu=takeaway"
echo
echo "Press Ctrl+C to stop the server"
echo

npm run dev