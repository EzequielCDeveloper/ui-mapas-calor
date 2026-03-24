'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  CalendarCheck,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { getInitials, formatRole } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['admin', 'staff', 'billing'],
  },
  {
    label: 'Clientes',
    href: '/clients',
    icon: Users,
    roles: ['admin', 'staff', 'billing'],
  },
  {
    label: 'Membresías',
    href: '/memberships',
    icon: CalendarCheck,
    roles: ['admin', 'staff'],
  },
  {
    label: 'Pagos',
    href: '/payments',
    icon: CreditCard,
    roles: ['admin', 'billing'],
  },
  {
    label: 'Reportes',
    href: '/reports',
    icon: BarChart3,
    roles: ['admin', 'staff'],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [collapsed, setCollapsed] = useState(false)

  const visibleItems = navItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  )

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <aside
      className={cn(
        'relative flex flex-col h-screen bg-black-800 border-r border-border transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center border-b border-border flex-shrink-0',
        collapsed ? 'justify-center px-3 py-4' : 'px-5 py-4 gap-3'
      )}>
        <div className="w-9 h-9 rounded-lg bg-gold-gradient flex items-center justify-center flex-shrink-0 shadow-gold">
          <Dumbbell size={18} className="text-black-900" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-white font-bold text-base tracking-wider">CHAPITOS</h1>
            <p className="text-gold-400 text-[10px] uppercase tracking-[0.2em] font-medium">Gym Management</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.label : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                collapsed ? 'justify-center' : '',
                active
                  ? 'bg-gold-400/15 text-gold-400 border border-gold-400/20 shadow-gold'
                  : 'text-text-muted hover:text-white hover:bg-black-700 border border-transparent'
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {!collapsed && active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="border-t border-border p-3 flex-shrink-0">
        {user && (
          <div className={cn('flex items-center gap-3 mb-3', collapsed && 'justify-center')}>
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-black-900">
                {getInitials(user.name)}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-text-muted">{formatRole(user.role)}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => logout()}
          title={collapsed ? 'Cerrar sesión' : undefined}
          className={cn(
            'flex items-center gap-2 w-full rounded-lg px-3 py-2 text-sm',
            'text-text-muted hover:text-danger hover:bg-danger/10 transition-colors',
            collapsed ? 'justify-center' : ''
          )}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-black-700 border border-border text-text-muted hover:text-gold-400 hover:border-gold-400 transition-colors flex items-center justify-center z-10"
        aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
