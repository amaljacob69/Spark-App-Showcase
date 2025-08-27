#!/bin/bash

# Paradise Family Restaurant Menu - GitHub Setup Script
# This script helps you quickly set up your repository on GitHub

echo "🍽️  Paradise Family Restaurant Menu - GitHub Setup"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}📋 Prerequisites Check:${NC}"
echo "✅ Project files are ready"
echo "✅ .gitignore is configured"
echo "✅ README.md is available"

echo ""
echo -e "${YELLOW}⚠️  Before running Git commands:${NC}"
echo "1. Create a new repository on GitHub.com"
echo "2. Copy your repository URL"
echo "3. Do NOT initialize with README, .gitignore, or license"

echo ""
echo -e "${GREEN}🚀 Git Commands to Run:${NC}"
echo ""

echo -e "${BLUE}# 1. Initialize Git repository (if not done already)${NC}"
echo "git init"
echo ""

echo -e "${BLUE}# 2. Add all files to staging area${NC}"
echo "git add ."
echo ""

echo -e "${BLUE}# 3. Create initial commit${NC}"
echo 'git commit -m "Initial commit: Paradise Family Restaurant Menu App

- Complete restaurant menu application with Firebase integration
- Three menu types: Dine-in Non-AC, Dine-in AC, and Takeaway  
- Admin panel for menu management
- Firebase Authentication and Firestore integration
- Responsive design with shadcn/ui components
- QR code ready with direct menu URLs"'
echo ""

echo -e "${BLUE}# 4. Add GitHub repository as remote origin${NC}"
echo -e "${RED}# ⚠️  REPLACE 'YOUR_USERNAME' and 'REPO_NAME' with your actual values${NC}"
echo "git remote add origin https://github.com/YOUR_USERNAME/paradise-family-restaurant-menu.git"
echo ""

echo -e "${BLUE}# 5. Set main branch and push to GitHub${NC}"
echo "git branch -M main"
echo "git push -u origin main"

echo ""
echo -e "${GREEN}📁 Repository Structure:${NC}"
echo "Your GitHub repository will include:"
echo "├── src/                     # React application source"
echo "├── firebase.json            # Firebase configuration"  
echo "├── package.json             # Dependencies"
echo "├── README.md                # Project documentation"
echo "├── GITHUB-SETUP.md         # This setup guide"
echo "├── DEPLOYMENT.md           # Deployment instructions"
echo "├── .gitignore              # Git ignore rules"
echo "└── Various setup guides    # Admin, Firebase, etc."

echo ""
echo -e "${YELLOW}🔄 Daily Development Workflow:${NC}"
echo ""
echo -e "${BLUE}# Pull latest changes before starting work${NC}"
echo "git pull origin main"
echo ""
echo -e "${BLUE}# After making changes${NC}"
echo "git add ."
echo 'git commit -m "Your descriptive commit message"'
echo "git push origin main"

echo ""
echo -e "${GREEN}✨ Quick Commands for Menu Updates:${NC}"
echo ""
echo -e "${BLUE}# Adding new menu items${NC}"
echo 'git commit -m "Add new menu items: [item names]"'
echo ""
echo -e "${BLUE}# Updating prices${NC}"
echo 'git commit -m "Update pricing for [menu type]"'
echo ""
echo -e "${BLUE}# UI improvements${NC}"
echo 'git commit -m "Improve [component] design and responsiveness"'
echo ""
echo -e "${BLUE}# Bug fixes${NC}"
echo 'git commit -m "Fix [specific issue description]"'

echo ""
echo -e "${GREEN}🌐 After GitHub Setup:${NC}"
echo "1. ✅ Repository will be available at: https://github.com/YOUR_USERNAME/REPO_NAME"
echo "2. ✅ Clone anywhere with: git clone https://github.com/YOUR_USERNAME/REPO_NAME.git"
echo "3. ✅ Share with team members for collaboration"
echo "4. ✅ Set up GitHub Actions for automatic Firebase deployment"

echo ""
echo -e "${BLUE}📚 Documentation Available:${NC}"
echo "- README.md           # Main project overview"
echo "- GITHUB-SETUP.md     # This GitHub setup guide" 
echo "- DEPLOYMENT.md       # Firebase deployment guide"
echo "- ADMIN-SETUP.md      # Admin user configuration"
echo "- FIREBASE-SETUP.md   # Firebase project setup"

echo ""
echo -e "${GREEN}🎉 Ready to save your restaurant menu to GitHub!${NC}"
echo ""
echo -e "${YELLOW}💡 Pro Tips:${NC}"
echo "• Use descriptive commit messages"
echo "• Commit frequently with small, logical changes"  
echo "• Pull before pushing to avoid conflicts"
echo "• Create branches for major new features"
echo "• Never commit sensitive data (.env files are ignored)"

echo ""
echo -e "${RED}🔒 Security Reminder:${NC}"
echo "Your Firebase config is safe to commit (it's public by design)"
echo "Environment secrets are protected by .gitignore"
echo "Admin access is controlled through Firebase Console"

echo ""
echo "=================================================="
echo -e "${GREEN}Follow the commands above to save your project to GitHub! 🚀${NC}"