'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, ChevronRight } from 'lucide-react'
import UpdatePaymentMethodModal from '@/components/update-payment-method-modal'
import { format } from 'date-fns'

interface BillingViewProps {
  orders: any[]
}

export default function BillingView({ orders }: BillingViewProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    last4: '2985',
    expiry: '12/28'
  })

  // Generate invoices from orders (newest first)
  const invoices = orders
    .map((order) => {
      const date = new Date(order.createdAt || 0)
      // Date-only strings (YYYY-MM-DD) must be parsed as local time, not UTC
      const nextBillingDate = order.nextBilling
        ? new Date(/^\d{4}-\d{2}-\d{2}$/.test(order.nextBilling) ? `${order.nextBilling}T00:00:00` : order.nextBilling)
        : new Date(date.getTime())
      if (!order.nextBilling) {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
      }

      return {
        id: `INV-${order.id}`,
        orderId: order.id,
        date: format(date, 'MMM d, yyyy HH:mm'),
        sortKey: date.getTime(),
        nextBilling: format(nextBillingDate, 'MMM d, yyyy'),
        amount: order.price,
        description: `Billing for ${order.planName}`
      }
    })
    .sort((a, b) => b.sortKey - a.sortKey)

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
                <Link
                  key={invoice.id}
                  href={`/dashboard/billing/${invoice.orderId}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-primary">Invoice #{invoice.id}</p>
                    <p className="text-sm text-muted-foreground">{invoice.date} - {invoice.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Next billing: {invoice.nextBilling}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{invoice.amount}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
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
