import HeroSection from '../components/HeroSection'
import HomeServices from '../components/HomeServices'
import About from '../components/About'
import Stats from '../components/Stats'
import Process from '../components/Process'
import Solutions from '../components/Solutions'
import Portfolio from '../components/Portfolio'
import Testimonials from '../components/Testimonials'
import HomeBlog from '../components/HomeBlog'
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
      <Portfolio />
      <Testimonials />
      <HomeBlog />
      <Footer />
    </main>
  )
}
