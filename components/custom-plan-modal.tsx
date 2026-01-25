"use client"

import React from "react"
import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
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
import { Cpu, MemoryStick, HardDrive, Gauge, Globe, Server, Shield, Zap, CheckCircle2 } from "lucide-react"

interface CustomPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfigureComplete: (plan: CustomPlan) => void
}

export interface CustomPlan {
  name: string
  price: number
  cpu: string
  ram: string
  storage: string
  bandwidth: string
  zone: string
  storageType: string
  os: string
}

const datacenters = [
  { id: "us-east", name: "US East (Virginia)", flag: "us" },
  { id: "us-west", name: "US West (Oregon)", flag: "us" },
  { id: "eu-central", name: "EU Central (Frankfurt)", flag: "de" },
  { id: "eu-west", name: "EU West (London)", flag: "gb" },
  { id: "ap-southeast", name: "Asia Pacific (Singapore)", flag: "sg" },
  { id: "ap-northeast", name: "Asia Pacific (Tokyo)", flag: "jp" },
  { id: "sa-east", name: "South America (São Paulo)", flag: "br" },
  { id: "au-east", name: "Australia (Sydney)", flag: "au" },
]

const storageTypes = [
  { id: "nvme", name: "NVMe SSD", description: "Ultra-fast storage", multiplier: 1.0 },
  { id: "ssd", name: "Standard SSD", description: "Fast & reliable", multiplier: 0.8 },
  { id: "hdd", name: "HDD Storage", description: "Cost-effective", multiplier: 0.5 },
]

const operatingSystems = [
  { id: "ubuntu-22", name: "Ubuntu 22.04 LTS", category: "Linux" },
  { id: "ubuntu-24", name: "Ubuntu 24.04 LTS", category: "Linux" },
  { id: "debian-12", name: "Debian 12", category: "Linux" },
  { id: "centos-9", name: "CentOS Stream 9", category: "Linux" },
  { id: "rocky-9", name: "Rocky Linux 9", category: "Linux" },
  { id: "alma-9", name: "AlmaLinux 9", category: "Linux" },
  { id: "fedora-39", name: "Fedora 39", category: "Linux" },
  { id: "windows-2022", name: "Windows Server 2022", category: "Windows" },
  { id: "windows-2019", name: "Windows Server 2019", category: "Windows" },
]

const cpuOptions = [
  { cores: 1, price: 5 },
  { cores: 2, price: 10 },
  { cores: 4, price: 20 },
  { cores: 8, price: 40 },
  { cores: 12, price: 60 },
  { cores: 16, price: 80 },
  { cores: 24, price: 120 },
  { cores: 32, price: 160 },
  { cores: 48, price: 240 },
  { cores: 64, price: 320 },
]

const ramOptions = [
  { gb: 1, price: 3 },
  { gb: 2, price: 6 },
  { gb: 4, price: 12 },
  { gb: 8, price: 24 },
  { gb: 16, price: 48 },
  { gb: 32, price: 96 },
  { gb: 64, price: 192 },
  { gb: 128, price: 384 },
  { gb: 256, price: 768 },
]

const storageOptions = [
  { gb: 20, price: 2 },
  { gb: 40, price: 4 },
  { gb: 80, price: 8 },
  { gb: 160, price: 16 },
  { gb: 320, price: 32 },
  { gb: 640, price: 64 },
  { gb: 1000, price: 100 },
  { gb: 2000, price: 200 },
  { gb: 4000, price: 400 },
]

const bandwidthOptions = [
  { tb: 1, price: 0 },
  { tb: 2, price: 5 },
  { tb: 4, price: 10 },
  { tb: 8, price: 20 },
  { tb: 16, price: 40 },
  { tb: 32, price: 80 },
  { tb: 50, price: 100 },
  { tb: 100, price: 150 },
  { tb: -1, price: 200 }, // Unlimited
]

