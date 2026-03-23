/**
 * Centralized design system tokens
 * Single source of truth for spacing, sizing, timing, and layout
 */

/* ============================================================ */
/* Brand Color Palette                                          */
/* ============================================================ */
/**
 * Brand colour CSS variable references.
 * Values are defined as the source of truth in app/globals.css —
 * edit them there and the change will cascade everywhere automatically.
 *
 *   --color-blue:   oklch(0.73 0.09 262.89)  → Home / Header
 *   --color-teal:   oklch(0.78 0.09 184.18)  → Services / Contact
 *   --color-pink:   oklch(0.72 0.18 336.27)  → Projects
 *   --color-coral:  oklch(0.67 0.16 38.00)   → Industries
 *   --color-yellow: oklch(0.82 0.14 92.25)   → About
 */
export const brandColors = {
  blue:   "var(--color-blue)",
  teal:   "var(--color-teal)",
  pink:   "var(--color-pink)",
  coral:  "var(--color-coral)",
  yellow: "var(--color-yellow)",
}

/**
 * Neutral colour CSS variable references.
 * Cool-tinted (hue 263°) to complement the brand palette.
 *
 *   --color-white:      oklch(1 0 0)            → Cards, modals, pure white surfaces
 *   --color-light-grey: oklch(0.96 0.005 263)   → Page backgrounds, subtle panels
 *   --color-grey:       oklch(0.65 0.010 263)   → Muted text, borders, placeholders
 *   --color-off-black:  oklch(0.22 0.015 263)   → Body text, dark surfaces
 */
export const neutralColors = {
  white:      "var(--color-white)",
  lightGrey:  "var(--color-light-grey)",
  grey:       "var(--color-grey)",
  offBlack:   "var(--color-off-black)",
}

/* ============================================================ */
/* Page Theme Configuration                                     */
/* ============================================================ */
export const pageThemes = {
  home: "blue",
  services: "teal",
  industries: "coral",
  projects: "pink",
  about: "yellow",
  contact: "teal",
} as const

export type PageTheme = keyof typeof pageThemes

/**
 * Map page routes to their theme identifiers
 * Used by layout wrappers to apply data-page-theme attribute
 */
export const routeToTheme: Record<string, PageTheme> = {
  "/": "home",
  "/services": "services",
  "/services/[slug]": "services",
  "/industries": "industries",
  "/industry/[slug]": "industries",
  "/projects": "projects",
  "/projects/[slug]": "projects",
  "/about": "about",
  "/about/[slug]": "about",
  "/about/faq": "about",
  "/contact": "contact",
}

/* ============================================================ */
/* Spacing Tokens                                               */
/* ============================================================ */
export const spacing = {
  // Section padding (vertical rhythm for pages)
  sectionPy: "py-16 lg:py-24",
  sectionPyLarge: "py-20 lg:py-28",
  sectionPySmall: "py-12 lg:py-16",
  sectionPyXl: "py-24 lg:py-32",

  // Container padding (horizontal, consistent across breakpoints)
  containerPadding: "px-4 sm:px-6 lg:px-8",
  
  // Max widths for containers
  containerMaxWidth: "max-w-6xl",
  containerMaxWidthLg: "max-w-6xl",
  containerMaxWidthMd: "max-w-4xl",
  containerMaxWidthSm: "max-w-3xl",

  // Grid gaps
  cardGap: "gap-8",
  gridGapLg: "gap-8",
  gridGapMd: "gap-6",
  gridGapSm: "gap-4",

  // Component spacing
  sectionGap: "gap-12",
  elementGap: "gap-6",
}

export const timing = {
  fast: "duration-200",
  normal: "duration-300",
  slow: "duration-500",
}

export const layout = {
  // Common flex patterns
  flexCenter: "flex items-center justify-center",
  flexBetween: "flex items-center justify-between",
  flexCol: "flex flex-col",
  flexColCenter: "flex flex-col items-center justify-center",

  // Common grid patterns
  gridCols2: "grid-cols-1 md:grid-cols-2",
  gridCols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  gridCols4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}

export const hover = {
  // Common hover effects
  scaleImage: "group-hover:scale-105 transition-transform duration-300",
  shadowLift: "hover:shadow-lg transition-shadow duration-300",
  colorAccent: "hover:text-accent transition-colors duration-300",
  underlineAccent: "hover:underline hover:text-accent transition-colors duration-300",
}

export const transitions = {
  default: "transition-all duration-300",
  fast: "transition-all duration-200",
  slow: "transition-all duration-500",
}
