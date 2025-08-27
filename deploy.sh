#!/bin/bash

echo "🍴 Paradise Family Restaurant - Deployment Script"
echo "================================================="

# Build the project
echo "🔨 Building the application..."
npx vite build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Firebase (hosting and Firestore rules)
echo "🚀 Deploying to Firebase..."
npx firebase deploy

if [ $? -eq 0 ]; then
  echo ""
  echo "🎉 Deployment successful!"
  echo "================================================="
  echo "Your restaurant app is now live at:"
  echo "• Main Site: https://paradise-family.web.app"
  echo "• Alt URL: https://paradise-family.firebaseapp.com"
  echo ""
  echo "📱 QR Code Menu URLs:"
  echo "• Non-AC: https://paradise-family.web.app?menu=dinein-non-ac"
  echo "• AC Dine-in: https://paradise-family.web.app?menu=dinein-ac"  
  echo "• Takeaway: https://paradise-family.web.app?menu=takeaway"
  echo ""
  echo "🔐 Next Steps:"
  echo "1. Set up admin users (see ADMIN-SETUP.md)"
  echo "2. Test all menu types"
  echo "3. Generate QR codes for each menu type"
  echo ""
  echo "Firebase Console: https://console.firebase.google.com/project/paradise-family"
else
  echo "❌ Deployment failed"
  echo "Check the error messages above and try again"
  exit 1
fi