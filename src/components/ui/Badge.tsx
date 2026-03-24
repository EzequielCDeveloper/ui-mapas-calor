import React from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'success' | 'warning' | 'danger' | 'gold' | 'muted' | 'info'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, string> = {
  success: 'bg-success/15 text-success border border-success/30',
  warning: 'bg-warning/15 text-warning border border-warning/30',
  danger: 'bg-danger/15 text-danger border border-danger/30',
  gold: 'bg-gold-400/15 text-gold-400 border border-gold-400/30',
  muted: 'bg-black-500 text-text-muted border border-border',
  info: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
}

const dotStyles: Record<BadgeVariant, string> = {
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  gold: 'bg-gold-400',
  muted: 'bg-text-muted',
  info: 'bg-blue-400',
}

export function Badge({ variant = 'muted', children, className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[variant])} />}
      {children}
    </span>
  )
}

export function MembershipStatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    active: { variant: 'success', label: 'Activo' },
    expired: { variant: 'danger', label: 'Vencido' },
    cancelled: { variant: 'muted', label: 'Cancelado' },
  }
  const config = map[status] ?? { variant: 'muted', label: status }
  return <Badge variant={config.variant} dot>{config.label}</Badge>
}

export function PaymentMethodBadge({ method }: { method: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    cash: { variant: 'success', label: 'Efectivo' },
    card: { variant: 'info', label: 'Tarjeta' },
    bank_transfer: { variant: 'gold', label: 'Transferencia' },
  }
  const config = map[method] ?? { variant: 'muted', label: method }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

export function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    admin: { variant: 'gold', label: 'Admin' },
    staff: { variant: 'info', label: 'Personal' },
    billing: { variant: 'success', label: 'Facturación' },
  }
  const config = map[role] ?? { variant: 'muted', label: role }
  return <Badge variant={config.variant}>{config.label}</Badge>
}
