'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, CalendarDays, UserRound } from 'lucide-react'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { SectionLabelIcon } from './icons/LogisticsIcons'
import type { BlogPost } from '@/types/cms'

function BlogMeta({ author, date }: { author: string; date: string }) {
  return (
    <div className="blog-meta">
      <span className="blog-meta-item">
        <UserRound className="blog-meta-icon" strokeWidth={2} />
        {author}
      </span>
      <span className="blog-meta-item">
        <CalendarDays className="blog-meta-icon" strokeWidth={2} />
        {date}
      </span>
    </div>
  )
}

export default function Blog({ posts }: { posts: BlogPost[] }) {
  const { ref } = useScrollReveal()
  const featured = posts.find((p) => p.featured) ?? posts[0]
  const sidePosts = posts.filter((p) => p.slug !== featured?.slug).slice(0, 2)

  if (!featured) return null

  return (
    <section ref={ref} className="blog-section py-20 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <div className="blog-header reveal">
          <div>
            <div className="section-label mb-3">
              <SectionLabelIcon className="text-primary" />
              NEWS HIGHLIGHT
            </div>
            <h2 className="blog-heading">Check Our Latest Blog Post</h2>
          </div>

          <Link href="/blog" className="blog-view-all">
            View All Posts
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>

        <div className="blog-layout">
          <article className="blog-featured reveal">
            <Link href={`/blog/${featured.slug}`} className="blog-featured-media group">
              <Image
                src={featured.image}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 58vw"
                priority
              />
              {featured.cat && (
                <span className="absolute top-4 left-4 rounded-full bg-white/95 backdrop-blur-sm px-3.5 py-1 text-xs font-bold text-primary shadow-sm tracking-wide uppercase">
                  {featured.cat}
                </span>
              )}
            </Link>

            <BlogMeta author={featured.author} date={featured.date} />

            <div className="blog-featured-title-row">
              <h3 className="blog-featured-title">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h3>
              <Link href={`/blog/${featured.slug}`} className="blog-arrow-btn" aria-label={`Read ${featured.title}`}>
                <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>

            {featured.excerpt && (
              <p className="mt-3 text-sm leading-relaxed text-gray-600 line-clamp-2">
                {featured.excerpt}
              </p>
            )}
          </article>

          <div className="blog-side-list">
            {sidePosts.map((post, index) => (
              <article key={post.slug} className={`blog-side-item reveal delay-${(index + 1) * 150}`}>
                <Link href={`/blog/${post.slug}`} className="blog-side-thumb group" aria-hidden tabIndex={-1}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="124px"
                  />
                </Link>

                <div className="blog-side-content">
                  {post.cat && (
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1 inline-block">
                      {post.cat}
                    </span>
                  )}
                  <BlogMeta author={post.author} date={post.date} />
                  <h3 className={`blog-side-title ${post.highlight ? 'blog-side-title--highlight' : ''}`}>
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  {post.excerpt && (
                    <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
