import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTA() {
  return (
    <section className="py-20 md:py-32 bg-card">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground text-balance">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Deploy your VPS in minutes with our intuitive control panel. No long-term contracts, cancel anytime.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 h-12 text-base border-border text-foreground hover:bg-muted bg-transparent">
              Contact Sales
            </Button>
          </div>

          <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <span>Instant deployment</span>
            <span className="hidden sm:inline">•</span>
            <span>24/7 Support</span>
            <span className="hidden sm:inline">•</span>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  )
}
