"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Check, Cpu, HardDrive, MemoryStick, Gauge, Star, Settings2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { CheckoutModal } from "@/components/checkout-modal"
import { CustomPlanModal, type CustomPlan } from "@/components/custom-plan-modal"

const plans = [
  {
    name: "Starter VPS",
    price: 30,
    description: "Perfect for small projects and development",
    cpu: "2 vCPU Cores",
    ram: "4 GB RAM",
    storage: "80 GB NVMe",
    bandwidth: "4 TB Transfer",
    features: ["1 IPv4 Address", "DDoS Protection", "24/7 Support"],
    popular: false,
  },
  {
    name: "Business VPS",
    price: 75,
    description: "Ideal for growing businesses and apps",
    cpu: "4 vCPU Cores",
    ram: "8 GB RAM",
    storage: "200 GB NVMe",
    bandwidth: "8 TB Transfer",
    features: ["1 IPv4 Address", "DDoS Protection", "Priority Support", "Daily Backups"],
    popular: true,
  },
  {
    name: "Professional VPS",
    price: 150,
    description: "For high-traffic websites and databases",
    cpu: "8 vCPU Cores",
    ram: "16 GB RAM",
    storage: "400 GB NVMe",
    bandwidth: "16 TB Transfer",
    features: ["2 IPv4 Addresses", "DDoS Protection", "Priority Support", "Daily Backups", "Managed Services"],
    popular: false,
  },
  {
    name: "Enterprise VPS",
    price: 300,
    description: "Maximum power for demanding workloads",
    cpu: "16 vCPU Cores",
    ram: "32 GB RAM",
    storage: "800 GB NVMe",
    bandwidth: "32 TB Transfer",
    features: ["4 IPv4 Addresses", "DDoS Protection", "Dedicated Support", "Hourly Backups", "Managed Services", "SLA Guarantee"],
    popular: false,
  },
  {
    name: "Performance VPS",
    price: 500,
    description: "High-performance computing and AI workloads",
    cpu: "24 vCPU Cores",
    ram: "64 GB RAM",
    storage: "1.2 TB NVMe",
    bandwidth: "50 TB Transfer",
    features: ["6 IPv4 Addresses", "Advanced DDoS", "Dedicated Manager", "Real-time Backups", "Full Management", "Custom SLA"],
    popular: false,
  },
  {
    name: "Ultimate VPS",
    price: 900,
    description: "Enterprise-grade infrastructure at scale",
    cpu: "48 vCPU Cores",
    ram: "128 GB RAM",
    storage: "2.4 TB NVMe",
    bandwidth: "Unlimited",
    features: ["10 IPv4 Addresses", "Enterprise DDoS", "24/7 Dedicated Team", "Continuous Backups", "White-Glove Support", "Custom Solutions"],
    popular: false,
  },
]

type Plan = {
  name: string
  price: number
  description?: string
  cpu: string
  ram: string
  storage: string
  bandwidth: string
  features?: string[]
  popular?: boolean
  zone?: string
  storageType?: string
  os?: string
}

export function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [customPlanOpen, setCustomPlanOpen] = useState(false)

  const handleSelectPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setCheckoutOpen(true)
  }

  const handleCustomPlanComplete = (customPlan: CustomPlan) => {
    setSelectedPlan(customPlan)
    setCheckoutOpen(true)
  }

  return (
    <section id="pricing" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
            VPS Plans for Every Scale
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            From development to enterprise. Choose the perfect VPS plan for your needs with transparent pricing and no hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={cn(
                "relative flex flex-col bg-card border-border transition-all hover:shadow-lg",
                plan.popular && "border-primary shadow-lg ring-2 ring-primary/20"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground text-xs font-semibold rounded-full">
                    <Star className="h-3 w-3 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="pb-4">
                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Cpu className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{plan.cpu}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MemoryStick className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{plan.ram}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <HardDrive className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{plan.storage}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Gauge className="h-4 w-4 text-primary" />
                    <span className="text-foreground">{plan.bandwidth}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleSelectPlan(plan)}
                  className={cn(
                    "w-full",
                    plan.popular 
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Custom Plan Card */}
        <div className="mt-8">
          <Card className="bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20 border-2 border-dashed">
            <CardContent className="py-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Settings2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Build Your Custom VPS</h3>
                    <p className="text-muted-foreground mt-1">
                      Need specific resources? Configure your own server with exactly what you need.
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => setCustomPlanOpen(true)}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                  <Settings2 className="h-5 w-5 mr-2" />
                  Configure Now
                </Button>
              </div>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Up to 64 vCPU</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Up to 256 GB RAM</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>Up to 4 TB Storage</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" />
                  <span>8 Datacenters</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Need help choosing?{" "}
            <a href="#" className="text-primary hover:underline font-medium">
              Contact our sales team
            </a>{" "}
            for personalized recommendations.
          </p>
        </div>
      </div>

      <CheckoutModal
        plan={selectedPlan}
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />

      <CustomPlanModal
        open={customPlanOpen}
        onOpenChange={setCustomPlanOpen}
        onConfigureComplete={handleCustomPlanComplete}
      />
    </section>
  )
}
