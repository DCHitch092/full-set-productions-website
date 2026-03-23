/**
 * CONTENTFUL BACKGROUND TEXTURE INTEGRATION GUIDE
 * 
 * This guide explains how to use Contentful-managed background textures
 * in your website sections with theme-specific color overlays.
 */

// ============================================================
// SETUP
// ============================================================

// 1. In Contentful, add background texture assets to Global Settings:
//    - backgroundTextureAssets (for home/featured work sections)
//    - serviceBackgroundTextureAssets (for service sections)
//    - industryBackgroundTextureAssets (for industry sections)
//    - aboutBackgroundTextureAssets (for about sections)
//    - projectBackgroundTextureAssets (for project sections)
//    - articleBackgroundTextureAssets (for article sections)

// 2. Each field accepts an array of media assets - order matters!
//    Asset 0 is used for the first section, Asset 1 for the second, etc.

// ============================================================
// USAGE
// ============================================================

// Basic example with Contentful texture:
<SectionContainer
  bg="primary"
  spacing="lg"
  textureType="background"
  textureIndex={0}
  themeColor="blue"
>
  {children}
</SectionContainer>

// ============================================================
// PROPERTIES EXPLAINED
// ============================================================

// textureType: 'background' | 'service' | 'industry' | 'about' | 'project' | 'article'
// - Determines which field in global settings to fetch from

// textureIndex: number (default: 0)
// - Which asset in the array to use
// - First section uses index 0, second uses index 1, etc.

// themeColor: 'blue' | 'teal' | 'coral' | 'pink' | 'yellow'
// - Applies a low-opacity (8%) color overlay to the texture
// - Matches the page theme colors
// - Ensures text readability while maintaining visual cohesion

// ============================================================
// THEME COLOR MAPPINGS
// ============================================================

// Home/Featured Work: blue (--color-blue: #7F97C4)
// Services/Contact: teal (--color-teal: #7CC0B8)
// Industries: coral (--color-coral: #E0615A)
// Projects: pink (--color-pink: #D85AB8)
// About: yellow (--color-yellow: #EBCB5B)

// ============================================================
// SECTION HIERARCHY EXAMPLE - HOMEPAGE
// ============================================================

// 1. Hero Section (asset 0)
<SectionContainer
  bg="primary"
  spacing="lg"
  textureType="background"
  textureIndex={0}
  themeColor="blue"
>
  {/* Hero content */}
</SectionContainer>

// 2. Featured Work (asset 1)
<SectionContainer
  bg="secondary"
  spacing="lg"
  textureType="background"
  textureIndex={1}
  themeColor="blue"
>
  {/* Featured work content */}
</SectionContainer>

// 3. Edinburgh Advantage (asset 2)
<SectionContainer
  bg="primary"
  spacing="lg"
  textureType="background"
  textureIndex={2}
  themeColor="blue"
>
  {/* Edinburgh advantage content */}
</SectionContainer>

// 4. CTA Block (asset 3)
<SectionContainer
  bg="secondary"
  spacing="lg"
  textureType="background"
  textureIndex={3}
  themeColor="blue"
>
  {/* CTA content */}
</SectionContainer>

// ============================================================
// FALLBACK BEHAVIOR
// ============================================================

// If Contentful is unreachable or texture not found:
// 1. Component gracefully degrades (no texture, just background color)
// 2. backgroundImage prop still works as a fallback
// 3. Text remains readable and visible

// Example with fallback:
<SectionContainer
  bg="primary"
  spacing="lg"
  textureType="background"
  textureIndex={0}
  themeColor="blue"
  backgroundImage="/images/texture-fallback.jpg" // Used if Contentful fails
>
  {children}
</SectionContainer>

// ============================================================
// COLOR FILTER OPACITY
// ============================================================

// All theme color overlays use 8% opacity:
// - Subtle enough to not impact text readability
// - Strong enough to apply theme color to texture
// - Consistent across all sections

// This is defined in the themeColorMap in SectionContainer:
// blue: oklch(0.55 0.15 260 / 0.08)
// teal: oklch(0.61 0.11 190 / 0.08)
// coral: oklch(0.55 0.18 20 / 0.08)
// pink: oklch(0.55 0.22 330 / 0.08)
// yellow: oklch(0.75 0.16 90 / 0.08)
