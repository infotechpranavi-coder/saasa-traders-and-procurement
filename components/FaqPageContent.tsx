'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Headphones, Mail, Package, Phone, Rocket, Search, Wallet } from 'lucide-react'
import { SectionLabelIcon } from '@/components/icons/LogisticsIcons'
import { COMPANY_EMAIL, COMPANY_PHONES } from '@/lib/brand'
import {
  FAQ_CATEGORIES,
  FAQ_INTRO,
  FAQ_ITEMS,
  getFaqsByCategory,
  type FaqCategory,
  type FaqCategoryId,
} from '@/lib/faq-content'

const CATEGORY_ICONS = {
  rocket: Rocket,
  package: Package,
  wallet: Wallet,
  headset: Headphones,
} as const

const CATEGORY_LOOKUP = Object.fromEntries(FAQ_CATEGORIES.map((c) => [c.id, c.title])) as Record<
  FaqCategoryId,
  string
>

function FaqCategoryCard({
  category,
  index,
  active,
  onSelect,
}: {
  category: FaqCategory
  index: number
  active: boolean
  onSelect: (id: FaqCategoryId) => void
}) {
  const Icon = CATEGORY_ICONS[category.icon]
  const count = FAQ_ITEMS.filter((item) => item.categoryId === category.id).length

  return (
    <button
      type="button"
      className={`faq-category-card${active ? ' faq-category-card--active' : ''}`}
      onClick={() => onSelect(category.id)}
    >
      <span className="faq-category-card__index">{String(index + 1).padStart(2, '0')}</span>
      <span className="faq-category-card__icon" aria-hidden>
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <span className="faq-category-card__title">{category.title}</span>
      <span className="faq-category-card__desc">{category.description}</span>
      <span className="faq-category-card__meta">
        {count} question{count === 1 ? '' : 's'}
      </span>
    </button>
  )
}

function FaqAccordionItem({
  id,
  question,
  answer,
  categoryId,
  showCategory,
  open,
  onToggle,
}: {
  id: string
  question: string
  answer: string
  categoryId: FaqCategoryId
  showCategory: boolean
  open: boolean
  onToggle: () => void
}) {
  return (
    <div className={`faq-accordion-item${open ? ' faq-accordion-item--open' : ''}`}>
      <button
        type="button"
        className="faq-accordion-trigger"
        aria-expanded={open}
        aria-controls={`faq-panel-${id}`}
        id={`faq-trigger-${id}`}
        onClick={onToggle}
      >
        <span className="faq-accordion-trigger__main">
          {showCategory && (
            <span className="faq-accordion-tag">{CATEGORY_LOOKUP[categoryId]}</span>
          )}
          <span className="faq-accordion-question">{question}</span>
        </span>
        <span className="faq-accordion-toggle" aria-hidden>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </button>
      <div
        id={`faq-panel-${id}`}
        role="region"
        aria-labelledby={`faq-trigger-${id}`}
        className="faq-accordion-panel"
      >
        <div className="faq-accordion-panel__inner">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  )
}

