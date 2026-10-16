/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['cloudinary', 'mongodb'],
    serverActions: {
      bodySizeLimit: '30mb',
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/statsic/:path*',
        destination: '/static/:path*',
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/products/category/:id',
        destination: '/products/:id',
        permanent: true,
      },
      {
        source: '/services/category/:id',
        destination: '/services/:id',
        permanent: true,
      },
      {
        source: '/products/hydraulic-pump-assemblies',
        destination: '/products/develon-excavator',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
