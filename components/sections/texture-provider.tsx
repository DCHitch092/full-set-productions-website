/**
 * TextureProvider - Server component that fetches background textures from Contentful
 * and provides them to child components via context or props
 */

import { ReactNode } from "react"
import { getBackgroundTextures, getThemeColorForType, themeColorFilters } from "@/lib/background-textures"
import { getAssetUrl } from "@/lib/contentful-types"

export interface TextureContextType {
  textures: {
    home: string[]
    services: string[]
    industry: string[]
    about: string[]
    project: string[]
    article: string[]
  }
  getTextureUrl: (type: string, index: number) => string | null
  getThemeFilter: (type: string) => string
}

/**
 * Get texture for a specific section
 * @param type - Section type (e.g., "home", "services")
 * @param index - Asset index within that type (0-based)
 */
export async function getSectionTexture(type: string, index: number) {
  try {
    const textures = await getBackgroundTextures()
    if (!textures) return null

    const typeTextures = textures[type as keyof typeof textures]
    if (!typeTextures || !typeTextures[index]) return null

    const asset = typeTextures[index]
    const url = getAssetUrl(asset)
    const themeColor = getThemeColorForType(type)
    const colorFilter = themeColorFilters[themeColor]

    return { url, colorFilter }
  } catch (e) {
    console.error(`[v0] Failed to get section texture for ${type}[${index}]:`, e)
    return null
  }
}
