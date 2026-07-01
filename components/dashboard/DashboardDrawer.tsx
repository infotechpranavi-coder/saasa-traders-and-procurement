'use client'

import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface DashboardDrawerProps {
  open: boolean
  title: string
  subtitle?: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  footerError?: string | null
}

export default function DashboardDrawer({
  open,
  title,
  subtitle,
  onClose,
  children,
  footer,
  footerError,
}: DashboardDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="dashboard-drawer-root" role="dialog" aria-modal="true">
      <button type="button" className="dashboard-drawer-backdrop" onClick={onClose} aria-label="Close panel" />
      <aside className="dashboard-drawer">
        <div className="dashboard-drawer-header">
          <div className="min-w-0 pr-4">
            <h2 className="dashboard-drawer-title">{title}</h2>
            {subtitle && <p className="dashboard-drawer-subtitle">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} className="dashboard-drawer-close" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div id="dashboard-drawer-body" className="dashboard-drawer-body">
          {children}
        </div>
        {footer && (
          <div className="dashboard-drawer-footer">
            {footerError ? (
              <p className="dashboard-form-error" role="alert">
                {footerError}
              </p>
            ) : null}
            <div className="dashboard-drawer-footer-actions">{footer}</div>
          </div>
        )}
      </aside>
    </div>
  )
}
