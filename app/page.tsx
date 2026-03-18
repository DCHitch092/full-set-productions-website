import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Shield,
  MessageSquare,
  Clock,
  Users,
  MapPin,
  Wrench,
  CheckCircle,
  Sparkles,
  ClipboardCheck,
} from "lucide-react"
import {
  getHomepage,
  getGlobalSettings,
  getServices,
  getFeaturedProjects,
  getStaticSiteContent,
  contentfulImageUrl,
} from "@/lib/contentful"
import { SectionContainer } from "@/components/sections/SectionContainer"
import { BaseCard } from "@/components/cards/BaseCard"
import { H1, H2, BodyLarge, Body } from "@/components/typography"

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  shield: Shield,
  "shield-check": Shield,
  "message-square": MessageSquare,
  clock: Clock,
  users: Users,
  wrench: Wrench,
  sparkles: Sparkles,
  "clipboard-check": ClipboardCheck,
}

function getIcon(iconName: string) {
  return ICON_MAP[iconName] ?? Shield
}

export default async function HomePage() {
  // Fetch from Contentful in parallel
  const [homepage, globalSettings, services, featuredProjects] =
    await Promise.all([
      getHomepage(),
      getGlobalSettings(),
      getServices(),
      getFeaturedProjects(),
    ])

  // Static fallbacks
  const fallback = getStaticSiteContent()

  // Hero
  const heroHeadline =
    homepage?.fields?.heroHeadline ?? fallback.hero.headline
  const heroSubheadline =
    homepage?.fields?.heroSubheadline ?? fallback.hero.subheadline
  const heroBadgeText = homepage?.fields?.heroBadgeText ?? "Escape Room Design & Build"
  const heroPrimaryCta =
    homepage?.fields?.heroPrimaryCtaText ??
    (globalSettings?.fields as any)?.primaryCTA ??
    (globalSettings?.fields as any)?.primaryCta ??
    fallback.hero.cta
  const heroPrimaryCtaUrl =
    homepage?.fields?.heroPrimaryCtaUrl ??
    (globalSettings?.fields as any)?.primaryCTAUrl ??
    (globalSettings?.fields as any)?.primaryCtaUrl ??
    "/contact"
  const heroSecondaryCta = homepage?.fields?.heroSecondaryCtaText ?? "View our work"
  const heroSecondaryCtaUrl = homepage?.fields?.heroSecondaryCtaUrl ?? "/projects"

  // Proof points
  const proofPointsJson = homepage?.fields?.proofPointsJson as
    | Array<{ value: string; label: string }>
    | undefined
  const proofPoints = proofPointsJson ??
    fallback.proofPoints.map((p) => ({ value: p.stat, label: p.label }))

  // Services (use Featured Services from Homepage if available, otherwise fallback)
  let featuredServices = homepage?.fields?.featuredServices as any[] | undefined
  
  // Resolve featured services from includes if they're references
  if (featuredServices && (homepage as any)?._includes?.Entry) {
    featuredServices = featuredServices
      .map((ref: any) => {
        // If it already has fields, return as-is
        if (ref.fields) return ref
        // Otherwise find it in includes by ID
        const resolved = (homepage as any)._includes.Entry.find((e: any) => e.sys?.id === ref.sys?.id)
        return resolved
      })
      .filter(Boolean)
  }
  
  const serviceCards = featuredServices && featuredServices.length > 0
    ? featuredServices
        .filter((s: any) => s?.fields?.title) // Filter out unresolved entries
        .map((s: any) => ({
          title: s.fields.title as string,
          slug: s.fields.slug as string,
          heading: s.fields.cardLayoutHeading as string | undefined,
          description: s.fields.cardLayoutDescription as string | undefined,
        }))
    : fallback.services.map((s) => ({
        title: s.title,
        slug: s.slug,
        heading: undefined,
        description: undefined,
      }))

  // Featured projects — always use CMS data, derive image via contentfulImageUrl
  const projectCards = featuredProjects.map((p) => {
    const imageUrl =
      contentfulImageUrl(p.fields?.heroImage, { w: 800, q: 80, fm: "webp" }) ??
      contentfulImageUrl(p.fields?.featuredImage, { w: 800, q: 80, fm: "webp" }) ??
      (Array.isArray(p.fields?.gallery) && p.fields.gallery.length > 0
        ? contentfulImageUrl(p.fields.gallery[0], { w: 800, q: 80, fm: "webp" })
        : null)

    // Handle projectType as either a string (split by |) or array
    const projectTypeRaw = p.fields?.projectType
    const projectTypes = Array.isArray(projectTypeRaw)
      ? projectTypeRaw
      : typeof projectTypeRaw === "string"
        ? projectTypeRaw.split("|").map((t) => t.trim())
        : []

    return {
      slug: p.fields?.slug as string,
      title: p.fields?.title as string,
      projectTypes: projectTypes.length > 0 ? projectTypes : ["Project"],
      outcome: (p.fields?.excerpt as string) ?? "",
      image: imageUrl,
    }
  })

  // Trust points
  const trustPoints = (homepage?.fields?.trustPoints as any[]) ??
    fallback.whyWorkWithUs.map((item, i) => ({
      icon: ["shield", "message-square", "clock", "users"][i],
      title: item.title,
      description: item.description,
    }))

  // Edinburgh Advantage
  const edinHeadline =
    homepage?.fields?.edinburghAdvantageHeadline ??
    fallback.edinburghAdvantage.headline
  const edinDescription =
    homepage?.fields?.edinburghAdvantageDescription ??
    fallback.edinburghAdvantage.description
  const edinBullets =
    homepage?.fields?.edinburghAdvantageBullets ??
    fallback.edinburghAdvantage.points

  // Process steps
  const processSteps = (homepage?.fields?.processSteps as any[]) ??
    fallback.process.map((step) => ({
      title: step.title,
      description: step.description,
    }))

  // CTA — label and URL always from global settings Primary CTA
  const ctaHeadline = fallback.cta.headline
  const ctaDescription = fallback.cta.description
  const gsFields = globalSettings?.fields as any
  const ctaButton = gsFields?.primaryCTA ?? gsFields?.primaryCta ?? fallback.cta.buttonText
  const ctaUrl = gsFields?.primaryCTAUrl ?? gsFields?.primaryCtaUrl ?? "/contact"

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <SectionContainer bg="primary" spacing="lg" backgroundImage="/images/texture-subtle.jpg">
        <div className="max-w-3xl">
          <Badge variant="secondary" className="mb-4">
            {heroBadgeText}
          </Badge>
          <H1 color="primary-foreground">{heroHeadline}</H1>
          <BodyLarge color="primary-foreground" className="mt-6 opacity-80">
            {heroSubheadline}
          </BodyLarge>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              asChild
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              <Link href={heroPrimaryCtaUrl}>
                {heroPrimaryCta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <Link href={heroSecondaryCtaUrl}>{heroSecondaryCta}</Link>
            </Button>
          </div>
        </div>
      </SectionContainer>

      {/* Proof Strip */}
      <section className="border-b border-border bg-secondary py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {proofPoints.map((point, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-foreground">
                  {point.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {point.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <SectionContainer spacing="lg" align="center">
        <div className="text-center">
          <H2>What we build</H2>
          <Body className="mx-auto mt-4 max-w-2xl text-lg" color="muted">
            From escape rooms to festival installations, we design and build
            immersive experiences that work.
          </Body>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {serviceCards.map((service, index) => (
            <BaseCard
              key={service.slug}
              variant="simple"
              interactive
              className={index === 0 ? "ring-2 ring-accent" : ""}
            >
              {index === 0 && (
                <Badge className="absolute right-4 top-4 bg-accent text-accent-foreground z-10">
                  Primary
                </Badge>
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-foreground">
                  {service.heading || service.title}
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {service.description || ""}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="mt-4 inline-flex items-center text-sm font-medium text-foreground hover:text-accent"
                >
                  Learn more
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </BaseCard>
          ))}
        </div>
      </SectionContainer>

      {/* Featured Work */}
      <SectionContainer bg="secondary" spacing="lg">
        <div className="flex items-end justify-between">
          <div>
            <H2>Featured work</H2>
            <Body className="mt-4 text-lg" color="muted">
              Recent projects across escape rooms, theatre, and scenic
              fabrication.
            </Body>
          </div>
          <Button
            variant="outline"
            asChild
            className="hidden sm:inline-flex bg-transparent"
          >
            <Link href="/projects">View all projects</Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {projectCards.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg"
            >
              {project.image && (
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="mb-2 flex flex-wrap gap-2">
                  {project.projectTypes.map((type, idx) => (
                    <Badge key={idx} variant="secondary">
                      {type}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {project.title}
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  {project.outcome}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/projects">View all projects</Link>
          </Button>
        </div>
      </SectionContainer>

      {/* Why Work With Us */}
      <SectionContainer spacing="lg" align="center">
        <div className="text-center">
          <H2>Why work with us</H2>
          <Body className="mx-auto mt-4 max-w-2xl text-lg" color="muted">
            {"We build for the real world\u2014durability, safety, and deadlines matter."}
          </Body>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map(
            (
              item: { icon: string; title: string; description: string },
              index: number,
            ) => {
              const Icon = getIcon(item.icon)
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                    <Icon className="h-6 w-6 text-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              )
            },
          )}
        </div>
      </SectionContainer>

      {/* Edinburgh Advantage */}
      <SectionContainer bg="primary" spacing="lg" backgroundImage="/images/texture-subtle.jpg">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <div className="flex items-center gap-2 text-primary-foreground/80">
              <MapPin className="h-5 w-5" />
              <span className="text-sm font-medium">Based in Edinburgh</span>
            </div>
            <H2 color="primary-foreground" className="mt-4">{edinHeadline}</H2>
            <BodyLarge color="primary-foreground" className="mt-4 opacity-80">
              {edinDescription}
            </BodyLarge>
            <ul className="mt-8 space-y-3">
              {edinBullets.map((point: string, index: number) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-primary-foreground"
                >
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/images/workshop.webp"
              alt="Full Set Productions workshop in Edinburgh"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </SectionContainer>

      {/* How We Work */}
      <SectionContainer as="section" spacing="lg" align="center">
        <div className="text-center">
          <H2>How we work</H2>
          <Body className="mx-auto mt-4 max-w-2xl text-lg" color="muted">
            A straightforward process from first conversation to final
            install.
          </Body>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-4">
          {processSteps.map(
            (
              step: { title: string; description: string },
              index: number,
            ) => (
              <div key={index} className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {index < processSteps.length - 1 && (
                  <div
                    className="absolute right-0 top-5 hidden h-0.5 w-full bg-border md:block"
                    style={{ left: "3rem", width: "calc(100% - 3rem)" }}
                  />
                )}
              </div>
            ),
          )}
        </div>
      </SectionContainer>

      {/* CTA Block */}
      <SectionContainer bg="secondary" spacing="lg" align="center" backgroundImage="/images/texture-subtle.jpg">
        <div className="mx-auto max-w-2xl text-center">
          <Wrench className="mx-auto h-12 w-12 text-accent" />
          <H2 className="mt-6">{ctaHeadline}</H2>
          <Body className="mt-4 text-lg" color="muted">{ctaDescription}</Body>
          <Button
            size="lg"
            asChild
            className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Link href={ctaUrl}>
              {ctaButton}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </SectionContainer>
    </div>
  )
}
