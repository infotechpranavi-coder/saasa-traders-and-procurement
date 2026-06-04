import Image from 'next/image'
import Link from 'next/link'

interface DetailPageContentProps {
  image: string
  title: string
  label: string
  overview: string[]
  listTitle: string
  listItems: string[]
  secondaryTitle: string
  secondaryItems: string[]
  backHref: string
  backLabel: string
}

export default function DetailPageContent({
  image,
  title,
  label,
  overview,
  listTitle,
  listItems,
  secondaryTitle,
  secondaryItems,
  backHref,
  backLabel,
}: DetailPageContentProps) {
  return (
    <article className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors mb-8"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to {backLabel}
        </Link>

        <div className="relative mb-10 h-72 md:h-96 overflow-hidden rounded-[22px]">
          <Image src={image} alt={title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 896px" priority />
          <span className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
            {label}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {overview.map((paragraph) => (
              <p key={paragraph} className="hp-body">
                {paragraph}
              </p>
            ))}
          </div>

          <aside className="rounded-[22px] bg-[#f4f5f7] p-6 h-fit">
            <h3 className="hp-subtitle mb-4">{listTitle}</h3>
            <ul className="space-y-3">
              {listItems.map((item) => (
                <li key={item} className="hp-body flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>

        <div className="mt-12 rounded-[22px] border border-gray-100 p-8">
          <h3 className="hp-subtitle text-xl mb-4">{secondaryTitle}</h3>
          <div className="flex flex-wrap gap-2">
            {secondaryItems.map((item) => (
              <span
                key={item}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Link href="/contact" className="btn-primary inline-flex">
            Request Quote
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 text-sm font-semibold text-dark hover:border-primary hover:text-primary transition-colors"
          >
            View all {backLabel.toLowerCase()}
          </Link>
        </div>
      </div>
    </article>
  )
}
