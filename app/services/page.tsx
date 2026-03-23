import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { getServices, getModularBlockByName, contentfulImageUrl } from "@/lib/contentful"
import { RichText } from "@/components/rich-text"
import { SectionContainer } from "@/components/sections/SectionContainer"
import { ANIMATIONS } from "@/lib/animations"
import type { Document } from "@contentful/rich-text-types"

export async function generateMetadata(): Promise<Metadata> {
  const heroBlock = await getModularBlockByName("Services Page Hero")
  
  return {
    title: heroBlock?.fields?.headline
      ? `${heroBlock.fields.headline} | Full Set Productions`
      : "Services | Full Set Productions",
    description:
      (heroBlock?.fields?.trimmed as string) ??
      "Escape room design and build, theatre and festival sets, props and scenic fabrication.",
  }
}

export default async function ServicesPage() {
  const [heroBlock, ctaBlock, services] = await Promise.all([
    getModularBlockByName("Services Page Hero"),
    getModularBlockByName("Services CTA"),
    getServices(),
  ])

  // Group services by category (category is an array, e.g. ["Design & Build"])
  const hasCategory = (service: any, categoryName: string) => {
    const cats = service.fields.category
    return Array.isArray(cats) && cats.some((c: string) => c === categoryName)
  }

  const designBuild = services.filter((s) => hasCategory(s, "Design & Build"))
  const specialist = services.filter((s) => hasCategory(s, "Specialist Contexts"))
  const support = services.filter((s) => hasCategory(s, "Support & Ongoing Services"))
  const temporary = services.filter((s) => hasCategory(s, "Temporary & Touring"))

  // Sort alphabetically by title
  const sortByTitle = (a: any, b: any) =>
    (a.fields.title as string).localeCompare(b.fields.title as string)
  designBuild.sort(sortByTitle)
  specialist.sort(sortByTitle)
  support.sort(sortByTitle)
  temporary.sort(sortByTitle)

  const categories = [
    { key: "design-build", title: "Design & Build", items: designBuild, bgColor: "bg-primary text-primary-foreground" },
    { key: "specialist", title: "Specialist Contexts", items: specialist, bgColor: "bg-secondary" },
    { key: "support", title: "Support & Ongoing Services", items: support, bgColor: "bg-accent text-accent-foreground" },
    { key: "temporary", title: "Temporary & Touring", items: temporary, bgColor: "bg-muted" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* ============================================ */}
      {/* Hero / Intro                                */}
      {/* ============================================ */}
      {heroBlock && (
        <SectionContainer bg="secondary" spacing="lg" align="center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
              {heroBlock.fields.headline as string}
            </h1>
            {heroBlock.fields.body && (
              <div className="prose prose-lg mx-auto mt-6 text-muted-foreground">
                <RichText document={heroBlock.fields.body as Document} />
              </div>
            )}
          </div>
        </SectionContainer>
      )}

      {/* ============================================ */}
      {/* Services grouped by category                */}
      {/* ============================================ */}
      {categories.map((category) =>
        category.items.length > 0 ? (
          <SectionContainer
            key={category.key}
            spacing="lg"
          >
            <h2 className="mb-12 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {category.title}
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((service) => {
                  const {
                    title,
                    slug,
                    cardLayoutHeading,
                    cardLayoutDescription,
                    featuredImage,
                  } = service.fields

                  // Resolve featured image
                  let imageUrl: string | null = null
                  if (featuredImage) {
                    imageUrl = contentfulImageUrl(featuredImage, {
                      w: 800,
                      h: 600,
                      q: 80,
                      fm: "webp",
                    })
                  }
                  if (!imageUrl && featuredImage?.sys?.id && (service as any)._includes?.Asset) {
                    const resolved = (service as any)._includes.Asset.find(
                      (a: any) => a.sys.id === (featuredImage as any).sys.id,
                    )
                    if (resolved)
                      imageUrl = contentfulImageUrl(resolved, {
                        w: 800,
                        h: 600,
                        q: 80,
                        fm: "webp",
                      })
                  }

                  const displayHeading = (cardLayoutHeading || title) as string
                  const displayDescription = (cardLayoutDescription || "") as string

                  return (
                    <Link
                      key={service.sys.id}
                      href={`/services/${slug}`}
                      className="group relative flex flex-col overflow-hidden rounded-lg border border-border"
                    >
                      {imageUrl ? (
                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={displayHeading}
                            fill
                            className={`object-cover ${ANIMATIONS.scaleHover}`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          
                          {/* Subtle textured overlay for visual interest */}
                          <div 
                            className="absolute inset-0 opacity-5 pointer-events-none"
                            style={{
                              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.1) 2px, rgba(0,0,0,.1) 4px)',
                            }}
                          />
                          
                          {/* Category color gradient overlay for consistent branding */}
                          <div className={`absolute inset-0 ${category.bgColor} opacity-30`} />
                          
                          {/* Diagonal gradient for text contrast and visual depth */}
                          <div 
                            className="absolute inset-0"
                            style={{
                              background: 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
                            }}
                          />
                          
                          {/* Content layer */}
                          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                            <h3 className="text-xl font-semibold leading-tight text-balance">
                              {displayHeading}
                            </h3>
                            {displayDescription && (
                              <p className="mt-2 text-sm text-white/90 leading-relaxed line-clamp-2">
                                {displayDescription}
                              </p>
                            )}
                            <div className="mt-3 flex items-center text-sm font-medium text-white/90">
                              Learn more
                              <ArrowRight className={`ml-1 h-4 w-4 ${ANIMATIONS.arrowHover}`} />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div 
                          className={`relative aspect-[4/3] flex flex-col justify-end p-6 ${category.bgColor} overflow-hidden`}
                          style={{
                            backgroundImage: imageUrl ? `url('${imageUrl}')` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'local',
                          }}
                        >
                          {/* Subtle textured overlay for depth */}
                          <div 
                            className="absolute inset-0 opacity-10"
                            style={{
                              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,.05) 2px, rgba(0,0,0,.05) 4px)',
                            }}
                          />
                          
                          {/* Diagonal gradient overlay for visual interest and text contrast */}
                          <div 
                            className={`absolute inset-0 ${category.bgColor} opacity-75`}
                            style={{
                              background: `linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)`,
                            }}
                          />

                          {/* Content layer */}
                          <div className="relative z-10">
                            <h3 className="text-xl font-semibold leading-tight text-balance">
                              {displayHeading}
                            </h3>
                            {displayDescription && (
                              <p className="mt-2 text-sm opacity-90 leading-relaxed line-clamp-2">
                                {displayDescription}
                              </p>
                            )}
                            <div className="mt-3 flex items-center text-sm font-medium">
                              Learn more
                              <ArrowRight className={`ml-1 h-4 w-4 ${ANIMATIONS.arrowHover}`} />
                            </div>
                          </div>
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </SectionContainer>
          ) : null,
      )}

      {/* ============================================ */}
      {/* CTA banner                                  */}
      {/* ============================================ */}
      {ctaBlock && (
        <SectionContainer as="section" bg="primary" spacing="lg" align="center">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
              {ctaBlock.fields.headline as string}
            </h2>
            {ctaBlock.fields.body && (
              <div className="prose prose-lg mx-auto mt-4 text-primary-foreground">
                <RichText document={ctaBlock.fields.body as Document} />
              </div>
            )}
            <div className="mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-background px-8 py-3 text-base font-semibold text-foreground transition-colors hover:bg-background/90"
              >
                Contact us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </SectionContainer>
      )}
    </div>
  )
}
