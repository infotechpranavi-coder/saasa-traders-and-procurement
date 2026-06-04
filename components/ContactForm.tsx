'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from 'lucide-react'
import { SectionLabelIcon } from './icons/LogisticsIcons'

interface ContactForm {
  name: string
  email: string
  phone: string
  service: string
  message: string
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    alert('Thank you! We will contact you soon.')
  }

  const info = [
    { icon: MapPin, title: 'Our Location', desc: '123 Street, New York, USA' },
    { icon: Phone, title: 'Phone Number', desc: '+92 8208 383 727' },
    { icon: Mail, title: 'Email Address', desc: 'info@transhub.com' },
    { icon: Clock, title: 'Working Hours', desc: 'Mon - Sat: 9AM - 7PM' },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <div className="section-label mb-3">
              <SectionLabelIcon className="text-primary" />
              GET IN TOUCH
            </div>
            <h2 className="hp-title mb-6">We&apos;d Love to Hear From You</h2>
            <p className="hp-lead mb-10">
              Have a question about our logistics services? Our team is ready to help you find the perfect solution for your shipping needs.
            </p>

            {info.map((item) => (
              <div key={item.title} className="flex gap-4 mb-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-primary">
                  <item.icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <div>
                  <div className="hp-subtitle text-sm">{item.title}</div>
                  <div className="hp-body text-sm">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-[22px] bg-[#f4f5f7] p-8">
            <h3 className="hp-subtitle text-2xl mb-6">Get a Free Quote</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  required
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  required
                  className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
                />
              </div>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
              />
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500 transition-colors focus:border-primary focus:outline-none"
              >
                <option value="">Select Service</option>
                <option>Sea Transport</option>
                <option>Road Freight</option>
                <option>Air Freight</option>
                <option>Rail Logistics</option>
              </select>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Your Message"
                rows={5}
                className="resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm transition-colors focus:border-primary focus:outline-none"
              />
              <button type="submit" className="btn-primary justify-center py-4 text-base">
                Send Message
                <ArrowUpRight className="h-5 w-5" strokeWidth={2.2} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
