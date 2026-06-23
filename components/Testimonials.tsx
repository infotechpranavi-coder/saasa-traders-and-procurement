'use client'

import CmsImage from './CmsImage'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionLabelIcon } from './icons/LogisticsIcons'
import type { CustomerReview } from '@/types/cms'

interface TestimonialsProps {
  reviews: CustomerReview[]
}

function StarRating() {
  return (
    <div className="testimonial-stars" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, index) => (
        <svg key={index} className="testimonial-star" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials({ reviews }: TestimonialsProps) {
  const { ref } = useScrollReveal()

  if (!reviews.length) return null

  return (
    <section ref={ref} className="testimonials-section py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-14 reveal">
          <div className="section-label justify-center mb-3">
            <SectionLabelIcon className="text-primary" />
            CLIENT FEEDBACK
          </div>
          <h2 className="testimonials-heading">What Our Clients Say About Us</h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-7 lg:gap-9">
          {reviews.map((testimonial, index) => (
            <article key={testimonial.slug} className={`reveal delay-${(index % 3) + 1}00`}>
              <div className="testimonial-bubble-wrap">
                <div className="testimonial-card">
                  <span className="testimonial-watermark" aria-hidden>
                    &ldquo;
                  </span>

                  <blockquote className="testimonial-quote">{testimonial.quote}</blockquote>

                  <div className="testimonial-card-footer">
                    <StarRating />
                  </div>

                  <div className="testimonial-quote-badge" aria-hidden>
                    <span>&rdquo;</span>
                  </div>
                </div>
              </div>

              <div className="testimonial-author">
                <div className="testimonial-avatar relative overflow-hidden">
                  <CmsImage
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div>
                  <div className="testimonial-name">{testimonial.name}</div>
                  <div className="testimonial-role">{testimonial.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
