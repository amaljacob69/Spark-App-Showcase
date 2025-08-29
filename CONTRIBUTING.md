# 🤝 Contributing to Paradise Family Restaurant

Thank you for your interest in contributing to Paradise Family Restaurant's digital menu system! This guide will help you get started with contributing to this project.

## 🍽️ Project Overview

Paradise Family Restaurant & Bake Shop is a modern, mobile-first PWA menu application serving authentic Kerala, Arabic, and Chinese cuisine. The app features dynamic pricing for different dining contexts and a comprehensive admin panel for menu management.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- VS Code (recommended)

### Setup
```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/paradise-family-restaurant.git
cd paradise-family-restaurant

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

## 🎯 How to Contribute

### 1. 🐛 Reporting Bugs
- Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md)
- Include device/browser information
- Specify which menu type is affected
- Provide clear reproduction steps

### 2. ✨ Suggesting Features  
- Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md)
- Explain how it benefits customers or restaurant operations
- Consider mobile-first design implications
- Think about PWA/offline functionality

### 3. 🔧 Code Contributions

#### Branch Naming Convention
```bash
# Feature branches
feature/add-dessert-category
feature/improve-mobile-search

# Bug fix branches  
fix/cart-total-calculation
fix/mobile-touch-responsiveness

# Documentation branches
docs/update-setup-guide
docs/add-api-documentation
```

#### Commit Message Format
```bash
# Format: type(scope): description

feat(menu): add dessert category with pricing tiers
fix(cart): resolve quantity update bug on mobile  
docs(readme): update installation instructions
style(components): improve button hover states
perf(images): optimize menu item photos
```

#### Pull Request Process
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test across devices (mobile priority)
5. Update documentation if needed
6. Submit PR with detailed description

## 🎨 Design Guidelines

### Mobile-First Approach
- Design for mobile screens first (320px+)
- Ensure touch targets are 44px minimum
- Test on real devices when possible
- Consider thumb navigation patterns

### Theme Consistency
- **Non-AC Theme**: Warm orange tones (cozy atmosphere)
- **A/C Theme**: Cool blue tones (premium experience)  
- **Takeaway Theme**: Fresh green tones (quick service)

### Typography
- **Headers**: Playfair Display (elegant, readable)
- **Body**: Inter (clean, mobile-optimized)
- **Sizes**: Responsive scale 14px-18px base

### Component Standards
- Use shadcn/ui components when possible
- Follow existing component patterns
- Ensure accessibility (WCAG AA)
- Include loading and error states

## 📱 Testing Requirements

### Device Testing Matrix
| Device Type | Priority | Browsers |
|------------|----------|----------|
| **Mobile Phones** | 🔴 Critical | Chrome, Safari |
| **Tablets** | 🟡 Medium | Chrome, Safari |  
| **Desktop** | 🟢 Low | Chrome, Safari, Firefox |

### Testing Checklist
- [ ] All three menu types work correctly
- [ ] QR code access functions properly
- [ ] Search and filters operate smoothly
- [ ] Cart functionality works offline
- [ ] Admin panel is secure and functional
- [ ] PWA installation works
- [ ] Performance remains optimal

## 🏗️ Code Standards

### File Organization
```
src/
├── components/
│   ├── ui/              # shadcn components (don't modify)
│   ├── Header.tsx       # Main navigation
│   ├── MenuGrid.tsx     # Menu item display
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── assets/              # Images, icons, media
```

### TypeScript Guidelines
- Use strict type checking
- Define interfaces for data structures
- Avoid `any` types
- Document complex type definitions

### Component Guidelines
```tsx
// Good: Mobile-first responsive component
const MenuCard = ({ item, menuType }: MenuCardProps) => {
  return (
    <Card className="w-full touch-target themed-card">
      <CardContent className="p-3 sm:p-4 lg:p-6">
        {/* Mobile-optimized content */}
      </CardContent>
    </Card>
  )
}

// Good: Accessible button with proper touch target
<Button 
  className="touch-target w-full sm:w-auto"
  aria-label="Add to cart"
>
  Add to Cart
</Button>
```

### Performance Guidelines
- Use React.memo() for expensive components
- Implement lazy loading for images
- Optimize bundle size with code splitting
- Cache API responses appropriately

## 🔒 Security Guidelines

### Input Validation
- Sanitize all user inputs
- Validate menu item data structures
- Check pricing ranges (0-10,000 INR)
- Prevent XSS and injection attacks

### Admin Panel Security
- Never log sensitive information
- Validate admin permissions
- Use secure session management
- Implement rate limiting

## 🌟 Restaurant-Specific Considerations

### Cuisine Categories
- **Kerala Cuisine**: Traditional local dishes
- **Arabic Cuisine**: Middle Eastern specialties  
- **Chinese Cuisine**: Indo-Chinese favorites
- **Bakery**: Fresh baked goods

### Pricing Structure
```typescript
// All items must have three price points
interface MenuPricing {
  'dinein-non-ac': number  // Base pricing
  'dinein-ac': number      // Premium pricing (+10-20%)
  'takeaway': number       // Discounted pricing (-10%)
}
```

### Dietary Filters
- Vegetarian (🥬)
- Egg (🥚) 
- Chicken (🐔)
- Meat (🥩)
- Fish (🐟)

## 🎭 User Experience Priorities

1. **Mobile Performance**: Fast loading on 3G/4G
2. **Offline Functionality**: Browse menu without connection
3. **Intuitive Navigation**: Easy food discovery
4. **Visual Appeal**: Appetizing food presentation
5. **Quick Actions**: Fast cart and ordering

## 📊 Performance Targets

- **Lighthouse Score**: 90+ (all metrics)
- **Load Time**: <2s on 3G
- **Bundle Size**: <500KB initial
- **Accessibility**: WCAG AA compliance

## 🤝 Community Guidelines

### Be Respectful
- Welcome newcomers warmly
- Provide constructive feedback
- Help others learn and grow
- Celebrate contributions

### Restaurant Context
- Remember this serves real customers
- Consider cultural sensitivity
- Think about accessibility needs
- Prioritize user experience

## 📞 Getting Help

### Development Questions
- Check existing issues first
- Create detailed bug reports
- Include code snippets
- Test on mobile devices

### Design Questions  
- Reference existing patterns
- Consider mobile-first approach
- Think about theme consistency
- Ask about accessibility

## 🏆 Recognition

Contributors will be:
- Listed in project README
- Credited in release notes  
- Invited to provide feedback on future features
- Recognized in the Paradise Restaurant community

## 📋 Review Process

### Code Review Criteria
- Mobile responsiveness
- Performance impact
- Security considerations  
- Design consistency
- Documentation updates

### Review Timeline
- Initial feedback: 1-2 days
- Detailed review: 3-5 days
- Final approval: 1-2 days

---

## 🙏 Thank You!

Your contributions help Paradise Family Restaurant provide an exceptional digital dining experience. Every bug fix, feature, and improvement makes a difference for our customers enjoying authentic Kerala, Arabic, and Chinese cuisine.

**🍛 Happy coding and bon appétit! 🥖**