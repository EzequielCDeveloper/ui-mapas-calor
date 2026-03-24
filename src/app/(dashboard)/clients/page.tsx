'use client'

import React, { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { Search, UserPlus, X } from 'lucide-react'
import { ClientTable } from '@/components/clients/ClientTable'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Pagination } from '@/components/ui/Pagination'
import { TableSkeleton } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/EmptyState'
import { ConfirmModal } from '@/components/ui/Modal'
import { Select } from '@/components/ui/Select'
import { useClients, useDeactivateClient } from '@/hooks/useClients'
import type { Client } from '@/types/api'
import { Users } from 'lucide-react'

const LIMIT = 20

export default function ClientsPage() {
  const { clients, isLoading, error, fetchClients } = useClients()
  const { deactivate, isLoading: isDeactivating } = useDeactivateClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [activeFilter, setActiveFilter] = useState<string>('')
  const [clientToDeactivate, setClientToDeactivate] = useState<Client | null>(null)

  const loadClients = useCallback(() => {
    fetchClients({
      page,
      limit: LIMIT,
      search: search || undefined,
      active: activeFilter === '' ? undefined : activeFilter === 'true',
    })
  }, [page, search, activeFilter, fetchClients])

  useEffect(() => {
    loadClients()
  }, [loadClients])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    loadClients()
  }

  const handleDeactivate = async () => {
    if (!clientToDeactivate) return
    const ok = await deactivate(clientToDeactivate.id)
    if (ok) {
      setClientToDeactivate(null)
      loadClients()
    }
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Clientes</h2>
          <p className="text-text-muted text-sm mt-0.5">
            {clients ? `${clients.total} registros` : 'Gestión de clientes'}
          </p>
        </div>
        <Link href="/clients/new">
          <Button leftIcon={<UserPlus size={16} />}>
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Lista de Clientes"
          icon={<Users size={18} />}
          action={
            <div className="flex items-center gap-3">
              {/* Status filter */}
              <Select
                options={[
                  { value: '', label: 'Todos' },
                  { value: 'true', label: 'Activos' },
                  { value: 'false', label: 'Inactivos' },
                ]}
                value={activeFilter}
                onChange={(e) => {
                  setActiveFilter(e.target.value)
                  setPage(1)
                }}
                className="w-32 h-9 text-xs"
              />
              {/* Search */}
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  placeholder="Buscar..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-48 h-9"
                  leftIcon={<Search size={14} />}
                  rightIcon={
                    search ? (
                      <button type="button" onClick={() => { setSearch(''); setPage(1) }}>
                        <X size={14} />
                      </button>
                    ) : null
                  }
                />
              </form>
            </div>
          }
        />

        {isLoading ? (
          <TableSkeleton rows={8} cols={6} />
        ) : error ? (
          <ErrorState message={error} onRetry={loadClients} />
        ) : (
          <>
            <ClientTable
              clients={clients?.items ?? []}
              onDeactivate={(c) => setClientToDeactivate(c)}
            />
            {clients && (
              <Pagination
                page={page}
                totalPages={clients.total_pages}
                total={clients.total}
                limit={LIMIT}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </Card>

      <ConfirmModal
        isOpen={!!clientToDeactivate}
        onClose={() => setClientToDeactivate(null)}
        onConfirm={handleDeactivate}
        isLoading={isDeactivating}
        title="Desactivar Cliente"
        message={`¿Estás seguro de desactivar a ${clientToDeactivate?.first_name} ${clientToDeactivate?.last_name}? El cliente no podrá acceder a nuevas membresías.`}
        confirmLabel="Desactivar"
      />
    </div>
  )
}
