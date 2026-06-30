import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import CmsImage from '../../components/CmsImage'
import { SectionLabelIcon } from '../../components/icons/LogisticsIcons'
import { COMPANY_NAME } from '@/lib/brand'
import { SITE_IMAGES } from '@/lib/site-content'

export const metadata: Metadata = { title: `About Us - ${COMPANY_NAME}` }

const team = [
  { name: 'Michael Torres', role: 'CEO & Founder', image: '/images/testimonials/jacob.jpg' },
  { name: 'Sarah Chen', role: 'Procurement Director', image: '/images/testimonials/sarah.jpg' },
  { name: 'James Wilson', role: 'Equipment Trading Lead', image: '/images/testimonials/bessie.jpg' },
  { name: 'Priya Sharma', role: 'Supply Chain Manager', image: '/images/testimonials/sarah.jpg' },
]

const stats = [
  { value: '25+', label: 'Years Trading' },
  { value: '150+', label: 'Product Lines' },
  { value: '40+', label: 'Equipment Categories' },
]

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHero title="About Us" breadcrumb="About" />

      <section className="overflow-hidden py-20 bg-white">
        <div className="mx-auto grid max-w-7xl min-w-0 items-center gap-12 px-4 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="min-w-0">
            <div className="section-label mb-3">
              <SectionLabelIcon className="text-primary" />
              OUR STORY
            </div>
            <h2 className="hp-title mb-6">Procurement &amp; Trading Built for Industry</h2>
            <p className="hp-body mb-4">
              SAASA B2E TRADES is a business-to-enterprise trading company focused on sourcing and supplying construction
              machinery, heavy equipment parts, trucks, buses, mining assets, and industrial products for contractors,
              fleet operators, and project owners.
            </p>
            <p className="hp-body mb-8">
              From Yaoundé, Cameroon, we coordinate global supplier networks, manage import logistics, and deliver the
              equipment and parts your operation needs — on spec, on time, and with transparent communication.
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {stats.map((s) => (
                <div key={s.label} className="min-w-0 rounded-2xl bg-[#f4f5f7] p-3 text-center sm:p-4">
                  <div className="hp-stat text-primary text-xl sm:text-2xl">{s.value}</div>
                  <div className="hp-label-sm mt-1 text-[0.65rem] leading-tight sm:text-xs">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="min-w-0 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 h-52 overflow-hidden rounded-[22px]">
              <CmsImage
                src={SITE_IMAGES.about.main}
                alt="JCB excavator on site"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[22px]">
              <CmsImage src={SITE_IMAGES.about.secondary} alt="Road roller" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[22px]">
              <CmsImage src={SITE_IMAGES.about.accent} alt="Drum mix plant" fill className="object-cover" sizes="25vw" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f4f5f7]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <div className="section-label justify-center mb-3">
              <SectionLabelIcon className="text-primary" />
              OUR TEAM
            </div>
            <h2 className="hp-title hp-title--center">Meet Our Team</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <article key={member.name} className="rounded-2xl bg-white p-6 text-center shadow-sm transition-shadow hover:shadow-xl">
                <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-dashed border-primary p-1">
                  <CmsImage src={member.image} alt={member.name} fill className="rounded-full object-cover" sizes="80px" />
                </div>
                <h4 className="hp-subtitle">{member.name}</h4>
                <p className="hp-label-sm mt-1">{member.role}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
