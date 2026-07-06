export interface BrochureRequestBody {
  name: string
  phone: string
  email?: string
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
  const phone = typeof raw.phone === 'string' ? raw.phone.trim() : ''
  const email = typeof raw.email === 'string' ? raw.email.trim() : ''
  const company = typeof raw.company === 'string' ? raw.company.trim() : ''

  if (!name || name.length > 120) {
    return { ok: false, error: 'Name is required (max 120 characters)' }
  }
  if (!phone || phone.length > 40) {
    return { ok: false, error: 'Phone is required (max 40 characters)' }
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Please enter a valid email address' }
  }
  if (company.length > 200) {
    return { ok: false, error: 'Company name is too long (max 200 characters)' }
  }

  return {
    ok: true,
    data: {
      name,
      phone,
      email: email || undefined,
      company: company || undefined,
    },
  }
}
