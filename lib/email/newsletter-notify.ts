import { listActiveNewsletterSubscribers } from '@/lib/leads-db'
import { isResendConfigured, sendNewsletterContentUpdate } from '@/lib/email/resend-mail'
import type { NewsletterContentAlert } from '@/types/leads'

/** Fire-and-forget — does not block dashboard saves. */
export function queueNewsletterContentAlert(alert: NewsletterContentAlert): void {
  void notifyNewsletterSubscribers(alert).catch((error) => {
    console.error('[newsletter] content alert failed:', error instanceof Error ? error.message : error)
  })
}

export async function notifyNewsletterSubscribers(alert: NewsletterContentAlert): Promise<void> {
  if (!isResendConfigured()) return

  const subscribers = await listActiveNewsletterSubscribers()
  if (subscribers.length === 0) return

  await sendNewsletterContentUpdate(subscribers, alert)
}
