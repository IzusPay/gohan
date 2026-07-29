import { getOrders, getUser, getCurrentUserProfile } from '@/app/actions'
import { redirect, notFound } from 'next/navigation'
import DashboardNav from '@/components/dashboard-nav'
import InvoiceDetailView from '@/components/invoice-detail-view'

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string }
}) {
  const { role, email } = await getUser()
  const resolved = await Promise.resolve(params)
  const id = resolved.id?.replace(/^INV-/i, '')

  if (!role) {
    redirect('/login')
  }

  const orders = await getOrders()
  const order = orders.find((o: any) => o.id === id)

  if (!order) {
    notFound()
  }

  if (role !== 'admin' && order.userEmail !== email) {
    redirect('/dashboard/billing')
  }

  const profile = await getCurrentUserProfile()
  const customer = {
    email: order.userEmail || email || '',
    firstName: profile?.firstName,
    lastName: profile?.lastName,
    company: profile?.company,
    address: profile?.address,
    city: profile?.city,
    country: profile?.country,
    zipCode: profile?.zipCode,
    phone: profile?.phone,
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav email={email || ''} />
      <main className="flex-1 container mx-auto px-4 py-8">
        <InvoiceDetailView order={order} customer={customer} />
      </main>
    </div>
  )
}
