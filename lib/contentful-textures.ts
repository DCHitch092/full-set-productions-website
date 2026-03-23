/**
 * Contentful Texture Assets Utility
 * Fetches and manages background texture assets from global settings
 */

const SPACE_ID = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
const ACCESS_TOKEN = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
const ENVIRONMENT = process.env.NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT || 'master'

interface TextureAsset {
  sys: { id: string }
  fields: {
    file: { url: string }
    title: string
  }
}

interface GlobalSettings {
  sys: { id: string }
  fields: {
    backgroundTextureAssets?: TextureAsset[]
    serviceBackgroundTextureAssets?: TextureAsset[]
    industryBackgroundTextureAssets?: TextureAsset[]
    aboutBackgroundTextureAssets?: TextureAsset[]
    projectBackgroundTextureAssets?: TextureAsset[]
    articleBackgroundTextureAssets?: TextureAsset[]
  }
}

export type TextureType = 
  | 'background'
  | 'service'
  | 'industry'
  | 'about'
  | 'project'
  | 'article'

const fieldMap: Record<TextureType, keyof GlobalSettings['fields']> = {
  background: 'backgroundTextureAssets',
  service: 'serviceBackgroundTextureAssets',
  industry: 'industryBackgroundTextureAssets',
  about: 'aboutBackgroundTextureAssets',
  project: 'projectBackgroundTextureAssets',
  article: 'articleBackgroundTextureAssets',
}

/**
 * Fetch global settings from Contentful
 */
export async function fetchGlobalSettings(): Promise<GlobalSettings | null> {
  if (!SPACE_ID || !ACCESS_TOKEN) {
    console.warn('[v0] Missing Contentful credentials')
    return null
  }

  try {
    const response = await fetch(
      `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}/entries?content_type=globalSettings&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    )

    if (!response.ok) {
      throw new Error(`Contentful API error: ${response.status}`)
    }

    const data = await response.json()
    const entry = data.items[0]

    if (!entry) {
      console.warn('[v0] No global settings found in Contentful')
      return null
    }

    return entry as GlobalSettings
  } catch (error) {
    console.error('[v0] Failed to fetch global settings:', error)
    return null
  }
}

/**
 * Get a specific texture asset by type and index
 * @param textureType The type of texture to fetch (e.g., 'background', 'service')
 * @param index The index of the asset to retrieve (0-based)
 * @returns The URL of the texture asset or null
 */
export async function getTextureAsset(
  textureType: TextureType,
  index: number = 0
): Promise<string | null> {
  const settings = await fetchGlobalSettings()
  if (!settings) return null

  const fieldName = fieldMap[textureType]
  const assets = settings.fields[fieldName] as TextureAsset[] | undefined

  if (!assets || !assets[index]) {
    console.warn(`[v0] Texture asset not found: ${textureType}[${index}]`)
    return null
  }

  const asset = assets[index]
  if (!asset.fields?.file?.url) {
    console.warn(`[v0] Asset missing URL: ${textureType}[${index}]`)
    return null
  }

  // Ensure absolute URL
  return asset.fields.file.url.startsWith('http')
    ? asset.fields.file.url
    : `https:${asset.fields.file.url}`
}

/**
 * Get all texture assets for a given type
 */
export async function getTextureAssets(
  textureType: TextureType
): Promise<string[]> {
  const settings = await fetchGlobalSettings()
  if (!settings) return []

  const fieldName = fieldMap[textureType]
  const assets = settings.fields[fieldName] as TextureAsset[] | undefined

  if (!assets) return []

  return assets
    .map((asset) => {
      if (!asset.fields?.file?.url) return null
      const url = asset.fields.file.url
      return url.startsWith('http') ? url : `https:${url}`
    })
    .filter((url): url is string => url !== null)
}
