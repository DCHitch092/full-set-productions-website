import type {
  GlobalSettingsSkeleton,
  HomepageSkeleton,
  FooterSkeleton,
  ServiceSkeleton,
  ProjectSkeleton,
  FaqItemSkeleton,
  PageSkeleton,
} from "./contentful-types"

// Static JSON fallbacks
import siteContentFallback from "@/content/site-content.json"
import caseStudiesFallback from "@/content/case-studies.json"

// =============================================================
// Raw fetch wrapper – bypasses the `contentful` SDK entirely
// so we have full control over the Authorization header.
// =============================================================

const CONTENTFUL_BASE = "https://cdn.contentful.com"
const CONTENTFUL_PREVIEW_BASE = "https://preview.contentful.com"

interface ContentfulResponse<T> {
  sys: { type: string }
  total: number
  skip: number
  limit: number
  items: T[]
  includes?: { Asset?: any[]; Entry?: any[] }
}

async function contentfulFetch<T>(
  path: string,
  params: Record<string, string | number> = {},
  preview = false,
): Promise<ContentfulResponse<T>> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = preview
    ? process.env.CONTENTFUL_PREVIEW_TOKEN || process.env.CONTENTFUL_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN

  if (!spaceId || !accessToken) {
    // Return empty response so callers can use fallbacks gracefully
    return { sys: { type: "Array" }, total: 0, skip: 0, limit: 0, items: [] }
  }

  const base = preview ? CONTENTFUL_PREVIEW_BASE : CONTENTFUL_BASE
  const url = new URL(`/spaces/${spaceId}/environments/master${path}`, base)

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value))
  }

  // Pass the token as a query parameter AND as an Authorization header for maximum compatibility
  url.searchParams.set("access_token", accessToken)

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: false },
    })

    if (!res.ok) {
      const body = await res.text()
      console.error("[v0] Contentful API error:", res.status, body)
      throw new Error(`Contentful API ${res.status}: ${body}`)
    }

    return res.json()
  } catch (e) {
    console.error("[v0] Contentful fetch failed for", path, ":", e instanceof Error ? e.message : String(e))
    // Return empty response so callers can use fallbacks gracefully
    throw e
  }
}

// Helper to resolve linked assets from `includes`
function resolveAsset(link: any, includes?: { Asset?: any[] }) {
  if (!link?.sys?.id || !includes?.Asset) return null
  return includes.Asset.find((a: any) => a.sys.id === link.sys.id) ?? null
}

function resolveEntries(links: any[], includes?: { Entry?: any[] }) {
  if (!links || !includes?.Entry) return []
  return links
    .map((link: any) => includes.Entry!.find((e: any) => e.sys.id === link.sys.id))
    .filter(Boolean)
}

// =============================================================
// Helper: extract fields and resolve assets for an entry
// =============================================================
function extractEntry(item: any, includes?: any) {
  if (!item) return null
  return { fields: item.fields, sys: item.sys, _includes: includes }
}

// =============================================================
// Global Settings (singleton)
// =============================================================
export async function getGlobalSettings(preview = false) {
  try {
    const data = await contentfulFetch("/entries", { content_type: "globalSettings", limit: "1" }, preview)
    const item = data.items[0]
    if (!item) return null
    return { fields: item.fields, sys: item.sys, _includes: data.includes }
  } catch (e) {
    console.error("[Contentful] Failed to fetch globalSettings:", e)
    return null
  }
}

// =============================================================
// Homepage (singleton)
// =============================================================
export async function getHomepage(preview = false) {
  try {
    const data = await contentfulFetch("/entries", { content_type: "homepage", include: "2", limit: "1" }, preview)
    const item = data.items[0]
    return item ? { fields: item.fields, sys: item.sys, _includes: data.includes } : null
  } catch (e) {
    console.error("[Contentful] Failed to fetch homepage:", e)
    return null
  }
}

// =============================================================
// Footer (singleton)
// =============================================================
export async function getFooter(preview = false) {
  try {
    const data = await contentfulFetch("/entries", { content_type: "footer", limit: "1" }, preview)
    const item = data.items[0]
    return item ? { fields: item.fields, sys: item.sys, _includes: data.includes } : null
  } catch (e) {
    console.error("[Contentful] Failed to fetch footer:", e)
    return null
  }
}

// =============================================================
// Services
// =============================================================
export async function getServices(preview = false) {
  try {
    const data = await contentfulFetch("/entries", { content_type: "service", include: "2" }, preview)
    return data.items.map((item: any) => ({ fields: item.fields, sys: item.sys, _includes: data.includes }))
  } catch (e) {
    console.error("[Contentful] Failed to fetch services:", e)
    return []
  }
}

