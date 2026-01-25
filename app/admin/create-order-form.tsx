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

export default function CreateOrderForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const orderData = {
      planName: formData.get('planName'),
      cpu: formData.get('cpu'),
      ram: formData.get('ram'),
      storage: formData.get('storage'),
      price: formData.get('price'),
      ip: formData.get('ip'),
      userEmail: formData.get('userEmail'),
      nextBilling: formData.get('nextBilling'),
    }

    await createOrder(orderData)
    setIsLoading(false)
    router.refresh()
    // Reset form
    e.currentTarget.reset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Register New VPS</CardTitle>
        <CardDescription>Add a new VPS purchase for a client</CardDescription>
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
