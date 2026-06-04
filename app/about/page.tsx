import Image from 'next/image'
import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import { SectionLabelIcon } from '../../components/icons/LogisticsIcons'

export const metadata: Metadata = { title: 'About Us - TransHub' }

const team = [
  { name: 'Michael Torres', role: 'CEO & Founder', image: '/images/testimonials/jacob.jpg' },
  { name: 'Sarah Chen', role: 'Operations Director', image: '/images/testimonials/sarah.jpg' },
  { name: 'James Wilson', role: 'Head of Logistics', image: '/images/testimonials/bessie.jpg' },
  { name: 'Priya Sharma', role: 'Technology Lead', image: '/images/testimonials/sarah.jpg' },
]

const stats = [
  { value: '25+', label: 'Years Experience' },
  { value: '150+', label: 'Countries Served' },
  { value: '5K+', label: 'Fleet Vehicles' },
]

export default function AboutPage() {
  return (
    <PageLayout>
      <PageHero title="About Us" breadcrumb="About" />

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="section-label mb-3">
              <SectionLabelIcon className="text-primary" />
              OUR STORY
            </div>
            <h2 className="hp-title mb-6">25+ Years of Logistics Excellence</h2>
            <p className="hp-body mb-4">
              Founded in 1999, TransHub began as a small regional carrier with just 10 trucks and a vision to transform the logistics industry. Over the past 25 years, we have grown into a global powerhouse serving over 150 countries.
            </p>
            <p className="hp-body mb-8">
              Our global logistics expertise, advanced supply chain technology and customized solutions help businesses of all sizes optimize their operations and deliver exceptional results.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center rounded-2xl bg-[#f4f5f7] p-4">
                  <div className="hp-stat text-primary">{s.value}</div>
                  <div className="hp-label-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 h-52 overflow-hidden rounded-[22px]">
              <Image src="/images/about/main.jpg" alt="TransHub operations" fill className="object-cover" sizes="50vw" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[22px]">
              <Image src="/images/about/truck.jpg" alt="Fleet truck" fill className="object-cover" sizes="25vw" />
            </div>
            <div className="relative h-44 overflow-hidden rounded-[22px]">
              <Image src="/images/about/port-circle.jpg" alt="Port logistics" fill className="object-cover" sizes="25vw" />
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
                  <Image src={member.image} alt={member.name} fill className="rounded-full object-cover" sizes="80px" />
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
