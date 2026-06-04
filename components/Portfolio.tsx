'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionLabelIcon, type LogisticsIconName } from './icons/LogisticsIcons'

const AUTO_PLAY_MS = 2600
const TRANSITION_MS = 550

const projects: {
  icon: LogisticsIconName
  image: string
  label: string
  title: string
}[] = [
  {
    icon: 'truck',
    image: '/images/services/road.jpg',
    label: 'Road Transport',
    title: 'Freight Fleet Expansion',
  },
  {
    icon: 'bus',
    image: '/images/about/truck.jpg',
    label: 'Transport',
    title: 'Electric Bus Fleet Implementation',
  },
  {
    icon: 'port',
    image: '/images/solutions/port.jpg',
    label: 'Port Logistics',
    title: 'Smart Port Management System',
  },
  {
    icon: 'ship',
    image: '/images/services/sea.jpg',
    label: 'Sea Freight',
    title: 'Container Ship Operations',
  },
  {
    icon: 'train',
    image: '/images/services/rail.jpg',
    label: 'Rail Freight',
    title: 'Cross-Continental Rail Network',
  },
]

const loopSlides = [...projects, ...projects]

export default function Portfolio() {
  const { ref } = useScrollReveal()
  const containerRef = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [trackOffset, setTrackOffset] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [disableTransition, setDisableTransition] = useState(false)

  const dotIndex = slideIndex % projects.length

  const centerActiveSlot = useCallback(() => {
    const container = containerRef.current
    const activeSlot = slotRefs.current[slideIndex]
    if (!container || !activeSlot) return

    const containerCenter = container.offsetWidth / 2
    const slotCenter = activeSlot.offsetLeft + activeSlot.offsetWidth / 2
    setTrackOffset(containerCenter - slotCenter)
  }, [slideIndex])

  useEffect(() => {
    centerActiveSlot()
    const onResize = () => centerActiveSlot()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [centerActiveSlot])

  useEffect(() => {
    if (slideIndex !== projects.length) return

    const timer = window.setTimeout(() => {
      setDisableTransition(true)
      setSlideIndex(0)
    }, TRANSITION_MS)

    return () => window.clearTimeout(timer)
  }, [slideIndex])

  useEffect(() => {
    if (!disableTransition) return

    centerActiveSlot()
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setDisableTransition(false))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [disableTransition, centerActiveSlot])

  useEffect(() => {
    if (isPaused) return

    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev >= projects.length ? prev : prev + 1))
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused])

  const goToSlide = (index: number) => {
    setSlideIndex(index)
  }

  return (
    <section ref={ref} className="portfolio-section py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 reveal">
          <div className="section-label justify-center mb-3">
            <SectionLabelIcon className="text-primary" />
            SEE OUR PORTFOLIO
          </div>
          <h2 className="hp-title hp-title--center">
            Explore Our Recent Work
          </h2>
        </div>

        <div
          ref={containerRef}
          className="portfolio-slider reveal delay-200"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            className="portfolio-slider-track"
            style={{
              transform: `translateX(${trackOffset}px)`,
              transitionDuration: disableTransition ? '0ms' : `${TRANSITION_MS}ms`,
            }}
          >
            {loopSlides.map((project, index) => {
              const isActive = index === slideIndex

              return (
                <div
                  key={`${project.title}-${index}`}
                  ref={(el) => {
                    slotRefs.current[index] = el
                  }}
                  className="portfolio-card-slot"
                >
                  <article
                    className={`portfolio-card group ${isActive ? 'portfolio-card--active' : ''}`}
                    style={{ transitionDuration: disableTransition ? '0ms' : `${TRANSITION_MS}ms` }}
                    onClick={() => goToSlide(index >= projects.length ? 0 : index)}
                  >
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 280px, 320px"
                    />
                    <div className="portfolio-card-overlay" />

                    <div
                      className={`absolute inset-0 z-10 flex flex-col justify-end p-5 md:p-6 transition-opacity duration-300 ${
                        isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {isActive && (
                        <Link
                          href="/projects"
                          className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary transition-transform hover:scale-110"
                          aria-label={`View ${project.title}`}
                        >
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 17L17 7M17 7H7M17 7v10"
                            />
                          </svg>
                        </Link>
                      )}
                      <p className="hp-label-sm mb-1 text-gray-300">{project.label}</p>
                      <h3 className="hp-subtitle text-white">{project.title}</h3>
                    </div>
                  </article>
                </div>
              )
            })}
          </div>

          <div className="portfolio-slider-dots" role="tablist" aria-label="Portfolio slides">
            {projects.map((project, index) => (
              <button
                key={project.title}
                type="button"
                role="tab"
                aria-selected={index === dotIndex}
                aria-label={`Show ${project.title}`}
                className={`portfolio-slider-dot ${index === dotIndex ? 'portfolio-slider-dot--active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
