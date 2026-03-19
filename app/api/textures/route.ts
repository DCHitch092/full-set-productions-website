import { getTextureAsset, TextureType } from '@/lib/contentful-textures'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const type = searchParams.get('type') as TextureType
  const indexStr = searchParams.get('index')
  const index = indexStr ? parseInt(indexStr, 10) : 0

  if (!type) {
    return NextResponse.json(
      { error: 'Missing texture type' },
      { status: 400 }
    )
  }

  try {
    const url = await getTextureAsset(type, index)
    return NextResponse.json({ url })
  } catch (error) {
    console.error('[v0] Error fetching texture:', error)
    return NextResponse.json(
      { error: 'Failed to fetch texture', url: null },
      { status: 500 }
    )
  }
}
