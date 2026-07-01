import { MongoClient, type Db } from 'mongodb'

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

const uri = process.env.MONGODB_URI?.trim()
const dbName = process.env.MONGODB_DB_NAME?.trim() || 'transhub'

export const CMS_COLLECTION = 'cms'
export const CMS_DOCUMENT_ID = 'site'
export const ENQUIRIES_COLLECTION = 'enquiries'
export const NEWSLETTER_COLLECTION = 'newsletter_subscribers'

export function isMongoConfigured(): boolean {
  return Boolean(uri)
}

export async function getMongoDb(): Promise<Db | null> {
  if (!uri) return null

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }

  const client = await global._mongoClientPromise
  return client.db(dbName)
}
