import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPageBySlug, getContentByType } from "@/lib/contentful"
import { ModularBlockRenderer } from "@/components/modular-blocks"
import { RichText } from "@/components/rich-text"
import { ContentListPage } from "@/components/content-list-page"
import type { Document } from "@contentful/rich-text-types"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  
  if (!page) {
    return {
      title: "Page Not Found | Full Set Productions",
    }
  }

  return {
    title: (page.fields?.metaTitle as string) ?? `${page.fields?.title || slug} | Full Set Productions`,
    description: (page.fields?.metaDescription as string) ?? undefined,
  }
}

export default async function AboutChildPage({ params }: PageProps) {
  const { slug } = await params
  const page = await getPageBySlug(slug)

  // Check if page exists and has 'about' as parent
  if (!page || (page.fields?.parent && page.fields.parent !== "about")) {
    notFound()
  }

  // Check if this is a list content page
  const listContentTypes = page.fields?.listContent as string[] | undefined
  if (listContentTypes && listContentTypes.length > 0) {
    const featureCount = (page.fields?.featureAssociatedContent as number) ?? 0

    const allContentArrays = await Promise.all(
      listContentTypes.map((typeName) => getContentByType(typeName as string)),
    )
    const allContent = allContentArrays.flat()
    const featuredContent = featureCount > 0 ? allContent.slice(0, featureCount) : []

    return (
      <ContentListPage
        page={page as any}
        featuredContent={featuredContent}
        allContent={allContent}
        primaryContentType={listContentTypes[0]}
      />
    )
  }

  // Standard page rendering
  const body = page.fields?.body as Document | undefined
  const allBlocks = page._includedModularBlocks ?? []
  
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
              Page content is being prepared. Please check back soon.
            </p>
          </div>
        </section>
      ) : null}
    </div>
  )
}
