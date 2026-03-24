import React from 'react'
import Link from 'next/link'
import { Table, TableHead, Th, TableBody, Tr, Td } from '@/components/ui/Table'
import { MembershipStatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Membership } from '@/types/api'
import { formatDate, formatPriceType, daysUntil } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface MembershipTableProps {
  memberships: Membership[]
  showClient?: boolean
}

export function MembershipTable({ memberships, showClient = true }: MembershipTableProps) {
  if (memberships.length === 0) {
    return (
      <EmptyState
        title="Sin membresías"
        description="No se encontraron membresías."
      />
    )
  }

  return (
    <Table>
      <TableHead>
        {showClient && <Th>Cliente</Th>}
        <Th>Plan</Th>
        <Th>Tipo</Th>
        <Th>Inicio</Th>
        <Th>Vencimiento</Th>
        <Th>Estado</Th>
        <Th>Días restantes</Th>
      </TableHead>
      <TableBody>
        {memberships.map((m) => {
          const days = m.status === 'active' ? daysUntil(m.end_date) : 0
          const isUrgent = m.status === 'active' && days <= 2
          const isWarning = m.status === 'active' && days <= 7

          return (
            <Tr key={m.id}>
              {showClient && (
                <Td>
                  {m.client ? (
                    <Link
                      href={`/clients/${m.client_id}`}
                      className="text-white hover:text-gold-400 font-medium text-sm transition-colors"
                    >
                      {m.client.first_name} {m.client.last_name}
                    </Link>
                  ) : (
                    <span className="text-text-muted text-sm">—</span>
                  )}
                </Td>
              )}
              <Td>
                <span className="text-white text-sm font-medium">
                  {m.plan?.name ?? '—'}
                </span>
              </Td>
              <Td>
                <span className="text-text-secondary text-sm">
                  {formatPriceType(m.price_type)}
                </span>
              </Td>
              <Td>
                <span className="text-text-secondary text-sm">{formatDate(m.start_date)}</span>
              </Td>
              <Td>
                <span className="text-text-secondary text-sm">{formatDate(m.end_date)}</span>
              </Td>
              <Td>
                <MembershipStatusBadge status={m.status} />
              </Td>
              <Td>
                {m.status === 'active' ? (
                  <span
                    className={cn(
                      'text-sm font-semibold tabular-nums',
                      isUrgent ? 'text-danger' : isWarning ? 'text-warning' : 'text-success'
                    )}
                  >
                    {days}d
                  </span>
                ) : (
                  <span className="text-text-muted text-sm">—</span>
                )}
              </Td>
            </Tr>
          )
        })}
      </TableBody>
    </Table>
  )
}
