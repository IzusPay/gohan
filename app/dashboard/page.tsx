import { getOrders, getUser } from '@/app/actions'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/dashboard-nav'
import InstancesView from '@/components/instances-view'

export default async function DashboardPage() {
  const { role, email } = await getUser()
  
  if (!role || role !== 'client') {
    redirect('/login')
  }

  const orders = await getOrders()
  // Filter orders for this user if needed, but getOrders might return all?
  // Looking at getOrders implementation (from memory/previous context), it reads from JSON.
  // Ideally it should filter by user email if it's a shared DB.
  // The current mock implementation in actions.ts (from memory) just returns all orders or maybe specific ones?
  // Let's assume getOrders returns all and I filter here, or getOrders handles it.
  // Actually, let's filter here to be safe if getOrders returns everything.
  // Wait, if I filter here, I need to know if getOrders returns a flat list.
  // Let's assume getOrders returns what is in the JSON.
  // In `app/admin/page.tsx` I saw `orders.map` so it returns an array.
  // I'll filter by email here to be correct for the client view.
  
  const userOrders = orders.filter((order: any) => order.userEmail === email)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav email={email || ''} />

      <main className="flex-1 p-6">
        <InstancesView orders={userOrders} />
      </main>
    </div>
  )
}