export async function getServiceBySlug(slug: string, preview = false) {
  try {
    const data = await contentfulFetch(
      "/entries",
      { content_type: "service", "fields.slug": slug, include: "3", limit: "1" },
      preview,
    )
    const item = data.items[0]
    return item ? { fields: item.fields, sys: item.sys, _includes: data.includes } : null
  } catch (e) {
    console.error(`[Contentful] Failed to fetch service "${slug}":`, e)
    return null
  }
}

// =============================================================
// Projects (case studies)
// =============================================================
export async function getProjects(preview = false) {
  try {
    const data = await contentfulFetch("/entries", { content_type: "project", include: "2" }, preview)
    return data.items.map((item: any) => ({ fields: item.fields, sys: item.sys, _includes: data.includes }))
  } catch (e) {
    console.error("[Contentful] Failed to fetch projects:", e)
    return []
  }
}

export async function getProjectBySlug(slug: string, preview = false) {
  try {
    const data = await contentfulFetch(
      "/entries",
      { content_type: "project", "fields.slug": slug, include: "2", limit: "1" },
      preview,
    )
    const item = data.items[0]
    return item ? { fields: item.fields, sys: item.sys, _includes: data.includes } : null
  } catch (e) {
    console.error(`[Contentful] Failed to fetch project "${slug}":`, e)
    return null
  }
}

export async function getFeaturedProjects(preview = false) {
  try {
    const homepage = await getHomepage(preview)
    const featured = homepage?.fields?.featuredProjects
    if (featured && Array.isArray(featured) && featured.length > 0) {
      const includes = homepage?._includes
      return featured
        .map((ref: any) => {
          const resolved = includes?.Entry?.find((e: any) => e.sys.id === ref.sys.id)
          if (!resolved) return ref
          // Resolve heroImage and featuredImage assets from includes
          for (const imgField of ["heroImage", "featuredImage"]) {
            if (resolved.fields?.[imgField]?.sys?.id) {
              const asset = includes?.Asset?.find(
                (a: any) => a.sys.id === resolved.fields[imgField].sys.id,
              )
              if (asset) resolved.fields[imgField] = asset
            }
          }
          return { fields: resolved.fields, sys: resolved.sys, _includes: includes }
        })
        .filter(Boolean)
    }
    const all = await getProjects(preview)
    return all.slice(0, 4)
  } catch (e) {
    console.error("[Contentful] Failed to fetch featured projects:", e)
    return []
  }
}

// =============================================================
// FAQ Items
// =============================================================
export async function getFaqItems(preview = false) {
  try {
    const data = await contentfulFetch(
      "/entries",
      { content_type: "faqItem", order: "fields.order", include: "1" },
      preview,
    )
    return data.items.map((item: any) => ({ fields: item.fields, sys: item.sys }))
  } catch (e) {
    console.error("[Contentful] Failed to fetch FAQ items:", e)
    return []
  }
}

// =============================================================
// Industries
// =============================================================
export async function getIndustries(preview = false) {
  try {
    const data = await contentfulFetch("/entries", { content_type: "industry", include: "2" }, preview)
    return data.items.map((item: any) => ({ fields: item.fields, sys: item.sys, _includes: data.includes }))
  } catch (e) {
    console.error("[Contentful] Failed to fetch industries:", e)
    return []
  }
}

export async function getIndustryBySlug(slug: string, preview = false) {
  try {
    const data = await contentfulFetch(
      "/entries",
      { content_type: "industry", "fields.slug": slug, include: "2", limit: "1" },
      preview,
    )
    const item = data.items[0]
    return item ? { fields: item.fields, sys: item.sys, _includes: data.includes } : null
  } catch (e) {
    console.error(`[Contentful] Failed to fetch industry "${slug}":`, e)
    return null
  }
}

// =============================================================
// Testimonials
// =============================================================
export async function getTestimonials(preview = false) {
  try {
    const data = await contentfulFetch("/entries", { content_type: "testimonial", include: "1" }, preview)
    return data.items.map((item: any) => ({ fields: item.fields, sys: item.sys, _includes: data.includes }))
  } catch (e) {
    console.error("[Contentful] Failed to fetch testimonials:", e)
    return []
  }
}

