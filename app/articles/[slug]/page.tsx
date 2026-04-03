import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Calendar, User } from "lucide-react"
import { LogoArrow, CornerBracket } from "@/components/brand-shapes"
import {
  getArticleBySlug,
  getPublishedArticles,
  getModularBlockByName,
  contentfulImageUrl,
} from "@/lib/contentful"
import { RichText } from "@/components/rich-text"
import type { Document } from "@contentful/rich-text-types"

interface PageProps {
  params: Promise<{ slug: string }>
}

// ============================================================
// Static params -- pre-render all article pages at build time
// ============================================================
export async function generateStaticParams() {
  try {
    const articles = await getPublishedArticles()
    return articles
      .filter((a: any) => !!a.fields.slug)
      .map((a: any) => ({ slug: a.fields.slug as string }))
  } catch {
    return []
  }
}

// ============================================================
// Metadata
// ============================================================
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const article = await getArticleBySlug(slug).catch(() => null)

    if (!article) {
      return { title: "Article | Full Set Productions" }
    }

    const featuredImageUrl = article.fields.headerImage
      ? contentfulImageUrl(article.fields.headerImage, { w: 1200, h: 630, q: 80, fm: "webp" })
      : null

    return {
      title: `${(article.fields.metaTitle as string) ?? (article.fields.title as string)} | Full Set Productions`,
      description:
        (article.fields.metaDescription as string) ??
        (article.fields.excerpt as string) ??
        "",
      openGraph: {
        title: `${article.fields.title as string} | Full Set Productions`,
        description: (article.fields.excerpt as string) ?? "",
        type: "article",
        publishedTime: article.fields.publishDate as string,
        ...(featuredImageUrl && {
          images: [{ url: featuredImageUrl, width: 1200, height: 630 }],
        }),
      },
    }
  } catch {
    return { title: "Article | Full Set Productions" }
  }
}

