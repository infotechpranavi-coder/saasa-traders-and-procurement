import { getServices } from '@/lib/cms'
import Services from './Services'

export default async function HomeServices() {
  const services = await getServices()
  return <Services services={services} />
}
