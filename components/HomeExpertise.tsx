'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import CmsImage from './CmsImage'
import { SectionLabelIcon } from './icons/LogisticsIcons'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { HomepageExpertiseItem } from '@/types/cms'

const AUTO_PLAY_MS = 3600

interface HomeExpertiseProps {
  items: HomepageExpertiseItem[]
}

export default function HomeExpertise({ items }: HomeExpertiseProps) {
  const { ref } = useScrollReveal()
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Drag tracking refs to avoid unnecessary re-renders during high-frequency mouse movements
  const isDownRef = useRef(false)
  const startXRef = useRef(0)
  const startScrollLeftRef = useRef(0)
  const hasMovedRef = useRef(false)

  // Calculate slide index on scroll
  const updateActiveIndex = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const slides = track.querySelectorAll<HTMLElement>('.home-expertise-slide')
    if (slides.length === 0) return

    const currentScroll = track.scrollLeft
    let closestIndex = 0
    let minDistance = Infinity

    slides.forEach((slide, idx) => {
      const distance = Math.abs(slide.offsetLeft - track.offsetLeft - currentScroll)
      if (distance < minDistance) {
        minDistance = distance
        closestIndex = idx
      }
    })

    setActiveIndex(closestIndex)
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let timeoutId: number
    const onScroll = () => {
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(updateActiveIndex, 40)
    }

    track.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', updateActiveIndex)

    return () => {
      track.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', updateActiveIndex)
      window.clearTimeout(timeoutId)
    }
  }, [updateActiveIndex])

  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return

    const slides = track.querySelectorAll<HTMLElement>('.home-expertise-slide')
    const target = slides[index]
    if (target) {
      const targetLeft = target.offsetLeft - track.offsetLeft
      track.scrollTo({ left: targetLeft, behavior: 'smooth' })
      setActiveIndex(index)
    }
  }, [])

  const handleNext = useCallback(() => {
    const track = trackRef.current
    if (!track || items.length <= 1) return

    const maxScroll = track.scrollWidth - track.clientWidth
    if (track.scrollLeft >= maxScroll - 20) {
      // Loop back to start smoothly
      track.scrollTo({ left: 0, behavior: 'smooth' })
      setActiveIndex(0)
    } else {
      const nextIndex = Math.min(items.length - 1, activeIndex + 1)
      scrollToIndex(nextIndex)
    }
  }, [activeIndex, items.length, scrollToIndex])

  const handlePrev = useCallback(() => {
    const track = trackRef.current
    if (!track || items.length <= 1) return

    if (track.scrollLeft <= 20) {
      // Loop to end smoothly
      const maxScroll = track.scrollWidth - track.clientWidth
      track.scrollTo({ left: maxScroll, behavior: 'smooth' })
      setActiveIndex(items.length - 1)
    } else {
      const prevIndex = Math.max(0, activeIndex - 1)
      scrollToIndex(prevIndex)
    }
  }, [activeIndex, items.length, scrollToIndex])

  // Autoplay functionality
  useEffect(() => {
    if (isPaused || isDragging || items.length <= 1) return

    const timer = window.setInterval(() => {
      handleNext()
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, isDragging, items.length, handleNext])

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (!track) return

    isDownRef.current = true
    setIsDragging(true)
    hasMovedRef.current = false
    startXRef.current = e.pageX - track.offsetLeft
    startScrollLeftRef.current = track.scrollLeft
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current) return
    const track = trackRef.current
    if (!track) return

    e.preventDefault()
    const x = e.pageX - track.offsetLeft
    const walk = (x - startXRef.current) * 1.3
    if (Math.abs(walk) > 6) {
      hasMovedRef.current = true
    }
    track.scrollLeft = startScrollLeftRef.current - walk
  }

  const handleMouseUp = () => {
    isDownRef.current = false
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    if (isDownRef.current) {
      isDownRef.current = false
      setIsDragging(false)
    }
  }

  // Prevent link navigation if the user was dragging
  const handleCardClick = (e: React.MouseEvent) => {
    if (hasMovedRef.current) {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  if (!items || items.length === 0) return null

  return (
    <section ref={ref} className="home-expertise" aria-label="Products and services slider">
      <div className="home-expertise-container">
        {/* Header with Title and Slider Controls */}
        <div className="home-expertise-header reveal flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8">
          <div>
            <div className="section-label mb-3">
              <SectionLabelIcon className="text-primary" />
              PRODUCTS &amp; SERVICES
            </div>
            <h2 className="hp-title mb-0">Our area of expertise</h2>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-primary hover:text-[#d44a15] transition-colors mr-1"
            >
              View Full Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>

            {items.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="home-expertise-nav-btn"
                  aria-label="Previous product card"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="home-expertise-nav-btn"
                  aria-label="Next product card"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Slider Track Container */}
        <div
          className="home-expertise-slider-wrapper reveal delay-100"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={trackRef}
            className={`home-expertise-slider-track ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {items.map((item, index) => (
              <div key={`${item.kind}-${item.slug}-${index}`} className="home-expertise-slide">
                <Link
                  href={item.href}
                  className="home-expertise-card group block"
                  aria-label={item.title}
                  onClick={handleCardClick}
                  draggable={false}
                >
                  <div className="home-expertise-card-media">
                    <CmsImage
                      src={item.image}
                      alt={item.title}
                      fill
                      className="transition-transform duration-500 group-hover:scale-105 pointer-events-none select-none"
                      sizes="(max-width: 640px) 85vw, (max-width: 1024px) 48vw, 33vw"
                    />
                    <div className="home-expertise-card-fade" aria-hidden />

                    {item.label && (
                      <span className="home-expertise-card-badge" aria-hidden>
                        {item.label}
                      </span>
                    )}

                    <div className="home-expertise-card-foot">
                      <h3 className="home-expertise-card-title">{item.title}</h3>
                      <span className="expertise-card-arrow home-expertise-card-arrow" aria-hidden>
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {items.length > 1 && (
            items.length <= 8 ? (
              <div className="home-expertise-dots" role="tablist" aria-label="Product slides">
                {items.map((item, index) => (
                  <button
                    key={`dot-${item.slug}-${index}`}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={`Slide to ${item.title}`}
                    className={`home-expertise-dot ${index === activeIndex ? 'active' : ''}`}
                    onClick={() => scrollToIndex(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="home-expertise-progress-wrap" aria-label="Slider progress">
                <span className="home-expertise-counter">
                  {String(activeIndex + 1).padStart(2, '0')}
                </span>
                <div className="home-expertise-progress-track">
                  <div
                    className="home-expertise-progress-fill"
                    style={{
                      width: `${Math.max(8, ((activeIndex + 1) / items.length) * 100)}%`,
                    }}
                  />
                </div>
                <span className="home-expertise-counter">
                  {String(items.length).padStart(2, '0')}
                </span>
              </div>
            )
          )}

          {/* Mobile View All Link */}
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
            >
              Explore Full Product Catalog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