// =============================================================
// Pages (generic) -- with full modular block + listing support
// =============================================================
export async function getPageBySlug(slug: string, preview = false) {
  try {
    const data = await contentfulFetch(
      "/entries",
      { content_type: "page", "fields.slug": slug, include: "3", limit: "1" },
      preview,
    )
    const item = data.items[0]
    if (!item) return null

    // Resolve reusableSnippets (modular blocks)
    const snippetsRef = item.fields.reusableSnippets
    let modularBlocks: any[] = []
    if (snippetsRef) {
      // Could be a single ref or the resolved entry
      const refs = Array.isArray(snippetsRef) ? snippetsRef : [snippetsRef]
      modularBlocks = refs
        .map((ref: any) => {
          if (ref.fields) return ref // Already resolved
          const resolved = data.includes?.Entry?.find((e: any) => e.sys.id === ref.sys?.id)
          return resolved ?? null
        })
        .filter(Boolean)
    }

    // Resolve includedModularBlocks (modular blocks specifically for this page)
    const includedBlocksRef = item.fields.includedModularBlocks as any[] | undefined
    let includedModularBlocks: any[] = []
    if (includedBlocksRef) {
      includedModularBlocks = includedBlocksRef
        .map((ref: any) => {
          if (ref.fields) return ref // Already resolved
          const resolved = data.includes?.Entry?.find((e: any) => e.sys.id === ref.sys?.id)
          return resolved ?? null
        })
        .filter(Boolean)
    }

    // Resolve faqItems
    const faqRefs = item.fields.faqItems as any[] | undefined
    const faqItems = faqRefs
      ? faqRefs
          .map((ref: any) => {
            if (ref.fields) return ref
            return data.includes?.Entry?.find((e: any) => e.sys.id === ref.sys?.id) ?? null
          })
          .filter(Boolean)
      : []

    // Resolve modular block images and includedCards (for both modularBlocks and includedModularBlocks)
    const allBlocks = [...modularBlocks, ...includedModularBlocks]
    for (const block of allBlocks) {
      // Resolve block-level image
      if (block.fields?.image?.sys?.id) {
        const asset = data.includes?.Asset?.find(
          (a: any) => a.sys.id === block.fields.image.sys.id,
        )
        if (asset) block.fields.image = asset
      }

      // Resolve includedCards (person, customJSON, or any card entries attached to modular blocks)
      if (block.fields?.includedCards) {
        const cardRefs = Array.isArray(block.fields.includedCards)
          ? block.fields.includedCards
          : [block.fields.includedCards]

        // Debug: log raw card references before resolution
        console.log("[v0] Block:", block.fields?.internalName, "- raw cardRefs count:", cardRefs.length)
        cardRefs.forEach((ref: any, idx: number) => {
          const alreadyResolved = !!ref.fields
          const foundInIncludes = data.includes?.Entry?.find((e: any) => e.sys.id === ref.sys?.id)
          console.log("[v0]   Raw ref", idx + 1, "- id:", ref.sys?.id, "- alreadyResolved:", alreadyResolved, "- foundInIncludes:", !!foundInIncludes)
        })

        block.fields.includedCards = cardRefs
          .map((ref: any) => {
            if (ref.fields) return ref // Already resolved
            return data.includes?.Entry?.find((e: any) => e.sys.id === ref.sys?.id) ?? null
          })
          .filter(Boolean)

        // Resolve each card's image asset (for person/media cards)
        for (const card of block.fields.includedCards) {
          for (const imgField of ["headshot", "photo", "image", "featuredImage"]) {
            if (card.fields?.[imgField]?.sys?.id) {
              const asset = data.includes?.Asset?.find(
                (a: any) => a.sys.id === card.fields[imgField].sys.id,
              )
              if (asset) card.fields[imgField] = asset
            }
          }
        }
      }
    }

    return {
      fields: item.fields,
      sys: item.sys,
      _includes: data.includes,
      _modularBlocks: modularBlocks,
      _includedModularBlocks: includedModularBlocks,
      _faqItems: faqItems,
    }
  } catch (e) {
    console.error(`[Contentful] Failed to fetch page "${slug}":`, e)
    return null
  }
}

// =============================================================
// Fetch content items by type name (for "List Content" feature)
// =============================================================
export async function getContentByType(
  typeName: string,
  limit?: number,
  preview = false,
): Promise<any[]> {
  const typeMap: Record<string, string> = {
    Service: "service",
    Industry: "industry",
    "FAQ Item": "faqItem",
    Project: "project",
    Testimonial: "testimonial",
  }
  const contentType = typeMap[typeName]
  if (!contentType) return []

  try {
    const params: Record<string, string | number> = {
      content_type: contentType,
      include: "2",
    }
    if (limit && limit > 0) params.limit = String(limit)
    if (contentType === "faqItem") params.order = "fields.order"

    const data = await contentfulFetch("/entries", params, preview)
    return data.items.map((item: any) => ({
      fields: item.fields,
      sys: item.sys,
      _includes: data.includes,
      _contentType: typeName,
    }))
  } catch (e) {
    console.error(`[Contentful] Failed to fetch content type "${typeName}":`, e)
    return []
  }
}

