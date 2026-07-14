import HeroSection from '../components/HeroSection'
import HomeServices from '../components/HomeServices'
import About from '../components/About'
import Stats from '../components/Stats'
import Process from '../components/Process'
import Solutions from '../components/Solutions'
import HomePortfolio from '../components/HomePortfolio'
import HomeTestimonials from '../components/HomeTestimonials'
import HomeBlog from '../components/HomeBlog'
import HomeCatalogCta from '../components/HomeCatalogCta'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="home-page site-typography">
      <HeroSection />
      <HomeServices />
      <About />
      <Stats />
      <Process />
      <Solutions />
      <HomeCatalogCta />
      <HomePortfolio />
      <HomeTestimonials />
      <HomeBlog />
      <Footer />
    </main>
  )
}
