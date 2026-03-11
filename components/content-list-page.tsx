import { RichText } from "@/components/rich-text"
import { ModularBlockRenderer } from "@/components/modular-blocks"
import { ContentListSection } from "@/components/content-cards"
import type { Document } from "@contentful/rich-text-types"

interface ContentListPageProps {
  page: {
    fields: {
      title: string
      slug: string
      body?: Document
      listContent?: string[]
      listAllAssociatedContent?: boolean
      featureAssociatedContent?: number
    }
    _modularBlocks?: any[]
    _faqItems?: any[]
  }
  /** Featured content: subset of allContent limited by featureAssociatedContent */
  featuredContent: any[]
  /** All content items (for listAllAssociatedContent) */
  allContent: any[]
  /** The primary content type name for card rendering */
  primaryContentType: string
}

/**
 * Reusable page template that renders modular blocks and content lists
 * in the specified priority order:
 *
 * 10 - Hero (modular block, if present)
 * 15 - Body (rich text, if not empty)
 * 20 - Featured Content (limited by featureAssociatedContent, skip if 0)
 * 25 - CTA (modular block, if present)
 * 30 - List All Associated Content (if listAllAssociatedContent is true)
 * 32 - MidRoll (modular block, if present)
 * 35 - FeatureList (modular block, if present)
 * 40 - Steps (modular block, if present)
 * 50 - Quote (modular block, if present)
 * 60 - Gallery (modular block, if present)
 * 70 - FAQ (modular block, if present) + inline FAQ items
 */
export function ContentListPage({
  page,
  featuredContent,
  allContent,
  primaryContentType,
}: ContentListPageProps) {
  const blocks = page._modularBlocks ?? []
  const faqItems = page._faqItems ?? []
  const {
    body,
    listAllAssociatedContent,
    featureAssociatedContent,
    listContent,
  } = page.fields

  // Find modular blocks by sectionType
  const findBlock = (type: string) => blocks.find((b: any) => b.fields?.sectionType === type)

  const heroBlock = findBlock("Hero")
  const ctaBlock = findBlock("CTA")
  const midRollBlock = findBlock("MidRoll")
  const featureListBlock = findBlock("FeatureList")
  const stepsBlock = findBlock("Steps")
  const quoteBlock = findBlock("Quote")
  const galleryBlock = findBlock("Gallery")
  const faqBlock = findBlock("FAQ")

  // Feature count: 0 means don't feature any
  const featureCount = featureAssociatedContent ?? 0
  const shouldFeature = featureCount > 0 && featuredContent.length > 0
  const shouldListAll = listAllAssociatedContent === true && allContent.length > 0

  // Determine the content type label for headings
  const typeLabels: Record<string, string> = {
    Service: "Our services",
    Industry: "Industries we serve",
    Project: "Our projects",
    "FAQ Item": "Frequently asked questions",
    Testimonial: "What our clients say",
  }

  // For "list all", determine which content type(s) to show
  const contentTypes = listContent && listContent.length > 0
    ? listContent
    : [primaryContentType]

  return (
    <div className="flex flex-col">
      {/* 10 - Hero */}
      {heroBlock && <ModularBlockRenderer block={heroBlock} />}

      {/* 15 - Body */}
      {body && hasContent(body) && (
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <RichText document={body} />
          </div>
        </section>
      )}

      {/* 20 - Featured Content */}
      {shouldFeature && (
        <ContentListSection
          items={featuredContent.slice(0, featureCount)}
          typeName={primaryContentType}
          heading={`Featured ${typeLabels[primaryContentType]?.toLowerCase() ?? "content"}`}
        />
      )}

      {/* 25 - CTA */}
      {ctaBlock && <ModularBlockRenderer block={ctaBlock} />}

      {/* 30 - List All Associated Content */}
      {shouldListAll &&
        contentTypes.map((typeName) => {
          const items = allContent.filter(
            (item) => item._contentType === typeName,
          )
          if (items.length === 0) return null
          return (
            <ContentListSection
              key={typeName}
              items={items}
              typeName={typeName}
              heading={typeLabels[typeName] ?? typeName}
            />
          )
        })}

      {/* 32 - MidRoll */}
      {midRollBlock && <ModularBlockRenderer block={midRollBlock} />}

      {/* 35 - FeatureList */}
      {featureListBlock && <ModularBlockRenderer block={featureListBlock} />}

      {/* 40 - Steps */}
      {stepsBlock && <ModularBlockRenderer block={stepsBlock} />}

      {/* 50 - Quote */}
      {quoteBlock && <ModularBlockRenderer block={quoteBlock} />}

      {/* 60 - Gallery */}
      {galleryBlock && <ModularBlockRenderer block={galleryBlock} />}

      {/* 70 - FAQ (modular block intro + actual FAQ items) */}
      {faqBlock && <ModularBlockRenderer block={faqBlock} />}
      {faqItems.length > 0 && (
        <ContentListSection
          items={faqItems.map((f: any) => ({ ...f, _contentType: "FAQ Item" }))}
          typeName="FAQ Item"
        />
      )}
    </div>
  )
}

// Helper: check if a rich text Document actually has content
function hasContent(doc: Document | undefined | null): boolean {
  if (!doc || !doc.content) return false
  return doc.content.some(
    (node) =>
      node.nodeType !== "paragraph" ||
      (node.content &&
        node.content.some(
          (c: any) => c.value && c.value.trim().length > 0,
        )),
  )
}
