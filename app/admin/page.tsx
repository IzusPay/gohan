import { getOrders, getUser, getAllUsers } from '@/app/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Search, 
  RotateCw, 
  Settings, 
  ChevronDown, 
  CheckCircle2,
  AlertCircle,
  DollarSign,
  Activity,
  CreditCard,
  UserPlus
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import CreateOrderForm from './create-order-form'
import DashboardNav from '@/components/dashboard-nav'
import UsersTable from '@/components/admin/users-table'
import CreateUserDialog from '@/components/admin/create-user-dialog'

import LeadsTable from '@/components/admin/leads-table'

export default async function AdminPage() {
  const { role, email } = await getUser()
  
  if (!role || role !== 'admin') {
    redirect('/login')
  }

  const orders = await getOrders()
  const users = await getAllUsers()

  const activeUsers = users.filter((u: any) => u.status !== 'inactive')
  const leads = users.filter((u: any) => u.status === 'inactive')

  // Calculate stats
  const activeServices = orders.filter((o: any) => o.status === 'Active').length
  
  const totalBilling = orders.reduce((acc: number, o: any) => {
    // Robust parsing for price
    const priceStr = o.price || ''
    // Remove all non-numeric chars except . and ,
    let clean = priceStr.replace(/[^0-9.,]/g, '')
    
    // Logic to handle 1.000,00 vs 1,000.00 vs 1000
    if (clean.includes(',') && clean.includes('.')) {
        if (clean.indexOf(',') > clean.indexOf('.')) {
            // 1.000,00 -> 1000.00 (European/Brazilian)
            clean = clean.replace(/\./g, '').replace(',', '.')
        } else {
            // 1,000.00 -> 1000.00 (US)
            clean = clean.replace(/,/g, '')
        }
    } else if (clean.includes(',')) {
        // 349,00 -> 349.00
        clean = clean.replace(',', '.')
    }
    
    const price = parseFloat(clean) || 0
    return acc + price
  }, 0)

  // Mock monthly billing (assuming all are monthly for this iteration)
  const monthlyBilling = totalBilling

  const formatBRL = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardNav email={email || ''} />

      <main className="flex-1 p-6">
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Console</h1>
              <p className="text-muted-foreground">Manage all instances and user orders</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services & Instances</TabsTrigger>
              <TabsTrigger value="clients">Client Management</TabsTrigger>
              <TabsTrigger value="leads">Leads (Inactive)</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Stats Cards */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Revenue
                    </CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatBRL(monthlyBilling)}</div>
                    <p className="text-xs text-muted-foreground">
                      +20.1% from last month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Revenue (All Time)
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatBRL(totalBilling * 12)}</div>
                    <p className="text-xs text-muted-foreground">
                      +180.1% from last year
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Services</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{activeServices}</div>
                    <p className="text-xs text-muted-foreground">
                      +19 since last hour
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-4">
              {/* Admin Header & Create Section */}
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Launch New Instance / Service</CardTitle>
                    <CardDescription>Register a new VPS order or service for a client. You can set a custom price.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CreateOrderForm />
                  </CardContent>
                </Card>
              </div>

              {/* Instances List Section */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">All Instances</h2>
                </div>

                {/* AWS Actions Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-muted/30 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="h-8" disabled>
                      Stop
                    </Button>
                    <Button variant="secondary" size="sm" className="h-8" disabled>
                      Reboot
                    </Button>
                    <Button variant="secondary" size="sm" className="h-8" disabled>
                      Terminate
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search instances..."
                        className="pl-9 h-9 w-[300px]"
                      />
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Instances Table */}
                <div className="border rounded-md bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="w-[40px]"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Client Email</TableHead>
                        <TableHead>Instance ID</TableHead>
                        <TableHead>Instance state</TableHead>
                        <TableHead>Instance type</TableHead>
                        <TableHead>Availability Zone</TableHead>
                        <TableHead>Public IPv4</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                            No instances registered
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order: any) => (
                          <TableRow key={order.id}>
                            <TableCell>
                              <input type="checkbox" className="translate-y-0.5" />
                            </TableCell>
                            <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">
                              {order.planName}
                            </TableCell>
                            <TableCell>{order.userEmail}</TableCell>
                            <TableCell className="font-mono text-xs">{order.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {order.status === 'Active' ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertCircle className="h-4 w-4 text-yellow-500" />
                                )}
                                <span>{order.status === 'Active' ? 'Running' : order.status}</span>
                              </div>
                            </TableCell>
                            <TableCell>{order.cpu?.split(' ')[0]}.medium</TableCell>
                            <TableCell>us-east-1a</TableCell>
                            <TableCell>{order.ip || '-'}</TableCell>
                            <TableCell>{order.price}</TableCell>
                            <TableCell>
                              <Link href={`/admin/storage/${order.id}`}>
                                <Button variant="outline" size="sm">
                                  Manage Storage
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="clients" className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Client Management</h2>
                  <CreateUserDialog />
                </div>
                <UsersTable users={activeUsers} />
              </div>
            </TabsContent>

            <TabsContent value="leads" className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">Leads (Inactive Users)</h2>
                  <p className="text-muted-foreground">Users who registered but have not been activated yet.</p>
                </div>
                <LeadsTable leads={leads} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
