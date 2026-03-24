'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { PaymentTable } from '@/components/payments/PaymentTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/EmptyState'
import { Input } from '@/components/ui/Input'
import { usePayments, useDownloadReceipt } from '@/hooks/usePayments'
import type { Payment } from '@/types/api'
import { CreditCard, Calendar } from 'lucide-react'
import { firstDayOfMonthISO, todayISO } from '@/lib/utils'

const LIMIT = 20

export default function PaymentsPage() {
  const { payments, isLoading, error, fetchPayments } = usePayments()
  const { download, isLoading: isDownloading } = useDownloadReceipt()
  const [page, setPage] = useState(1)
  const [fromDate, setFromDate] = useState(firstDayOfMonthISO())
  const [toDate, setToDate] = useState(todayISO())

  const loadPayments = useCallback(() => {
    fetchPayments({
      page,
      limit: LIMIT,
      from: fromDate || undefined,
      to: toDate || undefined,
    })
  }, [page, fromDate, toDate, fetchPayments])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Pagos</h2>
          <p className="text-text-muted text-sm mt-0.5">
            {payments ? `${payments.total} registros` : 'Historial de pagos'}
          </p>
        </div>
        <Link href="/payments/new">
          <Button leftIcon={<Plus size={16} />}>
            Registrar Pago
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Historial de Pagos"
          icon={<CreditCard size={18} />}
          action={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Calendar size={13} />
              </div>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => { setFromDate(e.target.value); setPage(1) }}
                className="h-9 w-36 text-xs"
              />
              <span className="text-text-muted text-xs">—</span>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => { setToDate(e.target.value); setPage(1) }}
                className="h-9 w-36 text-xs"
              />
            </div>
          }
        />

        {isLoading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadPayments} />
        ) : (
          <>
            <PaymentTable
              payments={payments?.items ?? []}
              onDownloadReceipt={(p: Payment) =>
                download(p.id, `recibo-${p.id.slice(0, 8)}.pdf`)
              }
              isDownloading={isDownloading}
            />
            {payments && (
              <Pagination
                page={page}
                totalPages={payments.total_pages}
                total={payments.total}
                limit={LIMIT}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </Card>
    </div>
  )
}
