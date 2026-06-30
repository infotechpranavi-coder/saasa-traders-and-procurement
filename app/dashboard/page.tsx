import type { Metadata } from 'next'
import { Suspense } from 'react'
import DashboardApp from '@/components/dashboard/DashboardApp'
import { getDashboardData } from '@/app/dashboard/actions'

export const metadata: Metadata = {
  title: 'Admin Dashboard - SAASA B2E TRADES',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { authenticated, cms } = await getDashboardData()
  return (
    <Suspense fallback={<div className="dashboard-shell p-8 text-sm text-gray-600">Loading dashboard…</div>}>
      <DashboardApp initialAuthenticated={authenticated} initialCms={cms} />
    </Suspense>
  )
}
