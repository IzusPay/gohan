'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Server, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions'

export default function DashboardNav({ email }: { email: string }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')
  
  const clientNavItems = [
    { name: 'Services', href: '/dashboard' },
    { name: 'Storage', href: '/dashboard/storage' }, // Keeping for now, though might be instance specific
    { name: 'Billing', href: '/dashboard/billing' },
    { name: 'Account', href: '/dashboard/account' },
  ]

  const adminNavItems = [
    { name: 'Overview', href: '/admin' },
    // Add more admin specific links if needed, e.g. Settings, Logs
  ]

  const navItems = isAdmin ? adminNavItems : clientNavItems

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Server className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">HostPrime</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {email}
            </span>
            <form action={logout}>
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
                <span className="sr-only sm:not-sr-only">Sign Out</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}
