'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { Bell } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clientes',
  '/clients/new': 'Nuevo Cliente',
  '/memberships': 'Membresías',
  '/memberships/new': 'Asignar Membresía',
  '/payments': 'Pagos',
  '/payments/new': 'Registrar Pago',
  '/reports': 'Reportes',
}

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname]
  if (pathname.includes('/edit')) return 'Editar Cliente'
  if (pathname.match(/\/clients\/[^/]+$/)) return 'Detalle Cliente'
  return 'Chapitos'
}

export function Header() {
  const pathname = usePathname()
  const title = getTitle(pathname)

  return (
    <header className="h-14 border-b border-border bg-black-800/50 backdrop-blur-sm flex items-center justify-between px-6 flex-shrink-0">
      <div>
        <h1 className="text-base font-semibold text-white">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <button className="w-9 h-9 rounded-lg text-text-muted hover:text-white hover:bg-black-700 transition-colors flex items-center justify-center relative">
          <Bell size={16} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gold-400" />
        </button>
      </div>
    </header>
  )
}
