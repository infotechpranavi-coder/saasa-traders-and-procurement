'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, ChevronRight } from 'lucide-react'
import type { BrochureFile } from '@/types/cms'
import type { NavItem, NavSubItem } from '@/types'
import BrochureDownloadButton from './BrochureDownloadButton'

interface NavMegaMenuProps {
  item: NavItem
  floating: boolean
  onNavigate?: () => void
}

export function NavMegaMenuItem({ item, floating, onNavigate }: NavMegaMenuProps) {
  const menuId = useId()
  const triggerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const flyoutTimerRef = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [hoveredCategoryIndex, setHoveredCategoryIndex] = useState<number | null>(null)

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const clearFlyoutTimer = useCallback(() => {
    if (flyoutTimerRef.current !== null) {
      window.clearTimeout(flyoutTimerRef.current)
      flyoutTimerRef.current = null
    }
  }, [])

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200
    const primaryWidth = 270
    const flyoutWidth = 320
    const totalRequiredWidth = primaryWidth + flyoutWidth + 24 // ~614px

    // Align dropdown left edge with the trigger item
    let left = rect.left - 8

    // If opening flyout to the right would exceed the screen width, shift left
    if (left + totalRequiredWidth > viewportWidth - 16) {
      left = Math.max(16, viewportWidth - totalRequiredWidth - 16)
    }
    if (left < 16) left = 16

    setPanelStyle({
      top: rect.bottom + 8,
      left,
    })
  }, [])

  const openMenu = useCallback(() => {
    clearCloseTimer()
    updatePanelPosition()
    setOpen(true)
  }, [clearCloseTimer, updatePanelPosition])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false)
      setHoveredCategoryIndex(null)
    }, 200)
  }, [clearCloseTimer])

  const closeMenu = useCallback(() => {
    clearCloseTimer()
    clearFlyoutTimer()
    setOpen(false)
    setHoveredCategoryIndex(null)
  }, [clearCloseTimer, clearFlyoutTimer])

  const handleCategoryMouseEnter = (index: number) => {
    clearFlyoutTimer()
    setHoveredCategoryIndex(index)
  }

  const handleCategoryMouseLeave = () => {
    clearFlyoutTimer()
    flyoutTimerRef.current = window.setTimeout(() => {
      setHoveredCategoryIndex(null)
    }, 180)
  }

  const handleFlyoutMouseEnter = () => {
    clearFlyoutTimer()
  }

  const handleFlyoutMouseLeave = () => {
    clearFlyoutTimer()
    flyoutTimerRef.current = window.setTimeout(() => {
      setHoveredCategoryIndex(null)
    }, 180)
  }

  useEffect(() => {
    if (!open) {
      setHoveredCategoryIndex(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    updatePanelPosition()

    const onScrollOrResize = () => updatePanelPosition()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu()
    }
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || panelRef.current?.contains(target)) return
      closeMenu()
    }

    window.addEventListener('scroll', onScrollOrResize, true)
    window.addEventListener('resize', onScrollOrResize)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onPointerDown)

    return () => {
      window.removeEventListener('scroll', onScrollOrResize, true)
      window.removeEventListener('resize', onScrollOrResize)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onPointerDown)
    }
  }, [closeMenu, open, updatePanelPosition])

  useEffect(() => () => {
    clearCloseTimer()
    clearFlyoutTimer()
  }, [clearCloseTimer, clearFlyoutTimer])

  if (!item.hasDropdown || !item.children?.length) {
    const className = `nav-link flex items-center gap-1 whitespace-nowrap text-[13px] xl:text-[14px] font-semibold ${
      item.external ? 'nav-link-external ' : ''
    }${
      floating ? 'text-white/90 hover:text-white' : 'text-[#1a1a1a] hover:text-primary'
    }`

    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onNavigate}
          className={className}
          title={item.label}
        >
          {item.label}
        </a>
      )
    }

    return (
      <Link href={item.href} onClick={onNavigate} className={className}>
        {item.label}
      </Link>
    )
  }

  const [viewAll, ...categories] = item.children
  const hoveredCategory = hoveredCategoryIndex !== null ? categories[hoveredCategoryIndex] : null

  const triggerClass = `nav-link flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold ${
    floating ? 'text-white/90 hover:text-white' : 'text-[#1a1a1a] hover:text-primary'
  } ${open ? (floating ? 'text-white' : 'text-primary') : ''}`

  const panel = open ? (
    <div
      ref={panelRef}
      id={menuId}
      role="menu"
      className="nav-flyout-portal"
      style={{ top: panelStyle.top, left: panelStyle.left }}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <div className="relative flex items-start">
        {/* Single box: sub-category names only */}
        <div className="w-[270px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col z-20">
          {/* Header */}
          <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {item.label === 'Products' ? 'Product Categories' : 'Service Categories'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400">
              {categories.length}
            </span>
          </div>

          {/* Categories List */}
          <div className="p-2 space-y-0.5 max-h-[400px] overflow-y-auto nav-mega-scroll">
            {categories.map((category, idx) => {
              const isHovered = hoveredCategoryIndex === idx
              const hasChildren = Boolean(category.children && category.children.length > 0)

              return (
                <div
                  key={category.href}
                  className="relative"
                  onMouseEnter={() => handleCategoryMouseEnter(idx)}
                  onMouseLeave={handleCategoryMouseLeave}
                >
                  <Link
                    href={category.href}
                    onClick={() => {
                      closeMenu()
                      onNavigate?.()
                    }}
                    className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all ${
                      isHovered
                        ? 'bg-orange-50 text-primary font-bold shadow-sm border border-orange-200/80'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-1">
                      <span
                        className={`h-1.5 w-1.5 rounded-full shrink-0 transition-all ${
                          isHovered ? 'bg-primary scale-125' : 'bg-slate-300 group-hover:bg-slate-400'
                        }`}
                      />
                      <span className="truncate text-xs">{category.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {hasChildren && (
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full transition-colors ${
                            isHovered
                              ? 'bg-orange-100 text-primary'
                              : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                          }`}
                        >
                          {category.children!.length}
                        </span>
                      )}
                      <ChevronRight
                        className={`h-3.5 w-3.5 transition-all ${
                          isHovered
                            ? 'text-primary translate-x-0.5'
                            : 'text-slate-300 group-hover:text-slate-500'
                        }`}
                      />
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>

          {/* Footer Link: View all products / services */}
          {viewAll && (
            <div className="p-2 border-t border-slate-100 bg-slate-50/60">
              <Link
                href={viewAll.href}
                onClick={() => {
                  closeMenu()
                  onNavigate?.()
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-primary hover:bg-orange-50 transition-colors"
              >
                <span>{viewAll.label}</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform hover:translate-x-0.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Secondary flyout box: shows products/services under category ONLY ON HOVER EVENT */}
        {hoveredCategory && hoveredCategory.children && hoveredCategory.children.length > 0 && (
          <div
            className="absolute left-full top-0 ml-2 w-[290px] sm:w-[320px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col nav-subflyout-box z-30"
            onMouseEnter={handleFlyoutMouseEnter}
            onMouseLeave={handleFlyoutMouseLeave}
          >
            {/* Flyout Header */}
            <div className="px-4 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  {hoveredCategory.label}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {hoveredCategory.children.length} {hoveredCategory.children.length === 1 ? 'item' : 'items'} available
                </span>
              </div>
              <Link
                href={hoveredCategory.href}
                onClick={() => {
                  closeMenu()
                  onNavigate?.()
                }}
                className="text-[11px] font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1 shrink-0 transition-colors"
              >
                <span>View all</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Product / Service Names ONLY */}
            <div className="p-2 space-y-1 max-h-[360px] overflow-y-auto nav-mega-scroll">
              {hoveredCategory.children.map((sub) => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={() => {
                    closeMenu()
                    onNavigate?.()
                  }}
                  className="group flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:text-primary hover:bg-orange-50/70 border border-transparent hover:border-orange-100 transition-all text-xs font-semibold"
                >
                  <span className="truncate pr-2 group-hover:translate-x-0.5 transition-transform">
                    {sub.label}
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </div>

            {/* Quick Footer */}
            <div className="px-4 py-2 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate">Worldwide delivery</span>
              <Link
                href="/contact"
                onClick={() => {
                  closeMenu()
                  onNavigate?.()
                }}
                className="font-bold text-primary hover:underline ml-2 shrink-0"
              >
                Request Quote →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null

  return (
    <>
      <div
        ref={triggerRef}
        className="nav-mega-trigger relative"
        onMouseEnter={openMenu}
        onMouseLeave={scheduleClose}
      >
        <button
          type="button"
          className={triggerClass}
          aria-expanded={open}
          aria-haspopup="menu"
          aria-controls={menuId}
          onClick={() => (open ? closeMenu() : openMenu())}
        >
          {item.label}
          <svg
            className={`mt-0.5 h-3 w-3 transition-transform ${open ? 'rotate-180' : ''} ${
              floating ? 'text-white/50' : 'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {typeof document !== 'undefined' && panel ? createPortal(panel, document.body) : null}
    </>
  )
}

interface MobileNavAccordionProps {
  navItems: NavItem[]
  brochure?: BrochureFile | null
  onClose: () => void
  solid: boolean
}

export function MobileNavAccordion({ navItems, brochure, onClose, solid }: MobileNavAccordionProps) {
  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => (
        <MobileNavItem key={item.label} item={item} onClose={onClose} solid={solid} />
      ))}
      <BrochureDownloadButton brochure={brochure} variant="inline" className="mt-3 w-full justify-center" onNavigate={onClose} />
      <Link href="/contact" className="btn-primary mt-3 justify-center text-sm" onClick={onClose}>
        Request a Quote →
      </Link>
    </div>
  )
}

function MobileNavItem({
  item,
  onClose,
  solid,
}: {
  item: NavItem
  onClose: () => void
  solid: boolean
}) {
  const linkClass = solid
    ? 'text-sm font-semibold text-gray-800 hover:text-primary'
    : 'text-sm font-semibold text-white/90 hover:text-white'

  if (!item.hasDropdown || !item.children?.length) {
    if (item.external) {
      return (
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${linkClass} border-b py-2.5 ${solid ? 'border-gray-100' : 'border-white/10'}`}
          onClick={onClose}
        >
          {item.label}
        </a>
      )
    }

    return (
      <Link href={item.href} className={`${linkClass} border-b py-2.5 ${solid ? 'border-gray-100' : 'border-white/10'}`} onClick={onClose}>
        {item.label}
      </Link>
    )
  }

  const [viewAll, ...categories] = item.children

  return (
    <details className={`nav-mobile-accordion border-b ${solid ? 'border-gray-100' : 'border-white/10'}`}>
      <summary className={`${linkClass} cursor-pointer list-none py-2.5 [&::-webkit-details-marker]:hidden`}>
        <span className="flex items-center justify-between">
          {item.label}
          <svg className="h-4 w-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </summary>
      <div className="pb-3 pl-3">
        {viewAll && (
          <Link href={viewAll.href} className={`${linkClass} block py-1.5 text-xs opacity-80`} onClick={onClose}>
            {viewAll.label}
          </Link>
        )}
        {categories.map((category) => (
          <details key={category.href} className="mt-1">
            <summary className={`${linkClass} cursor-pointer list-none py-1.5 text-xs [&::-webkit-details-marker]:hidden`}>
              <span className="flex items-center justify-between gap-2">
                {category.label}
                {category.children && category.children.length > 0 && (
                  <svg className="h-3.5 w-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </span>
            </summary>
            {category.children && category.children.length > 0 && (
              <div className="pb-2 pl-3">
                <Link href={category.href} className={`${linkClass} block py-1 text-xs opacity-75`} onClick={onClose}>
                  Browse {category.label}
                </Link>
                {category.children.map((sub) => (
                  <Link key={sub.href} href={sub.href} className={`${linkClass} block py-1 text-xs opacity-70`} onClick={onClose}>
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
            {(!category.children || category.children.length === 0) && (
              <Link href={category.href} className={`${linkClass} block py-1 pl-3 text-xs opacity-75`} onClick={onClose}>
                Browse {category.label}
              </Link>
            )}
          </details>
        ))}
      </div>
    </details>
  )
}
