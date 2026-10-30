'use client'

import { createCharge } from '@/app/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CreateChargeFormProps {
  users: any[]
  instances: any[]
}

export default function CreateChargeForm({ users, instances }: CreateChargeFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [userEmail, setUserEmail] = useState('')
  const [instanceId, setInstanceId] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const clients = users.filter((u: any) => u.role !== 'admin')
  const userInstances = instances.filter((o: any) => o.userEmail === userEmail)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (!userEmail) {
      setError('Select a client')
      return
    }
    setIsLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const chargeData = {
      userEmail,
      instanceId: instanceId || undefined,
      description: formData.get('description'),
      price: formData.get('price'),
      chargedTotal: formData.get('chargedTotal') || undefined,
      taxNote: formData.get('taxNote') || undefined,
      paymentMethod: formData.get('paymentMethod'),
      cardBrand: formData.get('cardBrand') || undefined,
      cardLast4: formData.get('cardLast4') || undefined,
      authCode: formData.get('authCode') || undefined,
      nextBilling: formData.get('nextBilling') || undefined,
      // datetime-local has no timezone: convert in the browser so the server keeps the admin's local time
      createdAt: formData.get('createdAt') ? new Date(formData.get('createdAt') as string).toISOString() : undefined,
    }

    const result = await createCharge(chargeData)
    setIsLoading(false)
    if (result?.error) {
      setError(result.error)
      return
    }
    form.reset()
    setInstanceId('')
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Charge</CardTitle>
        <CardDescription>Add a paid charge to a client. It appears in the client&apos;s Billing & Invoices.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={userEmail} onValueChange={(v) => { setUserEmail(v); setInstanceId('') }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((u: any) => (
                    <SelectItem key={u.id} value={u.email}>
                      {[u.firstName, u.lastName].filter(Boolean).join(' ')} ({u.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Instance (optional)</Label>
              <Select value={instanceId} onValueChange={setInstanceId} disabled={userInstances.length === 0}>
                <SelectTrigger>
                  <SelectValue placeholder={userInstances.length ? 'Select instance' : 'No instances'} />
                </SelectTrigger>
                <SelectContent>
                  {userInstances.map((o: any) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.planName} ({o.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="VPS monthly fee" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Amount</Label>
              <Input id="price" name="price" placeholder="$90" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chargedTotal">Total charged (with taxes)</Label>
              <Input id="chargedTotal" name="chargedTotal" placeholder="R$ 515,61" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxNote">Tax note</Label>
              <Input id="taxNote" name="taxNote" placeholder="USD 90 + taxes" />
            </div>
            <div className="space-y-2">
              <Label>Payment method</Label>
              <Select name="paymentMethod" defaultValue="credit_card">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                  <SelectItem value="crypto">Cryptocurrency</SelectItem>
                  <SelectItem value="nu_global">Nu Global</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardBrand">Card brand</Label>
                <Input id="cardBrand" name="cardBrand" placeholder="Mastercard" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardLast4">Card last 4</Label>
                <Input id="cardLast4" name="cardLast4" placeholder="5708" maxLength={4} pattern="\d{4}" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="authCode">Authorization code</Label>
              <Input id="authCode" name="authCode" placeholder="R35837" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="createdAt">Charge date</Label>
              <Input id="createdAt" name="createdAt" type="datetime-local" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nextBilling">Next billing date</Label>
              <Input id="nextBilling" name="nextBilling" type="date" />
            </div>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Charge'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
