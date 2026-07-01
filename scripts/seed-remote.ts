/**
 * Seeds demo CMS data into MongoDB with all media on Cloudinary.
 * Run: npm run seed
 */
import { seedDemoCmsToMongo } from '../lib/seed-remote-cms'
import { ensureStaticMachineryImages } from '../lib/ensure-static-images'

async function main() {
  console.log('Restoring local /statsic machinery photos...')
  await ensureStaticMachineryImages()

  console.log('Seeding CMS to MongoDB (Cloudinary: products, services, portfolio, reviews only)...')
  const data = await seedDemoCmsToMongo(true)
  console.log('Done.')
  console.log(`  Products: ${data.products.length}`)
  console.log(`  Services: ${data.services.length}`)
  console.log(`  Hero banners: ${data.heroBanners.length}`)
  console.log(`  Expertise (homepage): ${data.products.filter((p) => p.showOnHomepage).length} products, ${data.services.filter((s) => s.showOnHomepage).length} services`)
  console.log(`  Product image: ${data.products[0]?.image ?? 'n/a'}`)
  console.log(`  Service image: ${data.services[0]?.image ?? 'n/a'}`)
}

main().catch((error) => {
  console.error('Seed failed:', error instanceof Error ? error.message : error)
  process.exit(1)
})
