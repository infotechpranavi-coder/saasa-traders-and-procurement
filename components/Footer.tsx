'use client'

import { useState } from 'react'
import Link from 'next/link'
import BrandLogo from './BrandLogo'
import { COMPANY_NAME } from '@/lib/brand'
import { useScrollReveal } from '../hooks/useScrollReveal'
import type { SocialName } from '@/types'

export default function Footer() {
  const [email, setEmail] = useState('')
  const { ref } = useScrollReveal()

  return (
    <footer ref={ref} style={{background:'#0D1B2A', position:'relative', overflow:'hidden'}}>
      {/* Faint grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage:'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)',
        backgroundSize:'50px 50px'
      }}/>

      {/* Newsletter band */}
      <div className="relative border-b border-gray-700 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <h3>
            Subscribe Our<br />Newsletter
          </h3>
          <div className="flex gap-2 w-full max-w-md">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 bg-gray-800/80 border border-gray-600 text-white placeholder-gray-400 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
            <button className="btn-primary text-sm px-6">
              Subscribe
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="relative py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-10">
            {/* Brand */}
            <div className="reveal">
              <Link href="/" className="flex flex-col items-start gap-2 mb-5">
                <BrandLogo className="brand-logo brand-logo--nav" />
                <span className="footer-brand-name text-white">{COMPANY_NAME}</span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Our dedication lies in embracing challenges and pioneering innovation within the more attractive advertising sector.
              </p>
              <div className="flex gap-3">
                {(['facebook', 'twitter', 'instagram', 'linkedin'] as const).map((s) => (
                  <a key={s} href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                    <SocialIcon name={s} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="reveal delay-100">
              <h4 className="mb-2">Quick Links</h4>
              <div className="w-8 h-1 bg-primary mb-5"/>
              {['About Us','Our Services','Project','FAQ\'s','Our Blog','Contact Us'].map(l => (
                <Link key={l} href="#"
                  className="block text-gray-400 hover:text-primary text-sm py-1.5 hover:translate-x-1 transition-all">
                  {l}
                </Link>
              ))}
            </div>

            {/* Our Services */}
            <div className="reveal delay-200">
              <h4 className="mb-2">Our Services</h4>
              <div className="w-8 h-1 bg-primary mb-5"/>
              {['Ship Fright Shipping','Less Than Truckload','Container Freight','Adult Health','Rail Freight Shipping','Air Fright Trucking'].map(l => (
                <Link key={l} href="#"
                  className="block text-gray-400 hover:text-primary text-sm py-1.5 hover:translate-x-1 transition-all">
                  {l}
                </Link>
              ))}
            </div>

            {/* Opening Hours */}
            <div className="reveal delay-300">
              <h4 className="mb-2">Opening Hours</h4>
              <div className="w-8 h-1 bg-primary mb-5"/>
              {[
                {day:'Week Days', hours:'09.00 – 7.00'},
                {day:'Saturday', hours:'08.00 – 2.00'},
                {day:'Sunday', hours:'Day Off'},
              ].map(item => (
                <div key={item.day} className="flex items-center justify-between py-2 border-b border-gray-800 text-sm">
                  <span className="text-gray-400">{item.day}</span>
                  <span className="text-white font-medium">{item.hours}</span>
                </div>
              ))}
              <Link href="/contact" className="mt-5 inline-flex items-center justify-center bg-white text-dark font-bold text-sm px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-gray-800 py-5">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-gray-500 text-sm">
            Copyright © 2026 <span className="text-primary font-bold">{COMPANY_NAME}</span> All Rights Reserved.
          </p>
          <div className="flex gap-4 text-sm text-gray-500">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span>|</span>
            <Link href="#" className="hover:text-primary transition-colors">Terms & Condition</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SocialIcon({ name }: { name: SocialName }) {
  const icons: Record<SocialName, JSX.Element> = {
    facebook: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>,
    twitter: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    instagram: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="currentColor" strokeWidth="2"/></svg>,
    linkedin: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>,
  }
  return icons[name]
}
