/**
 * HeroSection - Standardized hero with optional image, configurable colors
 */

import { ReactNode } from "react"
import Image from "next/image"
import { spacing } from "@/lib/design-tokens"

interface HeroSectionProps {
  children: ReactNode
  imageUrl?: string
  imageAlt?: string
  background?: "primary" | "secondary"
  textColor?: "primary-foreground" | "foreground"
  className?: string
}

export function HeroSection({
  children,
  imageUrl,
  imageAlt = "Hero image",
  background = "primary",
  textColor = "primary-foreground",
  className = "",
}: HeroSectionProps) {
  const bgMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
  }

  const gridLayout = imageUrl ? "grid items-center gap-12 lg:grid-cols-2" : "max-w-3xl"

  return (
    <section className={`${bgMap[background]} ${spacing.sectionPyXl} ${className}`}>
      <div className={`mx-auto ${spacing.containerMaxWidthLg} ${spacing.containerPadding}`}>
        <div className={gridLayout}>
          <div className={textColor === "primary-foreground" ? "text-primary-foreground" : "text-foreground"}>
            {children}
          </div>
          {imageUrl && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
