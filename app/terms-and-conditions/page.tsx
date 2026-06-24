import type { Metadata } from 'next'
import PageLayout from '../../components/PageLayout'
import PageHero from '../../components/PageHero'
import { COMPANY_NAME, COMPANY_EMAIL } from '@/lib/brand'

export const metadata: Metadata = { title: `Terms & Conditions - ${COMPANY_NAME}` }

export default function TermsAndConditionsPage() {
  return (
    <PageLayout>
      <PageHero title="Terms & Conditions" breadcrumb="Terms & Conditions" />

      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <p className="hp-body text-sm text-gray-500 mb-8">Last updated: June 2026</p>

          <div className="space-y-8">
            <div>
              <h2 className="hp-card-title mb-3">1. Agreement</h2>
              <p className="hp-body">
                By using the {COMPANY_NAME} website or engaging our procurement and trading services, you agree to these
                Terms &amp; Conditions. If you do not agree, please do not use this site or our services.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">2. Services</h2>
              <p className="hp-body">
                We provide business-to-enterprise procurement, sourcing, and trading of construction machinery, heavy
                equipment parts, vehicles, mining assets, and related industrial products. Specific scope, pricing, and
                delivery terms are confirmed in written quotations or contracts.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">3. Quotations &amp; orders</h2>
              <ul className="hp-body list-disc pl-5 space-y-2">
                <li>Website content is for general information and does not constitute a binding offer</li>
                <li>Quotations are valid for the period stated and may change with market or supplier conditions</li>
                <li>Orders are confirmed only upon written acceptance and agreed payment terms</li>
              </ul>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">4. Pricing, payment &amp; delivery</h2>
              <p className="hp-body">
                Prices may exclude taxes, duties, freight, insurance, or on-site services unless explicitly stated.
                Delivery timelines depend on supplier availability, shipping routes, and customs clearance. Risk passes
                according to the agreed Incoterms or contract terms.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">5. Product information</h2>
              <p className="hp-body">
                We aim to keep product descriptions, images, and specifications accurate but do not warrant that all
                content is complete or current. OEM names and trademarks belong to their respective owners.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">6. Limitation of liability</h2>
              <p className="hp-body">
                To the fullest extent permitted by law, {COMPANY_NAME} is not liable for indirect, incidental, or
                consequential losses arising from use of this website. Our liability under any contract is limited to the
                amount paid for the relevant goods or services.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">7. Intellectual property</h2>
              <p className="hp-body">
                All website content, branding, and materials are owned by or licensed to {COMPANY_NAME}. You may not
                copy, reproduce, or distribute content without prior written permission.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">8. Governing law</h2>
              <p className="hp-body">
                These terms are governed by the laws of Cameroon unless otherwise agreed in writing. Disputes shall be
                subject to the competent courts of Yaoundé, Cameroon.
              </p>
            </div>

            <div>
              <h2 className="hp-card-title mb-3">9. Contact</h2>
              <p className="hp-body">
                Questions about these terms may be sent to{' '}
                <a href={`mailto:${COMPANY_EMAIL}`} className="text-primary hover:underline">
                  {COMPANY_EMAIL}
                </a>{' '}
                or via our{' '}
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
