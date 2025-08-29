name: Pull Request
description: Submit a pull request for the Paradise Restaurant Menu System
title: "[PR]: "
body:
  - type: markdown
    attributes:
      value: |
        Thank you for contributing to Paradise Family Restaurant Menu System! Please fill out this template to help us review your changes.

  - type: input
    id: summary
    attributes:
      label: Summary
      description: Brief description of what this PR does
      placeholder: "Fix mobile responsive issue with menu grid"
    validations:
      required: true

  - type: dropdown
    id: pr-type
    attributes:
      label: Type of Change
      description: What type of change does this PR make?
      multiple: false
      options:
        - Bug fix (non-breaking change which fixes an issue)
        - New feature (non-breaking change which adds functionality)
        - Breaking change (fix or feature that would cause existing functionality to not work as expected)
        - Performance improvement
        - Code refactoring (no functional changes)
        - Documentation update
        - UI/UX improvement
        - Accessibility improvement
        - Security fix
    validations:
      required: true

  - type: dropdown
    id: affected-areas
    attributes:
      label: Affected Areas
      description: Which parts of the application does this PR affect?
      multiple: true
      options:
        - Menu Display & Navigation
        - Admin Panel
        - Search & Filtering
        - Cart & Ordering System
        - PWA Functionality
        - Mobile Responsiveness
        - Theme System
        - Performance
        - Security
        - Accessibility
        - Documentation

  - type: textarea
    id: description
    attributes:
      label: Description
      description: Detailed description of the changes made
      placeholder: |
        Explain what changes you made and why:
        - Fixed the responsive grid layout on mobile devices
        - Updated CSS media queries for better mobile experience
        - Added touch-friendly interaction states
    validations:
      required: true

  - type: textarea
    id: motivation
    attributes:
      label: Motivation and Context
      description: Why is this change required? What problem does it solve?
      placeholder: |
        This change is needed because:
        - Issue #123 reported mobile layout problems
        - Customers were having difficulty viewing menu items on phones
        - The current grid was not optimized for touch interactions
    validations:
      required: true

  - type: checkboxes
    id: testing-checklist
    attributes:
      label: Testing Checklist
      description: Please confirm you have tested the following
      options:
        - label: Tested on mobile devices (both Android and iOS)
        - label: Tested on tablets (portrait and landscape)
        - label: Tested on desktop browsers
        - label: Verified all three menu types work (Non-AC, A/C, Take Away)
        - label: Tested PWA functionality (install, offline usage)
        - label: Verified accessibility with screen readers
        - label: Tested cart functionality (if applicable)
        - label: Tested admin panel (if applicable)
        - label: Performance impact assessed

  - type: checkboxes
    id: code-quality
    attributes:
      label: Code Quality Checklist
      description: Please confirm your code meets quality standards
      options:
        - label: Code follows TypeScript best practices
        - label: Components are properly typed
        - label: Mobile-first responsive design implemented
        - label: Accessibility standards followed (WCAG 2.1)
        - label: Performance considerations addressed
        - label: Security best practices followed
        - label: Code is properly commented where necessary
        - label: No console.log statements left in production code

  - type: textarea
    id: breaking-changes
    attributes:
      label: Breaking Changes
      description: List any breaking changes (if applicable)
      placeholder: |
        If this PR introduces breaking changes, list them here:
        - Changed the interface for MenuItem to include new required field
        - Removed deprecated function xyz()
        - Updated theme structure requiring theme file updates
    validations:
      required: false

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots/Videos
      description: Add screenshots or videos demonstrating the changes
      placeholder: |
        Before/After screenshots help reviewers understand the changes:
        - Mobile view improvements
        - New features in action
        - Fixed UI elements
    validations:
      required: false

  - type: checkboxes
    id: browser-testing
    attributes:
      label: Browser Testing
      description: Which browsers have you tested this change on?
      options:
        - label: Chrome (Android)
        - label: Chrome (Desktop)
        - label: Safari (iOS)
        - label: Safari (macOS)
        - label: Firefox
        - label: Microsoft Edge
        - label: Samsung Internet

  - type: input
    id: related-issues
    attributes:
      label: Related Issues
      description: Link to related issues (use "Closes #issue-number" to auto-close)
      placeholder: "Closes #123, References #456"
    validations:
      required: false

  - type: textarea
    id: additional-context
    attributes:
      label: Additional Context
      description: Add any additional context about the PR
      placeholder: |
        Any additional information that might be helpful:
        - Dependencies that need to be updated
        - Configuration changes required
        - Migration steps needed
        - Known limitations or future improvements
    validations:
      required: false

  - type: checkboxes
    id: final-checklist
    attributes:
      label: Final Checklist
      description: Please confirm the following before submitting
      options:
        - label: I have read and followed the Contributing Guidelines
        - label: I have tested my changes thoroughly
        - label: My code follows the project's coding standards
        - label: I have added appropriate documentation
        - label: My changes generate no new warnings or errors
        - label: I have added tests that prove my fix is effective or that my feature works
        - label: All new and existing tests pass
        - label: This PR is ready for review

  - type: checkboxes
    id: code-of-conduct
    attributes:
      label: Code of Conduct
      description: By submitting this PR, you agree to follow our Code of Conduct
      options:
        - label: I agree to follow this project's Code of Conduct
          required: true