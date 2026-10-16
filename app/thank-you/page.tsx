import type { Metadata } from 'next'
import { Suspense } from 'react'
import PageLayout from '@/components/PageLayout'
import ThankYouContent from './ThankYouContent'
import { COMPANY_NAME } from '@/lib/brand'

export const metadata: Metadata = {
  title: `Thank You - Enquiry Received | ${COMPANY_NAME}`,
  description:
    `Thank you for contacting ${COMPANY_NAME}. Your enquiry has been received and our procurement team will review your specifications and contact you shortly.`,
  robots: {
    index: false,
    follow: false,
  },
}

export default function ThankYouPage() {
  return (
    <PageLayout>
      <Suspense fallback={<div className="py-24 text-center text-gray-500">Loading confirmation details...</div>}>
        <ThankYouContent />
      </Suspense>
    </PageLayout>
  )
}
