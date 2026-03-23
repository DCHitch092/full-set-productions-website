import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { getPageBySlug, getProjects, contentfulImageUrl } from "@/lib/contentful"
import { ModularBlockRenderer } from "@/components/modular-blocks"
import { SectionContainer } from "@/components/sections/SectionContainer"
import { BaseCard } from "@/components/cards/BaseCard"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("projects")
  return {
    title: (page?.fields?.metaTitle as string) ?? "Projects | Full Set Productions",
    description:
      (page?.fields?.metaDescription as string) ??
      "Case studies from Full Set Productions -- escape rooms, immersive attractions, theatre sets, and scenic fabrication.",
  }
}

function ProjectListCard({ project }: { project: any }) {
  const { title, slug, excerpt, clientName, location, projectType, heroImage, gallery } =
    project.fields

  // Resolve featured image: heroImage first, then first gallery asset
  let imageUrl: string | null = null
  if (heroImage) {
    imageUrl = contentfulImageUrl(heroImage, { w: 800, h: 600, q: 80, fm: "webp" })
  }
  if (!imageUrl && heroImage?.sys?.id && (project as any)._includes?.Asset) {
    const resolved = (project as any)._includes.Asset.find(
      (a: any) => a.sys.id === (heroImage as any).sys.id,
    )
    if (resolved) imageUrl = contentfulImageUrl(resolved, { w: 800, h: 600, q: 80, fm: "webp" })
  }
  if (!imageUrl && gallery?.length > 0) {
    const firstGallery = gallery[0]
    imageUrl = contentfulImageUrl(firstGallery, { w: 800, h: 600, q: 80, fm: "webp" })
    if (!imageUrl && firstGallery?.sys?.id && (project as any)._includes?.Asset) {
      const resolved = (project as any)._includes.Asset.find(
        (a: any) => a.sys.id === firstGallery.sys.id,
      )
      if (resolved) imageUrl = contentfulImageUrl(resolved, { w: 800, h: 600, q: 80, fm: "webp" })
    }
  }

  const meta = [clientName, location, projectType].filter(Boolean)

  return (
    <Link href={`/projects/${slug}`}>
      <BaseCard variant="simple">
        {/* Featured image -- consistently cropped 4:3 */}
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
      </BaseCard>
    </Link>
  )
}

// ============================================================
// Projects Index Page
// ============================================================
export default async function ProjectsPage() {
  const [page, projects] = await Promise.all([
    getPageBySlug("projects"),
    getProjects(),
  ])

  // Separate hero from other modular blocks
  const allBlocks = page?._includedModularBlocks ?? []
  const heroBlock = allBlocks.find((b: any) => b.fields?.internalName === "Projects Page Hero")
  const otherBlocks = allBlocks.filter((b: any) => b.fields?.internalName !== "Projects Page Hero")

  return (
    <div className="flex flex-col">
      {/* Hero modular block (if attached to the Page) */}
      {heroBlock && <ModularBlockRenderer block={heroBlock} />}

      {/* Project listing */}
      <SectionContainer spacing="lg">
        {projects.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project: any) => (
              <ProjectListCard key={project.sys.id} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Projects are being added. Please check back soon.
          </p>
        )}
      </SectionContainer>

      {/* Additional modular blocks (CTA, etc.) */}
      {otherBlocks.map((block: any) => (
        <ModularBlockRenderer key={block.sys.id} block={block} />
      ))}
    </div>
  )
}
