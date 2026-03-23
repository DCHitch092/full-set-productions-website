import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Building2 } from "lucide-react"
import { LogoArrow, CornerBracket } from "@/components/brand-shapes"
import { Button } from "@/components/ui/button"
import {
  getProjectBySlug,
  getProjects,
  getModularBlockByName,
  contentfulImageUrl,
} from "@/lib/contentful"
import { getAssetUrl } from "@/lib/contentful-types"
import { RichText } from "@/components/rich-text"
import { KeyPointsList } from "@/components/key-points"
import type { Document } from "@contentful/rich-text-types"

interface PageProps {
  params: Promise<{ slug: string }>
}

// ============================================================
// Static params -- pre-render all project pages at build time
// ============================================================
export async function generateStaticParams() {
  try {
    const projects = await getProjects()
    return projects
      .filter((p) => !!p.fields.slug)
      .map((p) => ({ slug: p.fields.slug as string }))
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
    const project = await getProjectBySlug(slug).catch(() => null)

    if (!project) {
      return { title: "Project | Full Set Productions" }
    }

    return {
      title: `${(project.fields.metaTitle as string) ?? (project.fields.title as string)} | Full Set Productions`,
      description:
        (project.fields.metaDescription as string) ??
        (project.fields.excerpt as string) ??
        "",
      openGraph: {
        title: `${project.fields.title as string} | Full Set Productions`,
        description: (project.fields.excerpt as string) ?? "",
        type: "article",
      },
    }
  } catch {
    return { title: "Project | Full Set Productions" }
  }
}

// ============================================================
// Helper: resolve the featured image URL
// ============================================================
function resolveFeaturedImage(project: any): string | null {
  const { heroImage, gallery } = project.fields
  const includes = (project as any)._includes

  if (heroImage) {
    const direct = contentfulImageUrl(heroImage, { w: 1600, q: 80, fm: "webp" })
    if (direct) return direct
    if (heroImage.sys?.id && includes?.Asset) {
      const resolved = includes.Asset.find((a: any) => a.sys.id === heroImage.sys.id)
      if (resolved) return contentfulImageUrl(resolved, { w: 1600, q: 80, fm: "webp" })
    }
  }

  if (gallery?.length > 0) {
    const first = gallery[0]
    const direct = contentfulImageUrl(first, { w: 1600, q: 80, fm: "webp" })
    if (direct) return direct
    if (first.sys?.id && includes?.Asset) {
      const resolved = includes.Asset.find((a: any) => a.sys.id === first.sys.id)
      if (resolved) return contentfulImageUrl(resolved, { w: 1600, q: 80, fm: "webp" })
    }
  }

  return null
}

