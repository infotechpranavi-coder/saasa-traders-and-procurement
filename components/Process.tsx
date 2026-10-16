'use client'

import { useScrollReveal } from '../hooks/useScrollReveal'
import { LogisticsIcon, SectionLabelIcon, type LogisticsIconName } from './icons/LogisticsIcons'

const steps: { num: string; icon: LogisticsIconName; title: string; desc: string }[] = [
  {
    num: '01',
    icon: 'quote',
    title: 'Requirement & Quotation',
    desc: 'We understand your requirements, source suitable options from trusted manufacturers, and share detailed quotations and specifications.',
  },
  {
    num: '02',
    icon: 'package',
    title: 'Inspection & Customs',
    desc: 'Our team manages quality checks before dispatch, export documentation, containerized shipping, and customs clearance.',
  },
  {
    num: '03',
    icon: 'truck',
    title: 'Delivery & After-Sales',
    desc: 'Doorstep delivery with ongoing support for installation coordination, access to genuine spare parts, and repeat supply.',
  },
]

export default function Process({
  className = 'py-20 bg-[#f8fafc] border-t border-gray-100 overflow-hidden',
}: {
  className?: string
} = {}) {
  const { ref } = useScrollReveal()

  return (
    <section ref={ref} className={className}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14 reveal max-w-3xl mx-auto">
          <div className="section-label justify-center mb-3">
            <SectionLabelIcon className="text-primary" />
            HOW WE WORK
          </div>
          <h2 className="hp-title hp-title--center mb-4">
            Every Order Follows a Clear Process
          </h2>
          <p className="hp-body text-center text-gray-600">
            We understand your requirements, source suitable options from trusted manufacturers and suppliers, share detailed quotations and specifications, and manage quality inspection, export documentation, shipping, and customs clearance. After delivery, we continue to support you with installation coordination, spare parts, and repeat supply.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          {steps.map((step, i) => (
            <div key={step.num} className={`flex flex-col items-center text-center reveal delay-${(i + 1) * 100}`}>
              <div className="relative mb-6">
                <div className="relative w-32 h-32">
                  <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="46" fill="none" stroke="#f0f0f0" strokeWidth="4" />
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      fill="none"
                      stroke="#F15A24"
                      strokeWidth="4"
                      strokeDasharray="145 145"
                      strokeDashoffset="72"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow">
                    {step.num}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center">
                      <LogisticsIcon name={step.icon} size={36} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="hp-subtitle mb-3">{step.title}</h3>
              <p className="hp-body text-center max-w-xs">{step.desc}</p>
            </div>
          ))}

          <div className="hidden md:block absolute top-16 left-1/3 transform -translate-x-1/2">
            <ArrowConnector />
          </div>
          <div className="hidden md:block absolute top-16 right-1/3 transform translate-x-1/2">
            <ArrowConnector />
          </div>
        </div>
      </div>
    </section>
  )
}

function ArrowConnector() {
  return (
    <svg width="120" height="30" viewBox="0 0 120 30">
      <path d="M0 15 Q30 5 60 15 Q90 25 110 15" stroke="#ccc" strokeWidth="2" fill="none" strokeDasharray="6 4" />
      <polygon points="110,10 120,15 110,20" fill="#F15A24" />
    </svg>
  )
}
