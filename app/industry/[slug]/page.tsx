import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  getIndustryBySlug,
  getIndustries,
  getModularBlockByName,
} from "@/lib/contentful"
import { RichText } from "@/components/rich-text"
import type { Document } from "@contentful/rich-text-types"

interface PageProps {
  params: Promise<{ slug: string }>
}

// Only render slugs that exist at build time — no on-demand fallback
export const dynamicParams = false

// ============================================================
// Static params -- pre-render all industry pages at build time
// ============================================================
export async function generateStaticParams() {
  try {
    const industries = await getIndustries()
    return industries
      .filter((ind) => !!ind.fields.slug)
      .map((ind) => ({ slug: ind.fields.slug as string }))
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
    const industry = await getIndustryBySlug(slug).catch(() => null)

    if (!industry) {
      return { title: "Industry | Full Set Productions" }
    }

    return {
      title: `${(industry.fields.metaTitle as string) ?? (industry.fields.title as string) ?? "Industry"} | Full Set Productions`,
      description:
        (industry.fields.metaDescription as string) ??
        (industry.fields.intro as string) ??
        "",
    }
  } catch {
    return { title: "Industry | Full Set Productions" }
  }
}

// ============================================================
// Page Component
// ============================================================
export default async function IndustryDetailPage({ params }: PageProps) {
  const { slug } = await params

  const [industry, allIndustries, industryCta] = await Promise.all([
    getIndustryBySlug(slug).catch(() => null),
    getIndustries().catch(() => []),
    getModularBlockByName("Industries CTA").catch(() => null),
  ])

  if (!industry) {
    notFound()
  }

  // Resolve related services
  const relatedServiceRefs = Array.isArray(industry.fields?.relatedServices)
    ? (industry.fields.relatedServices as any[])
    : []
  const resolvedServices = relatedServiceRefs
    .map((ref: any) => {
      if (ref?.fields) return ref
      return (industry as any)._includes?.Entry?.find((e: any) => e.sys.id === ref?.sys?.id) ?? null
    })
    .filter(Boolean)

  // Prev / next navigation (sorted alphabetically to match index)
  const sorted = [...allIndustries].sort((a, b) =>
    (a.fields.title as string).localeCompare(b.fields.title as string),
  )
  const currentIndex = sorted.findIndex(
    (ind) => (ind.fields.slug as string) === slug,
  )
  const prevIndustry = currentIndex > 0 ? sorted[currentIndex - 1] : null
  const nextIndustry =
    currentIndex < sorted.length - 1 ? sorted[currentIndex + 1] : null

  return (
    <div className="flex flex-col">
      {/* ============================================ */}
      {/* Page header                                   */}
      {/* ============================================ */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Link
              href="/industry"
              className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              All industries
            </Link>

            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl text-balance">
              {industry.fields.title as string}
            </h1>

            {industry.fields.intro && (
              <p className="mt-6 text-xl text-muted-foreground leading-relaxed lg:text-2xl lg:leading-relaxed font-light">
                {industry.fields.intro as string}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Body                                          */}
      {/* ============================================ */}
      {industry.fields.body && (
        <section className="bg-background py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <RichText document={industry.fields.body as Document} />
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Related Services                              */}
      {/* ============================================ */}
      {resolvedServices.length > 0 && (
        <section className="relative bg-secondary py-16 lg:py-20">
          <div
            className="absolute inset-x-0 -top-6 h-6 bg-secondary"
            style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
          />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
                How we help
              </h2>
              <div className="mt-8 flex flex-col gap-0">
                {resolvedServices.map((svc: any) => (
                  <Link
                    key={svc.sys?.id ?? svc.fields.title}
                    href={`/services/${svc.fields.slug}`}
                    className="group flex items-center justify-between gap-4 border-b border-border py-5 first:border-t transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors">
                        {svc.fields.title as string}
                      </h3>
                      {svc.fields.summary && (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                          {svc.fields.summary as string}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* CTA (from Contentful modular block)           */}
      {/* ============================================ */}
      {industryCta && (
        <section className="relative bg-primary py-16 lg:py-20">
          <div
            className="absolute inset-x-0 -top-5 h-5 bg-primary"
            style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
          />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              {industryCta.fields.body && (
                <div className="mb-6">
                  <RichText
                    document={industryCta.fields.body as Document}
                    className="text-lg text-primary-foreground/80 [&_p]:text-primary-foreground/80"
                  />
                </div>
              )}
              <Link
                href="/contact"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent px-8 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-colors"
              >
                {(industryCta.fields.headline as string) || "Get in touch"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Prev / Next navigation                        */}
      {/* ============================================ */}
      {(prevIndustry || nextIndustry) && (
        <section className="border-t border-border bg-background py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {prevIndustry ? (
                <Link
                  href={`/industry/${prevIndustry.fields.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <ArrowLeft className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Previous</p>
                    <p className="mt-1 font-semibold text-card-foreground group-hover:text-accent">
                      {prevIndustry.fields.title as string}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextIndustry ? (
                <Link
                  href={`/industry/${nextIndustry.fields.slug}`}
                  className="group flex items-center justify-end gap-4 rounded-lg border border-border bg-card p-6 text-right transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Next</p>
                    <p className="mt-1 font-semibold text-card-foreground group-hover:text-accent">
                      {nextIndustry.fields.title as string}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-foreground" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
