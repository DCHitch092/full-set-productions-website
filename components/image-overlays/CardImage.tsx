/**
 * CardImage - Consistent image for card components
 * 4:3 aspect ratio with minimal overlay
 */

import Image from "next/image"
import { ANIMATIONS } from "@/lib/animations"

interface CardImageProps {
  src: string
  alt: string
  aspectRatio?: "4/3" | "3/2" | "square"
  className?: string
}

export function CardImage({
  src,
  alt,
  aspectRatio = "4/3",
  className = "",
}: CardImageProps) {
  const aspectMap = {
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    square: "aspect-square",
  }

  return (
    <div className={`relative overflow-hidden bg-muted ${aspectMap[aspectRatio]} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${ANIMATIONS.scaleHover}`}
      />
    </div>
  )
}
