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
  const subject =
    enquiry.type === 'brochure'
      ? `New catalog download request from ${enquiry.name}`
      : `New enquiry from ${enquiry.name}`

  const lines = [
    `Name: ${enquiry.name}`,
    enquiry.email ? `Email: ${enquiry.email}` : null,
    enquiry.phone ? `Phone: ${enquiry.phone}` : null,
    enquiry.company ? `Company: ${enquiry.company}` : null,
    enquiry.service ? `Requirement: ${enquiry.service}` : null,
    enquiry.message ? `\nMessage:\n${enquiry.message}` : null,
    `\nSubmitted: ${enquiry.createdAt}`,
  ].filter(Boolean)

  const { error } = await resend.emails.send({
    from: `${COMPANY_NAME} <${getFromEmail()}>`,
    to: [to],
    replyTo: enquiry.email || undefined,
    subject,
    text: lines.join('\n'),
    html: `<div style="font-family:sans-serif;line-height:1.6;color:#111">
      <h2 style="color:#ea580c">${enquiry.type === 'brochure' ? 'New catalog download request' : 'New contact enquiry'}</h2>
      <p><strong>Name:</strong> ${escapeHtml(enquiry.name)}</p>
      ${enquiry.email ? `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(enquiry.email)}">${escapeHtml(enquiry.email)}</a></p>` : ''}
      ${enquiry.phone ? `<p><strong>Phone:</strong> ${escapeHtml(enquiry.phone)}</p>` : ''}
      ${enquiry.company ? `<p><strong>Company:</strong> ${escapeHtml(enquiry.company)}</p>` : ''}
      ${enquiry.service ? `<p><strong>Requirement:</strong> ${escapeHtml(enquiry.service)}</p>` : ''}
      ${enquiry.message ? `<p><strong>Message:</strong></p><p>${escapeHtml(enquiry.message).replace(/\n/g, '<br>')}</p>` : ''}
      <p style="color:#666;font-size:12px">Submitted ${escapeHtml(enquiry.createdAt)}</p>
    </div>`,
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

  const { error } = await resend.emails.send({
    from: `${COMPANY_NAME} <${getFromEmail()}>`,
    to: [input.to],
    subject: `${COMPANY_NAME} — Product Catalog`,
    text: `${greeting}\n\nThank you for your interest in ${COMPANY_NAME}. Please find our product catalog attached.\n\nYou can also visit ${brochureUrl} anytime.\n\n— ${COMPANY_NAME}`,
    html: `<div style="font-family:sans-serif;line-height:1.6;color:#111">
      <p>${escapeHtml(greeting)}</p>
      <p>Thank you for your interest in <strong>${escapeHtml(COMPANY_NAME)}</strong>.</p>
      <p>Please find our product catalog attached to this email.</p>
      <p><a href="${escapeHtml(brochureUrl)}" style="color:#ea580c">Visit our catalog page →</a></p>
      <p style="color:#666;font-size:12px">— ${escapeHtml(COMPANY_NAME)}</p>
    </div>`,
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
