import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { COMPANY_NAME } from '@/lib/brand'
import './globals.css'

export const metadata: Metadata = {
  title: `${COMPANY_NAME} — Trading & Logistics`,
  description:
    'SAASA B2E TRADES delivers construction machinery parts, equipment trading, and logistics solutions for businesses worldwide.',
  icons: {
    icon: '/images/saasa-logo-nav.png',
    apple: '/images/saasa-logo-nav.png',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