// =============================================================
// Modular Blocks (by internalName)
// =============================================================
export async function getModularBlockByName(internalName: string, preview = false) {
  try {
    const data = await contentfulFetch(
      "/entries",
      { content_type: "modularBlocks", "fields.internalName": internalName, include: "1", limit: "1" },
      preview,
    )
    const item = data.items[0]
    if (!item) return null
    // Resolve image asset
    if (item.fields.image?.sys?.id && data.includes?.Asset) {
      const asset = data.includes.Asset.find((a: any) => a.sys.id === item.fields.image.sys.id)
      if (asset) item.fields.image = asset
    }
    return { fields: item.fields, sys: item.sys, _includes: data.includes }
  } catch (e) {
    console.error(`[Contentful] Failed to fetch modular block "${internalName}":`, e)
    return null
  }
}

// =============================================================
// Navigation
// =============================================================

export interface NavItem {
  label: string
  href: string
  openInNewTab?: boolean
}

export interface NavEntry {
  label: string
  href: string
  order: number
  visible: boolean
  placement: boolean // true = header, false = footer
  includeInFooter: boolean
  children: NavItem[]
}

export async function getNavigation(preview = false): Promise<NavEntry[]> {
  try {
    const data = await contentfulFetch<any>(
      "/entries",
      { content_type: "navigation", include: "3", order: "fields.order" },
      preview,
    )

    const includes = data.includes
    const allEntries = includes?.Entry ?? []

    function resolveEntry(ref: any) {
      if (!ref?.sys?.id) return null
      return allEntries.find((e: any) => e.sys.id === ref.sys.id) ?? null
    }

    return data.items
      .filter((item: any) => item.fields.visible !== false)
      .map((item: any) => {
        const fields = item.fields
        const parentSlug = fields.url || ""

        // Resolve listItems (navigationItem references)
        const listItemRefs: any[] = fields.listItems ?? []
        const children: NavItem[] = listItemRefs
          .map((ref: any) => {
            const navItem = resolveEntry(ref)
            if (!navItem) return null

            const nf = navItem.fields
            const linkType = nf.linkType || "internal"
            const openInNewTab = nf.openInNewTab ?? false

            let href = "#"
            if (linkType === "external" && nf.externalUrl) {
              href = nf.externalUrl
            } else if (linkType === "internal" && nf.internalLink) {
              const linkedEntry = resolveEntry(nf.internalLink)
              if (linkedEntry?.fields?.slug) {
                // Determine URL based on content type
                const contentType = linkedEntry.sys?.contentType?.sys?.id
                
                if (contentType === "page") {
                  // For pages, use the parent field if available
                  const pageParent = linkedEntry.fields.parent || ""
                  const pagePath = pageParent 
                    ? `${pageParent}/${linkedEntry.fields.slug}` 
                    : linkedEntry.fields.slug
                  href = `/${pagePath}`
                } else if (contentType === "project") {
                  href = `/projects/${linkedEntry.fields.slug}`
                } else if (contentType === "industry") {
                  href = `/industry/${linkedEntry.fields.slug}`
                } else if (contentType === "service") {
                  href = `/services/${linkedEntry.fields.slug}`
                } else {
                  // Fallback for unknown types
                  href = `/${linkedEntry.fields.slug}`
                }
              }
            }

            return {
              label: nf.label || "Untitled",
              href,
              openInNewTab,
            }
          })
          .filter(Boolean) as NavItem[]

        return {
          label: fields.label || "Untitled",
          href: `/${parentSlug}`,
          order: fields.order ?? 0,
          visible: fields.visible ?? true,
          placement: fields.placement ?? true, // true = header, false = footer
          includeInFooter: fields.placement === false,
          children,
        }
      })
      .sort((a: NavEntry, b: NavEntry) => a.order - b.order)
  } catch (e) {
    console.error("[Contentful] Failed to fetch navigation:", e)
    return []
  }
}

// =============================================================
// Contentful image URL helper
// =============================================================
export function contentfulImageUrl(asset: any, params?: { w?: number; h?: number; q?: number; fm?: string }) {
  const url = asset?.fields?.file?.url || asset?.file?.url
  if (!url) return null
  const base = url.startsWith("//") ? `https:${url}` : url
  if (!params) return base
  const searchParams = new URLSearchParams()
  if (params.w) searchParams.set("w", String(params.w))
  if (params.h) searchParams.set("h", String(params.h))
  if (params.q) searchParams.set("q", String(params.q))
  if (params.fm) searchParams.set("fm", params.fm)
  return `${base}?${searchParams.toString()}`
}

// =============================================================
// Fallback helpers (static JSON when Contentful has no data)
// =============================================================
export function getStaticSiteContent() {
  return siteContentFallback
}

export function getStaticCaseStudies() {
  return caseStudiesFallback.caseStudies
}
