import type { Metadata } from "next"
import React from "react"
import { ContactForm } from "@/components/contact-form"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MapPin, Clock } from "lucide-react"
import { CornerBracket } from "@/components/brand-shapes"
import {
  getGlobalSettings,
  getPageBySlug,
  getStaticSiteContent,
} from "@/lib/contentful"

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug("contact")
  return {
    title:
      (page?.fields?.metaTitle as string) ??
      "Contact Us | Full Set Productions",
    description:
      (page?.fields?.metaDescription as string) ??
      "Get in touch to discuss your escape room, theatre, or fabrication project. We'll respond within 2 working days.",
  }
}

export default async function ContactPage() {
  const [globalSettings, page] = await Promise.all([
    getGlobalSettings(),
    getPageBySlug("contact"),
  ])

  const fallback = getStaticSiteContent()
  const blocks = page?._includedModularBlocks ?? []

  // Find the three contact blocks by internal name
  const getJson = (name: string) => {
    const block = blocks.find((b: any) =>
      b.fields?.internalName?.toLowerCase().includes(name.toLowerCase())
    )
    return block?.fields?.customJson ?? null
  }

  const formJson = getJson("Contact Form")
  const infoJson = getJson("Information Banner")
  const keyInfoJson = getJson("Key Info")

  // Form props from CMS
  const formProps = formJson ? {
    formspreeId: formJson.formspreeId ?? "mbdaqknq",
    submitLabel: formJson.submitLabel ?? "Send message",
    successMessage: formJson.successMessage,
    footerNote: formJson.footerNote,
    fields: formJson.fields,
  } : {}

  // Info banner
  const infoHeadline = infoJson?.headline ?? "Get in touch"
  const infoBody = infoJson?.body ?? "Prefer email? Drop us a line directly and we'll respond promptly."
  const infoBadge = infoJson?.badge ?? null

  // Key info items (email, location, response time)
  const email = (globalSettings?.fields?.contactEmail as string) ?? fallback.company.email
  const keyItems: Array<{ icon: string; label: string; value: string; href?: string }> =
    keyInfoJson?.items ?? [
      { icon: "mail", label: "Email", value: email, href: `mailto:${email}` },
      { icon: "map-pin", label: "Location", value: fallback.company.location },
      { icon: "clock", label: "Response time", value: "Within 2 working days" },
    ]
  const workshopNote = keyInfoJson?.workshopNote ?? "Workshop visits welcome. If you'd like to see our space and discuss your project in person, let us know and we'll arrange a time."

  const pageTitle = (page?.fields?.title as string) ?? "Start a project"
  const pageIntro = (page?.fields?.intro as string) ?? "Tell us about your vision and timeline. We'll get back to you within 2 working days."

  const iconMap: Record<string, React.ComponentType<any>> = { mail: Mail, "map-pin": MapPin, clock: Clock }

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative bg-primary py-16 lg:py-20">
        <CornerBracket corner="top-right" colorA="var(--color-teal)" colorB="var(--color-yellow)" className="absolute top-0 right-0 pointer-events-none" />
        <CornerBracket corner="bottom-left" colorA="var(--color-pink)" colorB="var(--color-coral)" className="absolute bottom-0 left-0 pointer-events-none" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl">
              {pageTitle}
            </h1>
            <p className="mt-4 text-lg text-primary-foreground">
              {pageIntro}
            </p>
          </div>
        </div>
      </section>

      {/* Form & Contact Info */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Contact Info */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground">
                    {infoHeadline}
                  </h2>
                  <p className="mt-2 text-muted-foreground">{infoBody}</p>
                  {infoBadge && (
                    <span className="mt-3 inline-block rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                      {infoBadge}
                    </span>
                  )}
                </div>

                <Card>
                  <CardContent className="p-6 space-y-4">
                    {keyItems.map((item) => {
                      const Icon = iconMap[item.icon] ?? Mail
                      return (
                        <div key={item.label} className="flex items-start gap-3">
                          <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.label}</p>
                            {item.href ? (
                              <a href={item.href} className="text-sm text-muted-foreground hover:text-accent">
                                {item.value}
                              </a>
                            ) : (
                              <p className="text-sm text-muted-foreground">{item.value}</p>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                </Card>

                {workshopNote && (
                  <div className="rounded-lg bg-secondary p-4">
                    <p className="text-sm text-muted-foreground">{workshopNote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <ContactForm {...formProps} />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
