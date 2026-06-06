'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import BrandLogo from './BrandLogo'
import { COMPANY_NAME, COMPANY_TAGLINE } from '@/lib/brand'
import type { NavItem, NavbarVariant } from '@/types'

interface NavbarProps {
  variant?: NavbarVariant
}

function lerp(current: number, target: number, factor: number) {
  return current + (target - current) * factor
}

export default function Navbar({ variant = 'default' }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [navBlend, setNavBlend] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isHero = variant === 'hero'
  const blendRef = useRef(0)

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

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', hasDropdown: false },
    { label: 'About', href: '/about', hasDropdown: false },
    { label: 'Services', href: '/services', hasDropdown: false },
    { label: 'Products', href: '/products', hasDropdown: false },
    { label: 'Blog', href: '/blog', hasDropdown: false },
    { label: 'Contact Us', href: '/contact', hasDropdown: false },
  ]

  const solidNavContent = (
    <div className="flex h-[80px] items-center justify-between gap-4 px-5 lg:h-[88px] lg:px-8">
      <NavContent navItems={navItems} mode="solid" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
    </div>
  )

  const navInner = isHero ? (
    <NavInner navItems={navItems} blend={navBlend} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
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
    <nav className={`site-nav-default fixed top-0 left-0 right-0 z-50 px-4 lg:px-8 ${scrolled ? 'site-nav-default--scrolled' : ''}`}>
      <div className="hero-nav-shell site-nav-solid-shell max-w-[1400px] mx-auto">{solidNavContent}</div>
      {mobileOpen && (
        <MobileMenu
          navItems={navItems}
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
  blend,
  mobileOpen,
  setMobileOpen,
}: {
  navItems: NavItem[]
  blend: number
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}) {
  const floatingOpacity = 1 - blend
  const solidOpacity = blend

  return (
    <div className="relative w-full h-[80px] lg:h-[88px]">
      <div
        className="absolute inset-0 flex items-center justify-between gap-4 px-5 lg:px-8 hero-nav-layer"
        style={{ opacity: floatingOpacity, pointerEvents: blend > 0.4 ? 'none' : 'auto' }}
        aria-hidden={blend > 0.4}
      >
        <NavContent navItems={navItems} mode="floating" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>

      <div
        className="absolute inset-0 flex items-center justify-between gap-4 px-5 lg:px-8 hero-nav-layer"
        style={{ opacity: solidOpacity, pointerEvents: blend <= 0.4 ? 'none' : 'auto' }}
        aria-hidden={blend <= 0.4}
      >
        <NavContent navItems={navItems} mode="solid" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      </div>
    </div>
  )
}

function NavContent({
  navItems,
  mode,
  mobileOpen,
  setMobileOpen,
}: {
  navItems: NavItem[]
  mode: 'floating' | 'solid'
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}) {
  const floating = mode === 'floating'

  return (
    <>
      <Link href="/" className="flex items-center gap-3 sm:gap-4 shrink-0">
        <span className="nav-logo-wrap min-w-[180px] sm:min-w-[220px]">
          <BrandLogo
            variant="nav"
            className={floating ? 'brand-logo brand-logo--hero' : 'brand-logo brand-logo--nav'}
            priority
          />
        </span>
        <div className="min-w-0 max-w-[130px] sm:max-w-[145px] lg:max-w-[160px]">
          <span
            className={`site-logo-text block text-[10px] sm:text-[11px] lg:text-[12px] leading-tight tracking-tight ${floating ? 'text-white' : 'text-[#0A0E1A]'}`}
          >
            {COMPANY_NAME}
          </span>
          <p
            className={`hidden sm:block text-[7.5px] lg:text-[8.5px] tracking-[0.08em] font-medium mt-1 uppercase leading-tight ${floating ? 'text-white/55' : 'text-gray-500'}`}
          >
            {COMPANY_TAGLINE}
          </p>
        </div>
      </Link>

      <div className="hidden xl:flex items-center gap-7">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`nav-link flex items-center gap-1 text-[15px] font-semibold ${
              floating ? 'text-white/90 hover:text-white' : 'text-[#1a1a1a] hover:text-primary'
            }`}
          >
            {item.label}
            {item.hasDropdown && (
              <svg className={`w-3 h-3 mt-0.5 ${floating ? 'text-white/50' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </Link>
        ))}
      </div>

      <div className="hidden lg:flex items-center gap-3 shrink-0">
        <button
          type="button"
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            floating ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#f0f0f0] text-gray-700 hover:text-primary'
          }`}
          aria-label="Search"
        >
          <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
        <Link href="/contact" className="btn-primary text-sm px-6 py-3">
          Free Quote
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </Link>
        <button
          type="button"
          className={`w-11 h-11 rounded-full flex items-center justify-center ${
            floating ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-[#0A0E1A] hover:bg-dark text-white'
          }`}
          aria-label="Menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <button
        type="button"
        className={`lg:hidden p-2 ${floating ? 'text-white' : 'text-[#0A0E1A]'}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
        </svg>
      </button>
    </>
  )
}

interface MobileMenuProps {
  navItems: NavItem[]
  onClose: () => void
  className: string
  solid: boolean
}

function MobileMenu({ navItems, onClose, className, solid }: MobileMenuProps) {
  return (
    <div className={className}>
      <div className="flex flex-col gap-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={
              solid
                ? 'text-sm font-semibold text-gray-800 hover:text-primary py-2 border-b border-gray-100'
                : 'text-sm font-semibold text-white/90 hover:text-white py-2 border-b border-white/10'
            }
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        <Link href="/contact" className="btn-primary text-sm mt-2 justify-center" onClick={onClose}>
          Free Quote →
        </Link>
      </div>
    </div>
  )
}
