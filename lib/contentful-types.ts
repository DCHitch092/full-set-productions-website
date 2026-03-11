import type { Asset, Entry, EntrySkeletonType } from "contentful"
import type { Document } from "@contentful/rich-text-types"

// ============================================================
// Global Settings (Singleton)
// ============================================================
export interface GlobalSettingsFields {
  siteName: string
  defaultMetaTitle: string
  defaultMetaDescription: string
  primaryCTA: string
  primaryCTAUrl: string
  contactEmail: string
  contactPhone?: string
  contactAddress?: string
  contactResponseTime?: string
  ogDefaultImage?: Asset
  kvOverrides?: Record<string, string>
}

export type GlobalSettingsSkeleton = EntrySkeletonType<
  GlobalSettingsFields,
  "globalSettings"
>

// ============================================================
// Homepage (Singleton)
// ============================================================
export interface HomepageFields {
  heroHeadline: string
  heroSubheadline: string
  heroBadgeText?: string
  heroPrimaryCtaText?: string
  heroPrimaryCtaUrl?: string
  heroSecondaryCtaText?: string
  heroSecondaryCtaUrl?: string
  heroImage?: Asset
  proofPoints?: string[]
  proofPointsJson?: Array<{ value: string; label: string }>
  trustPoints?: Array<{
    icon: string
    title: string
    description: string
  }>
  edinburghAdvantageHeadline?: string
  edinburghAdvantageDescription?: string
  edinburghAdvantageBullets?: string[]
  processSteps?: Array<{
    title: string
    description: string
  }>
  featuredServices?: Entry<ServiceSkeleton>[]
  featuredProjects?: Entry<ProjectSkeleton>[]
  homepageMetaTitle?: string
  homepageMetaDescription?: string
}

export type HomepageSkeleton = EntrySkeletonType<HomepageFields, "homepage">

// ============================================================
// Footer (Singleton)
// ============================================================
export interface FooterFields {
  footerTagline: string
  footerMicrocopy?: string
  footerCtaText?: string
  footerCtaUrl?: string
  legalLinks?: Array<{ label: string; url: string }>
  socialLinks?: Array<{ label: string; url: string }>
  companySummary?: string
  body?: Document
}

export type FooterSkeleton = EntrySkeletonType<FooterFields, "footer">

// ============================================================
// Service
// ============================================================
export interface ServiceFields {
  title: string
  slug: string
  summary: string
  body?: Document
  keyPoints?: string[]
  category?: string[]
  featuredImage?: Asset
  gallery?: Asset[]
  relatedFaQs?: Entry<FaqItemSkeleton>[]
  relatedProjects?: Entry<ProjectSkeleton>[]
  metaTitle?: string
  metaDescription?: string
  cardLayoutHeading?: string
  cardLayoutDescription?: string
}

export type ServiceSkeleton = EntrySkeletonType<ServiceFields, "service">

// ============================================================
// Project (Case Study)
// ============================================================
export interface ProjectFields {
  title: string
  slug: string
  excerpt?: string
  clientName?: string
  location?: string
  projectType?: string
  brief?: Document
  solution?: Document
  highlights?: string[]
  gallery?: Asset[]
  heroImage?: Asset
  servicesProvided?: Entry<ServiceSkeleton>[]
  metaTitle?: string
  metaDescription?: string
}

export type ProjectSkeleton = EntrySkeletonType<ProjectFields, "project">

// ============================================================
// FAQ Item
// ============================================================
export interface FaqItemFields {
  question: string
  answer: string
  services?: Entry<ServiceSkeleton>[]
  order?: number
}

export type FaqItemSkeleton = EntrySkeletonType<FaqItemFields, "faqItem">

// ============================================================
// Industry
// ============================================================
export interface IndustryFields {
  title: string
  slug: string
  intro: string
  body: Document
  relatedServices?: Entry<ServiceSkeleton>[]
  metaTitle: string
  metaDescription: string
  internalId?: string
  featuredImage?: Asset
  cardDisplayTitle?: string
  cardDisplayBody?: string
}

export type IndustrySkeleton = EntrySkeletonType<IndustryFields, "industry">

// ============================================================
// Person
// ============================================================
export interface PersonFields {
  name: string
  role: string
  bio: string
  photo?: Asset
  order?: number
}

export type PersonSkeleton = EntrySkeletonType<PersonFields, "person">

// ============================================================
// Modular Blocks (reusable snippets)
// ============================================================
export type ModularBlockSectionType =
  | "Hero"
  | "CTA"
  | "MidRoll"
  | "FeatureList"
  | "Steps"
  | "Team"
  | "ContentBanner"
  | "Quote"
  | "Gallery"
  | "FAQ"

export interface ModularBlockFields {
  internalName: string
  sectionType: ModularBlockSectionType
  headline: string
  body: Document
  image?: Asset
  trimmed?: string // Short text for mobile
  people?: Entry<PersonSkeleton>[]
}

export type ModularBlockSkeleton = EntrySkeletonType<
  ModularBlockFields,
  "modularBlocks"
>

// ============================================================
// Page (Generic - About, Contact, etc.)
// ============================================================
export interface PageFields {
  title: string
  slug: string
  body?: Document
  metaTitle?: string
  metaDescription?: string
  reusableSnippets?: Entry<ModularBlockSkeleton>
  includedModularBlocks?: Entry<ModularBlockSkeleton>[]
  faqItems?: Entry<FaqItemSkeleton>[]
  listContent?: string[] // e.g. ["Service", "Industry", "FAQ Item", "Project", "Testimonial"]
  listAllAssociatedContent?: boolean
  featureAssociatedContent?: number
}

export type PageSkeleton = EntrySkeletonType<PageFields, "page">

// ============================================================
// Resolved types (for use in components)
// ============================================================
export type GlobalSettings = Entry<GlobalSettingsSkeleton>
export type Homepage = Entry<HomepageSkeleton>
export type FooterEntry = Entry<FooterSkeleton>
export type Service = Entry<ServiceSkeleton>
export type Project = Entry<ProjectSkeleton>
export type FaqItem = Entry<FaqItemSkeleton>
export type Page = Entry<PageSkeleton>

// ============================================================
// Helper to safely extract asset URL
// ============================================================
export function getAssetUrl(asset?: Asset): string | null {
  if (!asset?.fields?.file?.url) return null
  const url = asset.fields.file.url as string
  return url.startsWith("//") ? `https:${url}` : url
}

export function getAssetDimensions(asset?: Asset): {
  width: number
  height: number
} {
  const details = asset?.fields?.file?.details as
    | { image?: { width: number; height: number } }
    | undefined
  return {
    width: details?.image?.width ?? 800,
    height: details?.image?.height ?? 600,
  }
}
