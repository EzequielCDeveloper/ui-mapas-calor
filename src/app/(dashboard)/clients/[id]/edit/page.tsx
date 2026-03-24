'use client'

import React, { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Edit, AlertCircle } from 'lucide-react'
import { ClientForm } from '@/components/clients/ClientForm'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/EmptyState'
import { useClient, useUpdateClient } from '@/hooks/useClients'
import { IS_DEMO_MODE } from '@/lib/demo'

export default function EditClientPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { client, isLoading, error, fetchClient } = useClient(id)
  const { update, isLoading: isUpdating } = useUpdateClient()

  useEffect(() => {
    fetchClient()
  }, [id])

  const handleSubmit = async (data: Parameters<typeof update>[1]) => {
    const updated = await update(id, data)
    if (updated) {
      router.push(`/clients/${id}`)
    }
  }

  if (isLoading) return <PageLoader />
  if (error) return <ErrorState message={error} onRetry={fetchClient} />
  if (!client) return null

  if (IS_DEMO_MODE) {
    return (
      <div className="max-w-2xl space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href={`/clients/${id}`}>
            <Button size="sm" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
              Volver
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader
            title="Editar Cliente"
            subtitle={`${client.first_name} ${client.last_name}`}
            icon={<Edit size={18} />}
          />
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-gold-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Modo Demo</h3>
            <p className="text-text-muted max-w-md">
              Las funciones de edición están deshabilitadas en el modo de demostración.
            </p>
            <Link href={`/clients/${id}`} className="mt-4">
              <Button variant="secondary">Volver al perfil</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href={`/clients/${id}`}>
          <Button size="sm" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
            Volver
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Editar Cliente"
          subtitle={`${client.first_name} ${client.last_name}`}
          icon={<Edit size={18} />}
        />
        <ClientForm
          defaultValues={client}
          onSubmit={handleSubmit}
          isLoading={isUpdating}
          submitLabel="Guardar Cambios"
          onCancel={() => router.push(`/clients/${id}`)}
        />
      </Card>
    </div>
  )
}
