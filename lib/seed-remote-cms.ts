import { readFile } from 'fs/promises'
import path from 'path'
import type { CmsData } from '@/types/cms'
import { DEFAULT_IMAGE, REMOTE_IMAGE_MAP } from '@/lib/cms-images'
import {
  isCloudinaryConfigured,
  uploadToCloudinary,
  uploadUrlToCloudinary,
  type CloudinaryResourceType,
} from '@/lib/cloudinary-storage'
import { CMS_COLLECTION, CMS_DOCUMENT_ID, getMongoDb, isMongoConfigured } from '@/lib/mongodb'
import { buildSeedCms } from '@/lib/cms'
import { isStatsicImagePath } from '@/lib/static-machinery-images'

interface CmsDocument {
  _id: string
  data: CmsData
  updatedAt?: string
  seeded?: boolean
}

function isRemoteAsset(url: string) {
  return url.startsWith('https://') && url.includes('res.cloudinary.com')
}

function sourceUrlForLocalPath(localPath: string): string {
  if (REMOTE_IMAGE_MAP[localPath]) return REMOTE_IMAGE_MAP[localPath]
  return DEFAULT_IMAGE
}

async function uploadAsset(
  value: string,
  cache: Map<string, string>,
  options: { subfolder: string; resourceType: CloudinaryResourceType; name: string },
): Promise<string> {
  const trimmed = value.trim()
  if (!trimmed || isRemoteAsset(trimmed)) return trimmed

  if (cache.has(trimmed)) return cache.get(trimmed)!

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    const uploaded = await uploadUrlToCloudinary(trimmed, {
      resourceType: options.resourceType,
      subfolder: options.subfolder,
      name: options.name,
    })
    cache.set(trimmed, uploaded.url)
    return uploaded.url
  }

  if (trimmed.startsWith('/')) {
    const diskPath = path.join(process.cwd(), 'public', trimmed.replace(/^\//, ''))
    try {
      const buffer = await readFile(diskPath)
      const fileName = path.basename(trimmed)
      const uploaded = await uploadToCloudinary(buffer, {
        originalName: fileName,
        resourceType: options.resourceType,
        subfolder: options.subfolder,
      })
      cache.set(trimmed, uploaded.url)
      return uploaded.url
    } catch (error) {
      if (isStatsicImagePath(trimmed)) {
        throw new Error(`Missing local statsic image for seed: ${trimmed}`)
      }
      const remote = sourceUrlForLocalPath(trimmed)
      const uploaded = await uploadUrlToCloudinary(remote, {
        resourceType: 'image',
        subfolder: options.subfolder,
        name: options.name,
      })
      cache.set(trimmed, uploaded.url)
      return uploaded.url
    }
  }

  return trimmed
}

/** Upload only dashboard CMS media (products, services, recent work, reviews) to Cloudinary. */
export async function seedCmsAssetsToCloudinary(input: CmsData): Promise<CmsData> {
  if (!isCloudinaryConfigured()) {
    throw new Error('Cloudinary is not configured. Set CLOUDINARY_* in .env before seeding.')
  }

  const cache = new Map<string, string>()

  const products = await Promise.all(
    input.products.map(async (item) => ({
      ...item,
      image: item.image
        ? await uploadAsset(item.image, cache, { subfolder: 'products', resourceType: 'image', name: item.slug })
        : '',
    })),
  )

  const services = await Promise.all(
    input.services.map(async (item) => ({
      ...item,
      image: item.image
        ? await uploadAsset(item.image, cache, { subfolder: 'services', resourceType: 'image', name: item.slug })
        : '',
    })),
  )

  const portfolio = await Promise.all(
    input.portfolio.map(async (item) => ({
      ...item,
      image: item.image
        ? await uploadAsset(item.image, cache, { subfolder: 'portfolio', resourceType: 'image', name: item.slug })
        : '',
    })),
  )

  const reviews = await Promise.all(
    input.reviews.map(async (item, index) => ({
      ...item,
      image: item.image
        ? await uploadAsset(item.image, cache, {
            subfolder: 'reviews',
            resourceType: 'image',
            name: item.slug || `review-${index}`,
          })
        : '',
    })),
  )

  return {
    ...input,
    products,
    services,
    portfolio,
    reviews,
    // Hero banners, blogs, brands, catalog — keep original paths (local /statsic / public)
  }
}

export async function seedDemoCmsToMongo(force = false): Promise<CmsData> {
  if (!isMongoConfigured()) {
    throw new Error('MongoDB is not configured. Set MONGODB_URI in .env before seeding.')
  }

  const db = await getMongoDb()
  if (!db) {
    throw new Error('Failed to connect to MongoDB')
  }

  const existing = await db.collection<CmsDocument>(CMS_COLLECTION).findOne({ _id: CMS_DOCUMENT_ID })
  if (existing?.data && !force) {
    return existing.data
  }

  const base = buildSeedCms()
  const seeded = await seedCmsAssetsToCloudinary(base)

  await db.collection<CmsDocument>(CMS_COLLECTION).updateOne(
    { _id: CMS_DOCUMENT_ID },
    { $set: { data: seeded, updatedAt: new Date().toISOString(), seeded: true } },
    { upsert: true },
  )

  return seeded
}
