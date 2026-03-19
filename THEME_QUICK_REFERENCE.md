# Quick Reference: Brand Color System

## TL;DR

Your site now has automatic page-specific color theming. No action needed—it works automatically!

## The Five Brand Colors

```
🔵 Blue      #7F97C4  → Home page (white text)
🩵 Teal      #7CC0B8  → Services, Contact (dark text)
🪨 Coral     #E0615A  → Industries (white text)
💗 Pink      #D85AB8  → Projects (white text)
⭐ Yellow    #EBCB5B  → About (dark text)
```

## Quick Examples

### Use page's current theme color
```tsx
<div className="bg-primary text-primary-foreground">
  Automatically uses page's color
</div>
```

### Use specific brand color
```tsx
<div className="bg-blue text-white">Always blue</div>
<div className="bg-teal text-foreground">Always teal</div>
<div className="bg-coral text-white">Always coral</div>
```

### Use SectionContainer with theme
```tsx
<SectionContainer background="primary">
  Content uses page's primary color
</SectionContainer>
```

### Access current theme in code
```tsx
import { routeToTheme } from "@/lib/design-tokens"

const theme = routeToTheme[pathname] // "blue", "teal", etc.
```

## What Changed?

✅ `app/globals.css` - Added brand colors and page theme rules
✅ `app/layout.tsx` - Added ThemeWrapper component
✅ `lib/design-tokens.ts` - Added page theme configuration
✅ `components/layout/theme-wrapper.tsx` - New component
✅ `lib/brand-colors.ts` - Color utilities

## How It Works

The `ThemeWrapper` detects your route and adds `data-page-theme="home|services|industries|projects|about|contact"` to the DOM. CSS automatically applies the right colors. That's it!

## Changing a Page's Theme

1. Edit `lib/design-tokens.ts` - change the color in `pageThemes`
2. Update `app/globals.css` - adjust the `[data-page-theme="..."]` rule
3. Done! All components using semantic tokens (`bg-primary`, etc.) update automatically

## Full Documentation

See `THEME_SYSTEM.md` for detailed documentation, accessibility info, and advanced customization options.

---

**All existing components work unchanged.** The new system gracefully extends your design system!
