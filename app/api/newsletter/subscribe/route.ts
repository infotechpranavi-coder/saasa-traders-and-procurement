import { subscribeNewsletter } from '@/lib/leads-db'
import { isResendConfigured, sendNewsletterWelcome } from '@/lib/email/resend-mail'
import { isMongoConfigured } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; name?: string }
    const email = body.email?.trim()
    const name = body.name?.trim()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: 'A valid email is required' }, { status: 400 })
    }

    if (!isMongoConfigured()) {
      return Response.json(
        { ok: false, error: 'Newsletter is not configured yet. Please try again later.' },
        { status: 503 },
      )
    }

    const { subscriber, created } = await subscribeNewsletter({ email, name })

    let welcomeSent = false
    if (created && isResendConfigured()) {
      welcomeSent = await sendNewsletterWelcome(subscriber)
    }

    return Response.json({
      ok: true,
      created,
      welcomeSent,
      message: created
        ? 'You are subscribed! We will email you when we add new products, services, and blog posts.'
        : 'You are already subscribed to our newsletter.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to subscribe'
    console.error('[newsletter]', message)
    return Response.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
