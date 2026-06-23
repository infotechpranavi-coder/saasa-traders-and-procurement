import Navbar from './Navbar'
import Hero from './Hero'
import { getHeroBanners } from '@/lib/cms'

export default async function HeroSection() {
  const banners = await getHeroBanners()

  return (
    <>
      <header className="hero-cinematic-header relative bg-[#0F1419]">
        <Hero banners={banners} />
      </header>
      <Navbar variant="hero" />
    </>
  )
}
