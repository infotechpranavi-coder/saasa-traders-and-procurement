import type { Metadata } from 'next'
import DashboardApp from '@/components/dashboard/DashboardApp'
import { getDashboardData } from '@/app/dashboard/actions'

export const metadata: Metadata = {
  title: 'Admin Dashboard - TransHub',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const { authenticated, cms } = await getDashboardData()
  return <DashboardApp initialAuthenticated={authenticated} initialCms={cms} />
}
