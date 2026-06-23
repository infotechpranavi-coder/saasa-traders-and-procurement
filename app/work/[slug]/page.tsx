import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import PageLayout from '../../../components/PageLayout'
import PageHero from '../../../components/PageHero'
import { getPortfolioBySlug } from '@/lib/cms'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const project = await getPortfolioBySlug(params.slug)
  if (!project) return { title: 'Project Not Found - SAASA B2E TRADES' }
  return { title: `${project.title} - SAASA B2E TRADES` }
}

export default async function WorkDetailPage({ params }: { params: { slug: string } }) {
  const project = await getPortfolioBySlug(params.slug)
  if (!project) notFound()

  const metaParts = [project.client, project.location, project.year].filter(Boolean)

  return (
    <PageLayout>
      <PageHero
        title={project.title}
        breadcrumb="Recent Work"
        trail={[
          { label: 'Home', href: '/' },
          { label: project.title },
        ]}
      />

      <article className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="relative mb-8 h-72 overflow-hidden rounded-[22px]">
            <Image src={project.image} alt={project.title} fill className="object-cover" sizes="768px" priority />
          </div>
          <p className="section-label mb-2 !text-[0.8125rem]">{project.label}</p>
          {project.excerpt && <p className="hp-body text-lg mb-6 text-gray-700">{project.excerpt}</p>}
          {metaParts.length > 0 && (
            <p className="work-detail-meta mb-8 text-sm text-gray-500">{metaParts.join(' · ')}</p>
          )}
          <div className="space-y-4">
            {project.body.map((paragraph) => (
              <p key={paragraph} className="hp-body">
                {paragraph}
              </p>
            ))}
          </div>
          <Link href="/contact" className="btn-primary mt-10 inline-flex">
            Discuss a Similar Project
          </Link>
        </div>
      </article>
    </PageLayout>
  )
}
