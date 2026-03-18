/**
 * HeroImage - Consistent image with gradient overlay for hero sections
 */

import Image from "next/image"

interface HeroImageProps {
  src: string
  alt: string
  overlayOpacity?: "light" | "medium" | "dark"
  className?: string
}

export function HeroImage({
  src,
  alt,
  overlayOpacity = "medium",
  className = "",
}: HeroImageProps) {
  const overlayMap = {
    light: "bg-gradient-to-t from-black/30 via-black/10 to-transparent",
    medium: "bg-gradient-to-t from-black/60 via-black/30 to-transparent",
    dark: "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        priority
      />
      <div className={`absolute inset-0 ${overlayMap[overlayOpacity]}`} />
    </div>
  )
}
