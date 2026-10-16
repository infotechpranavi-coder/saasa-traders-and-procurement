import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CalendarDays, UserRound } from 'lucide-react'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import { SectionLabelIcon } from '../../components/icons/LogisticsIcons'
import { getBlogs } from '@/lib/cms'

import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Industry Insights & Procurement Blog - ${COMPANY_NAME}`,
  description:
    `Expert procurement guides, heavy machinery sourcing insights, FMCG bulk trading, pharmaceutical equipment validation, and international B2E logistics strategies from ${COMPANY_NAME}.`,
  openGraph: {
    title: `Trade & Procurement Blog - ${COMPANY_NAME}`,
    description:
      'Expert articles on heavy machinery sourcing, FMCG trading, pharma tech, commercial fleet procurement, and India-UAE-Africa trade corridors.',
  },
}
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getBlogs()

  return (
    <PageLayout>
      <PageHero title="Latest Blog & Insights" breadcrumb="Blog" />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-label justify-center mb-3">
              <SectionLabelIcon className="text-primary" />
              INDUSTRY KNOWLEDGE & INSIGHTS
            </div>
            <h2 className="hp-title hp-title--center">Check Our Latest Blog Posts</h2>
            <p className="hp-subtitle hp-subtitle--center mt-3 max-w-2xl mx-auto">
              Strategic procurement perspectives, market intelligence, and cross-border trade guidance for infrastructure, FMCG, pharma, and institutional sectors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="group blog-card flex flex-col justify-between p-4 rounded-3xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg hover:border-gray-200">
                <div>
                  <div className="relative mb-5 h-56 overflow-hidden rounded-[20px]">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width:768px) 100vw, 33vw"
                    />
                    <span className="absolute top-4 left-4 rounded-full bg-white/95 backdrop-blur-sm px-3.5 py-1 text-xs font-bold text-primary shadow-sm tracking-wide uppercase">
                      {post.cat}
                    </span>
                  </div>
                  <div className="blog-meta mb-3">
                    <span className="blog-meta-item">
                      <UserRound className="blog-meta-icon" strokeWidth={2} />
                      {post.author}
                    </span>
                    <span className="blog-meta-item">
                      <CalendarDays className="blog-meta-icon" strokeWidth={2} />
                      {post.date}
                    </span>
                  </div>
                  <h3 className="blog-side-title mb-3 font-bold transition-colors group-hover:text-primary">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-5 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
                <div>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary transition-all hover:gap-3">
                    Read Article →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
