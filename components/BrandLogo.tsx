import { LOGO_ALT, LOGO_NAV_SRC, LOGO_SRC } from '@/lib/brand'

interface BrandLogoProps {
  className?: string
  priority?: boolean
  /** Use trimmed nav asset (no empty PNG padding) */
  variant?: 'nav' | 'full'
}

/** Native img — avoids Next image optimizer memory spikes on Windows dev */
export default function BrandLogo({
  className = 'brand-logo',
  priority = false,
  variant = 'nav',
}: BrandLogoProps) {
  const src = variant === 'nav' ? LOGO_NAV_SRC : LOGO_SRC

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={LOGO_ALT}
      className={className}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
    />
  )
}
