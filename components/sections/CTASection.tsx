/**
 * CTASection - Call-to-action pattern with headline, description, and button
 */

import { ReactNode } from "react"
import { spacing } from "@/lib/design-tokens"

interface CTASectionProps {
  children: ReactNode
  background?: "primary" | "secondary" | "muted"
  centered?: boolean
  className?: string
}

export function CTASection({
  children,
  background = "secondary",
  centered = true,
  className = "",
}: CTASectionProps) {
  const bgMap = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    muted: "bg-muted",
  }

  const contentClass = centered ? "mx-auto max-w-2xl text-center" : ""

  return (
    <section className={`${bgMap[background]} ${spacing.sectionPyLarge} ${className}`}>
      <div className={`mx-auto ${spacing.containerMaxWidthLg} ${spacing.containerPadding}`}>
        <div className={contentClass}>{children}</div>
      </div>
    </section>
  )
}
