/**
 * KeyPointsList — reusable key-points / highlights component.
 *
 * Each item gets a thick left bar (10 px, square ends) inspired by
 * the vertical stroke of the "E" in the Full Set Productions logo.
 * Bars cycle through the five brand palette colours in order.
 */

import { cn } from "@/lib/utils"

// Brand palette in the order they cycle — edit here to reorder.
const PALETTE = [
  "var(--color-blue)",
  "var(--color-teal)",
  "var(--color-pink)",
  "var(--color-coral)",
  "var(--color-yellow)",
]

interface KeyPointsListProps {
  points: string[]
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function KeyPointsList({
  points,
  columns = 2,
  className,
}: KeyPointsListProps) {
  const colClass = {
    1: "",
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  }[columns]

  return (
    <ul className={cn("grid gap-6", colClass, className)}>
      {points.map((point, i) => (
        <li
          key={i}
          className="pl-4 text-[15px] text-foreground leading-snug"
          style={{
            borderLeft: `10px solid ${PALETTE[i % PALETTE.length]}`,
          }}
        >
          {point}
        </li>
      ))}
    </ul>
  )
}
