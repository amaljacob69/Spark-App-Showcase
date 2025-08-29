#!/bin/bash

echo "🚀 Deploying Paradise Restaurant Menu to GitHub Pages..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Deploy to gh-pages branch
    echo "🌍 Deploying to GitHub Pages..."
    npm run deploy
    
    if [ $? -eq 0 ]; then
        echo "🎉 Deployment successful!"
        echo "🔗 Your site will be available at: https://amaljacob69.github.io/paradise-restaurant-menu/"
        echo ""
        echo "📱 Direct menu links:"
        echo "   Non-AC: https://amaljacob69.github.io/paradise-restaurant-menu/?menu=dinein-non-ac"
        echo "   A/C:    https://amaljacob69.github.io/paradise-restaurant-menu/?menu=dinein-ac"  
        echo "   Takeaway: https://amaljacob69.github.io/paradise-restaurant-menu/?menu=takeaway"
    else
        echo "❌ Deployment failed!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi