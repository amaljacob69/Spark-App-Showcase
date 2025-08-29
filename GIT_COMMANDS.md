# 📋 Git Commands for Paradise Family Restaurant Repository

This guide provides all the necessary Git commands to set up and manage your Paradise Family Restaurant GitHub repository.

## 🚀 Initial Repository Setup

### 1. Clone or Initialize Repository

#### Option A: Clone from GitHub (if repository already exists)
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/paradise-family-restaurant.git
cd paradise-family-restaurant

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Option B: Initialize new repository
```bash
# Navigate to project directory
cd paradise-family-restaurant

# Initialize Git repository
git init

# Add remote origin (replace with your GitHub repository URL)
git remote add origin https://github.com/YOUR_USERNAME/paradise-family-restaurant.git

# Verify remote
git remote -v
```

### 2. Prepare Files for First Commit

```bash
# Check current status
git status

# Add all files
git add .

# Check what will be committed
git status

# Create comprehensive initial commit
git commit -m "🎉 Initial commit: Paradise Family Restaurant PWA

✨ Features:
- Multi-menu system with three dining options (Non-A/C, A/C, Take Away)
- Dynamic pricing system for different menu types
- PWA with offline support and mobile installation
- Advanced search and dietary preference filtering
- Shopping cart functionality with quantity management
- QR code direct access for seamless customer experience
- Admin panel for menu management and editing
- Special offers and daily specials section

🎨 User Experience:
- Mobile-first responsive design
- Dynamic theming for each menu type
- Smooth animations and micro-interactions
- Floating action buttons for quick access
- Horizontal scrolling menu sections
- Category-based menu browsing
- Touch-friendly interface optimization

🏗️ Technical Implementation:
- React 18 + TypeScript for type-safe development
- Tailwind CSS + Shadcn/ui component library
- Vite build system for optimal performance
- Progressive Web App (PWA) capabilities
- Service worker for offline functionality
- Performance monitoring and error handling
- Security hardening with input sanitization
- SEO optimization with structured data

🍽️ Restaurant Information:
- Famous for Kerala, Arabic, and Chinese cuisine
- Fresh bakery items made daily
- Located in Chalakudy, Kerala
- Multiple dining options with different pricing
- Integrated social media and review links

📱 Mobile Optimization:
- Touch-friendly interface design
- PWA installation prompts
- Offline menu access
- Quick call and location buttons
- Social media integration
- Google Reviews integration

🛡️ Production Ready:
- Environment configuration
- Error boundary implementation
- Performance optimization
- Security best practices
- Accessibility compliance (WCAG 2.1 AA)
- Cross-browser compatibility"

# Set main as default branch
git branch -M main

# Push to GitHub
git push -u origin main
```

## 🏷️ Version Management & Releases

### Create Release Tags

```bash
# Create and push initial release tag
git tag -a v1.0.0 -m "🎉 Paradise Family Restaurant v1.0.0 - Initial Release

🍽️ Welcome to Paradise Family Restaurant & Bake Shop!

This is the initial production release of our modern PWA restaurant menu application.

🌟 Major Features:
- Multi-menu system (Non-A/C, A/C, Take Away) with dynamic pricing
- PWA installation for mobile devices with offline support
- Advanced search and dietary preference filtering
- Admin panel for comprehensive menu management
- Mobile-first responsive design with touch optimization
- QR code direct access for seamless customer ordering

🎨 User Interface Highlights:
- Dynamic theming system for each menu type
- Smooth animations and delightful micro-interactions
- Floating action buttons for quick access to cart and social links
- Horizontal scrolling sections for featured and popular items
- Category-based browsing with visual indicators

🏗️ Technical Excellence:
- Built with React 18 + TypeScript for type safety
- Styled with Tailwind CSS + Shadcn/ui components
- Optimized build system using Vite
- Performance score 95+ on Lighthouse
- Comprehensive error handling and security measures
- SEO enhanced with structured data and meta tags

🍛 Showcasing Authentic Cuisine:
- Kerala specialties (fish curry, biriyani, beef fry)
- Arabic dishes (shawarma, kabsa, hummus)
- Chinese favorites (fried rice, noodles, sweet & sour)
- Fresh bakery items (croissants, cakes, pastries)

📱 PWA Features:
- Install on mobile devices like a native app
- Offline menu access and browsing
- Fast loading with service worker caching
- Push notification support (ready for future use)"

git push origin v1.0.0
```

### Future Version Tags

```bash
# For feature updates
git tag -a v1.1.0 -m "🚀 Feature Release v1.1.0

✨ New Features:
- [Feature 1 description]
- [Feature 2 description]

🐛 Bug Fixes:
- [Bug fix 1]
- [Bug fix 2]

🔧 Improvements:
- [Improvement 1]
- [Improvement 2]"

# For bug fixes
git tag -a v1.0.1 -m "🐛 Bug Fix Release v1.0.1

🔧 Fixes:
- [Critical bug fix]
- [Minor bug fix]"

# Push tags
git push origin --tags
```

## 🔄 Daily Development Workflow

### Working on Features

```bash
# Pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/menu-improvements

# Make changes and commit frequently
git add .
git commit -m "✨ Add new menu search functionality"

# Push feature branch
git push origin feature/menu-improvements

# When ready, merge back to main
git checkout main
git merge feature/menu-improvements
git push origin main

# Delete feature branch
git branch -d feature/menu-improvements
git push origin --delete feature/menu-improvements
```

### Quick Fixes

