#!/bin/bash

# Firestore Security Rules Deployment Script
# Paradise Family Restaurant Menu Application

set -e

echo "🔒 Paradise Family Restaurant - Firestore Security Rules Deployment"
echo "=================================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI is not installed${NC}"
    echo "Install it with: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
echo -e "${BLUE}🔐 Checking Firebase authentication...${NC}"
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️ Not logged in to Firebase${NC}"
    echo "Logging in..."
    firebase login
fi

# Verify project configuration
echo -e "${BLUE}📋 Verifying project configuration...${NC}"
PROJECT_ID=$(firebase use --current)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ No Firebase project selected${NC}"
    echo "Run: firebase use paradise-family"
    exit 1
fi
echo -e "${GREEN}✅ Using project: $PROJECT_ID${NC}"

# Check if firestore.rules exists
if [ ! -f "firestore.rules" ]; then
    echo -e "${RED}❌ firestore.rules file not found${NC}"
    exit 1
fi

# Validate rules syntax
echo -e "${BLUE}🔍 Validating Firestore rules syntax...${NC}"
if firebase firestore:rules:test --input=firestore.rules; then
    echo -e "${GREEN}✅ Rules syntax is valid${NC}"
else
    echo -e "${RED}❌ Rules syntax validation failed${NC}"
    exit 1
fi

# Display current rules for review
echo -e "${BLUE}📄 Current rules to be deployed:${NC}"
echo "================================"
head -20 firestore.rules
echo "... (showing first 20 lines)"
echo "================================"

# Confirmation prompt
read -p "🚀 Deploy these security rules to production? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Deployment cancelled${NC}"
    exit 0
fi

# Deploy rules
echo -e "${BLUE}🚀 Deploying Firestore security rules...${NC}"
if firebase deploy --only firestore:rules; then
    echo -e "${GREEN}✅ Firestore security rules deployed successfully!${NC}"
else
    echo -e "${RED}❌ Failed to deploy security rules${NC}"
    exit 1
fi

# Verify deployment
echo -e "${BLUE}🔍 Verifying deployment...${NC}"
sleep 2
if firebase firestore:rules:get > /dev/null; then
    echo -e "${GREEN}✅ Rules deployment verified${NC}"
else
    echo -e "${YELLOW}⚠️ Could not verify deployment${NC}"
fi

# Security checklist reminder
echo -e "${BLUE}📋 Post-deployment Security Checklist:${NC}"
echo "=================================="
echo "☐ Test admin authentication"
echo "☐ Verify menu read access for public"
echo "☐ Test menu write restrictions for non-admins"
echo "☐ Confirm admin management functions"
echo "☐ Monitor Firebase Console for rule violations"
echo "☐ Set up monitoring alerts (recommended)"

echo ""
echo -e "${GREEN}🎉 Deployment complete!${NC}"
echo -e "${BLUE}📚 View security documentation: FIRESTORE-SECURITY.md${NC}"
echo -e "${BLUE}🔍 Monitor rules: https://console.firebase.google.com/project/$PROJECT_ID/firestore/rules${NC}"

# Optional: Open Firebase Console
read -p "🌐 Open Firebase Console to monitor rules? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v open &> /dev/null; then
        open "https://console.firebase.google.com/project/$PROJECT_ID/firestore/rules"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://console.firebase.google.com/project/$PROJECT_ID/firestore/rules"
    else
        echo -e "${BLUE}🔗 Open this URL: https://console.firebase.google.com/project/$PROJECT_ID/firestore/rules${NC}"
    fi
fi

echo -e "${GREEN}✨ Security rules deployment completed successfully!${NC}"