'use client'

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

export default function BrochureDownloadButton({
  brochure: brochureProp,
  variant = 'inline',
  floating = false,
  iconOnly = false,
  className = '',
  onNavigate,
}: BrochureDownloadButtonProps) {
  const contextBrochure = useBrochureContext()
  const brochure = brochureProp?.url ? brochureProp : contextBrochure

  if (!brochure?.url) return null

  const catalogLabel = 'Download Catalog'
  const label = 'Download Catalog'

  if (variant === 'floating') {
    return (
      <a
        href={brochure.url}
        download={brochure.fileName}
        target="_blank"
        rel="noopener noreferrer"
        className={`floating-contact-btn floating-contact-btn--brochure ${className}`}
        aria-label={catalogLabel}
        title={catalogLabel}
        onClick={onNavigate}
      >
        <FileDown className="floating-contact-icon" strokeWidth={2.2} />
      </a>
    )
  }

  if (variant === 'navbar') {
    return (
      <a
        href={brochure.url}
        download={brochure.fileName}
        target="_blank"
        rel="noopener noreferrer"
        className={`nav-brochure-btn ${floating ? 'nav-brochure-btn--floating' : 'nav-brochure-btn--solid'} ${iconOnly ? 'nav-brochure-btn--icon-only' : ''} ${className}`}
        aria-label={catalogLabel}
        title={catalogLabel}
        onClick={onNavigate}
      >
        <FileDown className="h-4 w-4 shrink-0" strokeWidth={2.2} />
        {!iconOnly && <span className="nav-brochure-btn-text">Catalog</span>}
      </a>
    )
  }

  return (
    <a
      href={brochure.url}
      download={brochure.fileName}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white ${className}`}
      onClick={onNavigate}
    >
      <FileDown className="h-4 w-4" strokeWidth={2.2} />
      {label}
    </a>
  )
}
