import { getUser, getOrders } from '@/app/actions'
import DashboardNav from '@/components/dashboard-nav'
import { redirect } from 'next/navigation'
import BillingView from '@/components/billing-view'

export default async function BillingPage() {
  const { role, email } = await getUser()
  
  if (!role) {
    redirect('/login')
  }

  // Get user orders to generate invoices
  const allOrders = await getOrders()
  // Assuming getOrders returns only user orders for clients, or we filter manually just in case
  // The current mock getOrders logic for clients filters by email, but let's be safe if logic changes
  const userOrders = role === 'admin' 
    ? [] // Admin sees no personal invoices in this view usually, or maybe they do? Let's assume this page is for client billing.
    : allOrders // getOrders already filters for client

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav email={email || ''} />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Invoices</h1>
          <p className="text-muted-foreground mt-2">Manage your billing information and view invoices</p>
        </div>

        <BillingView orders={userOrders} />
      </main>
    </div>
  )
}
