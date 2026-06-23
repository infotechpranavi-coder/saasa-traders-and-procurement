import { getPortfolioProjects } from '@/lib/cms'
import PortfolioSlider from './PortfolioSlider'

export default async function HomePortfolio() {
  const projects = await getPortfolioProjects()
  return <PortfolioSlider projects={projects} />
}
