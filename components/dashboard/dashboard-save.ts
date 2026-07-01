import type { CmsData } from '@/types/cms'
import type { ShowDashboardMsg } from '@/components/dashboard/useDashboardToast'

export type DashboardSaveResult = { ok: boolean; error?: string; cms?: CmsData }

export async function runDashboardSave(
  setSaving: (value: boolean) => void,
  run: () => Promise<DashboardSaveResult>,
  options: {
    showMsg: ShowDashboardMsg
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
      options.showMsg(result.error || options.errorMessage || 'Save failed', 'error')
      return false
    }

    if (result.cms && options.setCms) {
      options.setCms(result.cms)
    } else if (options.refreshCms) {
      await options.refreshCms()
    }

    options.showMsg(options.successMessage, 'success')
    options.onSuccess?.()
    return true
  } catch {
    options.showMsg('Something went wrong. Please try again.', 'error')
    return false
  } finally {
    setSaving(false)
  }
}
