/**
 * Centralized design system tokens
 * Single source of truth for spacing, sizing, timing, and layout
 */

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
