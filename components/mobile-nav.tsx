'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Syringe, Calendar, BarChart3, Settings } from 'lucide-react'

const navItems = [
  { href: '/dashboard', icon: Syringe, label: 'Log' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/stats', icon: BarChart3, label: 'Stats' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="w-6 h-6" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
