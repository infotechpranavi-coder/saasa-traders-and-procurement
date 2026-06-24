import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import { COMPANY_NAME, COMPANY_EMAIL } from '@/lib/brand'

export const metadata: Metadata = { title: `Privacy Policy - ${COMPANY_NAME}` }

export default function PrivacyPolicyPage() {
  return (
    <PageLayout>
      <PageHero title="Privacy Policy" breadcrumb="Privacy Policy" />

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="hp-body text-sm text-gray-500 mb-8">Last updated: June 2026</p>

          <div className="space-y-8">
            <div>
              <h2 className="hp-card-title mb-3">1. Introduction</h2>
              <p className="hp-body">
                {COMPANY_NAME} (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This policy explains how we
                collect, use, and protect personal information when you visit our website, request quotations, or engage our
                procurement and trading services.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">2. Information we collect</h2>
              <p className="hp-body mb-3">We may collect:</p>
              <ul className="hp-body list-disc pl-5 space-y-2">
                <li>Contact details (name, company, email, phone) submitted through forms</li>
                <li>Business requirements shared for equipment, parts, or service quotations</li>
                <li>Technical data such as browser type, pages visited, and general usage analytics</li>
                <li>Newsletter email addresses if you subscribe</li>
              </ul>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">3. How we use your information</h2>
              <ul className="hp-body list-disc pl-5 space-y-2">
                <li>Respond to enquiries and prepare procurement or trading proposals</li>
                <li>Coordinate supplier sourcing, logistics, and order fulfilment</li>
                <li>Send service updates or marketing communications you have opted into</li>
                <li>Improve our website, security, and customer experience</li>
              </ul>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">4. Sharing of information</h2>
              <p className="hp-body">
                We do not sell personal data. We may share information with trusted suppliers, logistics partners, or
                professional advisers only when necessary to fulfil your request or comply with applicable law.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">5. Data retention &amp; security</h2>
              <p className="hp-body">
                We retain information only as long as needed for business, legal, or contractual purposes. We apply
                reasonable technical and organisational measures to protect data against unauthorised access or misuse.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">6. Your rights</h2>
              <p className="hp-body">
                You may request access, correction, or deletion of your personal information, or withdraw marketing
                consent, by contacting us at{' '}
                <a href={`mailto:${COMPANY_EMAIL}`} className="text-primary hover:underline">
                  {COMPANY_EMAIL}
                </a>
                .
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">7. Contact</h2>
              <p className="hp-body">
                For privacy-related questions, contact {COMPANY_NAME} via our{' '}
                <a href="/contact" className="text-primary hover:underline">
                  contact page
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  )
}
