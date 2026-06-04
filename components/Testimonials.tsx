'use client'

import Image from 'next/image'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionLabelIcon } from './icons/LogisticsIcons'

const testimonials = [
  {
    quote:
      'The transport company provides reliable service and delivers on time. Vehicles are well maintained and staff behavior is professional. A good experience. Customer support is helpful, though response time faster.',
    name: 'Sarah Williams',
    role: 'Marketing Manager',
    avatar: '/images/testimonials/sarah.jpg',
  },
  {
    quote:
      'Good transport company with safe handling of goods and timely delivery. Vehicles are well maintained and staff behavior is professional. They were incredibly helpful and available to answer my questions.',
    name: 'Bessie Cooper',
    role: 'Marketing Manager',
    avatar: '/images/testimonials/bessie.jpg',
  },
  {
    quote:
      'I was initially hesitant about switching logistics providers, but Transhub customer support team made the transition logistic seamless. They were incredibly helpful and available to answer my questions.',
    name: 'Jacob Jones',
    role: 'Marketing Manager',
    avatar: '/images/testimonials/jacob.jpg',
  },
]

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

export default function Testimonials() {
  const { ref } = useScrollReveal()

  return (
    <section ref={ref} className="testimonials-section py-20 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12 md:mb-14 reveal">
          <div className="section-label justify-center mb-3">
            <SectionLabelIcon className="text-primary" />
            ABOUT OUR COMPANY
          </div>
          <h2 className="testimonials-heading">What Our Client Say&apos;s about us</h2>
        </div>

        <div className="grid gap-10 md:grid-cols-3 md:gap-7 lg:gap-9">
          {testimonials.map((testimonial, index) => (
            <article key={testimonial.name} className={`reveal delay-${(index + 1) * 100}`}>
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
                <div className="testimonial-avatar">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    width={80}
                    height={80}
                    className="h-full w-full rounded-full object-cover"
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
