"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2, Cpu, MemoryStick, HardDrive, Gauge, Globe, Shield, CheckCircle2 } from "lucide-react"

interface Plan {
  name: string
  price: number
  cpu: string
  ram: string
  storage: string
  bandwidth: string
  zone?: string
  storageType?: string
  os?: string
}

interface CheckoutModalProps {
  plan: Plan | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const countries = [
  "United States",
  "United Kingdom",
  "Germany",
  "France",
  "Canada",
  "Australia",
  "Brazil",
  "Japan",
  "Singapore",
  "Netherlands",
]

export function CheckoutModal({ plan, open, onOpenChange }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    country: "",
    city: "",
    address: "",
    zipCode: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCountryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, country: value }))
  }

  const handlePayPalCheckout = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.country || !formData.address) {
      alert("Please fill in all required fields.")
      return
    }

    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    alert(`Redirecting to PayPal to complete your purchase of ${plan?.name} for $${plan?.price}/month...`)
    setIsLoading(false)
    onOpenChange(false)
    setStep(1)
  }

  const handleClose = (open: boolean) => {
    if (!open) {
      setStep(1)
    }
    onOpenChange(open)
  }

  if (!plan) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/30">
          <DialogTitle className="text-xl font-bold text-foreground">Complete Your Order</DialogTitle>
          <div className="flex items-center gap-2 mt-2">
            <div className={`flex items-center gap-2 text-sm ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>1</div>
              <span className="hidden sm:inline">Review</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={`flex items-center gap-2 text-sm ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>2</div>
              <span className="hidden sm:inline">Details</span>
            </div>
            <div className="w-8 h-px bg-border" />
            <div className={`flex items-center gap-2 text-sm ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>3</div>
              <span className="hidden sm:inline">Payment</span>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                  <div className="text-right">
                    <span className="text-3xl font-bold text-primary">${plan.price}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 bg-background/80 rounded-lg p-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Cpu className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CPU</p>
                      <p className="font-semibold text-foreground">{plan.cpu}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background/80 rounded-lg p-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MemoryStick className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Memory</p>
                      <p className="font-semibold text-foreground">{plan.ram}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background/80 rounded-lg p-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HardDrive className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Storage</p>
                      <p className="font-semibold text-foreground">{plan.storage}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-background/80 rounded-lg p-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Gauge className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Bandwidth</p>
                      <p className="font-semibold text-foreground">{plan.bandwidth}</p>
                    </div>
                  </div>
                </div>

                {plan.zone && (
                  <div className="mt-4 pt-4 border-t border-primary/20 grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 bg-background/80 rounded-lg p-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Data Center</p>
                        <p className="font-semibold text-foreground">{plan.zone}</p>
                      </div>
                    </div>
                    {plan.storageType && (
                      <div className="flex items-center gap-3 bg-background/80 rounded-lg p-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <HardDrive className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Storage Type</p>
                          <p className="font-semibold text-foreground">{plan.storageType}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Included Features</h4>
                <div className="grid grid-cols-2 gap-2">
                  {["DDoS Protection", "24/7 Support", "99.99% Uptime SLA", "IPv4 Address", "Root Access", "Instant Deployment"].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Account Information
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-background"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-background"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="email" className="text-foreground">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-background"
                    required
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="company" className="text-foreground">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-background"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Billing Address
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="country" className="text-foreground">Country *</Label>
                    <Select value={formData.country} onValueChange={handleCountryChange}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-foreground">City *</Label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="New York"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-background"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-foreground">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="10001"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="bg-background"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-foreground">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      placeholder="123 Main Street, Apt 4B"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-background"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-xl p-6 border border-border">
                <h4 className="font-semibold text-foreground mb-4">Order Summary</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Plan</span>
                    <span className="font-medium text-foreground">{plan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Billing Cycle</span>
                    <span className="font-medium text-foreground">Monthly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Customer</span>
                    <span className="font-medium text-foreground">{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-foreground">{formData.email}</span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-primary">${plan.price}/month</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={handlePayPalCheckout}
                  disabled={isLoading}
                  className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white h-14 text-lg font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg
                        className="mr-3 h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.767.767 0 0 1 .757-.648h6.833c2.268 0 3.936.514 4.957 1.53.936.932 1.305 2.235 1.098 3.875-.027.218-.063.44-.108.67-.448 2.29-1.497 3.888-3.115 4.75-1.568.835-3.575.977-5.33.977H8.23a.766.766 0 0 0-.757.648l-.398 2.815z" />
                        <path d="M19.426 8.142c-.01.07-.023.14-.035.21-.638 3.273-2.817 4.398-5.607 4.398h-1.42a.688.688 0 0 0-.68.583l-.727 4.608-.206 1.306a.362.362 0 0 0 .357.42h2.504a.603.603 0 0 0 .596-.51l.025-.127.473-2.999.03-.163a.603.603 0 0 1 .596-.51h.376c2.432 0 4.336-.988 4.892-3.847.232-1.194.112-2.19-.502-2.892a2.404 2.404 0 0 0-.672-.477z" />
                      </svg>
                      Pay with PayPal
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By completing this purchase, you agree to our Terms of Service and Privacy Policy.
                  You will be redirected to PayPal to complete your payment securely.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-muted/30 flex justify-between">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 && (
            <Button onClick={() => setStep(step + 1)} className="bg-primary text-primary-foreground hover:bg-primary/90">
              Continue
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
