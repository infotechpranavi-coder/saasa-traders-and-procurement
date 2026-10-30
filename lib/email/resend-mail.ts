import { Resend } from 'resend'
import { COMPANY_EMAIL, COMPANY_NAME } from '@/lib/brand'
import type { EnquiryRecord, NewsletterContentAlert } from '@/types/leads'
import type { BrochureFile } from '@/types/cms'
import { brochureDownloadFilename } from '@/lib/brochure-filename'
import { readBrochurePdfBuffer } from '@/lib/brochure-file'

let resendClient: Resend | null = null

export function isResendConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim())
}

function getResend(): Resend | null {
  if (!isResendConfigured()) return null
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY!.trim())
  }
  return resendClient
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || 'onboarding@resend.dev'
}

export function getEnquiryToEmail(): string {
  return process.env.ENQUIRY_TO_EMAIL?.trim() || COMPANY_EMAIL
}

function siteBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.SITE_URL?.trim()
  return url ? url.replace(/\/$/, '') : 'http://localhost:3000'
}

function contentPath(alert: NewsletterContentAlert): string {
  if (alert.kind === 'product') return `/products/${alert.slug}`
  if (alert.kind === 'service') return `/services/${alert.slug}`
  return `/blog/${alert.slug}`
}

function contentLabel(kind: NewsletterContentAlert['kind']): string {
  if (kind === 'product') return 'Product'
  if (kind === 'service') return 'Service'
  return 'Blog post'
}

