import Link from "next/link"
import Image from "next/image"
import { getFooter, getGlobalSettings, getNavigation } from "@/lib/contentful"
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer"
import type { Document } from "@contentful/rich-text-types"

export async function Footer() {
  const [footer, globalSettings, navEntries] = await Promise.all([
    getFooter(),
    getGlobalSettings(),
    getNavigation(),
  ])

  // Body copy under the logo — fall back to footerTagline if no body
  const bodyDoc = (footer?.fields as any)?.body as Document | undefined
  const bodyText = bodyDoc
    ? documentToPlainTextString(bodyDoc)
    : (footer?.fields?.footerTagline ??
        "Escape rooms, immersive attractions, and theatrical builds. Based in Edinburgh, delivering UK-wide.")

  const socialLinks = (footer?.fields?.socialLinks ?? []) as Array<{ label: string; url: string }>
  const legalLinks = (footer?.fields?.legalLinks ?? []) as Array<{ label: string; url: string }>

  // Navigation sections flagged for footer display
  const footerNavSections = navEntries.filter((n) => n.includeInFooter)

  // Grid columns: 2 for brand + one per nav section
  const totalCols = 2 + footerNavSections.length
  const gridClass =
    totalCols <= 3
      ? "grid gap-8 md:grid-cols-3"
      : totalCols === 4
        ? "grid gap-8 md:grid-cols-4"
        : "grid gap-8 md:grid-cols-5"

  return (
    <footer className="border-t border-border bg-secondary">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className={gridClass}>
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo-mono-horizontal.png"
                alt="Full Set Productions"
                width={150}
                height={44}
                className="h-9 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-sm text-sm text-white/80 leading-relaxed">
              {bodyText}
            </p>
            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="mt-4 flex gap-4">
                {socialLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Footer nav sections from CMS */}
          {footerNavSections.map((section) => (
            <div key={section.href}>
              <Link
                href={section.href}
                className="text-sm font-semibold text-white hover:text-accent transition-colors"
              >
                {section.label}
              </Link>
              <ul className="mt-4 space-y-2">
                {section.children.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      target={item.openInNewTab ? "_blank" : undefined}
                      rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border/30 pt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Full Set Productions. All rights reserved.
          </p>
          {legalLinks.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {legalLinks.map((link) => {
                // Map specific legal links to their CMS page slugs
                let href = link.url
                const linkLabel = link.label.toLowerCase()
                
                if (linkLabel.includes("privacy")) {
                  href = "/policy-page"
                } else if (linkLabel.includes("cookie")) {
                  href = "/cookie-policy"
                }
                
                return (
                  <Link
                    key={link.label}
                    href={href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
