"use client"

import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer"
import { BLOCKS, INLINES } from "@contentful/rich-text-types"
import type { Document } from "@contentful/rich-text-types"
import Image from "next/image"
import Link from "next/link"
import { getAssetUrl, getAssetDimensions } from "@/lib/contentful-types"
import { LogoBullet } from "@/components/brand-shapes"

// Stateful counter so bullets cycle per-list without React context
function makeBulletCounter() {
  let i = 0
  return () => i++
}

const defaultOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="mt-10 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {children}
      </h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="mt-12 text-2xl font-bold tracking-tight text-foreground">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="mt-8 text-xl font-semibold text-foreground">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className="mt-6 text-lg font-semibold text-foreground">
        {children}
      </h4>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mt-4 text-muted-foreground leading-relaxed">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (node, children) => {
      // Build a counter shared across this list's items
      const counter = makeBulletCounter()
      // Re-render children with index injected via wrapper
      const childArray = Array.isArray(children) ? children : [children]
      return (
        <ul className="mt-4 space-y-3">
          {childArray.map((child, i) => (
            <li key={i} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
              <span className="mt-1 flex-shrink-0 text-primary">
                <LogoBullet index={counter()} size="sm" color="var(--color-primary)" />
              </span>
              <span>{child}</span>
            </li>
          ))}
        </ul>
      )
    },
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="mt-4 space-y-2 list-decimal pl-6 text-muted-foreground">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      // Strip the outer <p> wrapper Contentful adds inside list items
      <>{children}</>
    ),
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="mt-6 border-l-4 border-accent pl-4 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <div data-section-break="true" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const asset = node.data.target
      const url = getAssetUrl(asset)
      if (!url) return null
      const { width, height } = getAssetDimensions(asset)
      const alt = (asset.fields.title as string) || ""
      return (
        <div className="my-8 overflow-hidden rounded-lg">
          <Image
            src={url || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className="w-full"
          />
        </div>
      )
    },
    [INLINES.HYPERLINK]: (node, children) => {
      const url = node.data.uri as string
      const isExternal = url.startsWith("http")
      if (isExternal) {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline underline-offset-4 hover:text-accent"
          >
            {children}
          </a>
        )
      }
      return (
        <Link
          href={url}
          className="text-foreground underline underline-offset-4 hover:text-accent"
        >
          {children}
        </Link>
      )
    },
  },
}

const darkBgOptions: Options = {
  renderNode: {
    [BLOCKS.HEADING_1]: (node, children) => (
      <h1 className="mt-10 text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {children}
      </h1>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <h2 className="mt-12 text-2xl font-bold tracking-tight text-white">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <h3 className="mt-8 text-xl font-semibold text-white">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <h4 className="mt-6 text-lg font-semibold text-white">
        {children}
      </h4>
    ),
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <p className="mt-4 text-white/85 leading-relaxed">{children}</p>
    ),
    [BLOCKS.UL_LIST]: (node, children) => {
      const counter = makeBulletCounter()
      const childArray = Array.isArray(children) ? children : [children]
      return (
        <ul className="mt-4 space-y-3">
          {childArray.map((child, i) => (
            <li key={i} className="flex items-start gap-3 text-white/85 leading-relaxed">
              <span className="mt-1 flex-shrink-0">
                <LogoBullet index={counter()} size="sm" color="rgba(255,255,255,0.75)" />
              </span>
              <span>{child}</span>
            </li>
          ))}
        </ul>
      )
    },
    [BLOCKS.OL_LIST]: (node, children) => (
      <ol className="mt-4 space-y-2 list-decimal pl-6 text-white/85">
        {children}
      </ol>
    ),
    [BLOCKS.LIST_ITEM]: (node, children) => (
      <>{children}</>
    ),
    [BLOCKS.QUOTE]: (node, children) => (
      <blockquote className="mt-6 border-l-4 border-white/50 pl-4 italic text-white/85">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <div data-section-break="true" />,
    [BLOCKS.EMBEDDED_ASSET]: (node) => {
      const asset = node.data.target
      const url = getAssetUrl(asset)
      if (!url) return null
      const { width, height } = getAssetDimensions(asset)
      const alt = (asset.fields.title as string) || ""
      return (
        <div className="my-8 overflow-hidden rounded-lg">
          <Image
            src={url || "/placeholder.svg"}
            alt={alt}
            width={width}
            height={height}
            className="w-full"
          />
        </div>
      )
    },
    [INLINES.HYPERLINK]: (node, children) => {
      const url = node.data.uri as string
      const isExternal = url.startsWith("http")
      if (isExternal) {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white underline underline-offset-4 hover:text-white/70"
          >
            {children}
          </a>
        )
      }
      return (
        <Link
          href={url}
          className="text-white underline underline-offset-4 hover:text-white/70"
        >
          {children}
        </Link>
      )
    },
  },
}

interface RichTextProps {
  document: Document | undefined | null
  className?: string
  sectionMode?: boolean
}

export function RichText({ document, className, sectionMode = false }: RichTextProps) {
  if (!document) return null

  if (!sectionMode) {
    return (
      <div className={className ?? "max-w-none"}>
        {documentToReactComponents(document, defaultOptions)}
      </div>
    )
  }

  // Section mode: split content at HR markers and wrap in banner sections
  // Parse the document manually to split at HR blocks
  const sections: any[] = []
  let currentSection: any[] = []

  document.content.forEach((block: any) => {
    if (block.nodeType === BLOCKS.HR) {
      // End current section if it has content
      if (currentSection.length > 0) {
        sections.push(currentSection)
        currentSection = []
      }
    } else {
      currentSection.push(block)
    }
  })

  // Push any remaining content
  if (currentSection.length > 0) {
    sections.push(currentSection)
  }

  // Three-color rotation for sections: background, secondary, and accent orange
  const bgColors = ["bg-background", "bg-secondary", "bg-accent"]

  return (
    <>
      {sections.map((sectionContent, idx) => {
        const sectionDoc = { ...document, content: sectionContent }
        const bgColor = bgColors[idx % 3]
        const prevBgColor = bgColors[(idx - 1 + 3) % 3]
        // Alternate diagonal direction for better visual flow
        const clipPath = idx % 2 === 0 
          ? "polygon(0 0, 100% 100%, 0 100%)" 
          : "polygon(100% 0, 100% 100%, 0 100%)"

        return (
          <section key={idx} className={`relative ${bgColor}`}>
            {/* Diagonal divider from previous section */}
            {idx > 0 && (
              <div
                className={`absolute inset-x-0 -top-6 z-10 h-6 ${prevBgColor}`}
                style={{ clipPath }}
              />
            )}
            <div className="relative z-20 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
              <div className="mx-auto max-w-3xl">
                {documentToReactComponents(
                  sectionDoc,
                  bgColor === "bg-accent" ? darkBgOptions : defaultOptions
                )}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
