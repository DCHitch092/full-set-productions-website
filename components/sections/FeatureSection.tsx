/**
 * FeatureSection - Two-column feature layout
 */

import { ReactNode } from "react"
import Image from "next/image"
import { spacing } from "@/lib/design-tokens"

interface FeatureSectionProps {
  children: ReactNode
  imageUrl?: string
  imageAlt?: string
  imagePosition?: "left" | "right"
  background?: "primary" | "secondary" | "transparent"
  className?: string
}

export function FeatureSection({
  children,
  imageUrl,
  imageAlt = "Feature image",
  imagePosition = "right",
  background = "transparent",
  className = "",
}: FeatureSectionProps) {
  const bgMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    transparent: "",
  }

  const imageElement = imageUrl && (
    <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt={imageAlt}
        fill
        className="object-cover"
      />
    </div>
  )

  return (
    <section className={`${bgMap[background]} ${spacing.sectionPyLarge} ${className}`}>
      <div className={`mx-auto ${spacing.containerMaxWidthLg} ${spacing.containerPadding}`}>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {imagePosition === "left" && imageElement}
          <div>{children}</div>
          {imagePosition === "right" && imageElement}
        </div>
      </div>
    </section>
  )
}
