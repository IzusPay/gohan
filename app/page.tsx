import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Products } from "@/components/products"
import { Stats } from "@/components/stats"
import { Pricing } from "@/components/pricing"
import { Features } from "@/components/features"
import { CTA } from "@/components/cta"
import { Footer } from "@/components/footer"

export default function HostPrimePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Products />
        <Stats />
        <Pricing />
        <Features />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
