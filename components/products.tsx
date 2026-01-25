import { Server, Cloud, Database, HardDrive, Shield, Cpu } from "lucide-react"
import Link from "next/link"

const products = [
  {
    icon: Server,
    title: "VPS Servers",
    description: "High-performance virtual private servers with dedicated resources.",
    price: "From $30",
  },
  {
    icon: Cloud,
    title: "Cloud Servers",
    description: "Flexible cloud computing with instant scaling and pay-as-you-go.",
    price: "From $5",
  },
  {
    icon: Database,
    title: "Dedicated Servers",
    description: "Bare metal servers for maximum control and performance.",
    price: "From $99",
  },
  {
    icon: HardDrive,
    title: "Storage Solutions",
    description: "Reliable object storage and block storage for your data.",
    price: "From $0.01/GB",
  },
  {
    icon: Shield,
    title: "Managed Services",
    description: "Let our experts handle your server management and security.",
    price: "From $50",
  },
  {
    icon: Cpu,
    title: "GPU Servers",
    description: "Powerful GPU computing for AI, ML, and rendering workloads.",
    price: "From $199",
  },
]

export function Products() {
  return (
    <section id="products" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
            Product Overview
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            A complete range of hosting solutions for every need. From development to enterprise-scale deployments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link 
              href="#pricing" 
              key={product.title}
              className="group flex items-start gap-4 p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-md"
            >
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                <product.icon className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {product.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                <span className="text-sm font-semibold text-primary">{product.price}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
