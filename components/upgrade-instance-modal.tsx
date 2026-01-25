'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { upgradeInstance } from '@/app/actions'
import { Loader2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UpgradeInstanceModalProps {
  isOpen: boolean
  onClose: () => void
  instanceId: string
  currentPlanName: string
}

const plans = [
  {
    name: "Starter VPS",
    price: 30,
    cpu: "2 vCPU",
    ram: "4 GB",
    storage: "80 GB NVMe",
  },
  {
    name: "Business VPS",
    price: 75,
    cpu: "4 vCPU",
    ram: "8 GB",
    storage: "200 GB NVMe",
  },
  {
    name: "Professional VPS",
    price: 150,
    cpu: "8 vCPU",
    ram: "16 GB",
    storage: "400 GB NVMe",
  },
  {
    name: "Enterprise VPS",
    price: 300,
    cpu: "16 vCPU",
    ram: "32 GB",
    storage: "800 GB NVMe",
  },
]

export default function UpgradeInstanceModal({ isOpen, onClose, instanceId, currentPlanName }: UpgradeInstanceModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>(currentPlanName)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleUpgrade = async () => {
    setIsLoading(true)
    const plan = plans.find(p => p.name === selectedPlan)
    
    if (!plan) return

    try {
      const result = await upgradeInstance(instanceId, plan)
      if (result.success) {
        toast.success('Instance upgraded successfully')
        router.refresh()
        onClose()
      } else {
        toast.error('Failed to upgrade instance')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upgrade Instance</DialogTitle>
          <DialogDescription>
            Choose a new plan for your instance. Your billing will be updated automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <RadioGroup value={selectedPlan} onValueChange={setSelectedPlan} className="gap-4">
            {plans.map((plan) => (
              <div key={plan.name} className={`flex items-center justify-between space-x-2 border rounded-lg p-4 cursor-pointer transition-colors ${selectedPlan === plan.name ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value={plan.name} id={plan.name} />
                  <Label htmlFor={plan.name} className="cursor-pointer">
                    <div className="font-semibold">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {plan.cpu} • {plan.ram} • {plan.storage}
                    </div>
                  </Label>
                </div>
                <div className="font-bold">
                  ${plan.price}/mo
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleUpgrade} disabled={isLoading || selectedPlan === currentPlanName}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
