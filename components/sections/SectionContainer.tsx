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
  bg?: "primary" | "secondary" | "muted" | "card" | "transparent"
  backgroundImage?: string
  align?: "left" | "center"
  className?: string
}

export function SectionContainer({
  children,
  spacing: spacingSize = "lg",
  maxWidth = "lg",
  bg = "transparent",
  backgroundImage,
  align = "left",
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

  const alignMap = {
    left: "",
    center: "text-center",
  }

  const sectionStyle = backgroundImage
    ? {
        backgroundImage: `url('${backgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : undefined

  return (
    <section 
      className={`${spacingMap[spacingSize]} ${bgMap[bg]} ${className}`}
      style={sectionStyle}
    >
      <div className={`mx-auto ${maxWidthMap[maxWidth]} ${spacing.containerPadding} ${alignMap[align]}`}>
        {children}
      </div>
    </section>
  )
}
