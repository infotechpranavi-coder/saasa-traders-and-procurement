'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

export type DashboardToastState = {
  text: string
  type: 'success' | 'error'
} | null

export type ShowDashboardMsg = (text: string, type?: 'success' | 'error') => void

export function useDashboardToast(durationMs = 4000) {
  const [toast, setToast] = useState<DashboardToastState>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showMsg: ShowDashboardMsg = useCallback(
    (text, type = 'success') => {
      if (timerRef.current) clearTimeout(timerRef.current)
      setToast({ text, type })
      timerRef.current = setTimeout(() => setToast(null), durationMs)
    },
    [durationMs],
  )

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  return { toast, showMsg }
}
