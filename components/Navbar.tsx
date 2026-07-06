'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BrandLogo from './BrandLogo'
import BrochureDownloadButton from './BrochureDownloadButton'
import { useBrochureContext } from './BrochureProvider'
import { MobileNavAccordion, NavMegaMenuItem } from './NavMegaMenu'
import { COMPANY_NAME, COMPANY_TAGLINE } from '@/lib/brand'
import { buildNavItems } from '@/lib/build-nav'
import type { CmsData, BrochureFile } from '@/types/cms'
import type { NavItem, NavbarVariant } from '@/types'

interface NavbarProps {
  variant?: NavbarVariant
}

interface SearchItem {
  title: string
  href: string
  type: 'page' | 'product' | 'service' | 'blog'
  keywords: string
}

const STATIC_SEARCH_ITEMS: SearchItem[] = [
  { title: 'Home', href: '/', type: 'page', keywords: 'home landing saasa b2e' },
  { title: 'About Us', href: '/about', type: 'page', keywords: 'about company firm team' },
  { title: 'Services', href: '/services', type: 'page', keywords: 'services expertise offerings' },
  { title: 'Products', href: '/products', type: 'page', keywords: 'products parts machinery' },
  { title: 'Blog', href: '/blog', type: 'page', keywords: 'blog news articles posts' },
  { title: 'FAQ', href: '/faq', type: 'page', keywords: 'faq questions help support answers' },
  { title: 'Contact Us', href: '/contact', type: 'page', keywords: 'contact phone email quote procurement yaounde cameroon' },
  { title: 'Strong Brands', href: '/products/brands', type: 'page', keywords: 'brands oem manufacturers equipment' },
]

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [navBlend, setNavBlend] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchItems, setSearchItems] = useState<SearchItem[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchHydrated, setSearchHydrated] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cms, setCms] = useState<CmsData | null>(null)
  const isHero = variant === 'hero'
  const blendRef = useRef(0)
  const router = useRouter()

  useEffect(() => {
    if (!isHero) return

    let frame = 0
    let targetBlend = 0

    const measure = () => {
      const header = document.querySelector('.hero-cinematic-header')
      if (!header) return

      const headerBottom = header.getBoundingClientRect().bottom
      const navHeight = window.innerWidth >= 1024 ? 80 : 72
      const blendStart = navHeight + 72
      const blendEnd = navHeight - 4

      const raw = (blendStart - headerBottom) / (blendStart - blendEnd)
      targetBlend = Math.min(Math.max(raw, 0), 1)
    }

    const tick = () => {
      measure()
      blendRef.current = lerp(blendRef.current, targetBlend, 0.55)
      setNavBlend(blendRef.current)
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isHero])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchHydrated) return

    let active = true
    setSearchLoading(true)

    fetch('/api/cms')
      .then(async (res) => {
        if (!res.ok) return null
        return (await res.json()) as CmsData
      })
      .then((cms) => {
        if (!active) return
        const cmsItems: SearchItem[] = cms
          ? [
              ...cms.products.map((p) => ({
                title: p.title,
                href: `/products/${p.slug}`,
                type: 'product' as const,
                keywords: `${p.title} ${p.label} ${p.desc} ${p.specs.join(' ')}`,
              })),
              ...cms.services.map((s) => ({
                title: s.title,
                href: `/services/${s.slug}`,
                type: 'service' as const,
                keywords: `${s.title} ${s.summary} ${s.capabilities.join(' ')}`,
              })),
              ...cms.blogs.map((b) => ({
                title: b.title,
                href: `/blog/${b.slug}`,
                type: 'blog' as const,
                keywords: `${b.title} ${b.author} ${b.cat} ${b.body.join(' ')}`,
              })),
            ]
          : []

        setSearchItems([...STATIC_SEARCH_ITEMS, ...cmsItems])
        setCms(cms)
        setSearchHydrated(true)
      })
      .finally(() => {
        if (active) setSearchLoading(false)
      })

    return () => {
      active = false
    }
  }, [searchHydrated])

  const filteredSearchItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const source = searchHydrated ? searchItems : STATIC_SEARCH_ITEMS
    if (!query) return source.slice(0, 10)

    return source
      .filter((item) => `${item.title} ${item.keywords}`.toLowerCase().includes(query))
      .slice(0, 12)
  }, [searchHydrated, searchItems, searchQuery])

  const goToSearchItem = (href: string) => {
    setShowSuggestions(false)
    setSearchQuery('')
    router.push(href)
  }

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const first = filteredSearchItems[0]
    if (first) {
      goToSearchItem(first.href)
    }
  }

  const navItems = useMemo(() => buildNavItems(cms), [cms])
  const contextBrochure = useBrochureContext()
  const brochure = cms?.brochure?.url ? cms.brochure : contextBrochure

  const solidNavContent = (
    <div className="flex h-[72px] min-w-0 items-center justify-between gap-2 overflow-hidden px-4 sm:h-[80px] sm:gap-3 sm:px-5 lg:h-[88px] lg:px-6 xl:px-8">
      <NavContent
        navItems={navItems}
        brochure={brochure}
        mode="solid"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        searchQuery={searchQuery}
        searchLoading={searchLoading}
        searchItems={filteredSearchItems}
        showSuggestions={showSuggestions}
        setShowSuggestions={setShowSuggestions}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        onSearchSelect={goToSearchItem}
      />
    </div>
  )

  const navInner = isHero ? (
    <NavInner
      navItems={navItems}
      brochure={brochure}
      blend={navBlend}
      mobileOpen={mobileOpen}
      setMobileOpen={setMobileOpen}
      searchQuery={searchQuery}
      searchLoading={searchLoading}
      searchItems={filteredSearchItems}
      showSuggestions={showSuggestions}
      setShowSuggestions={setShowSuggestions}
      onSearchChange={setSearchQuery}
      onSearchSubmit={handleSearchSubmit}
      onSearchSelect={goToSearchItem}
    />
  ) : (
    solidNavContent
  )

  if (isHero) {
    const shellPadding = 16 * (1 - navBlend)
    const isSolidMenu = navBlend > 0.5
    const isSolidShell = navBlend > 0.92

    return (
      <>
        <nav
          className="hero-nav-fixed"
          style={
            {
              top: 0,
              '--nav-blend': navBlend,
              paddingLeft: `${shellPadding}px`,
              paddingRight: `${shellPadding}px`,
            } as React.CSSProperties
          }
        >
          <div className={isSolidShell ? 'max-w-[1400px] mx-auto' : 'hero-nav-floating-wrap max-w-[1400px] mx-auto'}>
            <div
              className={
                isSolidShell ? 'hero-nav-shell site-nav-solid-shell' : 'hero-nav-shell hero-nav-blend-shell'
              }
            >
              {isSolidShell ? solidNavContent : navInner}
            </div>
          </div>
          {mobileOpen && (
            <MobileMenu
              navItems={navItems}
              brochure={brochure}
              onClose={() => setMobileOpen(false)}
              solid={isSolidMenu}
              className={
                isSolidMenu
                  ? 'max-w-[1400px] mx-auto site-nav-mobile-menu lg:hidden'
                  : 'max-w-[1400px] mx-auto hero-nav-mobile-menu lg:hidden'
              }
            />
          )}
        </nav>
        <div className="hero-nav-spacer" style={{ height: `${(72 + (navBlend > 0 ? 8 : 0)) * navBlend}px` }} aria-hidden />
      </>
    )
  }

  return (
    <nav className={`site-nav-default fixed top-0 left-0 right-0 z-[100] px-4 lg:px-8 ${scrolled ? 'site-nav-default--scrolled' : ''}`}>
      <div className="hero-nav-shell site-nav-solid-shell max-w-[1400px] mx-auto">{solidNavContent}</div>
      {mobileOpen && (
        <MobileMenu
          navItems={navItems}
          brochure={brochure}
          onClose={() => setMobileOpen(false)}
          solid
          className="max-w-[1400px] mx-auto site-nav-mobile-menu lg:hidden"
        />
      )}
    </nav>
  )
}

