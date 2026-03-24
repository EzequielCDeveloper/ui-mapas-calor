import React from 'react'
import Link from 'next/link'
import { AlertTriangle, Clock } from 'lucide-react'
import type { Membership } from '@/types/api'
import { formatDate, daysUntil } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface ExpirationListProps {
  memberships: Membership[]
}

export function ExpirationList({ memberships }: ExpirationListProps) {
  if (memberships.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-12 h-12 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mb-3 text-success">
          <Clock size={20} />
        </div>
        <p className="text-sm font-medium text-white">Sin vencimientos próximos</p>
        <p className="text-xs text-text-muted mt-1">No hay membresías por vencer esta semana</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {memberships.map((m) => {
        const days = daysUntil(m.end_date)
        const isUrgent = days <= 2
        const isWarning = days <= 5

        return (
          <Link
            key={m.id}
            href={`/clients/${m.client_id}`}
            className="flex items-center justify-between p-3 rounded-lg bg-black-800 border border-border hover:border-gold-400/30 hover:bg-black-700 transition-all group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold',
                  isUrgent
                    ? 'bg-danger/20 text-danger border border-danger/30'
                    : isWarning
                    ? 'bg-warning/20 text-warning border border-warning/30'
                    : 'bg-black-600 text-text-muted border border-border'
                )}
              >
                {m.client?.first_name?.[0] ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-gold-400 transition-colors truncate">
                  {m.client?.first_name} {m.client?.last_name}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {m.plan?.name} · Vence {formatDate(m.end_date)}
                </p>
              </div>
            </div>
            <div
              className={cn(
                'flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0',
                isUrgent
                  ? 'bg-danger/15 text-danger border border-danger/30'
                  : isWarning
                  ? 'bg-warning/15 text-warning border border-warning/30'
                  : 'bg-black-600 text-text-muted border border-border'
              )}
            >
              {isUrgent && <AlertTriangle size={10} />}
              {days === 0 ? 'Hoy' : `${days}d`}
            </div>
          </Link>
        )
      })}
    </div>
  )
}
