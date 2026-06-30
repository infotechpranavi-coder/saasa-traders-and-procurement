import type { CmsData } from '@/types/cms'

export type DashboardSaveResult = { ok: boolean; error?: string; cms?: CmsData }

export async function runDashboardSave(
  setSaving: (value: boolean) => void,
  run: () => Promise<DashboardSaveResult>,
  options: {
    showMsg: (message: string) => void
    setCms?: (cms: CmsData) => void
    refreshCms?: () => Promise<void>
    onSuccess?: () => void
    successMessage: string
    errorMessage?: string
  },
): Promise<boolean> {
  setSaving(true)
  try {
    const result = await run()
    if (!result.ok) {
      options.showMsg(result.error || options.errorMessage || 'Save failed')
      return false
    }

    if (result.cms && options.setCms) {
      options.setCms(result.cms)
    } else if (options.refreshCms) {
      await options.refreshCms()
    }

    options.onSuccess?.()
    options.showMsg(options.successMessage)
    return true
  } catch {
    options.showMsg('Something went wrong. Please try again.')
    return false
  } finally {
    setSaving(false)
  }
}
