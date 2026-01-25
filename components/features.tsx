import { 
  Server, 
  Shield, 
  Zap, 
  Clock, 
  Globe, 
  HeadphonesIcon,
  HardDrive,
  Network
} from "lucide-react"
import Image from "next/image"

const features = [
  {
    icon: Zap,
    title: "Lightning Fast NVMe",
    description: "Enterprise-grade NVMe SSD storage with up to 7GB/s read speeds for maximum performance.",
  },
  {
    icon: Shield,
    title: "Advanced DDoS Protection",
    description: "Multi-layer protection against DDoS attacks included free with every VPS plan.",
  },
  {
    icon: Clock,
    title: "99.99% Uptime SLA",
    description: "We guarantee near-perfect uptime backed by our service level agreement.",
  },
  {
    icon: Globe,
    title: "Global Data Centers",
    description: "Deploy your VPS in strategic locations across North America, Europe, and Asia.",
  },
  {
    icon: Server,
    title: "Dedicated Resources",
    description: "No shared resources. Your CPU, RAM, and storage are exclusively yours.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Expert Support",
    description: "Our technical team is available around the clock via live chat, phone, and tickets.",
  },
  {
    icon: HardDrive,
    title: "Automated Backups",
    description: "Daily automated backups with one-click restore to protect your data.",
  },
  {
    icon: Network,
    title: "High-Speed Network",
    description: "Up to 10 Gbps network connectivity with unlimited inbound bandwidth.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        {/* Data Center Showcase */}
        <div className="relative rounded-2xl overflow-hidden mb-20">
          <div className="relative h-[300px] md:h-[400px] w-full">
            <Image
              src="/images/servers.jpg"
              alt="HostPrime Enterprise Data Center"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-8">
                <div className="max-w-xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium mb-4">
                    Enterprise Infrastructure
                  </span>
                  <h3 className="text-3xl md:text-4xl font-bold text-background mb-4 text-balance">
                    State-of-the-Art Data Centers
                  </h3>
                  <p className="text-background/80 text-lg">
                    Our tier-4 data centers feature redundant power, cooling, and network connectivity. 
                    Experience enterprise-grade reliability for your mission-critical applications.
                  </p>
                  <div className="mt-6 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-background/90">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-sm">All Systems Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
            Enterprise Features, Affordable Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Every VPS comes packed with premium features designed for reliability, speed, and security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div 
              key={feature.title} 
              className="group p-6 rounded-xl bg-background border border-border hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
