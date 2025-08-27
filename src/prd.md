# Savory - Restaurant Menu Management System

# Savory - Multi-Tier Restaurant Menu Management System

## Core Purpose & Success
- **Mission Statement**: A sophisticated web application that displays restaurant menu items with dynamic pricing across three service types (Dine-in Non-AC, Dine-in AC, Take Away) while providing restaurant staff with admin tools to manage menu content in real-time.
- **Success Indicators**: Customers can easily browse menu items with appropriate pricing for their chosen service type, while administrators can efficiently manage base prices that automatically calculate across all service tiers.
- **Experience Qualities**: Professional, intuitive, and elegant - creating a premium dining experience digitally with transparent pricing across service levels.

## Project Classification & Approach
- **Complexity Level**: Light Application (multiple features with dynamic pricing logic and state management)
- **Primary User Activity**: 
  - **Customers**: Consuming (browsing menu items by category and service type)
  - **Administrators**: Acting (managing menu content and base pricing through admin panel)

## Thought Process for Feature Selection
- **Core Problem Analysis**: Restaurants need an efficient way to display their menu digitally with different pricing for various service types while maintaining centralized base price management.
- **User Context**: Customers select their service type first, then browse categories with appropriate pricing; staff manage base prices that automatically adjust across all service tiers.
- **Critical Path**: 
  - Customer: Select service type → Browse categories → View items with tier-appropriate pricing
  - Admin: Login → Manage base prices → Monitor tier pricing calculations → Update availability
- **Key Moments**: Service type selection, transparent pricing display, and seamless base price management.

## Essential Features

### QR Code Menu Isolation System
- **What it does**: Generates unique QR codes for each menu type (Non-AC, AC, Takeaway) that lock customers into viewing only their respective menu with appropriate pricing
- **Why it matters**: Customers scanning a QR code in the Non-AC area only see Non-AC pricing, eliminating confusion and ensuring they see the correct prices for their dining location
- **Success criteria**: Each QR code URL parameter locks the menu type, hides menu type selector, displays only relevant pricing, shows clear indicator of locked menu type

### Floating Action Button & Cart System
- **What it does**: Provides customers with a floating action button for quick access to Google Reviews, Instagram, and shopping cart functionality
- **Why it matters**: Enhances customer engagement by allowing easy access to social platforms and order management without disrupting menu browsing
- **Success criteria**: Button remains accessible while scrolling, cart badge shows item count, social links open correctly, cart allows order management and WhatsApp ordering

### Advanced Search & Filtering System
- **What it does**: Provides comprehensive search with text queries and advanced dietary preference filtering (vegetarian, egg, chicken, meat, fish)
- **Why it matters**: Customers can quickly find dishes that match their dietary needs and preferences, improving user experience and accessibility
- **Success criteria**: Search responds instantly to text queries, dietary filters work independently or in combination, clear visual indicators show applied filters, results update in real-time

### Multi-Tier Pricing Display
- **What it does**: Shows menu items with different pricing for Dine-in Non-AC, Dine-in AC, and Takeaway service types
- **Why it matters**: Transparent pricing allows customers to understand costs for their specific service choice
- **Success criteria**: Pricing is accurate for each service type, calculations are consistent, price changes update across all menu types

### Menu Display System
- **What it does**: Displays menu items in an organized grid with category filtering, text search, and dietary preference filters with visual indicators
- **Why it matters**: Customers need to easily browse menu offerings with clear organization and the ability to filter by their specific dietary needs
- **Success criteria**: Items load quickly, categories filter correctly, search responds instantly, dietary badges are clearly visible, responsive across devices

### Admin Menu Management
- **What it does**: Secure admin system for adding, editing, and managing menu items with three-tier pricing input and dietary preference assignment
- **Why it matters**: Restaurant staff need simple tools to maintain current menu information, pricing, and accurately categorize dietary information
- **Success criteria**: Admin can set prices for all three tiers simultaneously, assign multiple dietary preferences, changes persist immediately, secure authentication

### Real-time Content Updates
- **What it does**: Changes made in admin panel immediately reflect in customer view
- **Why it matters**: Ensures customers always see current pricing and availability
- **Success criteria**: No page refresh needed, instant updates, data persistence

## Design Direction

### Visual Tone & Identity
- **Emotional Response**: Sophisticated, welcoming, and appetite-appealing - evoking the feeling of fine dining
- **Design Personality**: Elegant and professional with subtle warmth, balancing premium quality with approachability
- **Visual Metaphors**: Clean table settings, refined typography reminiscent of upscale menu design
- **Simplicity Spectrum**: Minimal interface that lets food descriptions and imagery take center stage

### Color Strategy
- **Color Scheme Type**: Sophisticated monochromatic with warm accent
- **Primary Color**: Deep navy blue (oklch(0.4 0.15 200)) - communicates trust, professionalism, and premium quality
- **Secondary Colors**: Warm cream/off-white tones for cards and secondary elements
- **Accent Color**: Warm gold/amber (oklch(0.65 0.12 35)) - suggests warmth, hospitality, and premium dining
- **Color Psychology**: Navy establishes trust and sophistication; warm accents create appetite appeal and hospitality
- **Color Accessibility**: All pairings exceed WCAG AA standards with high contrast ratios
- **Foreground/Background Pairings**:
  - Background (cream): Dark navy text (excellent contrast 12:1)
  - Card (white): Dark navy text (excellent contrast 15:1) 
  - Primary (navy): White text (excellent contrast 10:1)
  - Accent (gold): White text (good contrast 4.8:1)

