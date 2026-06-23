'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ArrowRight } from 'lucide-react'
import CmsImage from './CmsImage'
import { SITE_IMAGES } from '@/lib/site-content'

const SLIDE_MS = 6000

const slides = [
  {
    image: SITE_IMAGES.hero.equipment,
    badge: 'EST. 2024 • PROCUREMENT & TRADING',
    line1: 'Heavy',
    line2: 'Equipment',
    desc: 'Source construction machinery, earthmoving equipment, and industrial assets through a trusted B2E trading partner.',
  },
  {
    image: SITE_IMAGES.hero.machinery,
    badge: 'EST. 2024 • FLEET SUPPLY',
    line1: 'Earthmoving',
    line2: 'Machinery',
    desc: 'Procure excavators, loaders, dozers, cranes, and road-building equipment through a trusted B2E trading partner.',
  },
  {
    image: SITE_IMAGES.hero.parts,
    badge: 'EST. 2024 • GENUINE PARTS',
    line1: 'Machinery',
    line2: 'Parts',
    desc: 'Genuine and aftermarket parts for excavators, loaders, cranes, and road-building equipment — supplied on time.',
  },
]

const stats = [
  { value: '150+', label: 'PRODUCT LINES' },
  { value: '25+', label: 'YEARS' },
  { value: '2K+', label: 'CLIENTS' },
]

function smoothstep(value: number) {
  const t = Math.min(Math.max(value, 0), 1)
  return t * t * (3 - 2 * t)
}

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor
}

export default function Hero() {
  const stageRef = useRef<HTMLElement>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const [displaySlide, setDisplaySlide] = useState(0)
  const [isContentVisible, setIsContentVisible] = useState(true)
  const progressRef = useRef(0)
  const [scrollVisual, setScrollVisual] = useState({ scale: 1, radius: 0 })

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, SLIDE_MS)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (activeSlide === displaySlide) return

    setIsContentVisible(false)
    const timer = window.setTimeout(() => {
      setDisplaySlide(activeSlide)
      setIsContentVisible(true)
    }, 420)

    return () => window.clearTimeout(timer)
  }, [activeSlide, displaySlide])

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
              key={item.image}
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
                <span className="hero-cinematic-title-main">{slide.line1}</span>
                <span className="hero-cinematic-title-accent">{slide.line2}</span>
              </h1>

              <p className="hero-cinematic-desc">{slide.desc}</p>

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
              {slides.map((_, index) => (
                <button
                  key={index}
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
