import { getHomepageExpertiseItems } from '@/lib/cms'
import HomeExpertise from './HomeExpertise'

export default async function HomeServices() {
  const items = await getHomepageExpertiseItems()
  return <HomeExpertise items={items} />
}
