import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, MapPin, Quote as QuoteIcon } from "lucide-react"
import { contentfulImageUrl } from "@/lib/contentful"

// ============================================================
// Service Card
// ============================================================
export function ServiceCard({ item }: { item: any }) {
  const { title, slug, summary, keyPoints } = item.fields
  return (
    <Link
      href={`/services/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-card-foreground group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {summary}
        </p>
        {keyPoints && keyPoints.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {(keyPoints as string[]).slice(0, 3).map((point: string, i: number) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {point}
              </Badge>
            ))}
          </div>
        )}
        <div className="mt-4 flex items-center text-sm font-medium text-foreground">
          Learn more
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

// ============================================================
// Industry Card
// ============================================================
export function IndustryCard({ item }: { item: any }) {
  const { title, slug, intro } = item.fields
  return (
    <Link
      href={`/industry/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-lg"
    >
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-card-foreground group-hover:text-accent">
          {title}
        </h3>
        <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {intro}
        </p>
        <div className="mt-4 flex items-center text-sm font-medium text-foreground">
          Explore
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}

// ============================================================
// Project Card (editorial, calm -- no badges, no hover effects)
// ============================================================
export function ProjectCard({ item }: { item: any }) {
  const { title, slug, clientName, location, excerpt, projectType, gallery, heroImage } = item.fields

  // Resolve featured image: heroImage first, then first gallery asset
  let imageUrl: string | null = null
  if (heroImage) {
    imageUrl = contentfulImageUrl(heroImage, { w: 800, h: 600, q: 80, fm: "webp" })
  }
  if (!imageUrl && heroImage?.sys?.id && item._includes?.Asset) {
    const resolved = item._includes.Asset.find((a: any) => a.sys.id === heroImage.sys.id)
    if (resolved) imageUrl = contentfulImageUrl(resolved, { w: 800, h: 600, q: 80, fm: "webp" })
  }
  if (!imageUrl && gallery?.length > 0) {
    const first = gallery[0]
    imageUrl = contentfulImageUrl(first, { w: 800, h: 600, q: 80, fm: "webp" })
    if (!imageUrl && first?.sys?.id && item._includes?.Asset) {
      const resolved = item._includes.Asset.find((a: any) => a.sys.id === first.sys.id)
      if (resolved) imageUrl = contentfulImageUrl(resolved, { w: 800, h: 600, q: 80, fm: "webp" })
    }
  }

  const meta = [clientName, location, projectType].filter(Boolean)

  return (
    <Link
      href={`/projects/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card"
    >
      {imageUrl && (
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={title as string}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-card-foreground leading-tight text-balance">
          {title}
        </h3>
        {meta.length > 0 && (
          <p className="mt-2 text-sm text-muted-foreground">
            {meta.join(" \u2022 ")}
          </p>
        )}
        {excerpt && (
          <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        )}
      </div>
    </Link>
  )
}

// ============================================================
// FAQ Item Card (accordion-style)
// ============================================================
export function FAQItemCard({ item }: { item: any }) {
  const { question, answer } = item.fields
  return (
    <details className="group rounded-lg border border-border bg-card">
      <summary className="flex cursor-pointer items-center justify-between p-5">
        <h3 className="text-base font-semibold text-card-foreground pr-4">{question}</h3>
        <span className="flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="px-5 pb-5">
        <p className="text-sm text-muted-foreground leading-relaxed">{answer}</p>
      </div>
    </details>
  )
}

// ============================================================
// Testimonial Card
// ============================================================
export function TestimonialCard({ item }: { item: any }) {
  const { quote, sourceName, sourceRole, sourceCompany } = item.fields
  return (
    <Card>
      <CardContent className="p-6">
        <QuoteIcon className="h-6 w-6 text-accent opacity-40" />
        <blockquote className="mt-3 text-foreground leading-relaxed italic">
          {`"${quote}"`}
        </blockquote>
        <div className="mt-4 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{sourceName}</span>
          {sourceRole && `, ${sourceRole}`}
          {sourceCompany && ` at ${sourceCompany}`}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================================
// Dispatcher: Render a content item by its type
// ============================================================
const cardRenderers: Record<string, React.ComponentType<{ item: any }>> = {
  Service: ServiceCard,
  Industry: IndustryCard,
  Project: ProjectCard,
  "FAQ Item": FAQItemCard,
  Testimonial: TestimonialCard,
}

export function ContentCard({ item, typeName }: { item: any; typeName: string }) {
  const Renderer = cardRenderers[typeName]
  if (!Renderer) return null
  return <Renderer item={item} />
}

// ============================================================
// Content List Section (renders grid of cards)
// ============================================================
export function ContentListSection({
  items,
  typeName,
  heading,
}: {
  items: any[]
  typeName: string
  heading?: string
}) {
  if (!items || items.length === 0) return null

  // FAQ items render as a stack, not a grid
  const isFaq = typeName === "FAQ Item"
  const isTestimonial = typeName === "Testimonial"

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {heading && (
          <h2 className="mb-10 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {heading}
          </h2>
        )}
        {isFaq ? (
          <div className="mx-auto max-w-3xl space-y-3">
            {items.map((item, i) => (
              <ContentCard key={item.sys?.id ?? i} item={item} typeName={typeName} />
            ))}
          </div>
        ) : isTestimonial ? (
          <div className="grid gap-6 md:grid-cols-2">
            {items.map((item, i) => (
              <ContentCard key={item.sys?.id ?? i} item={item} typeName={typeName} />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item, i) => (
              <ContentCard key={item.sys?.id ?? i} item={item} typeName={typeName} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
