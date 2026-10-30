import { redirect } from 'next/navigation'

export const runtime = 'edge'

// No landing page: the root opens the client panel (dashboard sends to /login when signed out)
export default function Home() {
  redirect('/dashboard')
}
