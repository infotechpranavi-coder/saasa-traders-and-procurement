'use client'

import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import type { NavItem, NavSubItem } from '@/types'

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
  const [open, setOpen] = useState(false)
  const [panelStyle, setPanelStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const updatePanelPosition = useCallback(() => {
    const trigger = triggerRef.current
    if (!trigger) return
    const rect = trigger.getBoundingClientRect()
    setPanelStyle({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    })
  }, [])

  const openMenu = useCallback(() => {
    clearCloseTimer()
    updatePanelPosition()
    setOpen(true)
  }, [clearCloseTimer, updatePanelPosition])

  const scheduleClose = useCallback(() => {
    clearCloseTimer()
    closeTimerRef.current = window.setTimeout(() => setOpen(false), 180)
  }, [clearCloseTimer])

  const closeMenu = useCallback(() => {
    clearCloseTimer()
    setOpen(false)
  }, [clearCloseTimer])

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

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer])

  if (!item.hasDropdown || !item.children?.length) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`nav-link flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold ${
          floating ? 'text-white/90 hover:text-white' : 'text-[#1a1a1a] hover:text-primary'
        }`}
      >
        {item.label}
      </Link>
    )
  }

  const [viewAll, ...categories] = item.children

  const triggerClass = `nav-link flex items-center gap-1 whitespace-nowrap text-[14px] font-semibold ${
    floating ? 'text-white/90 hover:text-white' : 'text-[#1a1a1a] hover:text-primary'
  } ${open ? (floating ? 'text-white' : 'text-primary') : ''}`

  const panel = open ? (
    <div
      ref={panelRef}
      id={menuId}
      role="menu"
      className="nav-mega-panel nav-mega-panel--portal"
      style={{ top: panelStyle.top, left: panelStyle.left }}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <div className="nav-mega-panel-inner">
        {viewAll && (
          <div className="nav-mega-view-all">
            <Link
              href={viewAll.href}
              role="menuitem"
              onClick={() => {
                closeMenu()
                onNavigate?.()
              }}
              className="nav-mega-view-all-link"
            >
              {viewAll.label}
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
        <div className="nav-mega-grid">
          {categories.map((category) => (
            <MegaCategoryColumn key={category.href} category={category} onNavigate={() => { closeMenu(); onNavigate?.() }} />
          ))}
        </div>
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

function MegaCategoryColumn({
  category,
  onNavigate,
}: {
  category: NavSubItem
  onNavigate?: () => void
}) {
  return (
    <div className="nav-mega-col">
      <Link href={category.href} role="menuitem" onClick={onNavigate} className="nav-mega-col-title">
        {category.label}
      </Link>
      {category.children && category.children.length > 0 ? (
        <ul className="nav-mega-col-list">
          {category.children.map((sub) => (
            <li key={sub.href}>
              <Link href={sub.href} role="menuitem" onClick={onNavigate} className="nav-mega-link">
                {sub.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

interface MobileNavAccordionProps {
  navItems: NavItem[]
  onClose: () => void
  solid: boolean
}

export function MobileNavAccordion({ navItems, onClose, solid }: MobileNavAccordionProps) {
  return (
    <div className="flex flex-col gap-1">
      {navItems.map((item) => (
        <MobileNavItem key={item.label} item={item} onClose={onClose} solid={solid} />
      ))}
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
