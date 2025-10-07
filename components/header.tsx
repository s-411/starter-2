'use client'

import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  showNotifications?: boolean
}

export function Header({ title, showNotifications = true }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <h1 className="text-xl font-heading">{title}</h1>

        <div className="flex items-center gap-2">
          {showNotifications && (
            <button className="p-2 hover:bg-accent rounded-input transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
