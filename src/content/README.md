# Content Folder

This folder contains app-wide content definitions including colors, typography, spacing, and other design tokens.

## Colors

### Primary Color
- **Primary**: `#8B0000` (Dark Red)
- **Primary Dark**: `#660000`
- **Primary Light**: `#B30000`

### Secondary Color
- **Secondary**: `#FF6B35` (Warm Orange) - Derived from primary to create visual harmony
- **Secondary Dark**: `#E55A2B`
- **Secondary Light**: `#FF8C5A`

### Usage

```tsx
import { colors } from '../content/colors';

// Use primary color
<View style={{ backgroundColor: colors.primary }} />

// Use secondary color
<View style={{ backgroundColor: colors.secondary }} />

// Use semantic colors
<Text style={{ color: colors.success }}>Success!</Text>
<Text style={{ color: colors.error }}>Error!</Text>

// Use with opacity helper
import { getColorWithOpacity } from '../content/colors';
<View style={{ backgroundColor: getColorWithOpacity(colors.primary, 0.5) }} />
```

## Color Palette Structure

- **Primary Colors**: Main brand colors
- **Secondary Colors**: Complementary colors derived from primary
- **Accent Colors**: Highlight colors for emphasis
- **Neutral Colors**: Grayscale palette
- **Semantic Colors**: Success, error, warning, info
- **Background Colors**: App backgrounds
- **Text Colors**: Text color variants
- **Border Colors**: Border and divider colors

## Design Principles

1. **Primary (#8B0000)**: Used for main actions, headers, and brand elements
2. **Secondary (#FF6B35)**: Used for secondary actions and accents
3. **Neutral Grays**: Used for text, borders, and backgrounds
4. **Semantic Colors**: Used for feedback (success, error, warning, info)

