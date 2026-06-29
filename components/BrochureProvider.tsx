'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { BrochureFile } from '@/types/cms'

const BrochureContext = createContext<BrochureFile | null>(null)

export function BrochureProvider({
  initial,
  children,
}: {
  initial: BrochureFile | null
  children: ReactNode
}) {
  const [brochure, setBrochure] = useState<BrochureFile | null>(initial)

  useEffect(() => {
    setBrochure(initial)
  }, [initial?.url, initial?.fileName, initial?.uploadedAt])

  useEffect(() => {
    const refresh = async () => {
      try {
        const res = await fetch('/api/brochure', { cache: 'no-store' })
        if (!res.ok) return
        const data = (await res.json()) as { brochure: BrochureFile | null }
        setBrochure(data.brochure)
      } catch {
        // ignore
      }
    }

    void refresh()
    window.addEventListener('focus', refresh)
    return () => window.removeEventListener('focus', refresh)
  }, [])

  return <BrochureContext.Provider value={brochure}>{children}</BrochureContext.Provider>
}

export function useBrochureContext() {
  return useContext(BrochureContext)
}