### Typography System
- **Font Pairing Strategy**: Playfair Display (elegant serif) for headings paired with Inter (clean sans-serif) for body text
- **Typographic Hierarchy**: Clear size relationships with Playfair for restaurant name/headings, Inter for descriptions and UI
- **Font Personality**: Sophisticated yet readable - Playfair adds elegance while Inter ensures excellent legibility
- **Readability Focus**: Appropriate line heights (1.5x), comfortable reading lengths, sufficient size for menu descriptions
- **Typography Consistency**: Consistent application of font families with clear hierarchy rules
- **Which fonts**: Playfair Display (400, 600, 700) and Inter (400, 500, 600) from Google Fonts
- **Legibility Check**: Both fonts chosen specifically for excellent readability across all device sizes

### Visual Hierarchy & Layout
- **Attention Direction**: Category navigation at top, then grid of items with clear pricing prominence
- **White Space Philosophy**: Generous spacing between menu items to avoid crowding, focusing attention on each dish
- **Grid System**: Responsive grid that adapts from single column on mobile to multi-column on desktop
- **Responsive Approach**: Mobile-first design that scales gracefully to larger screens
- **Content Density**: Balanced information density - enough detail to inform without overwhelming

### Animations
- **Purposeful Meaning**: Subtle hover effects on menu items suggest interactivity; smooth transitions reinforce premium feel
- **Hierarchy of Movement**: Gentle hover states on cards and buttons; smooth modal transitions for admin functions
- **Contextual Appropriateness**: Refined, subtle animations that enhance rather than distract from content

### UI Elements & Component Selection
- **Component Usage**: 
  - Cards for menu items with clear typography hierarchy and dietary preference indicators
  - Dialog modals for admin functions (login, add/edit items) with dietary selection checkboxes
  - Advanced filter popover with visual dietary preference selection
  - Button variants for different action priorities
  - Form inputs with clear labeling for admin panel
  - Badge components for dietary indicators with color-coded icons
- **Component Customization**: Tailored shadcn components with restaurant-appropriate styling and dietary preference theming
- **Component States**: Clear hover, active, and focus states for all interactive elements including dietary filters
- **Icon Selection**: Phosphor icons for admin functions and dietary indicators (Leaf, Egg, Bird, Cow, Fish)
- **Component Hierarchy**: Primary actions prominent, dietary filters easily discoverable, secondary actions subtle but accessible
- **Spacing System**: Consistent use of Tailwind spacing scale for rhythm and alignment
- **Mobile Adaptation**: Responsive component sizing, touch-friendly interactive elements, collapsible filter interface

### Visual Consistency Framework
- **Design System Approach**: Component-based design with consistent styling patterns
- **Style Guide Elements**: Typography scale, color usage rules, spacing system, component variants
- **Visual Rhythm**: Consistent card layouts, uniform spacing, predictable interaction patterns
- **Brand Alignment**: Professional restaurant identity with premium positioning

### Accessibility & Readability  
- **Contrast Goal**: WCAG AA compliance achieved with all text/background combinations exceeding 4.5:1 ratio
- **Keyboard Navigation**: Full keyboard accessibility for admin functions
- **Screen Reader Support**: Semantic HTML and proper ARIA labels for all interactive elements

## Edge Cases & Problem Scenarios
- **Potential Obstacles**: Empty menu state, network issues during admin updates, concurrent admin sessions, dietary information accuracy, filter combination complexity
- **Edge Case Handling**: Graceful empty states, loading indicators, conflict resolution for simultaneous edits, clear dietary preference management, intuitive filter combination logic
- **Technical Constraints**: Browser storage limitations, image handling for menu items, dietary data consistency across existing menu items

## Implementation Considerations
- **Scalability Needs**: Architecture supports easy addition of features like order management or table reservations, extensible dietary preference system
- **Testing Focus**: QR code URL parameters, menu type isolation, admin authentication flow, data persistence, dietary filter accuracy, search performance
- **Critical Questions**: QR code generation workflow, menu type switching restrictions for direct links, dietary information data migration for existing items

### QR Code Implementation
- **URL Structure**: 
  - Non-AC Menu: `?menu=dinein-non-ac`
  - AC Menu: `?menu=dinein-ac` 
  - Takeaway Menu: `?menu=takeaway`
- **Isolation Logic**: Direct QR access locks menu type selection and shows only relevant pricing
- **Admin Tools**: Dedicated QR code management panel for generating and copying QR links

## Reflection
This approach creates a professional dual-purpose application that serves both customer browsing and restaurant management needs with comprehensive dietary preference support. The elegant design reinforces the restaurant's premium positioning while the intuitive admin tools ensure staff can maintain current, accurate menu information including detailed dietary classifications without technical barriers. The advanced filtering system makes the menu accessible to customers with specific dietary needs, while the search functionality allows for quick discovery of specific dishes. The focus on typography and visual hierarchy makes menu items appetizing and easy to navigate, while the secure admin system provides necessary management capabilities including comprehensive dietary preference management.