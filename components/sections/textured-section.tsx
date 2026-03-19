/**
 * TexturedSection - Server component that fetches background textures from Contentful
 * and applies them with theme-appropriate color filters
 */

import { ReactNode } from "react"
import { SectionContainer } from "./SectionContainer"
import { getTextureUrl, getThemeColorForType, themeColorFilters } from "@/lib/background-textures"

interface TexturedSectionProps {
  children: ReactNode
  type: "home" | "services" | "industry" | "about" | "project" | "article"
  assetIndex: number
  spacing?: "sm" | "md" | "lg" | "xl"
  maxWidth?: "sm" | "md" | "lg" | "full"
  bg?: "primary" | "secondary" | "muted" | "card" | "transparent"
  align?: "left" | "center"
  className?: string
  preview?: boolean
}

export async function TexturedSection({
  children,
  type,
  assetIndex,
  spacing = "lg",
  maxWidth = "lg",
  bg = "transparent",
  align = "left",
  className = "",
  preview = false,
}: TexturedSectionProps) {
  // Fetch the texture asset URL from Contentful global settings
  const textureUrl = await getTextureUrl(type, assetIndex, preview)
  
  // Get the theme color for this section type
  const themeColor = getThemeColorForType(type)
  const colorFilter = themeColorFilters[themeColor]

  return (
    <SectionContainer
      spacing={spacing}
      maxWidth={maxWidth}
      bg={bg}
      backgroundImage={textureUrl || undefined}
      colorFilter={colorFilter}
      align={align}
      className={className}
    >
      {children}
    </SectionContainer>
  )
}
