'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard } from 'lucide-react'
import UpdatePaymentMethodModal from '@/components/update-payment-method-modal'
import { format } from 'date-fns'

interface BillingViewProps {
  orders: any[]
}

export default function BillingView({ orders }: BillingViewProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    last4: '4242',
    expiry: '12/28'
  })

  // Generate invoices from orders
  const invoices = orders.map((order, index) => {
    // Parse price to number
    const amount = order.price
    const date = new Date(order.createdAt || Date.now())
    const nextBillingDate = new Date(date)
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
    
    return {
      id: `INV-${date.getFullYear()}-${String(index + 1).padStart(3, '0')}`,
      date: format(date, 'MMM d, yyyy'),
      nextBilling: format(nextBillingDate, 'MMM d, yyyy'),
      amount: amount,
      description: `Billing for ${order.planName}`
    }
  })

  const handleUpdateCard = (newCard: any) => {
    // In a real app, this would verify the card and update backend
    setCardDetails({
      last4: newCard.number.slice(-4),
      expiry: newCard.expiry
    })
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>Manage your payment details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 border rounded-lg">
            <div className="h-10 w-10 flex items-center justify-center bg-muted rounded-full">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="font-medium">Visa ending in {cardDetails.last4}</p>
              <p className="text-sm text-muted-foreground">Expires {cardDetails.expiry}</p>
            </div>
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(true)}>Update</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>View past invoices generated from your services</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No invoices found
              </div>
            ) : (
              invoices.map((invoice) => (
                <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Invoice #{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date} - {invoice.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Next billing: {invoice.nextBilling}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium">{invoice.amount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <UpdatePaymentMethodModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        currentCardLast4={cardDetails.last4}
        onUpdate={handleUpdateCard}
      />
    </div>
  )
}
