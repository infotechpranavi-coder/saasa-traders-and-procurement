'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionLabelIcon } from './icons/LogisticsIcons'
import type { PortfolioProject } from '@/types/cms'

const AUTO_PLAY_MS = 2600
const TRANSITION_MS = 550

interface PortfolioSliderProps {
  projects: PortfolioProject[]
}

export default function PortfolioSlider({ projects }: PortfolioSliderProps) {
  const { ref } = useScrollReveal()
  const containerRef = useRef<HTMLDivElement>(null)
  const slotRefs = useRef<(HTMLDivElement | null)[]>([])
  const [slideIndex, setSlideIndex] = useState(0)
  const [trackOffset, setTrackOffset] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [disableTransition, setDisableTransition] = useState(false)

  const loopSlides = [...projects, ...projects]
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
  }, [slideIndex, projects.length])

  useEffect(() => {
    if (!disableTransition) return

    centerActiveSlot()
    const frame = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setDisableTransition(false))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [disableTransition, centerActiveSlot])

  useEffect(() => {
    if (isPaused || projects.length < 2) return

    const timer = window.setInterval(() => {
      setSlideIndex((prev) => (prev >= projects.length ? prev : prev + 1))
    }, AUTO_PLAY_MS)

    return () => window.clearInterval(timer)
  }, [isPaused, projects.length])

  const goToSlide = (index: number) => {
    setSlideIndex(index)
  }

  if (!projects.length) return null

  return (
    <section ref={ref} className="portfolio-section py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 reveal">
          <div className="section-label justify-center mb-3">
            <SectionLabelIcon className="text-primary" />
            SEE OUR PORTFOLIO
          </div>
          <h2 className="hp-title hp-title--center">Explore Our Recent Work</h2>
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
              const dotTarget = index >= projects.length ? 0 : index

              return (
                <div
                  key={`${project.slug}-${index}`}
                  ref={(el) => {
                    slotRefs.current[index] = el
                  }}
                  className="portfolio-card-slot"
                >
                  <Link
                    href={`/work/${project.slug}`}
                    className={`portfolio-card group block ${isActive ? 'portfolio-card--active' : ''}`}
                    style={{ transitionDuration: disableTransition ? '0ms' : `${TRANSITION_MS}ms` }}
                    onClick={(e) => {
                      if (!isActive) {
                        e.preventDefault()
                        goToSlide(dotTarget)
                      }
                    }}
                    aria-label={`View details: ${project.title}`}
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
                        <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary transition-transform group-hover:scale-110">
                          <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 17L17 7M17 7H7M17 7v10"
                            />
                          </svg>
                        </span>
                      )}
                      <p className="hp-label-sm mb-1 text-gray-300">{project.label}</p>
                      <h3 className="portfolio-card-title hp-subtitle text-white">{project.title}</h3>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>

          {projects.length > 1 && (
            <div className="portfolio-slider-dots" role="tablist" aria-label="Portfolio slides">
              {projects.map((project, index) => (
                <button
                  key={project.slug}
                  type="button"
                  role="tab"
                  aria-selected={index === dotIndex}
                  aria-label={`Show ${project.title}`}
                  className={`portfolio-slider-dot ${index === dotIndex ? 'portfolio-slider-dot--active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
