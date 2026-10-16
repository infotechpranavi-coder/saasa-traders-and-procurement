import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CalendarDays, Clock, UserRound, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import PageLayout from '../../../components/PageLayout'
import PageHero from '../../../components/PageHero'
import { getBlogBySlug, getBlogs } from '@/lib/cms'
import { COMPANY_NAME } from '@/lib/brand'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug)
  if (!post) return { title: `Post Not Found - ${COMPANY_NAME}` }
  const desc = post.excerpt?.trim() || (post.body && post.body[0]) || `Read ${post.title} on ${COMPANY_NAME}.`
  return {
    title: `${post.title} | ${COMPANY_NAME} Insights`,
    description: desc,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.title} - ${COMPANY_NAME}`,
      description: desc,
      images: post.image ? [post.image] : undefined,
      type: 'article',
    },
  }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const [post, allPosts] = await Promise.all([
    getBlogBySlug(params.slug),
    getBlogs(),
  ])

  if (!post) notFound()

  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 3)
  const wordCount = post.body.reduce((acc, p) => acc + p.split(/\s+/).length, 0)
  const readTime = Math.max(2, Math.ceil(wordCount / 180))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: [post.image],
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: post.author || COMPANY_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
    },
    description: post.excerpt || post.body[0],
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/blog/${post.slug}`,
    },
  }

  return (
    <PageLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHero
        title={post.title}
        breadcrumb="Blog"
        trail={[
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      <article className="py-16 md:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to All Articles
            </Link>
          </div>

          <div className="relative mb-8 h-80 sm:h-96 w-full overflow-hidden rounded-3xl shadow-md">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
            {post.cat && (
              <span className="absolute top-5 left-5 rounded-full bg-white/95 backdrop-blur-sm px-4 py-1.5 text-xs font-bold text-primary shadow-sm tracking-wide uppercase">
                {post.cat}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-100">
            <span className="inline-flex items-center gap-1.5 font-medium text-gray-700">
              <UserRound className="w-4 h-4 text-primary" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="w-4 h-4 text-gray-400" />
              {post.date}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              {readTime} min read
            </span>
          </div>

          {post.excerpt && (
            <div className="mb-8 p-6 rounded-2xl bg-orange-50/60 border border-orange-100/80">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-base text-gray-800 font-medium leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
          )}

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700 leading-relaxed">
            {post.body.map((paragraph, idx) => (
              <p key={idx} className="text-base md:text-lg text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Consultation CTA */}
          <div className="mt-14 p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl">
              <span className="text-xs uppercase font-bold tracking-wider text-primary">Global Sourcing & Trade Solutions</span>
              <h3 className="text-2xl font-bold mt-2 mb-3 text-white">Need Procurement Support for Your Region?</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-6">
                SAASA B2E Trades provides end-to-end international sourcing, pre-shipment quality verification, multi-modal maritime logistics, and destination clearance across Africa and the Middle East.
              </p>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Speak With Our Trade Specialists <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="mt-20 pt-12 border-t border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Keep Reading</span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">Related Insights</h3>
                </div>
                <Link href="/blog" className="text-sm font-semibold text-primary hover:underline">
                  View all →
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {related.map((rel) => (
                  <article key={rel.slug} className="group flex flex-col justify-between p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-md transition-all">
                    <div>
                      <div className="relative h-40 w-full mb-3 overflow-hidden rounded-xl">
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <span className="absolute top-2.5 left-2.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-primary uppercase">
                          {rel.cat}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
                        <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                      </h4>
                    </div>
                    <Link href={`/blog/${rel.slug}`} className="text-xs font-bold text-primary mt-2">
                      Read Article →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </PageLayout>
  )
}
