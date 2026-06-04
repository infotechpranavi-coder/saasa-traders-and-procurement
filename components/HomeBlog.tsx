import { getBlogs } from '@/lib/cms'
import Blog from './Blog'

export default async function HomeBlog() {
  const posts = await getBlogs()
  return <Blog posts={posts} />
}
