import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../components/PageLayout'
import PageHero from '../../../components/PageHero'
import { getBlogBySlug } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getBlogBySlug(params.slug)
  if (!post) return { title: 'Post Not Found - TransHub' }
  return { title: `${post.title} - TransHub Blog` }
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogBySlug(params.slug)
  if (!post) notFound()

  return (
    <PageLayout>
      <PageHero
        title={post.title}
        breadcrumb="Blog"
        trail={[
          { label: 'Blog', href: '/blog' },
          { label: post.title },
        ]}
      />

      <article className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative mb-8 h-72 overflow-hidden rounded-[22px]">
            <Image src={post.image} alt={post.title} fill className="object-cover" sizes="768px" priority />
          </div>
          <p className="section-label mb-2 !text-[0.8125rem]">{post.cat}</p>
          <p className="blog-meta mb-6">
            <span className="blog-meta-item">
              {post.author} · {post.date}
            </span>
          </p>
          <div className="space-y-4">
            {post.body.map((paragraph) => (
              <p key={paragraph} className="hp-body">
                {paragraph}
              </p>
            ))}
          </div>
          <Link href="/contact" className="btn-primary mt-10 inline-flex">
            Get a Free Quote
          </Link>
        </div>
      </article>
    </PageLayout>
  )
}
