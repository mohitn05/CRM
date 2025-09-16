# Skeleton Loading System

This document explains the skeleton loading system implemented for the Internship CRM application.

## Overview

The skeleton loading system provides a smooth user experience by displaying loading placeholders while content is being fetched or rendered. This helps reduce perceived loading times and provides visual feedback to users.

## Components

### 1. AdvancedSkeleton Component

Located at: `components/advanced-skeleton.tsx`

This is the core component that provides different skeleton variants:
- `page` - Full page skeleton
- `card` - Card-sized skeleton
- `list` - List item skeleton
- `text` - Text line skeleton
- `avatar` - Circular avatar skeleton
- `header` - Header skeleton
- `button` - Button skeleton
- `input` - Input field skeleton
- `chart` - Chart area skeleton

### 2. GlobalLoading Component

Located at: `components/global-loading.tsx`

A full-screen loading component with animated logo and progress indicators.

## Implementation

### Root Loading
- File: `app/loading.tsx`
- Shows when the root page is loading

### Admin Dashboard Loading
- File: `app/admin/dashboard/loading.tsx`
- Shows when the admin dashboard is loading

### Students List Loading
- File: `app/admin/students/loading.tsx`
- Shows when the students list is loading

### Student Detail Loading
- File: `app/admin/students/[id]/loading.tsx`
- Shows when a student detail page is loading

### Intern Dashboard Loading
- File: `app/intern/dashboard/loading.tsx`
- Shows when the intern dashboard is loading

### Application Form Loading
- File: `app/apply/loading.tsx`
- Shows when the application form is loading

### Authentication Loading
- File: `app/auth/loading.tsx`
- Shows when authentication pages are loading

### Intern Login Loading
- File: `app/intern/login/loading.tsx`
- Shows when the intern login page is loading

## Styling

The shimmer animation is defined in `app/globals.css` and provides a smooth, continuous loading effect.

## Usage

To use the skeleton loading system:

1. Import the AdvancedSkeleton component:
```tsx
import { AdvancedSkeleton } from "@/components/advanced-skeleton"
```

2. Use it with different variants:
```tsx
<AdvancedSkeleton variant="text" className="w-full h-4" />
<AdvancedSkeleton variant="card" className="w-full h-64" />
<AdvancedSkeleton variant="avatar" className="w-12 h-12 rounded-full" />
```

## Benefits

1. **Improved User Experience**: Provides visual feedback during loading states
2. **Reduced Perceived Loading Time**: Content appears to load faster with placeholders
3. **Consistent Design**: Unified loading experience across the application
4. **Performance**: Lightweight implementation with minimal overhead
5. **Accessibility**: Maintains layout stability during loading

## Customization

To customize the skeleton appearance:
1. Modify the gradient colors in the AdvancedSkeleton component
2. Adjust the animation speed in the CSS
3. Add new variants as needed for specific use cases