/**
 * useBackgroundTexture Hook
 * Client-side hook to fetch and manage background textures
 */

'use client'

import { useEffect, useState } from 'react'

export type TextureType = 
  | 'background'
  | 'service'
  | 'industry'
  | 'about'
  | 'project'
  | 'article'

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
        const response = await fetch(
          `/api/textures?type=${textureType}&index=${index}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch texture')
        }
        const data = await response.json()
        if (isMounted) {
          setTextureUrl(data.url || null)
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
