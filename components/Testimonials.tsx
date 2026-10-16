'use client'

import { UserRound } from 'lucide-react'
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
  if (!reviews.length) return null

  // Ensure only three cards are displayed in the client feedback section
  const displayReviews = reviews.slice(0, 3)

  return (
    <section className="testimonials-section py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-14">
          <div className="section-label justify-center mb-3">
            <SectionLabelIcon className="text-primary" />
            CLIENT FEEDBACK
          </div>
          <h2 className="testimonials-heading">What Our Clients Say About Us</h2>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 md:gap-7 lg:gap-9">
          {displayReviews.map((testimonial) => (
            <article key={testimonial.slug} className="flex flex-col">
              <div className="testimonial-bubble-wrap flex-1 flex flex-col">
                <div className="testimonial-card flex-1">
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
                <div className="testimonial-avatar relative overflow-hidden flex items-center justify-center">
                  <div className="testimonial-avatar-fallback flex items-center justify-center bg-orange-50/80 rounded-full w-full h-full">
                    <UserRound className="w-8 h-8 text-primary" strokeWidth={1.8} />
                  </div>
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
