import Navbar from './Navbar'
import Hero from './Hero'

export default function HeroSection() {
  return (
    <>
      <header className="hero-cinematic-header relative bg-[#0F1419]">
        <Hero />
      </header>
      <Navbar variant="hero" />
    </>
  )
}
