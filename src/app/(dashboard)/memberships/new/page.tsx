'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarCheck, AlertCircle } from 'lucide-react'
import { MembershipForm } from '@/components/memberships/MembershipForm'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCreateMembership } from '@/hooks/useMemberships'
import { IS_DEMO_MODE } from '@/lib/demo'

export default function NewMembershipPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultClientId = searchParams.get('client_id') ?? undefined
  const { create, isLoading } = useCreateMembership()

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    const membership = await create(data)
    if (membership) {
      if (defaultClientId) {
        router.push(`/clients/${defaultClientId}`)
      } else {
        router.push('/memberships')
      }
    }
  }

  if (IS_DEMO_MODE) {
    return (
      <div className="max-w-2xl space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href={defaultClientId ? `/clients/${defaultClientId}` : '/memberships'}>
            <Button size="sm" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
              Volver
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader
            title="Asignar Membresía"
            subtitle="Registra una nueva membresía para un cliente"
            icon={<CalendarCheck size={18} />}
          />
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-gold-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Modo Demo</h3>
            <p className="text-text-muted max-w-md">
              Las funciones de creación están deshabilitadas en el modo de demostración.
            </p>
            <Link href={defaultClientId ? `/clients/${defaultClientId}` : '/memberships'} className="mt-4">
              <Button variant="secondary">Volver</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <Link href={defaultClientId ? `/clients/${defaultClientId}` : '/memberships'}>
          <Button size="sm" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
            Volver
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Asignar Membresía"
          subtitle="Registra una nueva membresía para un cliente"
          icon={<CalendarCheck size={18} />}
        />
        <MembershipForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          defaultClientId={defaultClientId}
          onCancel={() => router.back()}
        />
      </Card>
    </div>
  )
}
