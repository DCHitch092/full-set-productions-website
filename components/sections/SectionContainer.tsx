/**
 * SectionContainer - Reusable wrapper for consistent section styling
 * Eliminates the repeated mx-auto max-w-6xl px-4... pattern
 */

import { ReactNode } from "react"
import { spacing, layout } from "@/lib/design-tokens"

interface SectionContainerProps {
  children: ReactNode
  spacing?: "sm" | "md" | "lg" | "xl"
  maxWidth?: "sm" | "md" | "lg" | "full"
  background?: "primary" | "secondary" | "muted" | "card" | "transparent"
  className?: string
}

export function SectionContainer({
  children,
  spacing: spacingSize = "lg",
  maxWidth = "lg",
  background = "transparent",
  className = "",
}: SectionContainerProps) {
  const spacingMap = {
    sm: spacing.sectionPySmall,
    md: spacing.sectionPy,
    lg: spacing.sectionPyLarge,
    xl: spacing.sectionPyXl,
  }

  const maxWidthMap = {
    sm: spacing.containerMaxWidthSm,
    md: spacing.containerMaxWidthMd,
    lg: spacing.containerMaxWidthLg,
    full: "",
  }

  const bgMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    muted: "bg-muted",
    card: "bg-card",
    transparent: "",
  }

  return (
    <section className={`${spacingMap[spacingSize]} ${bgMap[background]} ${className}`}>
      <div className={`mx-auto ${maxWidthMap[maxWidth]} ${spacing.containerPadding}`}>
        {children}
      </div>
    </section>
  )
}
