/**
 * Centralized animation utilities for consistent microinteractions
 * All timing values synced with design-tokens for cohesion
 */

export const ANIMATION_TIMING = {
  fast: "200ms",
  normal: "300ms",
  slow: "500ms",
} as const

export const ANIMATION_EASING = {
  easeIn: "cubic-bezier(0.4, 0, 1, 1)",
  easeOut: "cubic-bezier(0, 0, 0.2, 1)",
  easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  linear: "linear",
} as const

/**
 * Tailwind class combinations for common animation patterns
 * Use these in your components to maintain consistency
 */
export const ANIMATIONS = {
  // Scale effects
  scaleHover: "transition-transform duration-300 hover:scale-105",
  scaleActive: "transition-transform duration-200 active:scale-95",

  // Arrow animations (translate right on hover)
  arrowHover: "transition-transform duration-300 group-hover:translate-x-1",

  // Opacity fades
  fadeIn: "transition-opacity duration-300",
  fadeHover: "transition-opacity duration-300 hover:opacity-80",

  // Color transitions
  colorHover: "transition-colors duration-300 hover:text-accent",
  colorFocus: "transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent",

  // Shadow lifts
  shadowHover: "transition-shadow duration-300 hover:shadow-lg",
  shadowActive: "transition-shadow duration-200 active:shadow-md",

  // Border transitions
  borderHover: "transition-colors duration-300 hover:border-accent",

  // Combined button effect
  buttonHover:
    "transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95",

  // Card interactive effect
  cardInteractive:
    "transition-all duration-300 hover:shadow-lg hover:border-accent/50",

  // Link underline animation
  linkUnderline:
    "relative transition-colors duration-300 hover:text-accent after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full",

  // Loading animation
  loadingPulse: "animate-pulse",

  // Slide in from left
  slideInLeft:
    "animate-in slide-in-from-left-96 duration-500",

  // Slide in from right
  slideInRight:
    "animate-in slide-in-from-right-96 duration-500",

  // Fade in from top
  fadeInFromTop:
    "animate-in fade-in slide-in-from-top-12 duration-500",
} as const

/**
 * CSS-in-JS animation definitions for complex animations
 * Add these to your globals.css for page-level animations
 */
export const KEYFRAME_DEFINITIONS = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideInFromLeft {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInFromRight {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-fadeInUp {
    animation: fadeInUp 0.5s ease-out;
  }

  .animate-slideInFromLeft {
    animation: slideInFromLeft 0.3s ease-out;
  }

  .animate-slideInFromRight {
    animation: slideInFromRight 0.3s ease-out;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
    background-size: 1000px 100%;
  }

  .animate-scaleIn {
    animation: scaleIn 0.3s ease-out;
  }
`

/**
 * Delay utilities for staggered animations
 */
export const ANIMATION_DELAYS = {
  delay0: "transition-delay: 0ms",
  delay100: "transition-delay: 100ms",
  delay200: "transition-delay: 200ms",
  delay300: "transition-delay: 300ms",
  delay400: "transition-delay: 400ms",
  delay500: "transition-delay: 500ms",
} as const

/**
 * Helper function to create staggered animation classes
 * Useful for animating lists of items
 */
export function getStaggerDelay(index: number, baseDelay: number = 50): string {
  const totalDelay = index * baseDelay
  return `[transition-delay:${totalDelay}ms]`
}

/**
 * Hover state animation helper for interactive elements
 */
export const INTERACTIVE_STATES = {
  // For buttons and clickable cards
  interactive:
    "cursor-pointer transition-all duration-300 hover:shadow-lg active:shadow-md active:scale-95",

  // For links
  link: "cursor-pointer transition-colors duration-300 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",

  // For form inputs
  input:
    "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2",

  // For dismissible elements
  dismissible:
    "transition-all duration-300 hover:opacity-75 active:opacity-50",
} as const

export default ANIMATIONS
