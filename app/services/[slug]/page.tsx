import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { LogoArrow } from "@/components/brand-shapes"
import { Button } from "@/components/ui/button"
import { getServiceBySlug, getServices, contentfulImageUrl } from "@/lib/contentful"
import { RichText } from "@/components/rich-text"
import { KeyPointsList } from "@/components/key-points"
import { ProjectCard } from "@/components/content-cards"
import type { Document } from "@contentful/rich-text-types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface PageProps {
  params: Promise<{ slug: string }>
}

// ============================================================
// Static params -- pre-render all service pages at build time
// ============================================================
export async function generateStaticParams() {
  try {
    const services = await getServices()
    return services
      .filter((s) => !!s.fields.slug)
      .map((s) => ({ slug: s.fields.slug as string }))
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
    const service = await getServiceBySlug(slug).catch(() => null)

    if (!service) {
      return { title: "Service | Full Set Productions" }
    }

    const metaTitle =
      (service.fields.metaTitle as string) ?? `${service.fields.title as string} | Services`
    const metaDescription =
      (service.fields.metaDescription as string) ??
      ((service.fields.summary as string) ?? "").slice(0, 160)

    return {
      title: `${metaTitle} | Full Set Productions`,
      description: metaDescription,
      openGraph: {
        title: `${service.fields.title as string} | Full Set Productions`,
        description: metaDescription,
        type: "article",
      },
    }
  } catch {
    return { title: "Service | Full Set Productions" }
  }
}

// ============================================================
// Page Component
// ============================================================
export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) {
    notFound()
  }

  const {
    title,
    summary,
    body,
    keyPoints,
    featuredImage,
    gallery,
    relatedFaQs,
    relatedProjects,
  } = service.fields

  // Resolve featured image
  let featuredImageUrl: string | null = null
  if (featuredImage) {
    featuredImageUrl = contentfulImageUrl(featuredImage, { w: 1200, q: 85, fm: "webp" })
  }
  const svcAny = service as any
  if (!featuredImageUrl && featuredImage?.sys?.id && svcAny._includes?.Asset) {
    const resolved = svcAny._includes.Asset.find(
      (a: any) => a.sys.id === (featuredImage as any).sys.id,
    )
    if (resolved)
      featuredImageUrl = contentfulImageUrl(resolved, { w: 1200, q: 85, fm: "webp" })
  }

  // Resolve related FAQs
  const resolvedFaqs =
    relatedFaQs && svcAny._includes?.Entry
      ? relatedFaQs
          .map((ref: any) =>
            svcAny._includes.Entry.find((e: any) => e.sys?.id === ref.sys?.id),
          )
          .filter(Boolean)
      : []

  // Resolve related projects
  const resolvedProjects =
    relatedProjects && svcAny._includes?.Entry
      ? relatedProjects
          .map((ref: any) => {
            const resolved = svcAny._includes.Entry.find(
              (e: any) => e.sys?.id === ref.sys?.id,
            )
            return resolved
              ? { fields: resolved.fields, sys: resolved.sys, _includes: svcAny._includes }
              : null
          })
          .filter(Boolean)
      : []

  return (
    <div className="flex min-h-screen flex-col">
      {/* ============================================ */}
      {/* Service header                              */}
      {/* ============================================ */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
            {title}
          </h1>
          <p className="mt-6 text-xl text-muted-foreground leading-relaxed">{summary}</p>
        </div>
      </section>

      {/* ============================================ */}
      {/* Featured image                              */}
      {/* ============================================ */}
      {featuredImageUrl && (
        <section className="border-y border-border">
          <div className="relative aspect-[21/9] overflow-hidden bg-muted">
            <Image
              src={featuredImageUrl || "/placeholder.svg"}
              alt={title as string}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Key points / highlights                     */}
      {/* ============================================ */}
      {keyPoints && keyPoints.length > 0 && (
        <section className="border-b border-border bg-secondary py-12 lg:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground">
              Key capabilities
            </h2>
            <KeyPointsList points={keyPoints as string[]} columns={2} />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Main content                                */}
      {/* ============================================ */}
      {body && <RichText document={body as Document} sectionMode={true} />}

      {/* ============================================ */}
      {/* CTA                                         */}
      {/* ============================================ */}
      <section className="border-t border-border bg-primary py-16 text-primary-foreground lg:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-balance">
            Ready to discuss your project?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground">
            Get in touch to explore how we can bring your vision to life with our {(title as string ?? "").toLowerCase()} services.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">
                Contact us
                <LogoArrow size={18} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Related FAQs                                */}
      {/* ============================================ */}
      {resolvedFaqs.length > 0 && (
        <section className="bg-background py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
                Frequently asked questions
              </h2>
              <Accordion type="single" collapsible className="space-y-3">
                {resolvedFaqs.map((faq: any, i: number) => (
                  <AccordionItem
                    key={faq.sys?.id ?? i}
                    value={`faq-${i}`}
                    className="rounded-lg border border-border bg-card px-6"
                  >
                    <AccordionTrigger className="text-left font-semibold text-card-foreground hover:text-accent">
                      {faq.fields.question as string}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                      {faq.fields.answer as string}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Related projects                            */}
      {/* ============================================ */}
      {resolvedProjects.length > 0 && (
        <section className="bg-secondary py-16 lg:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground">
                Related projects
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {resolvedProjects.map((project: any) => (
                <ProjectCard key={project.sys.id} item={project} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
