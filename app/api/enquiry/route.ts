import { saveEnquiry } from '@/lib/leads-db'
import { isResendConfigured, sendEnquiryNotification } from '@/lib/email/resend-mail'
import { isMongoConfigured } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      phone?: string
      service?: string
      message?: string
    }

    const name = body.name?.trim()
    const email = body.email?.trim()

    if (!name) {
      return Response.json({ ok: false, error: 'Name is required' }, { status: 400 })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: 'A valid email is required' }, { status: 400 })
    }

    if (!isMongoConfigured()) {
      return Response.json(
        { ok: false, error: 'Enquiry storage is not configured yet. Please try again later.' },
        { status: 503 },
      )
    }

    const enquiry = await saveEnquiry({
      name,
      email,
      phone: body.phone,
      service: body.service,
      message: body.message,
    })

    let emailSent = false
    if (isResendConfigured()) {
      emailSent = await sendEnquiryNotification(enquiry)
    }

    return Response.json({
      ok: true,
      saved: true,
      emailSent,
      message: emailSent
        ? 'Thank you! Your enquiry has been sent. We will contact you soon.'
        : 'Thank you! Your enquiry has been saved. We will contact you soon.',
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to submit enquiry'
    console.error('[enquiry]', message)
    return Response.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
