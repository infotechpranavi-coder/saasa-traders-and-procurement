import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Super Admin - SAASA B2E TRADES',
  robots: { index: false, follow: false },
}

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return <div className="superadmin-route">{children}</div>
}
