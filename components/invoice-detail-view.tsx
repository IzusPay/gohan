'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowLeft, Printer, Server } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface InvoiceDetailViewProps {
  order: any
  customer: {
    email: string
    firstName?: string
    lastName?: string
    company?: string
    address?: string
    city?: string
    country?: string
    zipCode?: string
    phone?: string
  }
}

function paymentLabel(method?: string) {
  switch (method) {
    case 'paypal':
      return 'PayPal'
    case 'credit_card':
      return 'Credit Card'
    case 'crypto':
      return 'Cryptocurrency'
    case 'nu_global':
      return 'Nu Global'
    default:
      return method || 'Card on file'
  }
}

export default function InvoiceDetailView({ order, customer }: InvoiceDetailViewProps) {
  const invoiceDate = new Date(order.createdAt || 0)
  const nextBillingDate = order.nextBilling
    ? new Date(order.nextBilling)
    : new Date(invoiceDate.getTime())
  if (!order.nextBilling) {
    nextBillingDate.setMonth(nextBillingDate.getMonth() + 1)
  }

  const invoiceId = `INV-${order.id}`
  const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || 'Customer'
  const specs = [order.cpu, order.ram, order.storage].filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/billing">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Billing
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Invoice #{invoiceId}</h1>
            <p className="text-sm text-muted-foreground">
              {format(invoiceDate, 'MMM d, yyyy HH:mm')} · {order.status || 'Active'}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print / PDF
        </Button>
      </div>

      <Card className="overflow-hidden print:border-0 print:shadow-none">
        <CardContent className="p-6 sm:p-8 space-y-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary">
                <Server className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xl font-bold">HostPrime</p>
                <p className="text-sm text-muted-foreground">Premium VPS Hosting</p>
                <p className="text-sm text-muted-foreground mt-2">pedronovaisengcp@gmail.com</p>
              </div>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Invoice</p>
              <p className="font-mono text-lg font-semibold">{invoiceId}</p>
              <p className="text-sm text-muted-foreground">
                Issued {format(invoiceDate, 'MMM d, yyyy')} at {format(invoiceDate, 'HH:mm')}
              </p>
              <p className="text-sm">
                Status:{' '}
                <span className="font-medium text-green-600">{order.status || 'Paid'}</span>
              </p>
            </div>
          </div>

          <div className="border-t" />

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Bill to</p>
              <p className="font-semibold">{customerName}</p>
              {customer.company ? <p className="text-sm">{customer.company}</p> : null}
              <p className="text-sm text-muted-foreground">{customer.email}</p>
              {customer.address ? <p className="text-sm text-muted-foreground">{customer.address}</p> : null}
              {(customer.city || customer.zipCode || customer.country) && (
                <p className="text-sm text-muted-foreground">
                  {[customer.city, customer.zipCode, customer.country].filter(Boolean).join(', ')}
                </p>
              )}
              {customer.phone ? <p className="text-sm text-muted-foreground">{customer.phone}</p> : null}
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Service details</p>
              <p className="font-semibold">{order.planName}</p>
              <p className="text-sm text-muted-foreground">Instance ID: {order.id}</p>
              {order.ip ? <p className="text-sm text-muted-foreground">IP: {order.ip}</p> : null}
              {order.type ? <p className="text-sm text-muted-foreground">Type: {order.type}</p> : null}
              <p className="text-sm text-muted-foreground">
                Next billing: {format(nextBillingDate, 'MMM d, yyyy')}
              </p>
              <p className="text-sm text-muted-foreground">
                Payment: {paymentLabel(order.paymentMethod)}
                {order.cardLast4 ? ` •••• ${order.cardLast4}` : ''}
              </p>
            </div>
          </div>

          <div className="rounded-lg border overflow-hidden">
            <div className="grid grid-cols-12 gap-2 bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <div className="col-span-6">Description</div>
              <div className="col-span-3 hidden sm:block">Resources</div>
              <div className="col-span-6 sm:col-span-3 text-right">Amount</div>
            </div>
            <div className="grid grid-cols-12 gap-2 px-4 py-4 items-start">
              <div className="col-span-6">
                <p className="font-medium">Billing for {order.planName}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Monthly hosting service · {format(invoiceDate, 'MMM d, yyyy HH:mm')}
                </p>
              </div>
              <div className="col-span-3 hidden sm:block text-sm text-muted-foreground">
                {specs.length > 0 ? specs.join(' · ') : '—'}
              </div>
              <div className="col-span-6 sm:col-span-3 text-right font-semibold">{order.price}</div>
            </div>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{order.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span>$0.00</span>
              </div>
              <div className="border-t" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{order.price}</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Thank you for your business. For billing questions, contact support@hostprime.com.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
