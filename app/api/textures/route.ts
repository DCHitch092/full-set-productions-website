import { getGlobalSettings } from '@/lib/contentful'
import { NextRequest, NextResponse } from 'next/server'
import type { TextureType } from '@/lib/use-background-texture'

const TEXTURE_FIELD_MAP: Record<TextureType, string> = {
  background: 'backgroundTextureAssets',
  service: 'serviceBackgroundTextureAssets',
  industry: 'industryBackgroundTextureAssets',
  about: 'aboutBackgroundTextureAssets',
  project: 'projectBackgroundTextureAssets',
  article: 'articleBackgroundTextureAssets',
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type')
  const indexStr = searchParams.get('index')
  const index = indexStr ? parseInt(indexStr, 10) : 0

  if (!type || !TEXTURE_FIELD_MAP[type]) {
    return NextResponse.json(
      { error: 'Invalid texture type' },
      { status: 400 }
    )
  }

  try {
    const globalSettings = await getGlobalSettings()
    if (!globalSettings) {
      return NextResponse.json({ url: null, error: 'Global settings not found' }, { status: 404 })
    }

    const fieldName = TEXTURE_FIELD_MAP[type]
    const assets = globalSettings.fields?.[fieldName] || []
    
    if (!Array.isArray(assets) || assets.length === 0 || index >= assets.length) {
      return NextResponse.json({ url: null, error: 'Texture asset not found' }, { status: 404 })
    }

    const asset = assets[index]
    
    // Asset can be a link object or a full asset object
    let assetData = asset
    if (asset?.sys?.type === 'Link') {
      // It's a link reference, resolve from includes
      const includes = globalSettings._includes
      if (includes?.Asset) {
        assetData = includes.Asset.find((a: any) => a.sys.id === asset.sys.id)
      }
    }

    if (!assetData?.fields?.file?.url) {
      console.error(`[v0] Asset missing URL: ${type}[${index}]`)
      return NextResponse.json({ url: null, error: 'Asset URL not found' }, { status: 404 })
    }

    const url = assetData.fields.file.url
    const fullUrl = url.startsWith('http') ? url : `https:${url}`
    
    return NextResponse.json({ url: fullUrl })
  } catch (error) {
    console.error('[v0] Error fetching texture:', error)
    return NextResponse.json(
      { error: 'Failed to fetch texture', url: null },
      { status: 500 }
    )
  }
}
