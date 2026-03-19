"use client"

import { ReactNode, useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { routeToTheme } from "@/lib/design-tokens"

interface ThemeWrapperProps {
  children: ReactNode
}

/**
 * ThemeWrapper - Applies page-specific theme based on current route
 * Uses data-page-theme attribute to trigger CSS color overrides and geometric motifs
 */
export function ThemeWrapper({ children }: ThemeWrapperProps) {
  const pathname = usePathname()
  const [theme, setTheme] = useState<string>("home")

  useEffect(() => {
    // Find matching theme for current route
    let currentTheme = "home"

    // Check for exact matches first
    if (routeToTheme[pathname]) {
      currentTheme = routeToTheme[pathname]
    } else {
      // Check for dynamic routes (e.g., /services/[slug])
      for (const [route, themeKey] of Object.entries(routeToTheme)) {
        if (route.includes("[")) {
          const pattern = route.replace(/\[.*?\]/g, "[^/]+")
          const regex = new RegExp(`^${pattern}$`)
          if (regex.test(pathname)) {
            currentTheme = themeKey
            break
          }
        }
      }
    }

    setTheme(currentTheme)
  }, [pathname])

  return (
    <div data-page-theme={theme}>
      {children}
    </div>
  )
}
