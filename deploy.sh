#!/bin/bash

# Build the project
echo "🔨 Building the application..."
npx vite build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

echo "✅ Build completed successfully!"

# Deploy to Firebase
echo "🚀 Deploying to Firebase..."
npx firebase deploy

if [ $? -eq 0 ]; then
  echo "🎉 Deployment successful!"
  echo "Your app is now live at:"
  echo "- https://paradise-family.web.app"
  echo "- https://paradise-family.firebaseapp.com"
else
  echo "❌ Deployment failed"
  exit 1
fi