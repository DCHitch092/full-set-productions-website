/**
 * ServiceCardImage - Complex image treatment with category overlay
 * Used for service cards with category colors
 */

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { ANIMATIONS } from "@/lib/animations"

interface ServiceCardImageProps {
  src: string
  alt: string
  category?: string
  categoryColor?: string
  className?: string
}

export function ServiceCardImage({
  src,
  alt,
  category,
  categoryColor,
  className = "",
}: ServiceCardImageProps) {
  return (
    <div className={`relative aspect-[4/3] overflow-hidden bg-muted ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${ANIMATIONS.scaleHover}`}
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      
      {/* Category badge overlay */}
      {category && (
        <div className="absolute bottom-4 left-4 right-4">
          <Badge
            className={categoryColor ? `bg-${categoryColor}` : "bg-primary"}
            variant="secondary"
          >
            {category}
          </Badge>
        </div>
      )}
    </div>
  )
}
