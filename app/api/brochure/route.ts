import { getBrochure } from '@/lib/cms'
import { parseBrochureRequest } from '@/lib/brochure-validation'
import { saveBrochureEnquiry } from '@/lib/leads-db'
import { isResendConfigured, sendBrochureEmail, sendEnquiryNotification } from '@/lib/email/resend-mail'
import { isMongoConfigured } from '@/lib/mongodb'

export const dynamic = 'force-dynamic'

export async function GET() {
  const brochure = await getBrochure()
  return Response.json(
    {
      brochure,
      emailConfigured: isResendConfigured(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    },
  )
}

export async function POST(request: Request) {
  try {
    const brochure = await getBrochure()
    if (!brochure?.url?.trim()) {
      return Response.json({ ok: false, error: 'Catalog is not available yet.' }, { status: 503 })
    }

    const body = await request.json()
    const parsed = parseBrochureRequest(body)
    if (!parsed.ok) {
      return Response.json({ ok: false, error: parsed.error }, { status: 400 })
    }

    let enquirySaved = false
    if (isMongoConfigured()) {
      try {
        await saveBrochureEnquiry(parsed.data)
        enquirySaved = true
      } catch (error) {
        console.error('[brochure] failed to save enquiry:', error)
      }
    }

    const emailConfigured = isResendConfigured()
    let emailSent = false
    let adminNotified = false

    if (emailConfigured) {
      const enquiry = {
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || '',
        company: parsed.data.company,
        service: 'Product catalog download',
        message: `Catalog download via website form.${parsed.data.company ? `\nCompany: ${parsed.data.company}` : ''}`,
        type: 'brochure' as const,
        createdAt: new Date().toISOString(),
        source: 'brochure-form' as const,
      }

      try {
        emailSent = await sendBrochureEmail({
          to: parsed.data.email,
          name: parsed.data.name,
          brochure,
        })
      } catch (error) {
        console.error('[brochure] customer email failed:', error)
      }

      try {
        adminNotified = await sendEnquiryNotification(enquiry)
      } catch (error) {
        console.error('[brochure] admin notification failed:', error)
      }
    }

    return Response.json({
      ok: true,
      enquirySaved,
      emailSent,
      adminNotified,
      emailConfigured,
      downloadUrl: brochure.url,
      fileName: brochure.fileName,
    })
  } catch (error) {
    console.error('[brochure]', error)
    return Response.json({ ok: false, error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