function NavInner({
  navItems,
  brochure,
  blend,
  mobileOpen,
  setMobileOpen,
  searchQuery,
  searchLoading,
  searchItems,
  showSuggestions,
  setShowSuggestions,
  onSearchChange,
  onSearchSubmit,
  onSearchSelect,
}: {
  navItems: NavItem[]
  brochure?: BrochureFile | null
  blend: number
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  searchQuery: string
  searchLoading: boolean
  searchItems: SearchItem[]
  showSuggestions: boolean
  setShowSuggestions: (value: boolean) => void
  onSearchChange: (value: string) => void
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onSearchSelect: (href: string) => void
}) {
  const mode: 'floating' | 'solid' = blend > 0.5 ? 'solid' : 'floating'

  return (
    <div className="relative w-full min-h-[80px] overflow-visible lg:min-h-[88px]">
      <div className="relative flex min-h-[72px] w-full min-w-0 items-center justify-between gap-2 overflow-visible px-4 sm:min-h-[80px] sm:gap-3 sm:px-5 lg:min-h-[88px] lg:px-6 xl:px-8">
        <NavContent
          navItems={navItems}
          brochure={brochure}
          mode={mode}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          searchQuery={searchQuery}
          searchLoading={searchLoading}
          searchItems={searchItems}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onSearchSelect={onSearchSelect}
        />
      </div>
    </div>
  )
}

