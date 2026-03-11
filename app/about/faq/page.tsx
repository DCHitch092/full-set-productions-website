import type { Metadata } from "next"
import { getPageBySlug, getContentByType } from "@/lib/contentful"
import { ContentListPage } from "@/components/content-list-page"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("faq")
  return {
    title: (page?.fields?.metaTitle as string) ?? "FAQ | Full Set Productions",
    description:
      (page?.fields?.metaDescription as string) ??
      "Frequently asked questions about our escape room design, theatre set builds, and scenic fabrication services.",
  }
}

export default async function FAQPage() {
  const page = await getPageBySlug("faq")

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <h1 className="text-2xl font-bold text-foreground">FAQ</h1>
        <p className="mt-4 text-muted-foreground">
          This page is being set up. Please check back soon.
        </p>
      </div>
    )
  }

  const listContentTypes = (page.fields.listContent as string[]) ?? ["FAQ Item"]
  const featureCount = (page.fields.featureAssociatedContent as number) ?? 0

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
      primaryContentType="FAQ Item"
    />
  )
}