export async function sendEnquiryNotification(enquiry: EnquiryRecord): Promise<boolean> {
  const resend = getResend()
  if (!resend) return false

  const to = getEnquiryToEmail()
  const isBrochure = enquiry.type === 'brochure'
  const cleanPhone = enquiry.phone ? enquiry.phone.replace(/[^0-9]/g, '') : ''
  const subject = isBrochure
    ? `New catalog download request from ${enquiry.name}`
    : `New enquiry from ${enquiry.name}${enquiry.service ? ` [${enquiry.service}]` : ''}`

  const lines = [
    `Name: ${enquiry.name}`,
    enquiry.email ? `Email: ${enquiry.email}` : null,
    enquiry.phone ? `Phone: ${enquiry.phone}` : null,
    enquiry.company ? `Company: ${enquiry.company}` : null,
    enquiry.service ? `Requirement: ${enquiry.service}` : null,
    enquiry.message ? `\nMessage:\n${enquiry.message}` : null,
    `\nSubmitted: ${enquiry.createdAt}`,
  ].filter(Boolean)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:620px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          
          <!-- Brand Accent Strip -->
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#ea580c 0%,#f59e0b 50%,#0d1b2a 100%);"></td>
          </tr>

          <!-- Brand Header -->
          <tr>
            <td style="background-color:#0d1b2a;padding:26px 32px;text-align:left;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size:20px;font-weight:800;letter-spacing:1.2px;color:#ffffff;text-transform:uppercase;">
                      ${escapeHtml(COMPANY_NAME)}
                    </div>
                    <div style="font-size:12px;color:#94a3b8;margin-top:4px;letter-spacing:0.4px;">
                      Global Machinery, Parts &amp; B2B Procurement Portal
                    </div>
                  </td>
                  <td align="right" style="vertical-align:middle;">
                    <span style="display:inline-block;background-color:rgba(234,88,12,0.18);color:#fb923c;border:1px solid rgba(251,146,60,0.35);padding:4px 10px;border-radius:9999px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
                      ${isBrochure ? 'CATALOG LEAD' : 'WEBSITE LEAD'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Card Content Body -->
          <tr>
            <td style="padding:32px;">
              <!-- Headline -->
              <div style="margin-bottom:24px;">
                <h1 style="margin:0 0 6px 0;font-size:22px;font-weight:800;color:#0f172a;line-height:1.3;">
                  ${isBrochure ? 'New Catalog Download Request' : `New Enquiry from ${escapeHtml(enquiry.name)}`}
                </h1>
                <p style="margin:0;font-size:14px;color:#64748b;line-height:1.5;">
                  A new prospect has submitted their quotation &amp; procurement requirements through the website form.
                </p>
              </div>

              <!-- Structured Summary Table -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;margin-bottom:24px;">
                <!-- Row: Name -->
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#64748b;width:35%;border-bottom:1px solid #e2e8f0;">
                    Contact Person
                  </td>
                  <td style="padding:12px 16px;font-size:14px;font-weight:700;color:#0f172a;border-bottom:1px solid #e2e8f0;">
                    ${escapeHtml(enquiry.name)}
                  </td>
                </tr>

                <!-- Row: Requirement / Product -->
                <tr>
                  <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#64748b;width:35%;border-bottom:1px solid #e2e8f0;">
                    Requirement / Product
                  </td>
                  <td style="padding:12px 16px;font-size:14px;border-bottom:1px solid #e2e8f0;">
                    <span style="display:inline-block;background-color:#fff7ed;color:#c2410c;font-weight:700;padding:4px 10px;border-radius:6px;border:1px solid #fed7aa;font-size:13px;">
                      ${escapeHtml(enquiry.service || 'General Procurement Enquiry')}
                    </span>
                  </td>
                </tr>

                <!-- Row: Email -->
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#64748b;width:35%;border-bottom:1px solid #e2e8f0;">
                    Email Address
                  </td>
                  <td style="padding:12px 16px;font-size:14px;border-bottom:1px solid #e2e8f0;">
                    ${
                      enquiry.email
                        ? `<a href="mailto:${escapeHtml(enquiry.email)}" style="color:#ea580c;text-decoration:none;font-weight:600;">${escapeHtml(enquiry.email)}</a>`
                        : '<span style="color:#94a3b8;">Not provided</span>'
                    }
                  </td>
                </tr>

                <!-- Row: Phone -->
                <tr>
                  <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#64748b;width:35%;border-bottom:1px solid #e2e8f0;">
                    Phone / WhatsApp
                  </td>
                  <td style="padding:12px 16px;font-size:14px;border-bottom:1px solid #e2e8f0;">
                    ${
                      enquiry.phone
                        ? `<a href="tel:${escapeHtml(enquiry.phone.replace(/[^0-9+]/g, ''))}" style="color:#0f172a;text-decoration:none;font-weight:600;">${escapeHtml(enquiry.phone)}</a>`
                        : '<span style="color:#94a3b8;">Not provided</span>'
                    }
                  </td>
                </tr>

                <!-- Row: Company -->
                <tr style="background-color:#f8fafc;">
                  <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#64748b;width:35%;border-bottom:1px solid #e2e8f0;">
                    Company / Organization
                  </td>
                  <td style="padding:12px 16px;font-size:14px;color:#334155;border-bottom:1px solid #e2e8f0;">
                    ${
                      enquiry.company
                        ? escapeHtml(enquiry.company)
                        : '<span style="color:#94a3b8;font-style:italic;">Not specified</span>'
                    }
                  </td>
                </tr>

                <!-- Row: Submitted At -->
                <tr>
                  <td style="padding:12px 16px;font-size:13px;font-weight:600;color:#64748b;width:35%;">
                    Submission Time
                  </td>
                  <td style="padding:12px 16px;font-size:13px;color:#475569;">
                    ${escapeHtml(enquiry.createdAt)}
                  </td>
                </tr>
              </table>

              <!-- Customer Message Box (if provided) -->
              ${
                enquiry.message
                  ? `
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #ea580c;border-radius:8px;padding:18px 20px;margin-bottom:28px;">
                <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.6px;color:#475569;margin-bottom:8px;">
                  Customer Message &amp; Specifications:
                </div>
                <div style="font-size:14px;line-height:1.6;color:#1e293b;white-space:pre-wrap;">${escapeHtml(enquiry.message)}</div>
              </div>`
                  : ''
              }

              <!-- Direct Action Buttons -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top:8px;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        ${
                          enquiry.email
                            ? `
                        <td align="center" style="border-radius:10px;background-color:#ea580c;padding:0 6px;">
                          <a href="mailto:${escapeHtml(enquiry.email)}?subject=${encodeURIComponent(`Quotation & Details: ${enquiry.service || 'Your Enquiry'} - ${COMPANY_NAME}`)}" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">
                            Reply via Email &rarr;
                          </a>
                        </td>`
                            : ''
                        }
                        ${
                          cleanPhone
                            ? `
                        <td align="center" style="border-radius:10px;background-color:#16a34a;padding:0 6px;">
                          <a href="https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hello ${enquiry.name}, thank you for contacting ${COMPANY_NAME} regarding ${enquiry.service || 'your requirement'}.`)}" target="_blank" style="display:inline-block;padding:13px 22px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;">
                            Chat on WhatsApp &rarr;
                          </a>
                        </td>`
                            : ''
                        }
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:22px 32px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:13px;font-weight:600;color:#0d1b2a;">
                ${escapeHtml(COMPANY_NAME)} &bull; Global Heavy Machinery &amp; Equipment Procurement
              </p>
              <p style="margin:0;font-size:11px;color:#94a3b8;line-height:1.5;">
                This lead notification was automatically dispatched to <strong>${escapeHtml(to)}</strong> from your website inquiry portal at <a href="https://saasab2e.com" style="color:#ea580c;text-decoration:none;">saasab2e.com</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: `${COMPANY_NAME} <${getFromEmail()}>`,
    to: [to],
    replyTo: enquiry.email || undefined,
    subject,
    text: lines.join('\n'),
    html,
  })

  if (error) {
    console.error('[resend] enquiry notification failed:', error.message)
    return false
  }

  return true
}

export async function sendBrochureEmail(input: {
  to: string
  name: string
  brochure: BrochureFile
}): Promise<boolean> {
  const resend = getResend()
  if (!resend) return false

  const buffer = await readBrochurePdfBuffer(input.brochure)
  const filename = brochureDownloadFilename(input.brochure)
  const brochureUrl = `${siteBaseUrl()}/brochure`

  const greeting = input.name.trim() ? `Hi ${input.name.trim()},` : 'Hi there,'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(COMPANY_NAME)} &mdash; Product Catalog</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#1e293b;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#f1f5f9;padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
          <tr>
            <td style="height:5px;background:linear-gradient(90deg,#ea580c 0%,#f59e0b 50%,#0d1b2a 100%);"></td>
          </tr>
          <tr>
            <td style="background-color:#0d1b2a;padding:24px 32px;text-align:left;">
              <div style="font-size:20px;font-weight:800;letter-spacing:1.2px;color:#ffffff;text-transform:uppercase;">
                ${escapeHtml(COMPANY_NAME)}
              </div>
              <div style="font-size:12px;color:#94a3b8;margin-top:4px;">
                Official Heavy Machinery, Parts &amp; Equipment Catalog
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px 0;font-size:16px;font-weight:600;color:#0f172a;">${escapeHtml(greeting)}</p>
              <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#334155;">
                Thank you for your interest in <strong>${escapeHtml(COMPANY_NAME)}</strong>. Please find our official product catalog attached directly to this email for your reference.
              </p>
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin:24px 0;text-align:center;">
                <p style="margin:0 0 12px 0;font-size:13px;color:#64748b;">
                  Need an instant quotation or technical consultation on specific machinery or spare parts?
                </p>
                <a href="${escapeHtml(brochureUrl)}" style="display:inline-block;background-color:#ea580c;color:#ffffff;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:700;text-decoration:none;">
                  View Live Catalog &amp; Request Quote &rarr;
                </a>
              </div>
              <p style="margin:0;font-size:13px;color:#64748b;line-height:1.5;">
                If you have specific part codes, brand preferences, or tender requirements, reply directly to this email or reach us on WhatsApp.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;">
                &mdash; ${escapeHtml(COMPANY_NAME)} &bull; India &amp; Cameroon Offices
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

  const { error } = await resend.emails.send({
    from: `${COMPANY_NAME} <${getFromEmail()}>`,
    to: [input.to],
    subject: `${COMPANY_NAME} — Product Catalog`,
    text: `${greeting}\n\nThank you for your interest in ${COMPANY_NAME}. Please find our product catalog attached.\n\nYou can also visit ${brochureUrl} anytime.\n\n— ${COMPANY_NAME}`,
    html,
    attachments: [
      {
        filename,
        content: buffer,
      },
    ],
  })

  if (error) {
    console.error('[resend] brochure email failed:', error.message)
    return false
  }

  return true
}

export async function sendNewsletterWelcome(input: {
  email: string
  name?: string
}): Promise<boolean> {
  const resend = getResend()
  if (!resend) return false

  const greeting = input.name?.trim() ? `Hi ${input.name.trim()},` : 'Hi there,'

  const { error } = await resend.emails.send({
    from: `${COMPANY_NAME} <${getFromEmail()}>`,
    to: [input.email],
    subject: `You're subscribed to ${COMPANY_NAME} updates`,
    text: `${greeting}\n\nThanks for subscribing. We'll email you when we add new products, services, and blog posts.\n\n— ${COMPANY_NAME}`,
    html: `<div style="font-family:sans-serif;line-height:1.6;color:#111">
      <p>${escapeHtml(greeting)}</p>
      <p>Thanks for subscribing to <strong>${escapeHtml(COMPANY_NAME)}</strong>.</p>
      <p>We'll send you updates when we publish new products, services, and blog posts.</p>
      <p style="color:#666;font-size:12px">— ${escapeHtml(COMPANY_NAME)}</p>
    </div>`,
  })

  if (error) {
    console.error('[resend] welcome email failed:', error.message)
    return false
  }

  return true
}