function NavContent({
  navItems,
  brochure,
  mode,
  mobileOpen,
  setMobileOpen,
  searchQuery,
  searchLoading,
  searchItems,
  showSuggestions,
  setShowSuggestions,
  onSearchChange,
  onSearchSubmit,
  onSearchSelect,
}: {
  navItems: NavItem[]
  brochure?: BrochureFile | null
  mode: 'floating' | 'solid'
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
  searchQuery: string
  searchLoading: boolean
  searchItems: SearchItem[]
  showSuggestions: boolean
  setShowSuggestions: (value: boolean) => void
  onSearchChange: (value: string) => void
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onSearchSelect: (href: string) => void
}) {
  const floating = mode === 'floating'
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <>
      <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5 lg:gap-3">
        <span className={`nav-logo-wrap ${floating ? 'min-w-[120px] sm:min-w-[140px] lg:min-w-[130px] xl:min-w-[170px]' : 'min-w-[110px] sm:min-w-[120px] lg:min-w-[130px] xl:min-w-[145px]'}`}>
          <BrandLogo
            variant="nav"
            className={floating ? 'brand-logo brand-logo--hero' : 'brand-logo brand-logo--nav'}
            priority
          />
        </span>
        <div className="hidden min-w-0 max-w-[108px] sm:block sm:max-w-[118px] 2xl:max-w-[128px]">
          <span
            className={`site-logo-text block text-[9px] sm:text-[10px] lg:text-[11px] leading-tight tracking-tight ${floating ? 'text-white' : 'text-[#0A0E1A]'}`}
          >
            {COMPANY_NAME}
          </span>
          <p
            className={`hidden 2xl:block text-[7px] lg:text-[8px] tracking-[0.08em] font-medium mt-0.5 uppercase leading-tight ${floating ? 'text-white/55' : 'text-gray-500'}`}
          >
            {COMPANY_TAGLINE}
          </p>
        </div>
      </Link>

      <div className="nav-center-links hidden min-w-0 flex-1 items-center justify-center gap-3 overflow-hidden px-1 lg:flex xl:gap-5 2xl:gap-6">
        {navItems.map((item) => (
          <NavMegaMenuItem key={item.label} item={item} floating={floating} />
        ))}
      </div>

      <div className={`nav-actions hidden min-w-0 shrink-0 items-center gap-1.5 lg:flex xl:gap-2 ${searchOpen ? 'nav-actions--search-open' : ''}`}>
        <BrochureDownloadButton brochure={brochure} variant="navbar" floating={floating} iconOnly={searchOpen} />
        <NavSearch
          floating={floating}
          searchQuery={searchQuery}
          searchLoading={searchLoading}
          searchItems={searchItems}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onSearchSelect={onSearchSelect}
          onOpenChange={setSearchOpen}
        />
        <Link
          href="/contact"
          className={`btn-primary nav-quote-btn shrink-0 text-sm ${searchOpen ? 'nav-quote-btn--icon-only' : 'px-4 py-3 xl:px-5'}`}
          aria-label="Request a Quote"
          title="Request a Quote"
        >
          {!searchOpen && (
            <>
              <span className="nav-quote-btn-text">Request a Quote</span>
              <span className="nav-quote-btn-text-short">Quote</span>
            </>
          )}
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
      </div>

      <div className="flex shrink-0 items-center gap-1 lg:hidden">
        <NavSearch
          floating={floating}
          compact
          searchQuery={searchQuery}
          searchLoading={searchLoading}
          searchItems={searchItems}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          onSearchChange={onSearchChange}
          onSearchSubmit={onSearchSubmit}
          onSearchSelect={onSearchSelect}
        />
        <button
          type="button"
          className={`p-2 ${floating ? 'text-white' : 'text-[#0A0E1A]'}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
          </svg>
        </button>
      </div>
    </>
  )
}

function SearchIcon({ className = 'h-[17px] w-[17px]' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

function NavSearch({
  floating,
  compact = false,
  searchQuery,
  searchLoading,
  searchItems,
  showSuggestions,
  setShowSuggestions,
  onSearchChange,
  onSearchSubmit,
  onSearchSelect,
  onOpenChange,
}: {
  floating: boolean
  compact?: boolean
  searchQuery: string
  searchLoading: boolean
  searchItems: SearchItem[]
  showSuggestions: boolean
  setShowSuggestions: (value: boolean) => void
  onSearchChange: (value: string) => void
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  onSearchSelect: (href: string) => void
  onOpenChange?: (open: boolean) => void
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const setSearchOpen = (next: boolean) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  const closeSearch = () => {
    setSearchOpen(false)
    setShowSuggestions(false)
    onSearchChange('')
  }

  const openSearch = () => {
    setSearchOpen(true)
    setShowSuggestions(false)
  }

  const hasQuery = searchQuery.trim().length > 0

  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeSearch()
    }

    let onPointerDown: ((event: MouseEvent) => void) | null = null
    const attachTimer = window.setTimeout(() => {
      onPointerDown = (event: MouseEvent) => {
        if (!wrapRef.current?.contains(event.target as Node)) closeSearch()
      }
      window.addEventListener('mousedown', onPointerDown)
    }, 0)

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.clearTimeout(attachTimer)
      window.removeEventListener('keydown', onKeyDown)
      if (onPointerDown) window.removeEventListener('mousedown', onPointerDown)
    }
  }, [open])

  const shellClass = floating
    ? 'bg-white/10 text-white ring-1 ring-white/20'
    : 'bg-[#f0f0f0] text-gray-700 ring-1 ring-gray-200'

  const suggestions = showSuggestions && open && hasQuery && (
    <div
      className={`nav-search-suggestions absolute z-50 max-h-[320px] overflow-y-auto rounded-xl border border-gray-200 bg-white p-2 shadow-[0_16px_36px_rgba(0,0,0,0.18)] ${
        compact ? 'left-0 right-0 top-[calc(100%+0.5rem)] w-full min-w-[280px]' : 'right-0 top-[calc(100%+0.5rem)] w-[min(320px,calc(100vw-2rem))]'
      }`}
    >
      {searchLoading && <p className="px-2 py-2 text-sm text-gray-500">Loading...</p>}
      {!searchLoading && searchItems.length === 0 && <p className="px-2 py-2 text-sm text-gray-500">No results found.</p>}
      {!searchLoading &&
        searchItems.map((item) => (
          <button
            key={`${item.type}-${item.href}`}
            type="button"
            onMouseDown={() => {
              onSearchSelect(item.href)
              closeSearch()
            }}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-gray-50"
          >
            <span className="text-sm text-gray-800">{item.title}</span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500">
              {item.type}
            </span>
          </button>
        ))}
    </div>
  )

  if (!open) {
    return (
      <button
        type="button"
        onClick={openSearch}
        aria-label="Open search"
        className={`nav-search-toggle flex h-11 w-11 items-center justify-center rounded-full transition ${shellClass} ${
          floating ? 'hover:bg-white/15' : 'hover:bg-[#e8e8e8]'
        }`}
      >
        <SearchIcon />
      </button>
    )
  }

  return (
    <div ref={wrapRef} className={`nav-search-wrap relative ${compact ? 'min-w-[220px] flex-1' : ''}`}>
      <form
        onSubmit={(event) => {
          onSearchSubmit(event)
          closeSearch()
        }}
      >
        <div className={`nav-search-expanded flex h-11 items-center gap-1.5 rounded-full px-2.5 ${shellClass} ${compact ? 'w-full' : 'w-[min(220px,26vw)] lg:w-[min(240px,22vw)] xl:w-[min(260px,18vw)]'}`}>
          <SearchIcon />
          <input
            ref={inputRef}
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value)
              setShowSuggestions(e.target.value.trim().length > 0)
            }}
            onFocus={() => {
              if (searchQuery.trim().length > 0) setShowSuggestions(true)
            }}
            placeholder="Search..."
            aria-label="Search site"
            className={`w-full bg-transparent text-sm outline-none ${
              floating ? 'placeholder:text-white/65' : 'placeholder:text-gray-500'
            }`}
          />
          <button
            type="button"
            onClick={closeSearch}
            aria-label="Close search"
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
              floating ? 'hover:bg-white/15' : 'hover:bg-black/5'
            }`}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </form>
      {suggestions}
    </div>
  )
}

interface MobileMenuProps {
  navItems: NavItem[]
  brochure?: BrochureFile | null
  onClose: () => void
  className: string
  solid: boolean
}

function MobileMenu({ navItems, brochure, onClose, className, solid }: MobileMenuProps) {
  return (
    <div className={className}>
      <MobileNavAccordion navItems={navItems} brochure={brochure} onClose={onClose} solid={solid} />
    </div>
  )
}
