import type { Metadata } from "next"
import { getPageBySlug, getGlobalSettings } from "@/lib/contentful"
import { ModularBlockRenderer } from "@/components/modular-blocks"
import { RichText } from "@/components/rich-text"
import type { Document } from "@contentful/rich-text-types"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("about")
  return {
    title:
      (page?.fields?.metaTitle as string) ??
      "About Us | Full Set Productions",
    description:
      (page?.fields?.metaDescription as string) ??
      "Meet the team behind Full Set Productions. Edinburgh-based craftspeople who understand entertainment and build experiences that last.",
  }
}

export default async function AboutPage() {
  // Test: Compare delivery vs preview API
  const [page, pagePreview, globalSettings] = await Promise.all([
    getPageBySlug("about", false), // Delivery API
    getPageBySlug("about", true),  // Preview API
    getGlobalSettings(),
  ])
  
  // Debug: compare delivery vs preview
  const deliveryBlocks = page?._includedModularBlocks ?? []
  const previewBlocks = pagePreview?._includedModularBlocks ?? []
  const deliveryTeam = deliveryBlocks.find((b: any) => b.fields?.internalName === "About Team")
  const previewTeam = previewBlocks.find((b: any) => b.fields?.internalName === "About Team")
  console.log("[v0] DELIVERY API - About Team includedCards:", deliveryTeam?.fields?.includedCards?.length ?? 0)
  console.log("[v0] PREVIEW API - About Team includedCards:", previewTeam?.fields?.includedCards?.length ?? 0)

  // Get the page body and modular blocks
  const body = page?.fields?.body as Document | undefined
  const allBlocks = page?._includedModularBlocks ?? []
  
  // Debug: log modular blocks and their includedCards
  console.log("[v0] About page modular blocks count:", allBlocks.length)
  allBlocks.forEach((block: any) => {
    console.log("[v0] Block:", block.fields?.internalName, "- sectionType:", block.fields?.sectionType)
    if (block.fields?.includedCards) {
      console.log("[v0]   includedCards count:", block.fields.includedCards.length)
      block.fields.includedCards.forEach((card: any, idx: number) => {
        console.log("[v0]     Card", idx + 1, ":", card.fields?.name || "NO NAME", "- has fields:", !!card.fields)
      })
    }
  })
  
  // Separate hero from other modular blocks
  const heroBlock = allBlocks.find((b: any) => b.fields?.sectionType === "Hero")
  const otherBlocks = allBlocks.filter((b: any) => b.fields?.sectionType !== "Hero")

  return (
    <div className="flex flex-col">
      {/* Hero modular block (if attached to the Page) */}
      {heroBlock && <ModularBlockRenderer block={heroBlock} />}

      {/* Page body content (appears after hero) */}
      {body && (
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <RichText document={body} />
          </div>
        </section>
      )}

      {/* Other modular blocks from the CMS */}
      {otherBlocks.length > 0 ? (
        otherBlocks.map((block: any) => (
          <ModularBlockRenderer key={block.sys.id} block={block} />
        ))
      ) : !body && !heroBlock ? (
        <section className="py-20 lg:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-center text-muted-foreground">
              About page content is being prepared. Please check back soon.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  )
}
