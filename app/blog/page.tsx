import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { CalendarDays, UserRound } from 'lucide-react'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import { SectionLabelIcon } from '../../components/icons/LogisticsIcons'
import { getBlogs } from '@/lib/cms'

import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = { title: `Blog - ${COMPANY_NAME}` }
export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const posts = await getBlogs()

  return (
    <PageLayout>
      <PageHero title="Latest Blog" breadcrumb="Blog" />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-label justify-center mb-3">
              <SectionLabelIcon className="text-primary" />
              NEWS HIGHLIGHT
            </div>
            <h2 className="hp-title hp-title--center">Check Our Latest Blog Post</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.slug} className="group blog-card">
                <div className="relative mb-5 h-52 overflow-hidden rounded-[22px]">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:768px) 100vw, 33vw"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary">
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
                <h3 className="blog-side-title mb-4 transition-colors group-hover:text-primary">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-all hover:gap-3">
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
