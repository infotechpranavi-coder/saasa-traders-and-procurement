export interface BrochureRequestBody {
  name: string
  email: string
  phone?: string
  company?: string
}

export function parseBrochureRequest(body: unknown):
  | { ok: true; data: BrochureRequestBody }
  | { ok: false; error: string } {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid request body' }
  }

  const raw = body as Record<string, unknown>
  const name = typeof raw.name === 'string' ? raw.name.trim() : ''
  const email = typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : ''
  const phone = typeof raw.phone === 'string' ? raw.phone.trim() : ''
  const company = typeof raw.company === 'string' ? raw.company.trim() : ''

  if (!name || name.length > 120) {
    return { ok: false, error: 'Name is required (max 120 characters)' }
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'A valid email address is required' }
  }
  if (phone.length > 40) {
    return { ok: false, error: 'Phone number is too long (max 40 characters)' }
  }
  if (company.length > 200) {
    return { ok: false, error: 'Company name is too long (max 200 characters)' }
  }

  return {
    ok: true,
    data: {
      name,
      email,
      phone: phone || undefined,
      company: company || undefined,
    },
  }
}
