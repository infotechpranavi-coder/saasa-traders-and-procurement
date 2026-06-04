import type { ReactNode } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <main className="site-inner-page site-typography">
      <Navbar />
      {children}
      <Footer />
    </main>
  )
}
