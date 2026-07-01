'use client'

import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import type { DashboardToastState } from '@/components/dashboard/useDashboardToast'

export default function DashboardToast({ toast }: { toast: DashboardToastState }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || !toast) return null

  return createPortal(
    <div
      className={`dashboard-toast dashboard-toast--${toast.type}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {toast.text}
    </div>,
    document.body,
  )
}
