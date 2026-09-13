'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Server, LogOut, HardDrive, CreditCard, User, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions'

export default function DashboardNav({ email }: { email: string }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  const clientNavItems = [
    { name: 'Services', href: '/dashboard', icon: Server },
    { name: 'Storage', href: '/dashboard/storage', icon: HardDrive },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Account', href: '/dashboard/account', icon: User },
  ]

  const adminNavItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  ]

  const navItems = isAdmin ? adminNavItems : clientNavItems

  const isActive = (href: string) =>
    pathname === href ||
    (href !== '/dashboard' && href !== '/admin' && pathname.startsWith(href))

  return (
    <aside className="w-full md:w-64 md:shrink-0 md:h-screen md:sticky md:top-0 bg-sidebar border-b md:border-b-0 md:border-r border-sidebar-border flex md:flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 md:h-auto md:px-5 md:py-6 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
            <Server className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-sidebar-foreground">HostPrime</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex md:flex-col items-center md:items-stretch gap-1 px-2 md:px-3 flex-1 overflow-x-auto md:overflow-x-visible">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                active
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-sidebar-primary' : ''}`} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* User / Sign out */}
      <div className="flex items-center gap-2 px-4 md:px-3 md:py-4 md:border-t border-sidebar-border shrink-0 md:flex-col md:items-stretch">
        <span className="text-xs text-muted-foreground truncate hidden sm:block md:px-3 md:pb-2">
          {email}
        </span>
        <form action={logout}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 w-full justify-start text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Sign Out</span>
          </Button>
        </form>
      </div>
    </aside>
  )
}
