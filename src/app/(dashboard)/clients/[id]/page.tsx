'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, Edit, Phone, Mail, MapPin, Calendar, UserX,
  CalendarCheck, CreditCard, Plus
} from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { MembershipTable } from '@/components/memberships/MembershipTable'
import { PaymentTable } from '@/components/payments/PaymentTable'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/EmptyState'
import { ConfirmModal } from '@/components/ui/Modal'
import { useClient, useDeactivateClient } from '@/hooks/useClients'
import { useMemberships } from '@/hooks/useMemberships'
import { usePayments, useDownloadReceipt } from '@/hooks/usePayments'
import type { Payment } from '@/types/api'
import { formatDate, getInitials } from '@/lib/utils'

export default function ClientDetailPage() {
  const params = useParams()
  const id = params.id as string

  const { client, isLoading, error, fetchClient } = useClient(id)
  const { memberships, fetchMemberships } = useMemberships()
  const { payments, fetchPayments } = usePayments()
  const { deactivate, isLoading: isDeactivating } = useDeactivateClient()
  const { download: downloadReceipt, isLoading: isDownloading } = useDownloadReceipt()
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)

  useEffect(() => {
    fetchClient()
    fetchMemberships({ client_id: id, limit: 50 })
    fetchPayments({ client_id: id, limit: 50 })
  }, [id])

  const handleDeactivate = async () => {
    const ok = await deactivate(id)
    if (ok) {
      setShowDeactivateModal(false)
      fetchClient()
    }
  }

  if (isLoading) return <PageLoader />
  if (error) return <ErrorState message={error} onRetry={fetchClient} />
  if (!client) return null

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/clients">
          <Button size="sm" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
            Clientes
          </Button>
        </Link>
      </div>

      {/* Profile card */}
      <Card goldBorder>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gold-gradient flex items-center justify-center text-xl font-bold text-black-900 shadow-gold flex-shrink-0">
              {getInitials(`${client.first_name} ${client.last_name}`)}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold text-white">
                  {client.first_name} {client.last_name}
                </h2>
                <Badge variant={client.active ? 'success' : 'muted'} dot>
                  {client.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1.5">
                  <Mail size={13} />{client.email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone size={13} />{client.phone}
                </span>
                {client.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={13} />{client.address}
                  </span>
                )}
                {client.birth_date && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} />Nació {formatDate(client.birth_date)}
                  </span>
                )}
              </div>
              <p className="text-xs text-text-disabled mt-1">
                Registrado el {formatDate(client.created_at)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Link href={`/memberships/new?client_id=${client.id}`}>
              <Button size="sm" variant="outline" leftIcon={<Plus size={14} />}>
                Membresía
              </Button>
            </Link>
            <Link href={`/payments/new?client_id=${client.id}`}>
              <Button size="sm" leftIcon={<Plus size={14} />}>
                Pago
              </Button>
            </Link>
            <Link href={`/clients/${id}/edit`}>
              <Button size="sm" variant="secondary" leftIcon={<Edit size={14} />}>
                Editar
              </Button>
            </Link>
            {client.active && (
              <Button
                size="sm"
                variant="danger"
                leftIcon={<UserX size={14} />}
                onClick={() => setShowDeactivateModal(true)}
              >
                Desactivar
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Memberships */}
      <Card>
        <CardHeader
          title="Membresías"
          icon={<CalendarCheck size={18} />}
          action={
            <Link href={`/memberships/new?client_id=${client.id}`}>
              <Button size="sm" variant="outline" leftIcon={<Plus size={14} />}>
                Asignar
              </Button>
            </Link>
          }
        />
        <MembershipTable
          memberships={memberships?.items ?? []}
          showClient={false}
        />
      </Card>

      {/* Payments */}
      <Card>
        <CardHeader
          title="Historial de Pagos"
          icon={<CreditCard size={18} />}
          action={
            <Link href={`/payments/new?client_id=${client.id}`}>
              <Button size="sm" leftIcon={<Plus size={14} />}>
                Registrar
              </Button>
            </Link>
          }
        />
        <PaymentTable
          payments={payments?.items ?? []}
          showClient={false}
          onDownloadReceipt={(p: Payment) => downloadReceipt(p.id, `recibo-${client.last_name}-${p.id.slice(0,8)}.pdf`)}
          isDownloading={isDownloading}
        />
      </Card>

      <ConfirmModal
        isOpen={showDeactivateModal}
        onClose={() => setShowDeactivateModal(false)}
        onConfirm={handleDeactivate}
        isLoading={isDeactivating}
        title="Desactivar Cliente"
        message={`¿Desactivar a ${client.first_name} ${client.last_name}? No podrá obtener nuevas membresías.`}
        confirmLabel="Desactivar"
      />
    </div>
  )
}
