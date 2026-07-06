'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import CmsImage from './CmsImage'
import type { HeroBanner } from '@/types/cms'
import { normalizeSiteSettings, resolveHeroStats } from '@/lib/site-settings'
import type { SiteSettings } from '@/types/cms'

const SLIDE_MS = 6000

function smoothstep(value: number) {
  const t = Math.min(Math.max(value, 0), 1)
  return t * t * (3 - 2 * t)
}

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor
}

interface HeroProps {
  banners: HeroBanner[]
  siteSettings?: SiteSettings
}

export default function Hero({ banners, siteSettings }: HeroProps) {
  const slides = banners
  const stats = resolveHeroStats(normalizeSiteSettings(siteSettings))
  const stageRef = useRef<HTMLElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [displaySlide, setDisplaySlide] = useState(0)
  const [isContentVisible, setIsContentVisible] = useState(true)
  const progressRef = useRef(0)
  const [scrollVisual, setScrollVisual] = useState({ scale: 1, radius: 0 })

  useEffect(() => {
    if (slides.length === 0) return

    let frame = 0
    let targetProgress = 0

    const measure = () => {
      const stage = stageRef.current
      if (!stage) return

      const scrollRange = stage.offsetHeight - window.innerHeight
      if (scrollRange <= 0) {
        targetProgress = 0
        return
      }

      const raw = Math.min(Math.max(window.scrollY / scrollRange, 0), 1)
      targetProgress = smoothstep(raw)
    }

    const tick = () => {
      measure()
      progressRef.current = lerp(progressRef.current, targetProgress, 0.09)
      const eased = progressRef.current
      setScrollVisual({
        scale: 1 - eased * 0.1,
        radius: eased * 28,
      })
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [slides.length])

  useEffect(() => {
    if (slides.length <= 1) return

    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, SLIDE_MS)

    return () => window.clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    if (activeSlide === displaySlide) return

    setIsContentVisible(false)
    const timer = window.setTimeout(() => {
      setDisplaySlide(activeSlide)
      setIsContentVisible(true)
    }, 420)

    return () => window.clearTimeout(timer)
  }, [activeSlide, displaySlide])

  useEffect(() => {
    if (displaySlide >= slides.length) {
      setDisplaySlide(0)
      setActiveSlide(0)
    }
  }, [displaySlide, slides.length])

  if (slides.length === 0) {
    return null
  }

  const slide = slides[displaySlide]

  return (
    <section ref={stageRef} className="hero-scroll-stage" aria-label="Hero">
      <div
        className="hero-cinematic-shell"
        style={{
          transform: `scale(${scrollVisual.scale})`,
          borderRadius: `${scrollVisual.radius}px`,
        }}
      >
        <div className="hero-cinematic-inner">
          {slides.map((item, index) => (
            <div
              key={item.slug}
              className={`hero-cinematic-bg ${index === activeSlide ? 'hero-cinematic-bg--active' : ''}`}
              aria-hidden={index !== activeSlide}
            >
              <CmsImage
                src={item.image}
                alt=""
                fill
                priority={index === 0}
                className="hero-cinematic-image"
                sizes="100vw"
              />
            </div>
          ))}

          <div className="hero-cinematic-overlay" />

          <div className="hero-cinematic-content">
            <div className={`hero-cinematic-copy ${isContentVisible ? 'hero-cinematic-copy--visible' : 'hero-cinematic-copy--hidden'}`}>
              <span className="hero-cinematic-badge">{slide.badge}</span>

              <h1 className="hero-cinematic-title">
                <span className="hero-cinematic-title-main">{slide.title}</span>
                {slide.titleAccent && <span className="hero-cinematic-title-accent">{slide.titleAccent}</span>}
              </h1>

              <p className="hero-cinematic-desc">{slide.subtitle}</p>

              <div className="hero-cinematic-actions">
                <Link href="/contact" className="hero-cinematic-btn hero-cinematic-btn--primary">
                  Free Quote
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
                <Link href="/products" className="hero-cinematic-btn hero-cinematic-btn--outline">
                  View Products
                  <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                </Link>
              </div>
            </div>
          </div>

          <div className="hero-cinematic-footer">
            <div className="hero-cinematic-stats">
              {stats.map((item) => (
                <div key={item.label} className="hero-cinematic-stat">
                  <span className="hero-cinematic-stat-value">{item.value}</span>
                  <span className="hero-cinematic-stat-label">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-cinematic-counter">
              {String(activeSlide + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
            </div>

            <div className="hero-cinematic-dots" role="tablist" aria-label="Hero slides">
              {slides.map((item, index) => (
                <button
                  key={item.slug}
                  type="button"
                  role="tab"
                  aria-selected={index === activeSlide}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`hero-cinematic-dot ${index === activeSlide ? 'hero-cinematic-dot--active' : ''}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
