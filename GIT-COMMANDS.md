# Git Commands Quick Reference

## 🚀 Initial GitHub Setup

```bash
# 1. Initialize repository
git init

# 2. Add all files
git add .

# 3. Initial commit
git commit -m "Initial commit: Paradise Family Restaurant Menu App"

# 4. Add GitHub remote (replace with your URL)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

## 🔄 Daily Development

```bash
# Start your work session
git pull origin main

# After making changes
git add .
git commit -m "Your change description"
git push origin main
```

## 📝 Common Commit Messages

```bash
# Menu updates
git commit -m "Add new menu items: Beverages category"
git commit -m "Update pricing for takeaway menu"
git commit -m "Remove unavailable seasonal items"

# UI improvements  
git commit -m "Improve mobile responsiveness"
git commit -m "Update header design and navigation"
git commit -m "Enhance admin panel usability"

# Bug fixes
git commit -m "Fix price calculation error for AC pricing"
git commit -m "Resolve Firebase authentication issue"
git commit -m "Fix menu filtering on mobile devices"

# Features
git commit -m "Add menu item search functionality"
git commit -m "Implement QR code generation"
git commit -m "Add menu export feature"
```

## 🌿 Branch Management

```bash
# Create feature branch
git checkout -b feature/new-feature-name

# Switch between branches
git checkout main
git checkout feature/new-feature-name

# Merge feature to main
git checkout main
git merge feature/new-feature-name

# Delete feature branch
git branch -d feature/new-feature-name
```

## ❌ Troubleshooting

```bash
# Undo last commit (keep changes)
git reset HEAD~1

# Discard all local changes
git checkout -- .

# Check repository status
git status

# View commit history
git log --oneline

# Remove remote and re-add
git remote remove origin
git remote add origin NEW_URL
```

## 🔍 Checking Status

```bash
# See what files changed
git status

# See what changed in files
git diff

# See commit history
git log --oneline -10
```

---
💡 **Need help?** Check the full [GITHUB-SETUP.md](./GITHUB-SETUP.md) guide!