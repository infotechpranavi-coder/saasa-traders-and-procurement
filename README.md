# TransHub — Next.js + Tailwind CSS

A pixel-faithful recreation of the TransHub logistics website with scroll animations.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
transhub/
├── app/
│   ├── globals.css          # Global styles + animation classes
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── services/page.tsx    # Services page
│   ├── about/page.tsx       # About page
│   ├── projects/page.tsx    # Projects page
│   ├── blog/page.tsx        # Blog page
│   └── contact/page.tsx     # Contact page
├── components/
│   ├── Topbar.tsx           # Top info bar (orange)
│   ├── Navbar.tsx           # Sticky navigation
│   ├── Hero.tsx             # Hero section with truck
│   ├── Services.tsx         # 4 service cards + marquee
│   ├── About.tsx            # About section with tabs
│   ├── Stats.tsx            # Stats overlay on ship image
│   ├── Process.tsx          # 3-step process
│   ├── Solutions.tsx        # Solutions with feature grid
│   ├── Portfolio.tsx        # Portfolio image gallery
│   ├── Testimonials.tsx     # Client testimonials
│   ├── Blog.tsx             # Blog posts section
│   ├── Footer.tsx           # Dark footer with newsletter
│   └── PageHero.tsx         # Inner page hero breadcrumb
└── hooks/
    └── useScrollReveal.ts   # IntersectionObserver hook
```

## ✨ Features

- **Scroll animations** — fade-up, fade-left, fade-right on every section
- **Sticky navbar** with shadow on scroll
- **Orange + dark navy** brand colors matching the original
- **Marquee ticker** on services section
- **Tabbed content** in About section
- **Responsive** mobile-first design
- **Multi-page**: Home, Services, About, Projects, Blog, Contact
- **Hover effects** on cards, buttons, and nav links

## 🎨 Color Palette

| Variable | Color |
|----------|-------|
| Primary | `#F15A24` (Orange) |
| Dark | `#0D1B2A` (Navy) |
| Accent | `#1a2744` |

## 📦 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** + **React 18**
- **Tailwind CSS 3**
- **Google Fonts** — Barlow (headings) + Inter (body)
- Vanilla `IntersectionObserver` for scroll reveals
