import { getNavigation, getGlobalSettings } from "@/lib/contentful"
import { HeaderClient } from "./header-client"

export async function Header() {
  const [navEntries, globalSettings] = await Promise.all([
    getNavigation(),
    getGlobalSettings(),
  ])

  const gs = globalSettings?.fields as any
  const ctaText = gs?.primaryCTA ?? gs?.primaryCta ?? gs?.primaryCtaText ?? "Start a Project"
  const ctaUrl = gs?.primaryCTAUrl ?? gs?.primaryCtaUrl ?? "/contact"

  return (
    <HeaderClient
      navEntries={navEntries}
      ctaText={ctaText}
      ctaUrl={ctaUrl}
    />
  )
}
