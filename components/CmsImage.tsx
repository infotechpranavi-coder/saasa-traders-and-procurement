'use client'

import { useEffect, useState } from 'react'
import { getCmsImageFallback, resolveCmsImage } from '@/lib/cms-images'

interface CmsImageProps {
  src?: string
  alt: string
  className?: string
  fill?: boolean
  priority?: boolean
  /** Accepted for API compatibility with next/image call sites; native img ignores this. */
  sizes?: string
}

/** Native img for CMS assets — local paths first, remote fallback on error */
export default function CmsImage({
  src,
  alt,
  className = '',
  fill = false,
  priority = false,
}: CmsImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() => resolveCmsImage(src))

  useEffect(() => {
    setCurrentSrc(resolveCmsImage(src))
  }, [src])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={fill ? `cms-image cms-image--fill ${className}` : className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setCurrentSrc(getCmsImageFallback(src))}
    />
  )
}