export default function FaqPageContent() {
  const [activeCategory, setActiveCategory] = useState<FaqCategoryId | null>(null)
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null)
  const [searchQuery, setSearchQuery] = useState('')

  const categoryFiltered = useMemo(() => getFaqsByCategory(activeCategory), [activeCategory])

  const visibleFaqs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return categoryFiltered
    return categoryFiltered.filter(
      (item) =>
        item.question.toLowerCase().includes(query) || item.answer.toLowerCase().includes(query),
    )
  }, [categoryFiltered, searchQuery])

  const selectCategory = (id: FaqCategoryId) => {
    setActiveCategory((current) => (current === id ? null : id))
    setSearchQuery('')
    const first = getFaqsByCategory(id)[0]
    if (first) setOpenId(first.id)
    document.getElementById('faq-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <section className="faq-hero-band">
        <div className="faq-hero-band__grid" aria-hidden />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="faq-hero-band__content">
            <div className="section-label justify-center mb-4">
              <SectionLabelIcon className="text-primary" />
              Help centre
            </div>
            <h2 className="faq-hero-band__title">How can we help you today?</h2>
            <p className="faq-hero-band__lead">{FAQ_INTRO}</p>
            <div className="faq-hero-stats">
              <div className="faq-hero-stat">
                <span className="faq-hero-stat__value">{FAQ_ITEMS.length}+</span>
                <span className="faq-hero-stat__label">Answers</span>
              </div>
              <div className="faq-hero-stat">
                <span className="faq-hero-stat__value">{FAQ_CATEGORIES.length}</span>
                <span className="faq-hero-stat__label">Topics</span>
              </div>
              <div className="faq-hero-stat">
                <span className="faq-hero-stat__value">24h</span>
                <span className="faq-hero-stat__label">Response aim</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-categories">
        <div className="max-w-7xl mx-auto px-4">
          <div className="faq-section-head">
            <h3 className="faq-section-head__title">Browse by topic</h3>
            <p className="faq-section-head__desc">Pick a category to jump straight to related questions.</p>
          </div>
          <div className="faq-category-grid">
            {FAQ_CATEGORIES.map((category, index) => (
              <FaqCategoryCard
                key={category.id}
                category={category}
                index={index}
                active={activeCategory === category.id}
                onSelect={selectCategory}
              />
            ))}
          </div>
          {activeCategory && (
            <div className="faq-filter-pill">
              <span>
                Showing <strong>{CATEGORY_LOOKUP[activeCategory]}</strong>
              </span>
              <button type="button" className="faq-filter-clear" onClick={() => setActiveCategory(null)}>
                Clear filter
              </button>
            </div>
          )}
        </div>
      </section>

      <section id="faq-list" className="faq-list-section">
        <div className="max-w-7xl mx-auto px-4">
          <div className="faq-list-shell">
            <aside className="faq-sidebar">
              <div className="faq-sidebar__glow" aria-hidden />
              <p className="faq-sidebar__eyebrow">Support</p>
              <h2 className="faq-sidebar__title">Frequently Asked Questions</h2>
              <p className="faq-sidebar__text">
                Answers for contractors, fleet operators, and procurement teams. Still stuck? Our team is one message
                away.
              </p>

              <div className="faq-sidebar__contacts">
                {COMPANY_PHONES.map((phone) => (
                  <a key={phone.tel} href={`tel:${phone.tel}`} className="faq-sidebar__contact">
                    <Phone className="h-4 w-4 shrink-0" strokeWidth={2} />
                    <span>{phone.display}</span>
                  </a>
                ))}
                <a href={`mailto:${COMPANY_EMAIL}`} className="faq-sidebar__contact">
                  <Mail className="h-4 w-4 shrink-0" strokeWidth={2} />
                  <span>{COMPANY_EMAIL}</span>
                </a>
              </div>

              <Link href="/contact" className="btn-primary faq-sidebar__cta">
                Contact Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
            </aside>

            <div className="faq-main">
              <div className="faq-search">
                <Search className="faq-search__icon" strokeWidth={2} aria-hidden />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search questions…"
                  className="faq-search__input"
                  aria-label="Search FAQ questions"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="faq-search__clear"
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>

              <p className="faq-results-count">
                {visibleFaqs.length} question{visibleFaqs.length === 1 ? '' : 's'}
                {searchQuery ? ` matching “${searchQuery.trim()}”` : activeCategory ? ' in this topic' : ' available'}
              </p>

              <div className="faq-accordion">
                {visibleFaqs.length === 0 && (
                  <div className="faq-empty">
                    <p>No questions found.</p>
                    <button
                      type="button"
                      className="faq-filter-clear"
                      onClick={() => {
                        setSearchQuery('')
                        setActiveCategory(null)
                      }}
                    >
                      Reset filters
                    </button>
                  </div>
                )}
                {visibleFaqs.map((item) => (
                  <FaqAccordionItem
                    key={item.id}
                    id={item.id}
                    question={item.question}
                    answer={item.answer}
                    categoryId={item.categoryId}
                    showCategory={!activeCategory}
                    open={openId === item.id}
                    onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-cta-band">
        <div className="max-w-7xl mx-auto px-4">
          <div className="faq-cta-band__inner">
            <div>
              <p className="faq-cta-band__eyebrow">Need a custom quote?</p>
              <h3 className="faq-cta-band__title">We&apos;ll answer what the FAQ doesn&apos;t cover.</h3>
              <p className="faq-cta-band__text">
                Share part numbers, equipment models, or project requirements — we respond with sourcing options and
                pricing tailored to your order.
              </p>
            </div>
            <div className="faq-cta-band__actions">
              <Link href="/contact" className="btn-primary">
                Request a Quote
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </Link>
              <Link href="/products" className="faq-cta-band__secondary">
                Browse products
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
