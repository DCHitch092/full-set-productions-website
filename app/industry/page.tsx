import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getPageBySlug, getIndustries, contentfulImageUrl } from "@/lib/contentful"
import { RichText } from "@/components/rich-text"
import type { Document } from "@contentful/rich-text-types"

// ============================================================
// Metadata
// ============================================================
export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("industry")
  return {
    title:
      (page?.fields?.metaTitle as string) ??
      "Industries | Full Set Productions",
    description:
      (page?.fields?.metaDescription as string) ??
      "Discover the industries we work with -- from escape rooms and museums to theatre, live events, and visitor attractions.",
  }
}

// ============================================================
// Page Component
// ============================================================
export default async function IndustryIndexPage() {
  const [page, industries] = await Promise.all([
    getPageBySlug("industry"),
    getIndustries(),
  ])

  // Sort alphabetically by title
  const sorted = [...industries].sort((a, b) =>
    (a.fields.title as string).localeCompare(b.fields.title as string),
  )

  return (
    <div className="flex flex-col">
      {/* ============================================ */}
      {/* Page header                                   */}
      {/* ============================================ */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              {(page?.fields?.title as string) ?? "Industries"}
            </h1>

            {page?.fields?.body && (
              <div className="mt-6">
                <RichText
                  document={page.fields.body as Document}
                  className="text-lg text-muted-foreground leading-relaxed [&_p]:text-muted-foreground [&_p]:text-lg [&_p]:leading-relaxed"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Industry cards                                */}
      {/* ============================================ */}
      <section className="bg-background py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {sorted.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((industry, i) => {
                const { slug, title, cardDisplayTitle, cardDisplayBody, intro, featuredImage } = industry.fields
                
                // Resolve featured image with optimization
                let imageUrl: string | null = null
                if (featuredImage) {
                  imageUrl = contentfulImageUrl(featuredImage, { w: 800, h: 600, q: 80, fm: "webp" })
                }
                if (!imageUrl && featuredImage?.sys?.id && (industry as any)._includes?.Asset) {
                  const resolved = (industry as any)._includes.Asset.find((a: any) => a.sys.id === (featuredImage as any).sys.id)
                  if (resolved) imageUrl = contentfulImageUrl(resolved, { w: 800, h: 600, q: 80, fm: "webp" })
                }

                // Fallback color palette (cycle through theme colors)
                const bgColors = [
                  "bg-secondary",
                  "bg-primary text-primary-foreground",
                  "bg-accent text-accent-foreground",
                  "bg-muted",
                ]
                const bgColor = bgColors[i % bgColors.length]

                const displayTitle = (cardDisplayTitle || title) as string
                const displayBody = (cardDisplayBody || intro) as string

                return (
                  <Link
                    key={industry.sys?.id ?? i}
                    href={`/industry/${slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-lg border border-border transition-shadow hover:shadow-lg"
                  >
                    {imageUrl ? (
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <Image
                          src={imageUrl || "/placeholder.svg"}
                          alt={displayTitle}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                          <h3 className="text-xl font-semibold leading-tight text-balance">
                            {displayTitle}
                          </h3>
                          {displayBody && (
                            <p className="mt-2 text-sm text-white/90 leading-relaxed line-clamp-2">
                              {displayBody}
                            </p>
                          )}
                          <div className="mt-3 flex items-center text-sm font-medium text-white/90">
                            Explore
                            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className={`relative aspect-[4/3] flex flex-col justify-end p-6 ${bgColor}`}>
                        <h3 className="text-xl font-semibold leading-tight text-balance">
                          {displayTitle}
                        </h3>
                        {displayBody && (
                          <p className="mt-2 text-sm opacity-90 leading-relaxed line-clamp-2">
                            {displayBody}
                          </p>
                        )}
                        <div className="mt-3 flex items-center text-sm font-medium">
                          Explore
                          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
          ) : (
            <div className="py-16 text-center">
              <p className="text-muted-foreground">
                Industry pages are being prepared. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
