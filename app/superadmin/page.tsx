import type { Metadata } from 'next'
import { Suspense } from 'react'
import SuperAdminApp from '@/components/superadmin/SuperAdminApp'
import { getSuperAdminData } from '@/app/superadmin/actions'

export const metadata: Metadata = {
  title: 'Super Admin - SAASA B2E TRADES',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function SuperAdminPage() {
  const { authenticated, cms } = await getSuperAdminData()
  return (
    <Suspense fallback={<div className="dashboard-shell p-8 text-sm text-gray-600">Loading super admin…</div>}>
      <SuperAdminApp initialAuthenticated={authenticated} initialCms={cms} />
    </Suspense>
  )
}
