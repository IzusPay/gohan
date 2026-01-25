import DashboardNav from "@/components/dashboard-nav"
import { getUser, getOrders } from "@/app/actions"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HardDrive, FolderOpen } from "lucide-react"

export default async function StoragePage() {
  const { email } = await getUser()
  
  if (!email) {
    redirect('/login')
  }

  const orders = await getOrders()
  const userOrders = orders.filter((o: any) => o.userEmail === email && o.type === 'hosting')

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav email={email} />
      
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Storage Management</h1>
            <p className="text-muted-foreground">Manage files for your hosting services</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {userOrders.length === 0 ? (
              <div className="col-span-full text-center p-8 border rounded-lg bg-muted/20">
                <HardDrive className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No Storage Services Found</h3>
                <p className="text-muted-foreground mb-4">You don't have any active hosting services with storage.</p>
                <Link href="/dashboard">
                  <Button>View Services</Button>
                </Link>
              </div>
            ) : (
              userOrders.map((order: any) => (
                <Card key={order.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderOpen className="h-5 w-5 text-blue-500" />
                      {order.planName}
                    </CardTitle>
                    <CardDescription>{order.subdomain}.hostprime.shop</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>Storage: 10 GB (Shared)</p>
                        <p>Status: {order.status}</p>
                      </div>
                      <Link href={`/dashboard/hosting/${order.id}`} className="block">
                        <Button className="w-full">
                          Manage Files
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
