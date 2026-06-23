import { getCustomerReviews } from '@/lib/cms'
import Testimonials from './Testimonials'

export default async function HomeTestimonials() {
  const reviews = await getCustomerReviews()
  return <Testimonials reviews={reviews} />
}
