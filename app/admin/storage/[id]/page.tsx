import { getOrders, getUser } from '@/app/actions'
import HostingManager from '@/components/hosting/hosting-manager'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardNav from '@/components/dashboard-nav'

export const runtime = 'edge'

export default async function AdminStoragePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { role, email } = await getUser()

  if (role !== 'admin') {
    redirect('/login')
  }

  const orders = await getOrders()
  const order = orders.find((o: any) => o.id === id)

  if (!order) {
    return <div>Order not found</div>
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav email={email || ''} />
      <main className="flex-1 p-6">
        <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-2xl font-bold">Storage Management</h1>
              <p className="text-muted-foreground">Manage files for instance {order.id} ({order.planName})</p>
            </div>
            
            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>File Manager</CardTitle>
                    <CardDescription>
                        Direct access to client's storage (R2).
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 h-[600px]">
                    <HostingManager order={order} />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  )
}
