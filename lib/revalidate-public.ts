import { revalidatePath } from 'next/cache'

/** Targeted paths only — avoids slow full layout revalidation on every CMS save. */
const PUBLIC_PATHS = [
  '/',
  '/dashboard',
  '/products',
  '/services',
  '/blog',
  '/work',
  '/about',
  '/contact',
] as const

export function revalidatePublicPages() {
  for (const path of PUBLIC_PATHS) {
    revalidatePath(path)
  }
}
