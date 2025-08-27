# GitHub Repository Setup Guide

This guide will help you save your Paradise Family Restaurant Menu application to GitHub.

## 📋 Prerequisites

- GitHub account
- Git installed on your local machine
- Your project files ready

## 🚀 Step-by-Step Setup

### 1. Create a New Repository on GitHub

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top-right corner and select "New repository"
3. **Repository settings**:
   - **Repository name**: `paradise-family-restaurant-menu` (or your preferred name)
   - **Description**: `A modern restaurant menu application with Firebase integration, admin panel, and different pricing tiers for dine-in AC, non-AC, and takeaway options.`
   - **Visibility**: Choose "Public" or "Private" based on your preference
   - **Initialize repository**: ❌ **Do NOT check** "Add a README file" (we already have one)
   - **Add .gitignore**: ❌ **Do NOT select** (we already have one)
   - **Choose a license**: ❌ **Do NOT select** (we already have one)
4. **Click "Create repository"**

### 2. Connect Your Local Project to GitHub

After creating the repository, GitHub will show you setup instructions. Use the **"…or push an existing repository from the command line"** section.

**Open terminal in your project directory** and run these commands:

```bash
# Initialize git if not already done
git init

# Add all files to staging
git add .

# Make initial commit
git commit -m "Initial commit: Paradise Family Restaurant Menu App

- Complete restaurant menu application with Firebase integration
- Three menu types: Dine-in Non-AC, Dine-in AC, and Takeaway
- Admin panel for menu management
- Firebase Authentication and Firestore integration
- Responsive design with shadcn/ui components
- QR code ready with direct menu URLs"

# Add your GitHub repository as origin (replace USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/paradise-family-restaurant-menu.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME`** with your actual GitHub username.

### 3. Verify Upload

1. **Refresh your GitHub repository page**
2. **Check that all files are uploaded**:
   - ✅ Source code (`src/` folder)
   - ✅ Configuration files (`package.json`, `firebase.json`, etc.)
   - ✅ Documentation files (`README.md`, setup guides)
   - ✅ Firebase configuration
   - ❌ `node_modules/` should NOT be uploaded (excluded by .gitignore)
   - ❌ `.env` files should NOT be uploaded (excluded by .gitignore)

### 4. Set Up Repository Settings

#### A. Add Repository Topics
1. **Go to your repository page**
2. **Click the gear icon** next to "About"
3. **Add topics**: `restaurant`, `menu`, `firebase`, `react`, `typescript`, `vite`, `restaurant-menu`, `qr-menu`

#### B. Create Repository Description
In the "About" section, add:
```
🍽️ Modern restaurant menu application with Firebase integration. Features different pricing for dine-in AC/non-AC and takeaway, admin panel, and QR code support.
```

#### C. Add Website Link
If you've deployed to Firebase Hosting, add your live URL:
```
https://paradise-family.web.app
```

### 5. Repository Protection (Optional but Recommended)

#### A. Protect Main Branch
1. **Go to Settings → Branches**
2. **Click "Add rule"**
3. **Branch name pattern**: `main`
4. **Enable**: "Require a pull request before merging"
5. **Save changes**

#### B. Add Branch Protection
This prevents accidental direct pushes to main and requires pull requests.

## 📁 Repository Structure

Your GitHub repository will include:

```
paradise-family-restaurant-menu/
├── .github/                 # GitHub workflows and templates
├── src/                     # React application source code
│   ├── components/          # UI components
│   ├── lib/                 # Utilities and Firebase config
│   └── assets/              # Images and static assets
├── public/                  # Public assets
├── docs/                    # Documentation files
├── firebase.json            # Firebase configuration
├── package.json             # Node.js dependencies
├── README.md                # Project overview and setup
├── .gitignore              # Files to exclude from Git
└── deployment guides       # Various setup and deployment guides
```

## 🔄 Making Future Updates

### Daily Workflow
```bash
# Pull latest changes
git pull origin main

# Make your changes...

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add new menu category: Beverages"

# Push to GitHub
git push origin main
```

### Feature Development
```bash
# Create new feature branch
git checkout -b feature/add-beverage-menu

# Make changes and commit
git add .
git commit -m "Add beverage menu with pricing tiers"

# Push feature branch
git push origin feature/add-beverage-menu

# Create pull request on GitHub
```

## 🚀 Deployment Integration

### GitHub Pages (Optional)
You can set up automatic deployment to GitHub Pages:

1. **Go to Settings → Pages**
2. **Source**: Select "GitHub Actions"
3. **Create `.github/workflows/deploy.yml`** (see deployment guide)

### Firebase Integration
Your existing Firebase deployment will work with the GitHub repository:

```bash
# Deploy directly from local
firebase deploy

# Or set up GitHub Actions for auto-deployment
```

## 🔒 Security Considerations

### Environment Variables
- ❌ **Never commit** `.env` files with secrets
- ✅ **Use GitHub Secrets** for sensitive data in actions
- ✅ **Document** required environment variables in README

### Firebase Security
- ✅ **Review Firestore security rules** regularly
- ✅ **Keep Firebase config public** (it's safe)
- ✅ **Restrict admin access** through Firebase Console

## 🆘 Troubleshooting

### Common Issues

**1. Git not found**
```bash
# Install Git first, then retry
```

**2. Permission denied**
```bash
# Use personal access token instead of password
# GitHub Settings → Developer settings → Personal access tokens
```

**3. Repository already exists**
```bash
# Delete the remote and re-add
git remote remove origin
git remote add origin https://github.com/USERNAME/REPO.git
```

**4. Large file upload issues**
```bash
# Check .gitignore includes node_modules
# Remove large files if accidentally committed
```

## 📞 Support

- **GitHub Docs**: https://docs.github.com
- **Firebase Docs**: https://firebase.google.com/docs
- **Project Issues**: Create issues in your GitHub repository

---

🎉 **Congratulations!** Your Paradise Family Restaurant Menu is now saved on GitHub and ready for collaboration, deployment, and version control.