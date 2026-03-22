/**
 * BrandShapes — SVG embellishments derived from the Full Set Productions logo.
 *
 * Shapes extracted:
 *   - FDiamond     → the rotated square / diamond from the "F"
 *   - SHalfCircle  → the tilted half-circle from the "S"
 *   - LOblong      → the squat horizontal oblong cap from the "L"
 *
 * These are used as:
 *   - Inline decorative marks / bullet points
 *   - Section separators
 *   - Icon housings (SplitCircleIcon)
 */

import { cn } from "@/lib/utils"

// ─────────────────────────────────────────────
// Shared size helpers
// ─────────────────────────────────────────────
type Size = "xs" | "sm" | "md" | "lg" | "xl"

const sizeMap: Record<Size, number> = {
  xs: 10,
  sm: 14,
  md: 20,
  lg: 28,
  xl: 40,
}

// ─────────────────────────────────────────────
// FDiamond — rotated square from the "F"
// ─────────────────────────────────────────────
interface BrandShapeProps {
  size?: Size | number
  color?: string        // CSS color or "currentColor"
  className?: string
  "aria-hidden"?: boolean
}

export function FDiamond({
  size = "md",
  color = "currentColor",
  className,
  "aria-hidden": ariaHidden = true,
}: BrandShapeProps) {
  const px = typeof size === "number" ? size : sizeMap[size]
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Square rotated 45° → diamond */}
      <rect
        x="3.5"
        y="3.5"
        width="13"
        height="13"
        rx="1"
        fill={color}
        transform="rotate(45 10 10)"
      />
    </svg>
  )
}

// ─────────────────────────────────────────────
// SHalfCircle — tilted half-circle from the "S"
// ─────────────────────────────────────────────
export function SHalfCircle({
  size = "md",
  color = "currentColor",
  rotation = -35,          // degrees; -35 mirrors the logo angle
  className,
  "aria-hidden": ariaHidden = true,
}: BrandShapeProps & { rotation?: number }) {
  const px = typeof size === "number" ? size : sizeMap[size]
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Half-circle path (left half of a circle), then rotated */}
      <path
        d="M10 2 A8 8 0 0 0 10 18 Z"
        fill={color}
        transform={`rotate(${rotation} 10 10)`}
      />
    </svg>
  )
}

// ─────────────────────────────────────────────
// LOblong — squat horizontal rectangle from "L"
// ─────────────────────────────────────────────
export function LOblong({
  size = "md",
  color = "currentColor",
  className,
  "aria-hidden": ariaHidden = true,
}: BrandShapeProps) {
  const px = typeof size === "number" ? size : sizeMap[size]
  // Render as wide, short pill
  return (
    <svg
      width={px * 1.6}
      height={px * 0.55}
      viewBox="0 0 32 11"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden={ariaHidden}
    >
      <rect width="32" height="11" rx="3" fill={color} />
    </svg>
  )
}

// ─────────────────────────────────────────────
// LogoBullet — cycles through all three shapes
// Usage: replace <li> bullets or use inline
// ─────────────────────────────────────────────
const bulletCycle = ["diamond", "halfcircle", "oblong"] as const
type BulletShape = (typeof bulletCycle)[number]

interface LogoBulletProps {
  shape?: BulletShape | "auto"  // "auto" → pick by index
  index?: number                // for "auto" cycling
  size?: Size | number
  color?: string
  className?: string
}

export function LogoBullet({
  shape = "auto",
  index = 0,
  size = "sm",
  color = "currentColor",
  className,
}: LogoBulletProps) {
  const resolved: BulletShape =
    shape === "auto" ? bulletCycle[index % bulletCycle.length] : shape

  if (resolved === "diamond") {
    return <FDiamond size={size} color={color} className={className} />
  }
  if (resolved === "halfcircle") {
    return <SHalfCircle size={size} color={color} className={className} />
  }
  return <LOblong size={size} color={color} className={className} />
}

// ─────────────────────────────────────────────
// LogoBulletList — drop-in <ul> replacement
// ─────────────────────────────────────────────
interface LogoBulletListProps {
  items: string[]
  bulletColor?: string
  className?: string
  itemClassName?: string
  size?: Size | number
}

export function LogoBulletList({
  items,
  bulletColor = "var(--color-primary)",
  className,
  itemClassName,
  size = "sm",
}: LogoBulletListProps) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item, i) => (
        <li key={i} className={cn("flex items-start gap-3", itemClassName)}>
          <span className="mt-0.5 flex-shrink-0">
            <LogoBullet index={i} size={size} color={bulletColor} />
          </span>
          <span className="text-muted-foreground leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  )
}

// ─────────────────────────────────────────────
// SplitCircleIcon — circle split diagonally at
// an angle inspired by the "S" half-circle motif.
// Used as a replacement for the solid-colour icon housing.
// ─────────────────────────────────────────────
interface SplitCircleIconProps {
  size?: number          // diameter in px
  colorA?: string        // top-left half (dominant)
  colorB?: string        // bottom-right half (accent)
  angle?: number         // split angle in degrees (default 35, matching S tilt)
  children?: React.ReactNode   // icon rendered on top
  className?: string
}

export function SplitCircleIcon({
  size = 64,
  colorA = "var(--color-primary)",
  colorB = "var(--color-secondary)",
  angle = 35,
  children,
  className,
}: SplitCircleIconProps) {
  const r = size / 2
  const rad = (angle * Math.PI) / 180

  // Calculate the two points where the diagonal chord meets the circle edge
  // The chord passes through the centre at the given angle
  const cos = Math.cos(rad)
  const sin = Math.sin(rad)

  const x1 = r - r * cos
  const y1 = r - r * sin
  const x2 = r + r * cos
  const y2 = r + r * sin

  const id = `sc-clip-${angle}`

  return (
    <div
      className={cn("relative flex items-center justify-center flex-shrink-0", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0"
      >
        <defs>
          <clipPath id={`${id}-circle`}>
            <circle cx={r} cy={r} r={r} />
          </clipPath>
        </defs>

        {/* Top-left half */}
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 1 0 ${x2} ${y2} Z`}
          fill={colorA}
          clipPath={`url(#${id}-circle)`}
        />

        {/* Bottom-right half */}
        <path
          d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`}
          fill={colorB}
          clipPath={`url(#${id}-circle)`}
        />
      </svg>

      {/* Icon slot — rendered above the circle */}
      {children && (
        <div className="relative z-10 flex items-center justify-center text-white">
          {children}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// SplitCircleNumber — step-number badge variant
// ─────────────────────────────────────────────
interface SplitCircleNumberProps {
  number: number
  size?: number
  colorA?: string
  colorB?: string
  angle?: number
  className?: string
}

export function SplitCircleNumber({
  number,
  size = 64,
  colorA = "var(--color-primary)",
  colorB = "var(--color-secondary)",
  angle = 35,
  className,
}: SplitCircleNumberProps) {
  const fontSize = size * 0.34
  return (
    <SplitCircleIcon
      size={size}
      colorA={colorA}
      colorB={colorB}
      angle={angle}
      className={className}
    >
      <span
        className="font-serif font-bold select-none"
        style={{ fontSize, lineHeight: 1, color: "white" }}
      >
        {String(number).padStart(2, "0")}
      </span>
    </SplitCircleIcon>
  )
}
