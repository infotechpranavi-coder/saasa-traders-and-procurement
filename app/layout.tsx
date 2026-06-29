import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { COMPANY_NAME, COMPANY_DESCRIPTION } from '@/lib/brand'
import { getBrochure } from '@/lib/cms'
import { BrochureProvider } from '@/components/BrochureProvider'
import FloatingContactButtons from '@/components/FloatingContactButtons'
import './globals.css'

export const metadata: Metadata = {
  title: `${COMPANY_NAME} — Procurement & Trading`,
  description: COMPANY_DESCRIPTION,
  icons: {
    icon: '/images/saasa-logo-nav.png',
    apple: '/images/saasa-logo-nav.png',
  },
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: { children: ReactNode }) {
  const brochure = await getBrochure()

  return (
    <html lang="en">
      <body>
        <BrochureProvider initial={brochure}>
          {children}
          <FloatingContactButtons />
        </BrochureProvider>
      </body>
    </html>
  )
}
