import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import { SectionLabelIcon } from '../../components/icons/LogisticsIcons'
import { getProductCategories, getProducts } from '@/lib/cms'

export const metadata: Metadata = { title: 'Products - TransHub' }
export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const products = await getProducts()
  const categories = await getProductCategories()

  return (
    <PageLayout>
      <PageHero title="Our Products" breadcrumb="Products" />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <div className="section-label justify-center mb-3">
              <SectionLabelIcon className="text-primary" />
              CONSTRUCTION MACHINERY PARTS
            </div>
            <h2 className="hp-title hp-title--center">
              Genuine Parts for Heavy Equipment
            </h2>
            <p className="hp-lead mt-4 max-w-2xl mx-auto">
              TransHub supplies construction machinery parts and components for excavators, bulldozers, loaders, cranes, and
              road-building equipment — sourced globally and delivered to your job site on time.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-14">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-full border border-gray-200 bg-[#f4f5f7] px-4 py-1.5 text-xs font-semibold text-gray-600"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <Link
                key={product.slug}
                href={`/products/${product.slug}`}
                className="group overflow-hidden rounded-[22px] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-shadow duration-300 hover:shadow-[0_22px_55px_rgba(0,0,0,0.14)]"
              >
                <article>
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/80 via-transparent to-transparent" />
                    <span className="absolute bottom-4 left-4 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                      {product.label}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="hp-subtitle text-xl mb-2">{product.title}</h3>
                    <p className="hp-body mb-4">{product.desc}</p>
                    <ul className="mb-5 space-y-1">
                      {product.specs.map((spec) => (
                        <li key={spec} className="flex items-center gap-2 text-xs text-gray-400">
                          <span className="h-1 w-1 shrink-0 rounded-full bg-primary" aria-hidden />
                          {spec}
                        </li>
                      ))}
                    </ul>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      View Details
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f4f5f7]">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="hp-title mb-3">Need a part not listed here?</h3>
          <p className="hp-lead max-w-xl mx-auto mb-6">
            We source spare parts for all major construction machinery brands. Send us your model number or part code and our
            team will find it for you.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            Enquire About Parts
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}