// ============================================================
// Page Component
// ============================================================
export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const [project, allProjects, projectsCta] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
    getModularBlockByName("Projects CTA"),
  ])

  if (!project) {
    notFound()
  }

  const featuredImage = resolveFeaturedImage(project)

  // Prev / next navigation
  const currentIndex = allProjects.findIndex(
    (p) => (p.fields.slug as string) === slug,
  )
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null
  const nextProject =
    currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null

  // Resolve gallery assets
  const gallery = (project.fields.gallery as any[]) ?? []
  const resolvedGallery = gallery
    .map((asset: any) => {
      const url = contentfulImageUrl(asset, { w: 900, q: 80, fm: "webp" })
      if (url) return { url, title: asset.fields?.title as string }
      if (asset.sys?.id && (project as any)._includes?.Asset) {
        const resolved = (project as any)._includes.Asset.find(
          (a: any) => a.sys.id === asset.sys.id,
        )
        if (resolved)
          return {
            url: contentfulImageUrl(resolved, { w: 900, q: 80, fm: "webp" }),
            title: (resolved.fields?.title as string) ?? "",
          }
      }
      return null
    })
    .filter((g): g is { url: string; title: string } => g !== null && g.url !== null)

  const highlights = (project.fields.highlights as string[]) ?? []
  const servicesProvided = (project.fields.servicesProvided as any[]) ?? []
  const resolvedServices = servicesProvided
    .map((ref: any) => {
      if (ref.fields) return ref
      return (project as any)._includes?.Entry?.find((e: any) => e.sys.id === ref.sys?.id) ?? null
    })
    .filter(Boolean)

  return (
    <div className="flex flex-col">
      {/* ============================================ */}
      {/* Hero -- Featured image background             */}
      {/* ============================================ */}
      <section className="relative min-h-[60vh] flex items-end lg:min-h-[70vh]">
        {featuredImage ? (
          <Image
            src={featuredImage || "/placeholder.svg"}
            alt={project.fields.title as string}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="relative z-10 w-full pb-12 pt-32 lg:pb-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <Link
              href="/projects"
              className="mb-6 inline-flex items-center text-sm text-white/70 hover:text-white transition-colors"
            >
              <LogoArrow direction="left" size={14} className="mr-2" />
              All projects
            </Link>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl text-balance">
              {project.fields.title as string}
            </h1>

            {(project.fields.clientName || project.fields.location || project.fields.projectType) && (
              <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
                {project.fields.clientName && (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4" />
                    {project.fields.clientName as string}
                  </span>
                )}
                {project.fields.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {project.fields.location as string}
                  </span>
                )}
                {project.fields.projectType && (
                  <span>{project.fields.projectType as string}</span>
                )}
              </div>
            )}

            {resolvedServices.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {resolvedServices.map((svc: any) => (
                  <Link
                    key={svc.sys?.id ?? svc.fields.title}
                    href={`/services/${svc.fields.slug}`}
                    className="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20 hover:text-white"
                  >
                    {svc.fields.title as string}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* Excerpt -- lead paragraph                     */}
      {/* ============================================ */}
      {project.fields.excerpt && (
        <section className="relative overflow-hidden bg-secondary py-12 lg:py-16">
          <CornerBracket corner="bottom-left" className="absolute bottom-0 left-0" />
          <CornerBracket corner="top-right" className="absolute top-0 right-0" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <p className="text-xl text-muted-foreground leading-relaxed lg:text-2xl lg:leading-relaxed font-light text-balance max-w-3xl">
              {project.fields.excerpt as string}
            </p>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Highlights strip                              */}
      {/* ============================================ */}
      {highlights.length > 0 && (
        <section className="border-y border-border bg-background py-8 lg:py-10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <KeyPointsList points={highlights} columns={4} />
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* The Brief -- angled top edge for dynamism     */}
      {/* ============================================ */}
      {project.fields.brief && (
        <section className="relative overflow-hidden bg-background py-16 lg:py-24">
          {/* Angled top separator */}
          <div
            className="absolute inset-x-0 -top-8 h-8 bg-background"
            style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
          />
          <CornerBracket corner="bottom-left" className="absolute bottom-0 left-0" />
          <CornerBracket corner="top-right" className="absolute top-0 right-0" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">The Brief</h2>
            <div className="mt-6 max-w-3xl">
              <RichText document={project.fields.brief as Document} />
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Our Solution -- dark primary bg section       */}
      {/* ============================================ */}
      {project.fields.solution && (
        <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
          {/* Angled top separator */}
          <div
            className="absolute inset-x-0 -top-6 h-6 bg-primary"
            style={{ clipPath: "polygon(0 0, 100% 100%, 0 100%)" }}
          />
          <CornerBracket corner="bottom-left" colorA="var(--color-yellow)" colorB="var(--color-teal)" className="absolute bottom-0 left-0" />
          <CornerBracket corner="top-right" colorA="var(--color-yellow)" colorB="var(--color-teal)" className="absolute top-0 right-0" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-primary-foreground sm:text-3xl">Our Solution</h2>
            <div className="mt-6 max-w-3xl">
              <RichText
                document={project.fields.solution as Document}
                className="text-primary-foreground [&_p]:text-primary-foreground [&_li]:text-primary-foreground [&_h3]:text-primary-foreground [&_h4]:text-primary-foreground [&_strong]:text-primary-foreground"
              />
            </div>
          </div>
          {/* Angled bottom separator */}
          <div
            className="absolute inset-x-0 -bottom-6 h-6 bg-primary"
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%)" }}
          />
        </section>
      )}

      {/* ============================================ */}
      {/* Gallery                                       */}
      {/* ============================================ */}
      {resolvedGallery.length > 0 && (
        <section className="bg-secondary py-16 lg:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-10 sm:text-3xl">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resolvedGallery.map((img, i) => (
                <div
                  key={i}
                  className={`relative overflow-hidden rounded-lg bg-muted ${
                    i === 0 && resolvedGallery.length > 2
                      ? "sm:col-span-2 aspect-[16/9]"
                      : "aspect-[4/3]"
                  }`}
                >
                  <Image
                    src={img.url || "/placeholder.svg"}
                    alt={img.title || `Project image ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes={
                      i === 0 && resolvedGallery.length > 2
                        ? "(max-width: 768px) 100vw, 80vw"
                        : "(max-width: 768px) 100vw, 50vw"
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Projects CTA (from Contentful modular block)  */}
      {/* ============================================ */}
      {projectsCta && (
        <section className="relative bg-primary py-16 lg:py-20">
          <div
            className="absolute inset-x-0 -top-5 h-5 bg-primary"
            style={{ clipPath: "polygon(0 100%, 100% 0, 100% 100%)" }}
          />
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              {projectsCta.fields.body && (
                <div className="mb-6">
                  <RichText
                    document={projectsCta.fields.body as Document}
                    className="text-lg text-primary-foreground [&_p]:text-primary-foreground"
                  />
                </div>
              )}
              <Button
                size="lg"
                asChild
                className="bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Link href="/contact">
                  {(projectsCta.fields.headline as string) || "Get in touch"}
                  <LogoArrow size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* Prev / Next navigation                        */}
      {/* ============================================ */}
      {(prevProject || nextProject) && (
        <section className="border-t border-border bg-background py-12">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-2">
              {prevProject ? (
                <Link
                  href={`/projects/${prevProject.fields.slug}`}
                  className="group flex items-center gap-4 rounded-lg border border-border bg-card p-6 transition-shadow hover:shadow-md"
                >
                  <LogoArrow direction="left" size={20} color="var(--color-grey)" className="shrink-0 group-hover:[color:var(--color-off-black)] transition-colors" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Previous project
                    </p>
                    <p className="mt-1 font-semibold text-card-foreground group-hover:text-accent">
                      {prevProject.fields.title as string}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}
              {nextProject ? (
                <Link
                  href={`/projects/${nextProject.fields.slug}`}
                  className="group flex items-center justify-end gap-4 rounded-lg border border-border bg-card p-6 text-right transition-shadow hover:shadow-md"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Next project
                    </p>
                    <p className="mt-1 font-semibold text-card-foreground group-hover:text-accent">
                      {nextProject.fields.title as string}
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
    </div>
  )
}
