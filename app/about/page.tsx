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
  const [page, globalSettings] = await Promise.all([
    getPageBySlug("about"),
    getGlobalSettings(),
  ])

  // Get the page body and modular blocks
  const body = page?.fields?.body as Document | undefined
  const allBlocks = page?._includedModularBlocks ?? []
  
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
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
