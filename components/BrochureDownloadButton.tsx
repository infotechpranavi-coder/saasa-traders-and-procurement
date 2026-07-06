'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FileDown } from 'lucide-react'
import { useBrochureContext } from './BrochureProvider'
import type { BrochureFile } from '@/types/cms'

type BrochureVariant = 'navbar' | 'floating' | 'inline'

interface BrochureDownloadButtonProps {
  brochure?: BrochureFile | null
  variant?: BrochureVariant
  floating?: boolean
  iconOnly?: boolean
  className?: string
  onNavigate?: () => void
}

const CATALOG_HREF = '/brochure#download'
const catalogLabel = 'Download Catalog'

function scrollToBrochureForm() {
  document.getElementById('download')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BrochureDownloadButton({
  brochure: brochureProp,
  variant = 'inline',
  floating = false,
  iconOnly = false,
  className = '',
  onNavigate,
}: BrochureDownloadButtonProps) {
  const pathname = usePathname()
  const contextBrochure = useBrochureContext()
  const brochure = brochureProp?.url ? brochureProp : contextBrochure

  if (!brochure?.url) return null

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onNavigate?.()
    if (pathname === '/brochure') {
      e.preventDefault()
      scrollToBrochureForm()
    }
  }

  if (variant === 'floating') {
    return (
      <Link
        href={CATALOG_HREF}
        onClick={handleClick}
        className={`floating-contact-btn floating-contact-btn--brochure ${className}`}
        aria-label={catalogLabel}
        title={catalogLabel}
      >
        <FileDown className="floating-contact-icon" strokeWidth={2.2} />
      </Link>
    )
  }

  if (variant === 'navbar') {
    return (
      <Link
        href={CATALOG_HREF}
        onClick={handleClick}
        className={`nav-brochure-btn ${floating ? 'nav-brochure-btn--floating' : 'nav-brochure-btn--solid'} ${iconOnly ? 'nav-brochure-btn--icon-only' : ''} ${className}`}
        aria-label={catalogLabel}
        title={catalogLabel}
      >
        <FileDown className="h-4 w-4 shrink-0" strokeWidth={2.2} />
        {!iconOnly && <span className="nav-brochure-btn-text">Catalog</span>}
      </Link>
    )
  }

  return (
    <Link
      href={CATALOG_HREF}
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white ${className}`}
    >
      <FileDown className="h-4 w-4" strokeWidth={2.2} />
      {catalogLabel}
    </Link>
  )
}
