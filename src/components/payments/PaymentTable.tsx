import React from 'react'
import Link from 'next/link'
import { Download } from 'lucide-react'
import { Table, TableHead, Th, TableBody, Tr, Td } from '@/components/ui/Table'
import { PaymentMethodBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Payment } from '@/types/api'
import { formatCurrency, formatDateTime } from '@/lib/utils'

interface PaymentTableProps {
  payments: Payment[]
  showClient?: boolean
  onDownloadReceipt?: (payment: Payment) => void
  isDownloading?: boolean
}

export function PaymentTable({
  payments,
  showClient = true,
  onDownloadReceipt,
  isDownloading = false,
}: PaymentTableProps) {
  if (payments.length === 0) {
    return (
      <EmptyState
        title="Sin pagos"
        description="No se han registrado pagos."
      />
    )
  }

  return (
    <Table>
      <TableHead>
        {showClient && <Th>Cliente</Th>}
        <Th>Membresía</Th>
        <Th>Monto</Th>
        <Th>Método</Th>
        <Th>Fecha</Th>
        <Th>Referencia</Th>
        {onDownloadReceipt && <Th className="text-right">Recibo</Th>}
      </TableHead>
      <TableBody>
        {payments.map((payment) => (
          <Tr key={payment.id}>
            {showClient && (
              <Td>
                {payment.client ? (
                  <Link
                    href={`/clients/${payment.client_id}`}
                    className="text-white hover:text-gold-400 font-medium text-sm transition-colors"
                  >
                    {payment.client.first_name} {payment.client.last_name}
                  </Link>
                ) : (
                  <span className="text-text-muted text-sm">—</span>
                )}
              </Td>
            )}
            <Td>
              <span className="text-text-secondary text-sm">
                {payment.membership?.plan?.name ?? '—'}
              </span>
            </Td>
            <Td>
              <span className="text-white font-semibold text-sm tabular-nums">
                {formatCurrency(payment.amount)}
              </span>
            </Td>
            <Td>
              <PaymentMethodBadge method={payment.payment_method} />
            </Td>
            <Td>
              <span className="text-text-secondary text-sm">{formatDateTime(payment.paid_at)}</span>
            </Td>
            <Td>
              <span className="text-text-muted text-sm">{payment.reference || '—'}</span>
            </Td>
            {onDownloadReceipt && (
              <Td className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Download size={14} />}
                  onClick={() => onDownloadReceipt(payment)}
                  disabled={isDownloading}
                >
                  PDF
                </Button>
              </Td>
            )}
          </Tr>
        ))}
      </TableBody>
    </Table>
  )
}
