import type { EnquiryRecord, NewsletterSubscriber } from '@/types/leads'
import {
  ENQUIRIES_COLLECTION,
  NEWSLETTER_COLLECTION,
  getMongoDb,
  isMongoConfigured,
} from '@/lib/mongodb'

export async function saveEnquiry(input: Omit<EnquiryRecord, 'createdAt' | 'source'>): Promise<EnquiryRecord> {
  if (!isMongoConfigured()) {
    throw new Error('MongoDB is not configured')
  }

  const db = await getMongoDb()
  if (!db) throw new Error('Failed to connect to MongoDB')

  const record: EnquiryRecord = {
    ...input,
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    phone: input.phone?.trim() || undefined,
    service: input.service?.trim() || undefined,
    message: input.message?.trim() || undefined,
    createdAt: new Date().toISOString(),
    source: 'contact-form',
  }

  await db.collection<EnquiryRecord>(ENQUIRIES_COLLECTION).insertOne(record)
  return record
}

export async function subscribeNewsletter(input: {
  email: string
  name?: string
}): Promise<{ subscriber: NewsletterSubscriber; created: boolean }> {
  if (!isMongoConfigured()) {
    throw new Error('MongoDB is not configured')
  }

  const db = await getMongoDb()
  if (!db) throw new Error('Failed to connect to MongoDB')

  const email = input.email.trim().toLowerCase()
  const name = input.name?.trim() || undefined
  const collection = db.collection<NewsletterSubscriber & { _id?: unknown }>(NEWSLETTER_COLLECTION)

  const existing = await collection.findOne({ email })
  if (existing) {
    if (!existing.active) {
      await collection.updateOne(
        { email },
        { $set: { active: true, name: name || existing.name, subscribedAt: new Date().toISOString() } },
      )
    } else if (name && name !== existing.name) {
      await collection.updateOne({ email }, { $set: { name } })
    }

    return {
      subscriber: {
        email,
        name: name || existing.name,
        subscribedAt: existing.subscribedAt,
        active: true,
      },
      created: false,
    }
  }

  const subscriber: NewsletterSubscriber = {
    email,
    name,
    subscribedAt: new Date().toISOString(),
    active: true,
  }

  await collection.insertOne(subscriber)
  return { subscriber, created: true }
}

export async function listEnquiries(limit = 200): Promise<EnquiryRecord[]> {
  if (!isMongoConfigured()) return []

  const db = await getMongoDb()
  if (!db) return []

  const docs = await db
    .collection<EnquiryRecord & { _id?: { toString(): string } }>(ENQUIRIES_COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()

  return docs.map(({ _id, ...rest }) => ({
    ...rest,
    id: _id ? String(_id) : undefined,
  }))
}

export async function listNewsletterSubscribers(limit = 500): Promise<NewsletterSubscriber[]> {
  if (!isMongoConfigured()) return []

  const db = await getMongoDb()
  if (!db) return []

  return db
    .collection<NewsletterSubscriber>(NEWSLETTER_COLLECTION)
    .find({ active: true })
    .sort({ subscribedAt: -1 })
    .limit(limit)
    .project<NewsletterSubscriber>({ _id: 0, email: 1, name: 1, subscribedAt: 1, active: 1 })
    .toArray()
}

export async function removeNewsletterSubscriber(email: string): Promise<boolean> {
  if (!isMongoConfigured()) return false

  const db = await getMongoDb()
  if (!db) return false

  const normalized = email.trim().toLowerCase()
  const result = await db.collection(NEWSLETTER_COLLECTION).deleteOne({ email: normalized })
  return result.deletedCount > 0
}

export async function listActiveNewsletterSubscribers(): Promise<NewsletterSubscriber[]> {
  return listNewsletterSubscribers()
}
