'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
  Shield
} from 'lucide-react'
import Link from 'next/link'
import ConnectModal from './connect-modal'
import SecurityGroupsModal from './security-groups-modal'
import UpgradeInstanceModal from './upgrade-instance-modal'
import { ArrowUpCircle } from 'lucide-react'

interface Order {
  id: string
  planName: string
  userEmail: string
  status: string
  cpu: string
  ram: string
  ip: string
  price: string
}

interface InstancesViewProps {
  orders: Order[]
}

import { useRouter } from 'next/navigation'

// ... existing imports ...

export default function InstancesView({ orders }: InstancesViewProps) {
  const router = useRouter()
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null)
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false)
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false)
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedOrder = orders.find(o => o.id === selectedInstanceId)

  const handleRowClick = (order: any) => {
    if (order.type === 'hosting') {
      router.push(`/dashboard/hosting/${order.id}`)
    } else {
      setSelectedInstanceId(order.id === selectedInstanceId ? null : order.id)
    }
  }

  const handleConnect = () => {
    if (selectedInstanceId) {
      setIsConnectModalOpen(true)
    }
  }

  const handleSecurity = () => {
    if (selectedInstanceId) {
      setIsSecurityModalOpen(true)
    }
  }

  const handleUpgrade = () => {
    if (selectedInstanceId) {
      setIsUpgradeModalOpen(true)
    }
  }

  const filteredOrders = orders.filter(order => 
    order.planName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.ip.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Instances</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Feedback
          </Button>
        </div>
      </div>

      {/* AWS Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-2 bg-muted/30 border rounded-lg">
        <div className="flex items-center gap-2">
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8" 
            disabled={!selectedInstanceId}
            onClick={handleConnect}
          >
            Connect
          </Button>
          <Button variant="secondary" size="sm" className="h-8" disabled={!selectedInstanceId}>
            Instance state <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8" 
            disabled={!selectedInstanceId}
            onClick={handleSecurity}
          >
            Security <Shield className="ml-1 h-3 w-3" />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-8" 
            disabled={!selectedInstanceId}
            onClick={handleUpgrade}
          >
            Upgrade <ArrowUpCircle className="ml-1 h-3 w-3" />
          </Button>
          <Button variant="secondary" size="sm" className="h-8" disabled={!selectedInstanceId}>
            Actions <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </div>
        <div>
          <Link href="/#pricing">
            <Button size="sm" className="h-8 bg-orange-500 hover:bg-orange-600 text-white">
              Launch instances
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Find instance by attribute or tag (case-sensitive)"
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <RotateCw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Settings className="h-4 w-4" />
        </Button>
      </div>

      {/* Instances Table */}
      <div className="border rounded-md bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Instance ID</TableHead>
              <TableHead>Instance state</TableHead>
              <TableHead>Instance type</TableHead>
              <TableHead>Status check</TableHead>
              <TableHead>Availability Zone</TableHead>
              <TableHead>Public IPv4 address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No instances found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow 
                  key={order.id} 
                  className={selectedInstanceId === order.id ? 'bg-muted/50' : ''}
                  onClick={() => handleRowClick(order)}
                >
                  <TableCell>
                    <input 
                      type="checkbox" 
                      className="translate-y-0.5" 
                      checked={selectedInstanceId === order.id}
                      onChange={() => setSelectedInstanceId(order.id === selectedInstanceId ? null : order.id)}
                    />
                  </TableCell>
                  <TableCell className="font-medium text-blue-600 hover:underline cursor-pointer">
                    {order.planName}
                  </TableCell>
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
                  <TableCell>{order.cpu.split(' ')[0]}.medium</TableCell>
                  <TableCell className="text-green-600">2/2 checks passed</TableCell>
                  <TableCell>us-east-1a</TableCell>
                  <TableCell>{order.ip || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selectedOrder && (
        <>
          <ConnectModal 
            isOpen={isConnectModalOpen}
            onClose={() => setIsConnectModalOpen(false)}
            instanceId={selectedOrder.id}
            ip={selectedOrder.ip}
          />
          <SecurityGroupsModal
            isOpen={isSecurityModalOpen}
            onClose={() => setIsSecurityModalOpen(false)}
            instanceId={selectedOrder.id}
          />
          <UpgradeInstanceModal
            isOpen={isUpgradeModalOpen}
            onClose={() => setIsUpgradeModalOpen(false)}
            instanceId={selectedOrder.id}
            currentPlanName={selectedOrder.planName}
          />
        </>
      )}
    </div>
  )
}
