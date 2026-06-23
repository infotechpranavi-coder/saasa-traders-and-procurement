import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { COMPANY_NAME, COMPANY_DESCRIPTION } from '@/lib/brand'
import './globals.css'

export const metadata: Metadata = {
  title: `${COMPANY_NAME} — Procurement & Trading`,
  description: COMPANY_DESCRIPTION,
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