export async function sendNewsletterContentUpdate(
  subscribers: { email: string; name?: string }[],
  alert: NewsletterContentAlert,
): Promise<number> {
  const resend = getResend()
  if (!resend || subscribers.length === 0) return 0

  const label = contentLabel(alert.kind)
  const url = `${siteBaseUrl()}${contentPath(alert)}`
  let sent = 0

  for (const subscriber of subscribers) {
    const greeting = subscriber.name?.trim() ? `Hi ${subscriber.name.trim()},` : 'Hi there,'

    const { error } = await resend.emails.send({
      from: `${COMPANY_NAME} <${getFromEmail()}>`,
      to: [subscriber.email],
      subject: `New ${label.toLowerCase()}: ${alert.title}`,
      text: `${greeting}\n\nWe added a new ${label.toLowerCase()}: ${alert.title}\n\nView it here: ${url}\n\n— ${COMPANY_NAME}`,
      html: `<div style="font-family:sans-serif;line-height:1.6;color:#111">
        <p>${escapeHtml(greeting)}</p>
        <p>We just added a new <strong>${escapeHtml(label.toLowerCase())}</strong>:</p>
        <h2 style="color:#ea580c;margin:0.5rem 0">${escapeHtml(alert.title)}</h2>
        <p><a href="${escapeHtml(url)}" style="color:#ea580c">View on our website →</a></p>
        <p style="color:#666;font-size:12px">— ${escapeHtml(COMPANY_NAME)}</p>
      </div>`,
    })

    if (error) {
      console.error(`[resend] newsletter update to ${subscriber.email} failed:`, error.message)
      continue
    }

    sent += 1
  }

  return sent
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
