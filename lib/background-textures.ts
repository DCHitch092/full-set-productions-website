import { getGlobalSettings } from "./contentful"
import { getAssetUrl } from "./contentful-types"

/**
 * Background texture asset configuration for different page sections
 * Maps page/section types to their associated texture asset arrays from Contentful
 */
export interface TextureAssetConfig {
  type: "home" | "services" | "industry" | "about" | "project" | "article"
  index: number // Asset index within the array (0-based)
}

/**
 * Fetch all background texture assets from global settings
 */
export async function getBackgroundTextures(preview = false) {
  try {
    const settings = await getGlobalSettings(preview)
    if (!settings?.fields) return null

    return {
      home: settings.fields.backgroundTextureAssets || [],
      services: settings.fields.serviceBackgroundTextureAssets || [],
      industry: settings.fields.industryBackgroundTextureAssets || [],
      about: settings.fields.aboutBackgroundTextureAssets || [],
      project: settings.fields.projectBackgroundTextureAssets || [],
      article: settings.fields.articleBackgroundTextureAssets || [],
    }
  } catch (e) {
    console.error("[v0] Failed to fetch background textures:", e)
    return null
  }
}

/**
 * Get a specific texture asset URL for a section
 * @param type - The page/section type (e.g., "home", "services")
 * @param index - The asset index within that type's array (0-based)
 */
export async function getTextureUrl(type: "home" | "services" | "industry" | "about" | "project" | "article", index: number, preview = false): Promise<string | null> {
  try {
    const textures = await getBackgroundTextures(preview)
    if (!textures?.[type]?.[index]) return null
    
    const asset = textures[type][index]
    return getAssetUrl(asset)
  } catch (e) {
    console.error(`[v0] Failed to fetch texture URL for ${type}[${index}]:`, e)
    return null
  }
}

/**
 * Color filters to apply over textures based on page theme
 * These are CSS color overlays that maintain readability while adding thematic color
 */
export const themeColorFilters = {
  blue: "rgba(127, 151, 196, 0.08)", // #7F97C4 with 8% opacity
  teal: "rgba(124, 192, 184, 0.08)", // #7CC0B8 with 8% opacity
  coral: "rgba(224, 97, 90, 0.08)", // #E0615A with 8% opacity
  pink: "rgba(216, 90, 184, 0.08)", // #D85AB8 with 8% opacity
  yellow: "rgba(235, 203, 91, 0.06)", // #EBCB5B with 6% opacity (lower for light color)
}

/**
 * Get the theme color based on page type
 */
export function getThemeColorForType(type: string): keyof typeof themeColorFilters {
  const themeMap: Record<string, keyof typeof themeColorFilters> = {
    home: "blue",
    services: "teal",
    industries: "coral",
    industry: "coral",
    projects: "pink",
    project: "pink",
    about: "yellow",
    article: "teal",
  }
  return themeMap[type] || "blue"
}
