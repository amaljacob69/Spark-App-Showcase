# Contributing to Paradise Family Restaurant Menu System

Thank you for your interest in contributing to the Paradise Family Restaurant menu application! This document provides guidelines for contributing to this project.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** first to avoid duplicates
2. **Use the issue template** when creating new issues
3. **Provide clear descriptions** with steps to reproduce
4. **Include screenshots** for UI-related issues
5. **Specify device/browser** information for compatibility issues

### Submitting Changes

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following our coding standards
4. **Test thoroughly** on multiple devices
5. **Submit a pull request** with clear description

## 🎯 Development Guidelines

### Code Style

- **TypeScript**: Use strict typing, avoid `any` types
- **React**: Use functional components with hooks
- **CSS**: Use Tailwind utilities, custom CSS only when necessary
- **Mobile-First**: Always consider mobile experience first
- **Accessibility**: Ensure all features are accessible

### Component Structure

```typescript
// Good component structure
import { useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'

interface ComponentProps {
  title: string
  onAction: () => void
}

export function Component({ title, onAction }: ComponentProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = useCallback(() => {
    setIsLoading(true)
    onAction()
    setIsLoading(false)
  }, [onAction])

  return (
    <Button onClick={handleClick} disabled={isLoading}>
      {title}
    </Button>
  )
}
```

### Testing Guidelines

- **Test on multiple screen sizes** (320px to 1920px)
- **Test touch interactions** on mobile devices
- **Verify PWA functionality** works correctly
- **Check theme consistency** across all menu types
- **Validate accessibility** with screen readers

## 📱 Mobile-First Development

### Essential Considerations

1. **Touch Targets**: Minimum 44px height/width
2. **Safe Areas**: Respect device notches and home indicators
3. **Viewport**: Use proper viewport meta tag
4. **Performance**: Optimize images and animations
5. **Offline**: Ensure graceful offline behavior

### Responsive Breakpoints

```css
/* Mobile-first approach */
.component {
  /* Mobile styles (default) */
  font-size: 14px;
}

@media (min-width: 640px) {
  .component {
    /* Small tablets and up */
    font-size: 16px;
  }
}

@media (min-width: 1024px) {
  .component {
    /* Desktop and up */
    font-size: 18px;
  }
}
```

## 🎨 Theme Development

### Adding New Themes

1. Define color palette in `src/index.css`
2. Add theme class to body element
3. Create themed components
4. Test across all menu types

### Color Guidelines

- Use OKLCH color space for better consistency
- Maintain WCAG AA contrast ratios (4.5:1 minimum)
- Test colors with colorblind accessibility tools

## 🔧 Feature Development

### Menu System

- **Menu Items**: Use the `MenuItem` interface consistently
- **Pricing**: Always handle all three price types
- **Categories**: Ensure new categories work with filtering
- **Images**: Optimize images for mobile (WebP preferred)

### PWA Features

- **Service Worker**: Update caching strategies for new features
- **Manifest**: Keep app manifest current with features
- **Offline**: Test offline functionality thoroughly

## 🐛 Bug Fixes

### Priority Levels

1. **Critical**: App crashes, data loss, security issues
2. **High**: Major feature broken, poor UX
3. **Medium**: Minor feature issues, cosmetic problems
4. **Low**: Enhancement requests, nice-to-have fixes

### Bug Fix Process

1. **Reproduce** the issue consistently
2. **Identify root cause** before making changes
3. **Fix minimally** - don't over-engineer
4. **Test thoroughly** to avoid regressions
5. **Document** the fix in commit messages

## 📊 Performance Guidelines

### Core Web Vitals Targets

- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

### Optimization Techniques

- Use `React.memo` for expensive components
- Implement proper loading states
- Optimize images and assets
- Minimize bundle size
- Use efficient data structures

## 🔒 Security Considerations

### Input Validation

```typescript
// Always sanitize user input
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '')
}
```

### Admin Features

- Validate admin permissions before operations
- Use secure password practices
- Implement rate limiting
- Log security-related events

## 📝 Documentation

### Code Comments

```typescript
/**
 * Calculates the price for a menu item based on menu type
 * @param item - Menu item with pricing information
 * @param menuType - Type of menu (dinein-non-ac, dinein-ac, takeaway)
 * @returns Formatted price with currency symbol
 */
export function formatPrice(item: MenuItem, menuType: MenuType): string {
  // Implementation details...
}
```

### README Updates

- Keep feature lists current
- Update screenshots when UI changes
- Maintain accurate setup instructions
- Include new configuration options

## 🚀 Release Process

### Version Management

- Use semantic versioning (MAJOR.MINOR.PATCH)
- Update version in `package.json`
- Create release notes
- Tag releases in Git

### Deployment Checklist

- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Mobile testing complete
- [ ] PWA functionality verified
- [ ] Security review completed

## 💡 Enhancement Ideas

### Potential Contributions

- **Multi-language support** (Malayalam, Hindi, Arabic)
- **Voice ordering** integration
- **Table booking** system
- **Loyalty program** features
- **Nutritional information** display
- **Allergen warnings** system

## 📞 Getting Help

### Resources

- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **TypeScript**: https://typescriptlang.org
- **PWA Guide**: https://web.dev/progressive-web-apps/

### Contact

- Create an issue for technical questions
- Use discussions for feature ideas
- Check existing documentation first

## 🏆 Recognition

Contributors will be:
- Listed in the project README
- Credited in release notes
- Invited to join the maintainers team (for significant contributions)

---

Thank you for helping make Paradise Family Restaurant's digital menu system better! 🍴