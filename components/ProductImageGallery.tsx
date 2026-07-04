'use client'

import { useCallback, useEffect, useState } from 'react'
import CmsImage from './CmsImage'
import { resolveCmsImage } from '@/lib/cms-images'

interface ProductImageGalleryProps {
  images: string[]
  title: string
}

export default function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const list = images.filter(Boolean)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const goPrev = useCallback(() => {
    setActiveIndex((i) => (i <= 0 ? list.length - 1 : i - 1))
  }, [list.length])

  const goNext = useCallback(() => {
    setActiveIndex((i) => (i >= list.length - 1 ? 0 : i + 1))
  }, [list.length])

  useEffect(() => {
    if (activeIndex >= list.length) setActiveIndex(0)
  }, [activeIndex, list.length])

  useEffect(() => {
    if (!lightboxOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false)
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [lightboxOpen, goPrev, goNext])

  if (list.length === 0) return null

  const activeSrc = list[activeIndex] ?? list[0]

  return (
    <>
      <div className="product-gallery">
        <button
          type="button"
          className="product-gallery-main"
          onClick={() => setLightboxOpen(true)}
          aria-label="View full-size image"
        >
          <CmsImage src={activeSrc} alt={title} fill priority />
        </button>

        {list.length > 1 && (
          <div className="product-gallery-thumbs" role="tablist" aria-label="Product images">
            {list.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                className={`product-gallery-thumb${i === activeIndex ? ' is-active' : ''}`}
                onClick={() => setActiveIndex(i)}
              >
                <CmsImage src={src} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      {lightboxOpen && (
        <div
          className="product-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — image ${activeIndex + 1} of ${list.length}`}
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            className="product-lightbox-close"
            aria-label="Close"
            onClick={() => setLightboxOpen(false)}
          >
            ×
          </button>

          {list.length > 1 && (
            <>
              <button
                type="button"
                className="product-lightbox-nav product-lightbox-nav--prev"
                aria-label="Previous image"
                onClick={(e) => {
                  e.stopPropagation()
                  goPrev()
                }}
              >
                ‹
              </button>
              <button
                type="button"
                className="product-lightbox-nav product-lightbox-nav--next"
                aria-label="Next image"
                onClick={(e) => {
                  e.stopPropagation()
                  goNext()
                }}
              >
                ›
              </button>
            </>
          )}

          <div className="product-lightbox-stage" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resolveCmsImage(activeSrc)} alt={title} className="product-lightbox-image" />
            {list.length > 1 && (
              <p className="product-lightbox-counter">
                {activeIndex + 1} / {list.length}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
