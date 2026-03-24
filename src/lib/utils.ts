import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow, parseISO, differenceInDays } from 'date-fns'
import { es } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '—'
  try {
    const date = parseISO(dateStr)
    return format(date, 'dd/MM/yyyy')
  } catch {
    return '—'
  }
}

export function formatDateTime(dateStr: string | undefined | null): string {
  if (!dateStr) return '—'
  try {
    const date = parseISO(dateStr)
    return format(date, 'dd/MM/yyyy HH:mm')
  } catch {
    return '—'
  }
}

export function formatRelative(dateStr: string | undefined | null): string {
  if (!dateStr) return '—'
  try {
    const date = parseISO(dateStr)
    return formatDistanceToNow(date, { addSuffix: true, locale: es })
  } catch {
    return '—'
  }
}

export function daysUntil(dateStr: string | undefined | null): number {
  if (!dateStr) return 0
  try {
    const date = parseISO(dateStr)
    return differenceInDays(date, new Date())
  } catch {
    return 0
  }
}

export function formatPaymentMethod(method: string): string {
  const map: Record<string, string> = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    bank_transfer: 'Transferencia',
  }
  return map[method] ?? method
}

export function formatPriceType(type: string): string {
  const map: Record<string, string> = {
    standard: 'Estándar',
    student: 'Estudiante',
  }
  return map[type] ?? type
}

export function formatMembershipStatus(status: string): string {
  const map: Record<string, string> = {
    active: 'Activo',
    expired: 'Vencido',
    cancelled: 'Cancelado',
  }
  return map[status] ?? status
}

export function formatRole(role: string): string {
  const map: Record<string, string> = {
    admin: 'Administrador',
    staff: 'Personal',
    billing: 'Facturación',
  }
  return map[role] ?? role
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const qs = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.set(key, String(value))
    }
  })
  const str = qs.toString()
  return str ? `?${str}` : ''
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function firstDayOfMonthISO(): string {
  const now = new Date()
  return format(new Date(now.getFullYear(), now.getMonth(), 1), 'yyyy-MM-dd')
}
