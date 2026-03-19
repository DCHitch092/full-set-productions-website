/**
 * useBackgroundTexture Hook
 * Client-side hook to fetch and manage background textures
 */

'use client'

import { useEffect, useState } from 'react'
import { getTextureAsset, TextureType } from '@/lib/contentful-textures'

interface UseBackgroundTextureOptions {
  textureType: TextureType
  index?: number
}

export function useBackgroundTexture({
  textureType,
  index = 0,
}: UseBackgroundTextureOptions) {
  const [textureUrl, setTextureUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadTexture() {
      try {
        setLoading(true)
        const url = await getTextureAsset(textureType, index)
        if (isMounted) {
          setTextureUrl(url)
          setError(null)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to load texture'))
          setTextureUrl(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadTexture()

    return () => {
      isMounted = false
    }
  }, [textureType, index])

  return { textureUrl, loading, error }
}
