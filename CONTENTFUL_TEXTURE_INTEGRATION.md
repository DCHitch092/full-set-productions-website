# Contentful Background Texture Integration Guide

## Overview
The background texture system is now fully implemented to fetch texture assets from Contentful global settings and apply them with theme-aware color filters.

## Architecture

### New Component: TexturedSection (`components/sections/textured-section.tsx`)
A server component that:
- Fetches background texture assets from Contentful global settings based on section type and asset index
- Applies theme-specific color filters for visual cohesion
- Automatically maps color filters to section types

### Existing Utilities: `lib/background-textures.ts`
Already contains all configuration:
- `getBackgroundTextures()` - Fetches all texture arrays from global settings
- `getTextureUrl(type, index)` - Fetches specific texture by section type and asset index
- `themeColorFilters` - CSS color overlays with appropriate opacity for each theme
- Color mapping by page type (home → blue, services → teal, etc.)

## Usage in Pages

### Homepage (`app/page.tsx`)
Replace `SectionContainer` calls with `TexturedSection` for textured sections:

```tsx
import { TexturedSection } from "@/components/sections/textured-section"

// Hero (asset index 0)
<TexturedSection type="home" assetIndex={0} bg="primary" spacing="lg">
  {content}
</TexturedSection>

// Edinburgh Advantage (asset index 1)
<TexturedSection type="home" assetIndex={1} bg="primary" spacing="lg">
  {content}
</TexturedSection>

// CTA Block (asset index 2)
<TexturedSection type="home" assetIndex={2} bg="secondary" spacing="lg" align="center">
  {content}
</TexturedSection>
```

### Services, Industries, Projects, About, Articles
Follow the same pattern with appropriate asset types:
- `type="services"` uses `serviceBackgroundTextureAssets`
- `type="industry"` uses `industryBackgroundTextureAssets`
- `type="project"` uses `projectBackgroundTextureAssets`
- `type="about"` uses `aboutBackgroundTextureAssets`
- `type="article"` uses `articleBackgroundTextureAssets`

## Color Filters Applied

Each section type gets theme-appropriate color overlay with low opacity to ensure text readability:
- **Blue (Home)**: `rgba(127, 151, 196, 0.08)` - 8% opacity
- **Teal (Services/Contact)**: `rgba(124, 192, 184, 0.08)` - 8% opacity
- **Coral (Industries)**: `rgba(224, 97, 90, 0.08)` - 8% opacity
- **Pink (Projects)**: `rgba(216, 90, 184, 0.08)` - 8% opacity
- **Yellow (About)**: `rgba(235, 203, 91, 0.06)` - 6% opacity (lower due to light color)

## Asset Hierarchy

Within each section type, assets are indexed 0-based:
- Asset 0: Primary/Hero sections
- Asset 1: Featured/Secondary sections
- Asset 2: CTA blocks
- Asset 3+: Additional sections as needed

## Fallback Behavior

If texture assets are not available in Contentful:
- Sections will render with solid background colors
- No texture overlay will apply
- Text remains fully readable
- Functionality is maintained

## Next Steps

1. Update `app/page.tsx` to use `TexturedSection` for Hero, Edinburgh Advantage, and CTA Block
2. Update service detail pages to use textures (asset indices based on section order)
3. Update industry detail pages similarly
4. Update project/case study pages
5. Update article/blog pages
6. Ensure all texture assets are added to Contentful global settings

## SectionContainer Still Works

Regular `SectionContainer` is still available for sections without textures:
```tsx
<SectionContainer spacing="lg" align="center">
  {content}
</SectionContainer>
```
