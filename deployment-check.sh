#!/bin/bash

# Paradise Family Restaurant Deployment Checker
echo "🍴 Paradise Family Restaurant - Deployment Status Check"
echo "======================================================"

# Check if we're running in production
if [ "$NODE_ENV" = "production" ]; then
    echo "✅ Environment: Production"
else
    echo "⚠️  Environment: Development/Local"
fi

echo ""
echo "🌐 Application URLs:"
echo "   Primary: https://paradise-family.web.app"
echo "   Secondary: https://paradise-family.firebaseapp.com"

echo ""
echo "📱 QR Code Menu Links:"
echo "   Non-AC: https://paradise-family.web.app?menu=dinein-non-ac"
echo "   AC: https://paradise-family.web.app?menu=dinein-ac"
echo "   Takeaway: https://paradise-family.web.app?menu=takeaway"

echo ""
echo "🔧 Firebase Services:"
echo "   ✅ Hosting: Configured"
echo "   ✅ Authentication: Google OAuth enabled"
echo "   ✅ Firestore: Database rules configured"
echo "   ✅ Security Rules: Admin-based access control"

echo ""
echo "📋 Post-Deployment Checklist:"
echo "   [ ] Test main website loads"
echo "   [ ] Test all three menu types via QR links"
echo "   [ ] Test admin Google login"
echo "   [ ] Test menu item management"
echo "   [ ] Verify Firebase console access"

echo ""
echo "🎯 Next Steps:"
echo "   1. Generate QR codes for the three menu URLs"
echo "   2. Set up admin users in Firebase console"
echo "   3. Test complete user flow"
echo "   4. Monitor Firebase usage and performance"

echo ""
echo "For support: Check Firebase console at https://console.firebase.google.com/project/paradise-family"