import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Quote as QuoteIcon } from "lucide-react"
import { RichText } from "@/components/rich-text"
import { contentfulImageUrl } from "@/lib/contentful"
import { SectionContainer } from "@/components/sections/SectionContainer"
import { BaseCard } from "@/components/cards/BaseCard"
import { ANIMATIONS } from "@/lib/animations"
import { SplitCircleNumber } from "@/components/brand-shapes"
import type { Document } from "@contentful/rich-text-types"

// ============================================================
// Types
// ============================================================
interface ModularBlock {
  fields: {
    internalName: string
    sectionType: string
    headline: string
    body: Document
    image?: any
    trimmed?: string
  }
  sys: { id: string }
}

// ============================================================
// Hero Block
// ============================================================
export function HeroBlock({ block }: { block: ModularBlock }) {
  const { headline, body, image, trimmed } = block.fields
  const imageUrl = image ? contentfulImageUrl(image, { w: 1200, q: 80, fm: "webp" }) : null

  return (
    <SectionContainer bg="primary" spacing="lg">
      <div className={imageUrl ? "grid items-center gap-12 lg:grid-cols-2" : "max-w-3xl"}>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl text-balance">
            {headline}
          </h1>
          {/* Mobile: show trimmed text. Desktop: show full rich text body */}
          {trimmed && (
            <p className="mt-6 text-xl text-primary-foreground/80 leading-relaxed lg:hidden">
              {trimmed}
            </p>
          )}
          <div className={trimmed ? "mt-6 hidden lg:block" : "mt-6"}>
            <RichText
              document={body}
              className="text-lg text-primary-foreground/80 leading-relaxed [&_p]:text-primary-foreground/80 [&_p]:mt-4"
            />
          </div>
        </div>
        {imageUrl && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={headline}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
      </div>
    </SectionContainer>
  )
}

// ============================================================
// CTA Block
// ============================================================
export function CTABlock({ block }: { block: ModularBlock }) {
  const { headline, body } = block.fields
  return (
    <SectionContainer bg="primary" spacing="lg" align="center">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl text-balance">
          {headline}
        </h2>
        <div className="mt-4">
          <RichText
            document={body}
            className="text-lg text-primary-foreground/80 [&_p]:text-primary-foreground/80"
          />
        </div>
        <Button
          size="lg"
          asChild
          className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <Link href="/contact">
            Get in touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </SectionContainer>
  )
}

// ============================================================
// MidRoll Block (inline callout / highlight)
// ============================================================
export function MidRollBlock({ block }: { block: ModularBlock }) {
  const { headline, body, image } = block.fields
  const imageUrl = image ? contentfulImageUrl(image, { w: 800, q: 80, fm: "webp" }) : null

  return (
    <SectionContainer bg="secondary" spacing="md">
      <div className={imageUrl ? "grid items-center gap-12 lg:grid-cols-2" : "mx-auto max-w-3xl text-center"}>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
            {headline}
          </h2>
          <div className="mt-4">
            <RichText document={body} />
          </div>
        </div>
        {imageUrl && (
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image src={imageUrl || "/placeholder.svg"} alt={headline} fill className="object-cover" />
          </div>
        )}
      </div>
    </SectionContainer>
  )
}

// ============================================================
// FeatureList Block
// ============================================================
export function FeatureListBlock({ block }: { block: ModularBlock }) {
  const { headline, body } = block.fields
  return (
    <SectionContainer spacing="lg" align="center">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          {headline}
        </h2>
      </div>
      <div className="mt-10">
        <RichText document={body} className="mx-auto max-w-3xl" />
      </div>
    </SectionContainer>
  )
}

// ============================================================
// Steps Block
// ============================================================
export function StepsBlock({ block }: { block: ModularBlock }) {
  const { headline, body } = block.fields
  
  // Extract steps from rich text body (looking for ordered list items)
  const steps: Array<{ title: string; description: string }> = []
  
  if (body?.content) {
    for (const node of body.content) {
      if (node.nodeType === 'ordered-list' && node.content) {
        for (const listItem of node.content) {
          if (listItem.nodeType === 'list-item' && listItem.content) {
            let title = ''
            let description = ''
            
            // Get the first paragraph as title
            const firstPara = listItem.content[0]
            if (firstPara?.nodeType === 'paragraph' && firstPara.content) {
              title = firstPara.content
                .map((c: any) => c.value || '')
                .join('')
                .trim()
            }
            
            // Get subsequent paragraphs as description
            if (listItem.content.length > 1) {
              description = listItem.content
                .slice(1)
                .map((para: any) => {
                  if (para.nodeType === 'paragraph' && para.content) {
                    return para.content.map((c: any) => c.value || '').join('')
                  }
                  return ''
                })
                .filter(Boolean)
                .join(' ')
            }
            
            if (title) {
              steps.push({ title, description })
            }
          }
        }
      }
    }
  }
  
  // If no steps found, fall back to rendering the full rich text
  if (steps.length === 0) {
    return (
      <SectionContainer bg="secondary" spacing="lg" align="center">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            {headline}
          </h2>
        </div>
        <div className="mt-10">
          <RichText document={body} className="mx-auto max-w-3xl" />
        </div>
      </SectionContainer>
    )
  }
  
  return (
    <SectionContainer bg="secondary" spacing="lg">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          {headline}
        </h2>
      </div>
      
      <div className="mt-16 relative">
        {/* Connecting line for desktop */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden lg:block" />
        
        <div className="space-y-8 lg:space-y-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              <div className="flex gap-6 lg:gap-8 items-start">
                {/* Step number — split-circle badge */}
                <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-110">
                  <SplitCircleNumber
                    number={index + 1}
                    size={64}
                    colorA="var(--color-blue)"
                    colorB="var(--color-coral)"
                    angle={-69}
                  />
                  {/* Connecting dot on the line (desktop only) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-secondary hidden lg:block" />
                </div>
                  {/* Connecting dot on the line (desktop only) */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary border-4 border-secondary hidden lg:block" />
                </div>
                
                {/* Step content */}
                <BaseCard variant="simple" className={`flex-1 ${ANIMATIONS.cardInteractive}`}>
                  <CardContent className="p-6 lg:p-8">
                    <h3 className="text-xl lg:text-2xl font-semibold text-foreground leading-tight text-balance">
                      {step.title}
                    </h3>
                    {step.description && (
                      <p className="mt-3 text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    )}
                  </CardContent>
                </BaseCard>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionContainer>
  )
}

// ============================================================
// Team Block (ContentBanner with includedCards = person entries)
// ============================================================
export function TeamBlock({ block }: { block: ModularBlock }) {
  const fields = block.fields as any
  const { headline, body } = fields
  const members: any[] = fields.includedCards ?? []

  return (
    <SectionContainer bg="secondary" spacing="lg" align="center">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          {headline}
        </h2>
        {body && (
          <div className="mt-4 mx-auto max-w-2xl">
            <RichText
              document={body}
              className="text-lg text-muted-foreground [&_p]:text-muted-foreground"
            />
          </div>
        )}
      </div>

      {members.length > 0 && (
        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {members.map((person: any) => {
            const { name, roleTitle, role, jobTitle, position, bio, headshot, photo, image } = person.fields || {}
            const displayRole = roleTitle || role || jobTitle || position
            const photoAsset = headshot || photo || image
            const photoUrl = photoAsset
              ? contentfulImageUrl(photoAsset, { w: 600, h: 600, q: 80, fm: "webp", fit: "fill" })
              : null

            return (
              <BaseCard key={person.sys.id} variant="clean">
                {photoUrl && (
                  <div className="relative aspect-square overflow-hidden rounded-t-xl bg-muted">
                    <Image
                      src={photoUrl}
                      alt={name || "Team member"}
                      fill
                      className={`object-cover ${ANIMATIONS.scaleHover}`}
                    />
                  </div>
                )}
                <CardContent className="px-6 py-5">
                  <h3 className="text-xl font-semibold text-card-foreground">{name}</h3>
                  {displayRole && <p className="text-sm text-accent font-medium mt-1">{displayRole}</p>}
                  {bio && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{bio}</p>
                  )}
                </CardContent>
              </BaseCard>
            )
          })}
        </div>
      )}
    </SectionContainer>
  )
}

// ============================================================
// Quote Block
// ============================================================
export function QuoteBlock({ block }: { block: ModularBlock }) {
  const { headline, body } = block.fields
  return (
    <SectionContainer spacing="lg" align="center">
      <div className="mx-auto max-w-4xl text-center">
        <QuoteIcon className="mx-auto h-10 w-10 text-accent opacity-40" />
        <blockquote className="mt-6">
          <h2 className="text-2xl font-medium italic text-foreground leading-relaxed sm:text-3xl text-balance">
            {headline}
          </h2>
        </blockquote>
        <div className="mt-4">
          <RichText
            document={body}
            className="text-muted-foreground [&_p]:text-muted-foreground"
          />
        </div>
      </div>
    </SectionContainer>
  )
}

// ============================================================
// Gallery Block
// ============================================================
export function GalleryBlock({ block }: { block: ModularBlock }) {
  const { headline, image } = block.fields
  const imageUrl = image ? contentfulImageUrl(image, { w: 1200, q: 80, fm: "webp" }) : null
  return (
    <SectionContainer spacing="lg">
      {headline && (
        <h2 className="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          {headline}
        </h2>
      )}
      {imageUrl && (
        <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
          <Image src={imageUrl || "/placeholder.svg"} alt={headline || "Gallery"} fill className="object-cover" />
        </div>
      )}
    </SectionContainer>
  )
}

// ============================================================
// FAQ Block (uses rich text body as intro, actual FAQ items rendered separately)
// ============================================================
export function FAQBlock({ block }: { block: ModularBlock }) {
  const { headline, body } = block.fields
  return (
    <SectionContainer bg="secondary" spacing="lg" align="center">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
          {headline}
        </h2>
      </div>
      <div className="mt-6">
        <RichText document={body} className="mx-auto max-w-3xl text-center" />
      </div>
    </SectionContainer>
  )
}

// ============================================================
// Block Dispatcher
// ============================================================
const blockRenderers: Record<string, React.ComponentType<{ block: ModularBlock }>> = {
  Hero: HeroBlock,
  CTA: CTABlock,
  MidRoll: MidRollBlock,
  FeatureList: FeatureListBlock,
  Steps: StepsBlock,
  Team: TeamBlock,
  ContentBanner: TeamBlock, // ContentBanner with people renders as Team block
  Quote: QuoteBlock,
  Gallery: GalleryBlock,
  FAQ: FAQBlock,
}

export function ModularBlockRenderer({ block }: { block: ModularBlock }) {
  const Renderer = blockRenderers[block.fields.sectionType]
  if (!Renderer) {
    console.warn(`[v0] Unknown modular block type: ${block.fields.sectionType}`)
    return null
  }
  return <Renderer block={block} />
}
