"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Full background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://cdn.hetzner.com/assets/Uploads/gex131-web_big.webp')"
        }}
      />
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySC0yNHYtMmgxMnoiLz48L2c+PC9nPjwvc3ZnPg==')]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-4 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium">
              Dedicated Servers
            </span>
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-sm font-medium border border-white/20">
              GPU Servers
            </span>
          </div>
          
          {/* Main headline */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white tracking-tight leading-tight text-balance">
            Powerful ideas deserve
            <br />
            <span className="text-primary">powerful servers</span>
          </h1>
          
          {/* Subheadline */}
          <div className="mt-8 space-y-2">
            <p className="text-xl md:text-2xl text-white/90 font-medium">
              The new GEX131: AI infrastructure for digital sovereignty.
            </p>
            <p className="text-lg text-white/70">
              Affordable, reliable, GDPR-compliant.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-start gap-4">
            <Link href="#pricing">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-14 text-lg font-semibold shadow-lg shadow-primary/25">
                Configure Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="px-8 h-14 text-lg border-white/30 text-white hover:bg-white/10 bg-transparent backdrop-blur-sm">
                Client Login
              </Button>
            </Link>
          </div>
          
          
        </div>
      </div>
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}
