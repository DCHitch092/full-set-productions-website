import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getPublishedArticles, getModularBlockByName, contentfulImageUrl } from "@/lib/contentful"
import { ModularBlockRenderer } from "@/components/modular-blocks"
import { RichText } from "@/components/rich-text"
import type { Document } from "@contentful/rich-text-types"

export async function generateMetadata(): Promise<Metadata> {
  const heroBlock = await getModularBlockByName("Articles Page Hero")
  
  return {
    title: heroBlock?.fields?.headline
      ? `${heroBlock.fields.headline} | Full Set Productions`
      : "Articles | Full Set Productions",
    description:
      (heroBlock?.fields?.trimmed as string) ??
      "Insights, news, and stories from Full Set Productions -- escape room design, immersive experiences, and scenic fabrication.",
  }
}

// ============================================================
// Article Card Component
// ============================================================
function ArticleCard({ article }: { article: any }) {
  const { title, slug, excerpt, publishDate, featuredImage, author, category } = article.fields

  // Resolve featured image
  let imageUrl: string | null = null
  if (featuredImage) {
    imageUrl = contentfulImageUrl(featuredImage, { w: 800, h: 600, q: 80, fm: "webp" })
  }

  // Format publish date
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  // Get author name
  const authorName = author?.fields?.name as string | undefined

  return (
    <Link
      href={`/articles/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      {/* Featured image */}
      {imageUrl && (
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={title as string}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* Category and date */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          {category && (
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {category}
            </span>
          )}
          {formattedDate && <time dateTime={publishDate}>{formattedDate}</time>}
        </div>

        {/* Title */}
        <h3 className="mt-3 text-xl font-semibold text-card-foreground leading-tight text-balance group-hover:text-accent transition-colors">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}

        {/* Author */}
        {authorName && (
          <p className="mt-4 text-sm text-muted-foreground">
            By <span className="font-medium text-foreground">{authorName}</span>
          </p>
        )}
      </div>
    </Link>
  )
}

// ============================================================
// Articles Index Page
// ============================================================
export default async function ArticlesPage() {
  const [heroBlock, ctaBlock, articles] = await Promise.all([
    getModularBlockByName("Articles Page Hero"),
    getModularBlockByName("Articles CTA"),
    getPublishedArticles(),
  ])

  return (
    <div className="flex flex-col">
      {/* ============================================ */}
      {/* Hero / Intro                                */}
      {/* ============================================ */}
      {heroBlock ? (
        <ModularBlockRenderer block={heroBlock} />
      ) : (
        <section className="bg-secondary py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              Articles
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Insights, news, and stories from Full Set Productions.
            </p>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Articles Grid                               */}
      {/* ============================================ */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article: any) => (
                <ArticleCard key={article.sys.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Articles are being added. Please check back soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ============================================ */}
      {/* CTA Section                                 */}
      {/* ============================================ */}
      {ctaBlock && (
        <ModularBlockRenderer block={ctaBlock} />
      )}
    </div>
  )
}
