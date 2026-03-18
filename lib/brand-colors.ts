/**
 * Color utilities for accessing brand colors in components
 * Maps CSS custom properties to Tailwind classes
 */

export const brandColorClasses = {
  blue: {
    bg: "bg-blue",
    text: "text-blue",
    border: "border-blue",
    ring: "ring-blue",
  },
  teal: {
    bg: "bg-teal",
    text: "text-teal",
    border: "border-teal",
    ring: "ring-teal",
  },
  pink: {
    bg: "bg-pink",
    text: "text-pink",
    border: "border-pink",
    ring: "ring-pink",
  },
  coral: {
    bg: "bg-coral",
    text: "text-coral",
    border: "border-coral",
    ring: "ring-coral",
  },
  yellow: {
    bg: "bg-yellow",
    text: "text-yellow",
    border: "border-yellow",
    ring: "ring-yellow",
  },
}

/**
 * Helper to get contrasting text color for brand colors
 * Follows accessibility guidelines from the brand spec
 */
export function getTextColorForBrand(brandColor: keyof typeof brandColorClasses): string {
  const darkTextColors = ["teal", "yellow"]
  return darkTextColors.includes(brandColor) ? "text-foreground" : "text-white"
}

/**
 * Get background styles for brand color with proper text contrast
 */
export function getBrandColorStyles(brandColor: keyof typeof brandColorClasses) {
  return {
    bg: brandColorClasses[brandColor].bg,
    text: getTextColorForBrand(brandColor),
  }
}