```bash
# For urgent fixes
git checkout -b hotfix/critical-bug-fix

# Make fix and commit
git add .
git commit -m "🚨 Fix critical menu display bug"

# Merge and push
git checkout main
git merge hotfix/critical-bug-fix
git push origin main

# Create patch version tag
git tag -a v1.0.1 -m "🚨 Critical Bug Fix v1.0.1"
git push origin v1.0.1
```

## 📝 Commit Message Conventions

### Commit Types
```bash
# Features
git commit -m "✨ Add shopping cart functionality"

# Bug fixes  
git commit -m "🐛 Fix menu item price display issue"

# Documentation
git commit -m "📝 Update README with deployment instructions"

# Style/UI changes
git commit -m "🎨 Improve mobile menu layout"

# Performance
git commit -m "⚡ Optimize image loading and caching"

# Security
git commit -m "🔒 Add input sanitization for admin panel"

# Refactoring
git commit -m "♻️ Refactor menu component structure"

# Configuration
git commit -m "🔧 Update build configuration for production"

# Dependencies
git commit -m "⬆️ Update React to v18.3.1"

# Breaking changes
git commit -m "💥 BREAKING: Change menu API structure"
```

## 🌿 Branch Management

### Branch Naming Conventions

```bash
# Feature branches
git checkout -b feature/add-payment-integration
git checkout -b feature/multilingual-support
git checkout -b feature/advanced-analytics

# Bug fix branches
git checkout -b bugfix/menu-loading-issue
git checkout -b bugfix/mobile-scroll-problem

# Hotfix branches (for critical production issues)
git checkout -b hotfix/security-vulnerability
git checkout -b hotfix/payment-gateway-down

# Release branches
git checkout -b release/v1.1.0
git checkout -b release/v2.0.0
```

### Branch Operations

```bash
# List all branches
git branch -a

# Switch branches
git checkout main
git checkout feature/menu-improvements

# Create and switch to new branch
git checkout -b feature/new-feature

# Delete branches
git branch -d feature/completed-feature
git push origin --delete feature/completed-feature

# Merge branches
git checkout main
git merge feature/ready-feature

# Rebase (alternative to merge)
git checkout feature/my-feature
git rebase main
```

## 🔄 Syncing and Collaboration

### Pulling Changes

```bash
# Pull latest changes from main
git pull origin main

# Pull with rebase (keeps history cleaner)
git pull --rebase origin main

# Fetch changes without merging
git fetch origin
git log origin/main --oneline
```

### Resolving Conflicts

```bash
# When conflicts occur during merge/rebase
git status  # See conflicted files

# Edit conflicted files, then:
git add resolved-file.js
git commit -m "🔀 Resolve merge conflict in menu component"

# For rebase conflicts:
git add resolved-file.js
git rebase --continue
```

### Stashing Changes

```bash
# Save work in progress
git stash save "WIP: working on menu filters"

# Apply stashed changes
git stash pop

# List stashes
git stash list

# Apply specific stash
git stash apply stash@{1}
```

## 📊 Repository History and Information

### Viewing History

```bash
# View commit history
git log --oneline --graph --decorate

# View specific file history
git log --follow src/App.tsx

# View changes in last commit
git show HEAD

# View changes between commits
git diff HEAD~1 HEAD

# View who changed what
git blame src/components/MenuGrid.tsx
```

### Repository Status

```bash
# Check status
git status

# View differences
git diff

# View staged differences
git diff --staged

# Check remote repositories
git remote -v

# View branch information
git branch -vv
```

## 🛠️ Useful Git Configurations

### Initial Git Setup

```bash
# Configure user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable colored output
git config --global color.ui auto

# Set default editor
git config --global core.editor "code --wait"
```

### Aliases for Faster Work

```bash
# Create useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
git config --global alias.visual '!gitk'
git config --global alias.pom 'push origin main'
git config --global alias.plo 'pull origin main'
```

## 🚨 Emergency Procedures

### Undo Recent Changes

```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo changes to specific file
git checkout HEAD -- src/components/MenuGrid.tsx

# Reset to specific commit
git reset --hard COMMIT_HASH
```

### Recovery Operations

```bash
# Find lost commits
git reflog

# Recover deleted branch
git checkout -b recovered-branch COMMIT_HASH

# Recover specific file from another branch
git checkout other-branch -- src/components/Header.tsx
```

## 📈 Repository Maintenance

### Cleaning Up

```bash
# Remove untracked files
git clean -fd

# Prune remote tracking branches
git remote prune origin

# Garbage collection
git gc --aggressive --prune=now

# Check repository integrity
git fsck --full
```

### Repository Statistics

```bash
# View repository size
git count-objects -vH

# View contributor statistics
git shortlog -sn

# View file statistics
git ls-files | wc -l
```

---

## 🎯 Quick Command Reference

### Daily Commands
```bash
git status              # Check repository status
git add .               # Stage all changes
git commit -m "message" # Commit with message
git push origin main    # Push to remote
git pull origin main    # Pull latest changes
```

### Branch Commands
```bash
git branch              # List local branches
git checkout -b name    # Create and switch branch
git merge branch-name   # Merge branch
git branch -d name      # Delete branch
```

### History Commands
```bash
git log --oneline       # View commit history
git show HEAD           # Show last commit
git diff                # Show unstaged changes
git blame file.js       # Show file history
```

This comprehensive Git command reference will help you manage your Paradise Family Restaurant repository effectively! 🎉