// ============================================================
// Related Article Card
// ============================================================
function RelatedArticleCard({ article }: { article: any }) {
  const { title, slug, excerpt, publishDate, featuredImage } = article.fields

  let imageUrl: string | null = null
  if (featuredImage) {
    imageUrl = contentfulImageUrl(featuredImage, { w: 400, h: 300, q: 80, fm: "webp" })
  }

  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null

  return (
    <Link
      href={`/articles/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      {imageUrl && (
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={title as string}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        {formattedDate && (
          <time className="text-xs text-muted-foreground" dateTime={publishDate}>
            {formattedDate}
          </time>
        )}
        <h4 className="mt-1 font-semibold text-card-foreground leading-tight line-clamp-2 group-hover:text-accent transition-colors">
          {title}
        </h4>
      </div>
    </Link>
  )
}

// ============================================================
// Page Component
// ============================================================
export default async function ArticleDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [article, allArticles, articlesCta] = await Promise.all([
    getArticleBySlug(slug),
    getPublishedArticles(),
    getModularBlockByName("Articles CTA"),
  ])

  if (!article) {
    notFound()
  }

  // Verify article is published (has publishDate in the past)
  const publishDate = article.fields.publishDate as string | undefined
  if (publishDate && new Date(publishDate) > new Date()) {
    notFound()
  }

  // Resolve featured image
  let featuredImageUrl: string | null = null
  if (article.fields.headerImage) {
    featuredImageUrl = contentfulImageUrl(article.fields.headerImage, {
      w: 1600,
      q: 80,
      fm: "webp",
    })
  }

  // Format publish date
  const formattedDate = publishDate
    ? new Date(publishDate).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null

  // Get author details
  const author = article.fields.author
  const authorName = author?.fields?.name as string | undefined
  const authorRole = author?.fields?.role as string | undefined
  let authorHeadshotUrl: string | null = null
  if (author?.fields?.headshot) {
    authorHeadshotUrl = contentfulImageUrl(author.fields.headshot, {
      w: 80,
      h: 80,
      q: 80,
      fm: "webp",
    })
  }

  // Prev / next navigation
  const currentIndex = allArticles.findIndex(
    (a: any) => (a.fields.slug as string) === slug,
  )
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null
  const nextArticle =
    currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null

  // Related articles (from CMS or fallback to other recent articles)
  const relatedArticles =
    (article.fields.relatedArticles as any[])?.slice(0, 3) ??
    allArticles.filter((a: any) => a.fields.slug !== slug).slice(0, 3)

  return (
    <div className="flex flex-col">
      {/* ============================================ */}
      {/* Hero -- Featured image background           */}
      {/* ============================================ */}
      <section className="relative min-h-[50vh] flex items-end lg:min-h-[60vh]">
        {featuredImageUrl ? (
          <Image
            src={featuredImageUrl}
            alt={article.fields.title as string}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 w-full pb-12 pt-32 lg:pb-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/articles"
              className="mb-6 inline-flex items-center text-sm text-white/70 hover:text-white transition-colors"
            >
              <LogoArrow direction="left" size={14} className="mr-2" />
              All articles
            </Link>

            {/* Category */}
            {article.fields.category && (
              <span className="mb-4 inline-block rounded-full bg-accent/90 px-4 py-1.5 text-sm font-medium text-accent-foreground">
                {article.fields.category as string}
              </span>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl text-balance">
              {article.fields.title as string}
            </h1>

            {/* Meta: date and author */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/70">
              {formattedDate && (
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={publishDate}>{formattedDate}</time>
                </span>
              )}
              {authorName && (
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {authorName}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Excerpt -- lead paragraph                   */}
      {/* ============================================ */}
      {article.fields.excerpt && (
        <section className="bg-secondary py-10 lg:py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <p className="text-xl text-muted-foreground leading-relaxed lg:text-2xl lg:leading-relaxed font-light text-balance">
              {article.fields.excerpt as string}
            </p>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Visual Sections (visualSection1Text-5Text)  */}
      {/* ============================================ */}
      {(() => {
        // Collect all visual sections that have content
        const sectionFields = ['visualSection1Text', 'visualSection2Text', 'visualSection3Text', 'visualSection4Text', 'visualSection5Text']
        const activeSections = sectionFields
          .map((fieldName) => article.fields[fieldName] as Document | undefined)
          .filter((doc): doc is Document => !!doc && !!doc.content && doc.content.length > 0)
        
        // If only one section, render without striping
        if (activeSections.length === 1) {
          return (
            <section className="bg-background py-12 lg:py-20">
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <article className="prose prose-lg max-w-none">
                  <RichText document={activeSections[0]} />
                </article>
              </div>
            </section>
          )
        }
        
        // Multiple sections: render with alternating backgrounds
        return activeSections.map((doc, index) => {
          const isEven = index % 2 === 0
          const bgColor = isEven ? 'bg-background' : 'bg-secondary'

          return (
            <section
              key={index}
              className={`${bgColor} py-14 lg:py-20`}
            >
              <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                <article className="prose prose-lg max-w-none">
                  <RichText document={doc} />
                </article>
              </div>
            </section>
          )
        })
      })()}

      {/* ============================================ */}
      {/* Author Bio                                  */}
      {/* ============================================ */}
      {author?.fields && (
        <section className="border-t border-border bg-secondary py-10 lg:py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-start gap-5">
              {authorHeadshotUrl && (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                  <Image
                    src={authorHeadshotUrl}
                    alt={authorName ?? "Author"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Written by</p>
                <p className="mt-1 font-semibold text-foreground">{authorName}</p>
                {authorRole && (
                  <p className="text-sm text-muted-foreground">{authorRole}</p>
                )}
                {author.fields.bio && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {author.fields.bio as string}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Related Articles                            */}
      {/* ============================================ */}
      {relatedArticles.length > 0 && (
        <section className="bg-background py-14 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8">
              Related Articles
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related: any) => (
                <RelatedArticleCard key={related.sys?.id ?? related.fields.slug} article={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Prev / Next navigation                      */}
      {/* ============================================ */}
      {(prevArticle || nextArticle) && (
        <section className="border-t border-border bg-background py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {prevArticle ? (
                <Link
                  href={`/articles/${prevArticle.fields.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <LogoArrow direction="left" size={20} color="var(--color-grey)" className="shrink-0 group-hover:[color:var(--color-off-black)] transition-colors" />
                  <div>
                    <p className="text-sm text-muted-foreground">Previous article</p>
                    <p className="mt-1 font-semibold text-card-foreground group-hover:text-accent line-clamp-1">
                      {prevArticle.fields.title as string}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextArticle ? (
                <Link
                  href={`/articles/${nextArticle.fields.slug}`}
                  className="group flex items-center justify-end gap-4 rounded-lg border border-border bg-card p-6 text-right transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Next article</p>
                    <p className="mt-1 font-semibold text-card-foreground group-hover:text-accent line-clamp-1">
                      {nextArticle.fields.title as string}
                    </p>
                  </div>
                  <LogoArrow size={20} color="var(--color-grey)" className="shrink-0 group-hover:[color:var(--color-off-black)] transition-colors" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* CTA Section                                 */}
      {/* ============================================ */}
      {articlesCta && (
        // ISS-25: L-pieces removed — bg-primary is a coloured background. L-pieces must only appear on white/light backgrounds.
        <section className="relative bg-primary py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl text-balance">
                {articlesCta.fields.headline as string}
              </h2>
              {articlesCta.fields.body && (
                <div className="mt-4 text-primary-foreground">
                  <RichText
                    document={articlesCta.fields.body as Document}
                    className="[&_p]:text-primary-foreground"
                  />
                </div>
              )}
              <div className="mt-8">
                <Link
                  href="/contact"
                  className="inline-flex items-center rounded-md bg-background px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-background/90"
                >
                  Get in touch
                  <LogoArrow size={18} className="ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
