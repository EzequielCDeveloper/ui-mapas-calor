'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { MembershipTable } from '@/components/memberships/MembershipTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Pagination } from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/EmptyState'
import { Select } from '@/components/ui/Select'
import { useMemberships } from '@/hooks/useMemberships'
import type { MembershipStatus } from '@/types/api'
import { CalendarCheck } from 'lucide-react'

const LIMIT = 20

export default function MembershipsPage() {
  const { memberships, isLoading, error, fetchMemberships } = useMemberships()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>('')

  const loadMemberships = useCallback(() => {
    fetchMemberships({
      page,
      limit: LIMIT,
      status: (statusFilter as MembershipStatus) || undefined,
    })
  }, [page, statusFilter, fetchMemberships])

  useEffect(() => {
    loadMemberships()
  }, [loadMemberships])

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Membresías</h2>
          <p className="text-text-muted text-sm mt-0.5">
            {memberships ? `${memberships.total} registros` : 'Gestión de membresías'}
          </p>
        </div>
        <Link href="/memberships/new">
          <Button leftIcon={<Plus size={16} />}>
            Asignar Membresía
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Lista de Membresías"
          icon={<CalendarCheck size={18} />}
          action={
            <Select
              options={[
                { value: '', label: 'Todos los estados' },
                { value: 'active', label: 'Activos' },
                { value: 'expired', label: 'Vencidos' },
                { value: 'cancelled', label: 'Cancelados' },
              ]}
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-44 h-9 text-xs"
            />
          }
        />

        {isLoading ? (
          <TableSkeleton rows={8} cols={7} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadMemberships} />
        ) : (
          <>
            <MembershipTable memberships={memberships?.items ?? []} />
            {memberships && (
              <Pagination
                page={page}
                totalPages={memberships.total_pages}
                total={memberships.total}
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
