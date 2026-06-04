import Link from 'next/link'

export interface BreadcrumbTrailItem {
  label: string
  href?: string
}

interface PageHeroProps {
  title: string
  breadcrumb: string
  breadcrumbHref?: string
  trail?: BreadcrumbTrailItem[]
}

export default function PageHero({ title, breadcrumb, breadcrumbHref, trail }: PageHeroProps) {
  const items: BreadcrumbTrailItem[] =
    trail ??
    (breadcrumbHref
      ? [{ label: breadcrumb, href: breadcrumbHref }, { label: title }]
      : [{ label: breadcrumb }])

  return (
    <div className="page-hero relative overflow-hidden bg-[#0d1b2a] pt-28 pb-20 md:pt-32 md:pb-24">
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.15) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.15) 1px,transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 text-center">
        <h1 className="page-hero-title mb-4">{title}</h1>
        <div className="page-hero-breadcrumb flex flex-wrap items-center justify-center gap-2">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          {items.map((item, index) => {
            const isLast = index === items.length - 1
            return (
              <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {item.href && !isLast ? (
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-primary' : undefined}>{item.label}</span>
                )}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
