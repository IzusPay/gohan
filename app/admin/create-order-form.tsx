'use client'

import { createOrder } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const runtime = 'edge'

export default function CreateOrderForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const orderData = {
      type: formData.get('type'),
      planName: formData.get('planName'),
      cpu: formData.get('cpu'),
      ram: formData.get('ram'),
      storage: formData.get('storage'),
      price: formData.get('price'),
      ip: formData.get('ip'),
      subdomain: formData.get('subdomain'),
      userEmail: formData.get('userEmail'),
      nextBilling: formData.get('nextBilling'),
    }

    await createOrder(orderData)
    setIsLoading(false)
    router.refresh()
    // Reset form
    e.currentTarget.reset()
  }

  const [serviceType, setServiceType] = useState('vps')

  const handleServiceTypeChange = (value: string) => {
    setServiceType(value)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New Service</CardTitle>
        <CardDescription>Add a new VPS or Web Hosting purchase for a client</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="userEmail">Client Email</Label>
              <Input 
                id="userEmail" 
                name="userEmail" 
                defaultValue="pedronovaisengcp@gmail.com" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Service Type</Label>
              <Select name="type" defaultValue="vps" onValueChange={handleServiceTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vps">VPS</SelectItem>
                  <SelectItem value="hosting">Web Hosting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {serviceType === 'vps' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="planName">Plan Name</Label>
                  <Input id="planName" name="planName" placeholder="VPS Pro" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpu">CPU</Label>
                  <Input id="cpu" name="cpu" placeholder="4 vCPU" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ram">RAM</Label>
                  <Input id="ram" name="ram" placeholder="8 GB" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage">Storage</Label>
                  <Input id="storage" name="storage" placeholder="160 GB NVMe" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" placeholder="$24.00" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input id="ip" name="ip" placeholder="192.168.1.101" />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="planName">Plan Name</Label>
                  <Select name="planName" defaultValue="Web Hosting Demo">
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Web Hosting Demo">Web Hosting Demo ($3.00)</SelectItem>
                      <SelectItem value="Web Hosting Pro">Web Hosting Pro ($10.00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain (e.g. mysite)</Label>
                  <div className="flex items-center gap-2">
                    <Input id="subdomain" name="subdomain" placeholder="mysite" required />
                    <span className="text-sm text-muted-foreground">.hostprime.shop</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storage">Storage Limit</Label>
                  <Input id="storage" name="storage" defaultValue="10 GB" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" name="price" defaultValue="$3.00" />
                </div>
                <input type="hidden" name="cpu" value="Shared" />
                <input type="hidden" name="ram" value="Shared" />
                <input type="hidden" name="ip" value="Shared IP" />
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="nextBilling">Next Billing Date</Label>
              <Input id="nextBilling" name="nextBilling" type="date" required />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Registering...
              </>
            ) : (
              "Register Purchase"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
