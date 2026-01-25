"use client"

import Link from "next/link"
import { AnimatedLogo } from "@/components/animated-logo"
import { Mail, Phone, MapPin, Twitter, Linkedin, Github, Youtube } from "lucide-react"

const footerLinks = {
  products: [
    { label: "VPS Servers", href: "/login" },
    { label: "Cloud Servers", href: "/login" },
    { label: "Dedicated Servers", href: "/login" },
    { label: "Storage Solutions", href: "/login" },
    { label: "GPU Servers", href: "/login" },
    { label: "Managed Hosting", href: "/login" },
  ],
  company: [
    { label: "About Us", href: "/login" },
    { label: "Careers", href: "/login" },
    { label: "Blog", href: "/login" },
    { label: "Press & Media", href: "/login" },
    { label: "Partners", href: "/login" },
    { label: "Affiliate Program", href: "/login" },
  ],
  support: [
    { label: "Help Center", href: "/login" },
    { label: "Documentation", href: "/login" },
    { label: "API Reference", href: "/login" },
    { label: "System Status", href: "/login" },
    { label: "Contact Support", href: "/login" },
    { label: "Community Forum", href: "/login" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/login" },
    { label: "Terms of Service", href: "/login" },
    { label: "Service Level Agreement", href: "/login" },
    { label: "GDPR Compliance", href: "/login" },
    { label: "Cookie Policy", href: "/login" },
    { label: "Acceptable Use", href: "/login" },
  ],
}

const socialLinks = [
  { icon: Twitter, href: "/login", label: "Twitter" },
  { icon: Linkedin, href: "/login", label: "LinkedIn" },
  { icon: Github, href: "/login", label: "GitHub" },
  { icon: Youtube, href: "/login", label: "YouTube" },
]

export function Footer() {
  return (
    <footer className="bg-foreground text-background relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 relative">
        {/* Top section with logo and newsletter */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-8 pb-12 border-b border-background/10">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-3 mb-4 group">
              <AnimatedLogo size="large" />
              <span className="text-2xl font-bold group-hover:text-primary transition-colors">HostPrime</span>
            </Link>
            <p className="text-background/70 mb-6">
              Enterprise-grade VPS hosting with maximum performance, reliability, and 24/7 expert support. Trusted by thousands of businesses worldwide.
            </p>
            
            {/* Social links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-background/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="flex flex-col sm:flex-row gap-8 lg:gap-12">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-background/50 mb-1">Email Us</p>
                <Link href="/login" className="text-background hover:text-primary transition-colors font-medium">
                  support@hostprime.com
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-background/50 mb-1">Call Us</p>
                <Link href="/login" className="text-background hover:text-primary transition-colors font-medium">
                  +1 (888) 555-0199
                </Link>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/20 text-primary">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-background/50 mb-1">Headquarters</p>
                <Link href="/login" className="text-background hover:text-primary transition-colors font-medium">
                  San Francisco, CA
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12">
          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary"></span>
              Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary"></span>
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary"></span>
              Support
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-lg flex items-center gap-2">
              <span className="w-8 h-0.5 bg-primary"></span>
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-primary hover:translate-x-1 transition-all duration-300 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-8 border-t border-background/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-background/60">
              <p>&copy; 2026 HostPrime. All rights reserved.</p>
              <span className="hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span>All systems operational</span>
              </div>
            </div>
            
            {/* Payment methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-background/60">Payment Methods:</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center h-8 px-3 rounded bg-background/10 text-xs font-medium">
                  VISA
                </div>
                <div className="flex items-center justify-center h-8 px-3 rounded bg-background/10 text-xs font-medium">
                  Mastercard
                </div>
                <div className="flex items-center justify-center h-8 px-3 rounded bg-[#0070ba] text-xs font-medium">
                  PayPal
                </div>
                <div className="flex items-center justify-center h-8 px-3 rounded bg-background/10 text-xs font-medium">
                  Crypto
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
