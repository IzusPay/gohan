import { getOrders, getUser } from '@/app/actions'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard-nav'
import HostingManager from '@/components/hosting/hosting-manager'

export default async function HostingPage({ params }: { params: Promise<{ id: string }> }) {
  const { role, email } = await getUser()
  const { id } = await params
  
  if (!role) {
    redirect('/login')
  }

  const orders = await getOrders()
  const order = orders.find((o: any) => o.id === id)

  if (!order) {
    redirect('/dashboard')
  }

  // Verify ownership if not admin (though getOrders already filters for non-admin)
  // But redundant check is fine.
  if (role !== 'admin' && order.userEmail !== email) {
    redirect('/dashboard')
  }

  if (order.type !== 'hosting') {
     // If it's a VPS, redirect back to dashboard or VPS view?
     // For now, redirect to dashboard
     redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav email={email || ''} />
      <main className="flex-1 p-6 h-[calc(100vh-64px)] overflow-hidden">
        <HostingManager order={order} />
      </main>
    </div>
  )
}