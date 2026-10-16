import fs from 'fs'
import path from 'path'
import { MongoClient } from 'mongodb'
import { seedBlogs } from '../data/blog-seed'
import { seedHeroBanners } from '../data/hero-banners-seed'

async function syncBlogs() {
  console.log('Seed blogs to sync:', seedBlogs.length)
  console.log('Seed hero banners to sync:', seedHeroBanners.length)

  // 1. Update data/cms.json
  const cmsJsonPath = path.resolve('data/cms.json')
  if (fs.existsSync(cmsJsonPath)) {
    const raw = fs.readFileSync(cmsJsonPath, 'utf-8')
    const cmsData = JSON.parse(raw)
    cmsData.blogs = seedBlogs
    cmsData.heroBanners = seedHeroBanners
    fs.writeFileSync(cmsJsonPath, JSON.stringify(cmsData, null, 2), 'utf-8')
    console.log('Successfully updated data/cms.json with blogs and heroBanners.')
  } else {
    console.log('data/cms.json does not exist.')
  }

  // 2. Update MongoDB if configured
  const envPath = path.resolve('.env')
  if (fs.existsSync(envPath)) {
    const env = fs.readFileSync(envPath, 'utf-8')
    const match = env.match(/MONGODB_URI=(.+)/)
    const uri = match ? match[1].trim() : ''
    if (uri) {
      const client = new MongoClient(uri)
      await client.connect()
      const db = client.db('transhub')
      const result = await db.collection('cms').updateOne(
        { _id: 'site' as any },
        {
          $set: {
            'data.blogs': seedBlogs,
            'data.heroBanners': seedHeroBanners,
            updatedAt: new Date().toISOString(),
          },
        },
      )
      console.log('Successfully updated MongoDB cms.data.blogs and cms.data.heroBanners! Matched:', result.matchedCount, 'Modified:', result.modifiedCount)
      await client.close()
    } else {
      console.log('No MONGODB_URI found in .env')
    }
  }
}

syncBlogs().catch((err) => {
  console.error('Error syncing blogs:', err)
  process.exit(1)
})
