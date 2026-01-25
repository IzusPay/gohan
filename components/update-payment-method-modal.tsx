'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CreditCard, Loader2 } from 'lucide-react'

interface UpdatePaymentMethodModalProps {
  isOpen: boolean
  onClose: () => void
  currentCardLast4: string
  onUpdate: (newCard: { number: string; expiry: string; cvc: string }) => void
}

export default function UpdatePaymentMethodModal({ isOpen, onClose, currentCardLast4, onUpdate }: UpdatePaymentMethodModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    onUpdate(formData)
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Payment Method</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Cardholder Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="number">Card Number</Label>
            <div className="relative">
              <CreditCard className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="number"
                placeholder="0000 0000 0000 0000"
                className="pl-9"
                value={formData.number}
                onChange={e => setFormData({...formData, number: e.target.value})}
                maxLength={19}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                value={formData.expiry}
                onChange={e => setFormData({...formData, expiry: e.target.value})}
                maxLength={5}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                placeholder="123"
                value={formData.cvc}
                onChange={e => setFormData({...formData, cvc: e.target.value})}
                maxLength={3}
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Save New Card"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
