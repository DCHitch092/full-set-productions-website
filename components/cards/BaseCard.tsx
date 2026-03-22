/**
 * BaseCard - Unified card component with variant support
 * Replaces duplicated card styling across ServiceCard, IndustryCard, ProjectCard
 * Uses centralized animation library for consistent microinteractions
 */

import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ANIMATIONS } from "@/lib/animations"

type CardVariant = "elevated" | "simple" | "interactive" | "testimonial" | "clean"

interface BaseCardProps {
  children: ReactNode
  variant?: CardVariant
  interactive?: boolean
  className?: string
  asChild?: boolean
}

export function BaseCard({
  children,
  variant = "simple",
  interactive = false,
  className = "",
  asChild = false,
}: BaseCardProps) {
  const variantStyles = {
    // Elevated: shadow on hover, full interactivity with scale effect (Services, Projects)
    elevated: `
      relative flex flex-col overflow-hidden rounded-lg border border-border bg-card
      ${interactive ? `${ANIMATIONS.cardInteractive} cursor-pointer group` : ""}
    `,
    
    // Simple: border only, subtle hover effect (Industries, general content)
    simple: `
      relative flex flex-col overflow-hidden rounded-lg border border-border bg-card
      ${interactive ? `transition-all duration-300 hover:shadow-md hover:border-primary/30 cursor-pointer group` : ""}
    `,
    
    // Clean: no border, seamless edge-to-edge images (Team members, profiles)
    clean: `
      relative flex flex-col overflow-hidden rounded-lg bg-card
      ${interactive ? `transition-all duration-300 hover:shadow-md cursor-pointer group` : ""}
    `,
    
    // Interactive: for expandable/collapsible content (FAQ) with full hover effect
    interactive: `
      relative flex flex-col overflow-hidden rounded-lg border border-border bg-card
      ${ANIMATIONS.cardInteractive} cursor-pointer group
    `,
    
    // Testimonial: quote styling with subtle animation
    testimonial: `
      relative flex flex-col overflow-hidden rounded-lg border border-border bg-card p-6
      transition-all duration-300 hover:shadow-md
    `,
  }

  const Component = asChild ? CardContent : Card

  return (
    <Component
      className={`
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </Component>
  )
}
