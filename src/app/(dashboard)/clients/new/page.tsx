'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserPlus } from 'lucide-react'
import { ClientForm } from '@/components/clients/ClientForm'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCreateClient } from '@/hooks/useClients'

export default function NewClientPage() {
  const router = useRouter()
  const { create, isLoading } = useCreateClient()

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    const client = await create(data)
    if (client) {
      router.push(`/clients/${client.id}`)
    }
  }

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href="/clients">
          <Button size="sm" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
            Volver
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Nuevo Cliente"
          subtitle="Registra un nuevo cliente en el sistema"
          icon={<UserPlus size={18} />}
        />
        <ClientForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          submitLabel="Crear Cliente"
          onCancel={() => router.push('/clients')}
        />
      </Card>
    </div>
  )
}
