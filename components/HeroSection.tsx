import Navbar from './Navbar'
import Hero from './Hero'
import { getHeroBanners, getSiteSettings } from '@/lib/cms'

export default async function HeroSection() {
  const [banners, siteSettings] = await Promise.all([getHeroBanners(), getSiteSettings()])

  return (
    <>
      <header className="hero-cinematic-header relative bg-[#0F1419]">
        <Hero banners={banners} siteSettings={siteSettings} />
      </header>
      <Navbar variant="hero" />
    </>
  )
}