export function CustomPlanModal({ open, onOpenChange, onConfigureComplete }: CustomPlanModalProps) {
  const [cpuIndex, setCpuIndex] = useState(2) // 4 cores
  const [ramIndex, setRamIndex] = useState(3) // 8 GB
  const [storageIndex, setStorageIndex] = useState(3) // 160 GB
  const [bandwidthIndex, setBandwidthIndex] = useState(2) // 4 TB
  const [storageType, setStorageType] = useState("nvme")
  const [datacenter, setDatacenter] = useState("us-east")
  const [os, setOs] = useState("ubuntu-22")
  const [ipv4Count, setIpv4Count] = useState(1)
  const [backupEnabled, setBackupEnabled] = useState(false)
  const [ddosProtection, setDdosProtection] = useState("standard")

  const selectedCpu = cpuOptions[cpuIndex]
  const selectedRam = ramOptions[ramIndex]
  const selectedStorage = storageOptions[storageIndex]
  const selectedBandwidth = bandwidthOptions[bandwidthIndex]
  const selectedStorageType = storageTypes.find(s => s.id === storageType)!

  const totalPrice = useMemo(() => {
    let price = 0
    price += selectedCpu.price
    price += selectedRam.price
    price += selectedStorage.price * selectedStorageType.multiplier
    price += selectedBandwidth.price
    price += (ipv4Count - 1) * 3 // Additional IPs cost $3 each
    if (backupEnabled) price += Math.round(price * 0.2) // 20% for backups
    if (ddosProtection === "advanced") price += 10
    if (ddosProtection === "enterprise") price += 25
    return Math.round(price)
  }, [selectedCpu, selectedRam, selectedStorage, selectedBandwidth, selectedStorageType, ipv4Count, backupEnabled, ddosProtection])

  const handleContinue = () => {
    const plan: CustomPlan = {
      name: "Custom VPS",
      price: totalPrice,
      cpu: `${selectedCpu.cores} vCPU Cores`,
      ram: `${selectedRam.gb} GB RAM`,
      storage: `${selectedStorage.gb} GB ${selectedStorageType.name}`,
      bandwidth: selectedBandwidth.tb === -1 ? "Unlimited" : `${selectedBandwidth.tb} TB Transfer`,
      zone: datacenters.find(d => d.id === datacenter)?.name || "",
      storageType: selectedStorageType.name,
      os: operatingSystems.find(o => o.id === os)?.name || "",
    }
    onConfigureComplete(plan)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-muted/30">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Build Your Custom VPS
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Configure your perfect server with exactly the resources you need
          </p>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Configuration Panel */}
            <div className="lg:col-span-2 p-6 space-y-8 border-r border-border">
              {/* CPU */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    CPU Cores
                  </Label>
                  <span className="text-lg font-bold text-primary">{selectedCpu.cores} vCPU</span>
                </div>
                <Slider
                  value={[cpuIndex]}
                  onValueChange={(value) => setCpuIndex(value[0])}
                  max={cpuOptions.length - 1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 Core</span>
                  <span>64 Cores</span>
                </div>
              </div>

              {/* RAM */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <MemoryStick className="h-5 w-5 text-primary" />
                    Memory (RAM)
                  </Label>
                  <span className="text-lg font-bold text-primary">{selectedRam.gb} GB</span>
                </div>
                <Slider
                  value={[ramIndex]}
                  onValueChange={(value) => setRamIndex(value[0])}
                  max={ramOptions.length - 1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 GB</span>
                  <span>256 GB</span>
                </div>
              </div>

              {/* Storage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <HardDrive className="h-5 w-5 text-primary" />
                    Storage
                  </Label>
                  <span className="text-lg font-bold text-primary">{selectedStorage.gb >= 1000 ? `${selectedStorage.gb / 1000} TB` : `${selectedStorage.gb} GB`}</span>
                </div>
                <Slider
                  value={[storageIndex]}
                  onValueChange={(value) => setStorageIndex(value[0])}
                  max={storageOptions.length - 1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>20 GB</span>
                  <span>4 TB</span>
                </div>
              </div>

              {/* Storage Type */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Storage Type
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {storageTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setStorageType(type.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        storageType === type.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      <p className="font-semibold text-foreground text-sm">{type.name}</p>
                      <p className="text-xs text-muted-foreground">{type.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bandwidth */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    Bandwidth
                  </Label>
                  <span className="text-lg font-bold text-primary">
                    {selectedBandwidth.tb === -1 ? "Unlimited" : `${selectedBandwidth.tb} TB`}
                  </span>
                </div>
                <Slider
                  value={[bandwidthIndex]}
                  onValueChange={(value) => setBandwidthIndex(value[0])}
                  max={bandwidthOptions.length - 1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 TB</span>
                  <span>Unlimited</span>
                </div>
              </div>

              {/* Datacenter */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Data Center Location
                </Label>
                <Select value={datacenter} onValueChange={setDatacenter}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select a datacenter" />
                  </SelectTrigger>
                  <SelectContent>
                    {datacenters.map((dc) => (
                      <SelectItem key={dc.id} value={dc.id}>
                        {dc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Operating System */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Server className="h-5 w-5 text-primary" />
                  Operating System
                </Label>
                <Select value={os} onValueChange={setOs}>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select an operating system" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header-linux" disabled className="font-semibold text-muted-foreground">
                      Linux
                    </SelectItem>
                    {operatingSystems.filter(o => o.category === "Linux").map((osItem) => (
                      <SelectItem key={osItem.id} value={osItem.id}>
                        {osItem.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="header-windows" disabled className="font-semibold text-muted-foreground mt-2">
                      Windows
                    </SelectItem>
                    {operatingSystems.filter(o => o.category === "Windows").map((osItem) => (
                      <SelectItem key={osItem.id} value={osItem.id}>
                        {osItem.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* IPv4 Addresses */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-base font-semibold">IPv4 Addresses</Label>
                  <span className="text-lg font-bold text-primary">{ipv4Count} IP{ipv4Count > 1 ? 's' : ''}</span>
                </div>
                <Slider
                  value={[ipv4Count]}
                  onValueChange={(value) => setIpv4Count(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">First IP included, additional IPs $3/month each</p>
              </div>

              {/* DDoS Protection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  DDoS Protection
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "standard", name: "Standard", desc: "Included", price: 0 },
                    { id: "advanced", name: "Advanced", desc: "+$10/mo", price: 10 },
                    { id: "enterprise", name: "Enterprise", desc: "+$25/mo", price: 25 },
                  ].map((option) => (
                    <button
                      key={option.id}
                      onClick={() => setDdosProtection(option.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        ddosProtection === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      <p className="font-semibold text-foreground text-sm">{option.name}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Backups */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Automatic Backups</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: false, name: "No Backups", desc: "Manual only" },
                    { id: true, name: "Daily Backups", desc: "+20% of plan" },
                  ].map((option) => (
                    <button
                      key={String(option.id)}
                      onClick={() => setBackupEnabled(option.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        backupEnabled === option.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50 bg-background"
                      }`}
                    >
                      <p className="font-semibold text-foreground text-sm">{option.name}</p>
                      <p className="text-xs text-muted-foreground">{option.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Panel */}
            <div className="bg-muted/30 p-6 lg:sticky lg:top-0">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">Configuration Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Cpu className="h-4 w-4" /> CPU
                      </span>
                      <span className="font-medium text-foreground">{selectedCpu.cores} vCPU</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <MemoryStick className="h-4 w-4" /> Memory
                      </span>
                      <span className="font-medium text-foreground">{selectedRam.gb} GB</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <HardDrive className="h-4 w-4" /> Storage
                      </span>
                      <span className="font-medium text-foreground">{selectedStorage.gb >= 1000 ? `${selectedStorage.gb / 1000} TB` : `${selectedStorage.gb} GB`} {selectedStorageType.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Gauge className="h-4 w-4" /> Bandwidth
                      </span>
                      <span className="font-medium text-foreground">
                        {selectedBandwidth.tb === -1 ? "Unlimited" : `${selectedBandwidth.tb} TB`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Location
                      </span>
                      <span className="font-medium text-foreground text-right text-xs">
                        {datacenters.find(d => d.id === datacenter)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Server className="h-4 w-4" /> OS
                      </span>
                      <span className="font-medium text-foreground text-right text-xs">
                        {operatingSystems.find(o => o.id === os)?.name}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground text-sm">Included Features</h4>
                  <div className="space-y-1">
                    {[
                      "Root/Admin Access",
                      "99.99% Uptime SLA",
                      "24/7 Support",
                      `${ipv4Count} IPv4 Address${ipv4Count > 1 ? 'es' : ''}`,
                      `${ddosProtection.charAt(0).toUpperCase() + ddosProtection.slice(1)} DDoS Protection`,
                      backupEnabled ? "Daily Backups" : "Manual Backups"
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
                  <p className="text-sm text-muted-foreground mb-1">Estimated Monthly Cost</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-primary">${totalPrice}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Billed monthly. Cancel anytime.</p>
                </div>

                <Button 
                  onClick={handleContinue}
                  className="w-full h-12 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Continue to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
