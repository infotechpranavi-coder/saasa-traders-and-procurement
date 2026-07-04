'use client'

import DashboardApp from '@/components/dashboard/DashboardApp'
import type { CmsData } from '@/types/cms'

export default function SuperAdminApp({
  initialAuthenticated,
  initialCms,
}: {
  initialAuthenticated: boolean
  initialCms: CmsData | null
}) {
  return (
    <DashboardApp
      initialAuthenticated={initialAuthenticated}
      initialCms={initialCms}
      mode="superadmin"
      enableBulkImport
    />
  )
}
