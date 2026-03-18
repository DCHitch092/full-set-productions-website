# Brand Color System Documentation

## Overview

The site now features a unified brand color system with dynamic page-specific theming. Colors change automatically based on the current page, following your design guidelines.

## Color Palette

Five brand colors are now integrated throughout the site:

- **Blue** (`#7F97C4`) - Home page
- **Teal** (`#7CC0B8`) - Services & Contact pages
- **Coral** (`#E0615A`) - Industries page
- **Pink** (`#D85AB8`) - Projects page
- **Yellow** (`#EBCB5B`) - About page

## Page Theme Mapping

Each main page automatically applies its designated theme:

| Route | Theme | Color |
|-------|-------|-------|
| `/` | Home | Blue |
| `/services` | Services | Teal |
| `/services/[slug]` | Services | Teal |
| `/industries` | Industries | Coral |
| `/industry/[slug]` | Industries | Coral |
| `/projects` | Projects | Pink |
| `/projects/[slug]` | Projects | Pink |
| `/about` | About | Yellow |
| `/about/[slug]` | About | Yellow |
| `/about/faq` | About | Yellow |
| `/contact` | Contact | Teal |

## How It Works

### 1. Automatic Theme Application

The `ThemeWrapper` component (in `layout/theme-wrapper.tsx`) automatically detects the current page route and applies the corresponding theme via the `data-page-theme` attribute.

```tsx
// app/layout.tsx
<ThemeWrapper>
  <Header />
  <main>{children}</main>
  <Footer />
</ThemeWrapper>
```

### 2. CSS Custom Properties

Brand colors are defined as CSS custom properties in `app/globals.css`:

```css
--color-blue: oklch(0.55 0.15 260);
--color-teal: oklch(0.61 0.11 190);
--color-pink: oklch(0.55 0.22 330);
--color-coral: oklch(0.55 0.18 20);
--color-yellow: oklch(0.75 0.16 90);
```

### 3. Semantic Token Overrides

When a page theme is active, semantic tokens update automatically:

```css
[data-page-theme="home"] {
  --primary: var(--color-blue);
  --primary-foreground: oklch(1 0 0); /* white */
}

[data-page-theme="about"] {
  --primary: var(--color-yellow);
  --primary-foreground: oklch(0.145 0.01 250); /* dark text */
}
```

### 4. Geometric Motifs

Low-opacity background shapes accent each page theme:

```css
[data-page-theme="home"]::before,
[data-page-theme="home"]::after {
  background: radial-gradient(circle at 100% 0%, var(--color-blue) 0%, transparent 40%);
  opacity: 0.08;
}
```

## Using Theme Colors in Components

### Option 1: Semantic Tokens (Recommended)

Semantic tokens automatically update with the page theme:

```tsx
<div className="bg-primary text-primary-foreground">
  This uses the page's primary color
</div>
```

### Option 2: Direct Brand Colors

For specific brand colors regardless of page:

```tsx
<div className="bg-blue text-white">
  Always blue
</div>

<div className="bg-teal text-foreground">
  Always teal with dark text
</div>
```

### Option 3: Color Utilities

Use helper functions from `lib/brand-colors.ts`:

```tsx
import { getBrandColorStyles, getTextColorForBrand } from "@/lib/brand-colors"

const styles = getBrandColorStyles("yellow")
// Returns: { bg: "bg-yellow", text: "text-foreground" }

const textColor = getTextColorForBrand("coral")
// Returns: "text-white" (for contrast)
```

### Option 4: SectionContainer Component

The `SectionContainer` component supports both semantic and specific colors:

```tsx
// Uses page's primary color
<SectionContainer background="primary">
  Content
</SectionContainer>

// Always secondary color
<SectionContainer background="secondary">
  Content
</SectionContainer>
```

## Accessibility

The color system follows WCAG contrast guidelines:

- **White text** on blue, pink, coral (dark colors)
- **Dark text** on yellow, teal (light colors)
- **Dark text** on white backgrounds

Tailwind classes automatically apply correct foreground colors:

```css
--color-blue: oklch(0.55 0.15 260);      /* white text */
--color-teal: oklch(0.61 0.11 190);      /* dark text */
--color-yellow: oklch(0.75 0.16 90);     /* dark text */
```

## Modifying Themes

### Change a Page's Theme

Edit `lib/design-tokens.ts`:

```ts
export const pageThemes = {
  home: "blue",      // ← change here
  services: "teal",
  // ...
}
```

Then add/update the CSS override in `app/globals.css`:

```css
[data-page-theme="home"] {
  --primary: var(--color-teal);
  --primary-foreground: oklch(0.145 0.01 250);
}
```

### Add a New Brand Color

1. Add CSS custom property to `:root` in `app/globals.css`:
   ```css
   --color-purple: oklch(0.55 0.20 310);
   ```

2. Add to `brandColors` in `lib/design-tokens.ts`:
   ```ts
   purple: "var(--color-purple)",
   ```

3. Add Tailwind mapping in `@theme inline`:
   ```css
   --color-purple: var(--color-purple);
   ```

### Adjust Color Values

OKLch color format offers precise control:

- **First value** (0-1): Lightness (0=black, 1=white)
- **Second value** (0-0.4): Chroma (saturation)
- **Third value** (0-360): Hue angle

Example: Make blue lighter:
```css
--color-blue: oklch(0.60 0.15 260); /* was 0.55, now lighter */
```

## Technical Details

### Files Modified

- `app/globals.css` - Brand colors and page theme overrides
- `app/layout.tsx` - Added ThemeWrapper component
- `lib/design-tokens.ts` - Page theme configuration
- `components/layout/theme-wrapper.tsx` - New dynamic theme component
- `lib/brand-colors.ts` - Color utility functions

### Component Hierarchy

```
layout.tsx (ThemeWrapper)
  ├── Header
  ├── main
  │   └── Page Content (affected by data-page-theme)
  └── Footer
```

The `data-page-theme` attribute propagates to all child elements, automatically updating semantic colors.

### No Breaking Changes

Existing components continue working. The new system gracefully extends the design system without requiring updates to existing code.

## Examples

### Hero Section with Theme Color

```tsx
<SectionContainer background="primary" spacing="lg">
  <h1 className="text-4xl font-bold text-primary-foreground">
    Welcome to {pageName}
  </h1>
</SectionContainer>
```

### Dynamic Color Based on Current Page

```tsx
"use client"
import { usePathname } from "next/navigation"
import { routeToTheme } from "@/lib/design-tokens"

export function ColoredBadge() {
  const pathname = usePathname()
  const currentTheme = routeToTheme[pathname] ?? "home"
  
  return (
    <span className={`bg-${currentTheme} px-3 py-1 rounded`}>
      {currentTheme}
    </span>
  )
}
```

### Accent Elements

```tsx
<div className="border-l-4 border-highlight pl-4">
  Important note with yellow accent
</div>
```

---

**Questions?** Check the brand color palette at the top of this document or review `app/globals.css` for the complete color system.
