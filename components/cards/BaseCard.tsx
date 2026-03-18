/**
 * BaseCard - Unified card component with variant support
 * Replaces duplicated card styling across ServiceCard, IndustryCard, ProjectCard
 */

import { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

type CardVariant = "elevated" | "simple" | "interactive" | "testimonial"

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
    // Elevated: shadow on hover, full interactivity (Services, Projects)
    elevated: `
      relative flex flex-col overflow-hidden rounded-lg border border-border bg-card
      ${interactive ? "transition-shadow hover:shadow-lg cursor-pointer group" : ""}
    `,
    
    // Simple: border only, minimal hover (Industries)
    simple: `
      relative flex flex-col overflow-hidden rounded-lg border border-border bg-card
      ${interactive ? "transition-shadow hover:shadow-md cursor-pointer group" : ""}
    `,
    
    // Interactive: for expandable/collapsible content (FAQ)
    interactive: `
      relative flex flex-col overflow-hidden rounded-lg border border-border bg-card
      transition-all duration-300 hover:border-primary/50 hover:shadow-md cursor-pointer group
    `,
    
    // Testimonial: quote styling
    testimonial: `
      relative flex flex-col overflow-hidden rounded-lg border border-border bg-card p-6
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
