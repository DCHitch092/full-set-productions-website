/**
 * SectionContainer - Reusable wrapper for consistent section styling
 * Supports Contentful-managed background textures with themed color filters
 */

'use client'

import { ReactNode } from "react"
import { spacing } from "@/lib/design-tokens"
import { useBackgroundTexture, type TextureType } from "@/lib/use-background-texture"

interface SectionContainerProps {
  children: ReactNode
  spacing?: "sm" | "md" | "lg" | "xl"
  maxWidth?: "sm" | "md" | "lg" | "full"
  bg?: "primary" | "secondary" | "muted" | "card" | "transparent"
  backgroundImage?: string
  textureType?: TextureType
  textureIndex?: number
  themeColor?: "blue" | "teal" | "coral" | "pink" | "yellow"
  colorFilter?: string
  align?: "left" | "center"
  className?: string
}

export function SectionContainer({
  children,
  spacing: spacingSize = "lg",
  maxWidth = "lg",
  bg = "transparent",
  backgroundImage,
  textureType,
  textureIndex = 0,
  themeColor,
  colorFilter,
  align = "left",
  className = "",
}: SectionContainerProps) {
  const { textureUrl } = useBackgroundTexture({
    textureType: textureType,
    index: textureIndex,
  })

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

  // Theme color to oklch mapping for filters
  const themeColorMap = {
    blue: "oklch(0.55 0.15 260 / 0.08)",
    teal: "oklch(0.61 0.11 190 / 0.08)",
    coral: "oklch(0.55 0.18 20 / 0.08)",
    pink: "oklch(0.55 0.22 330 / 0.08)",
    yellow: "oklch(0.75 0.16 90 / 0.08)",
  }

  // Use Contentful texture if available, otherwise fall back to backgroundImage
  const finalBackgroundImage = textureUrl || backgroundImage
  const finalColorFilter = themeColor ? themeColorMap[themeColor] : colorFilter

  const sectionStyle = finalBackgroundImage
    ? {
        backgroundImage: finalColorFilter
          ? `linear-gradient(0deg, ${finalColorFilter}, ${finalColorFilter}), url('${finalBackgroundImage}')`
          : `url('${finalBackgroundImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "scroll",
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
