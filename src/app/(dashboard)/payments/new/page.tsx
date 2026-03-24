'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, AlertCircle } from 'lucide-react'
import { PaymentForm } from '@/components/payments/PaymentForm'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCreatePayment } from '@/hooks/usePayments'
import { IS_DEMO_MODE } from '@/lib/demo'

export default function NewPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultClientId = searchParams.get('client_id') ?? undefined
  const { create, isLoading } = useCreatePayment()

  const handleSubmit = async (data: Parameters<typeof create>[0]) => {
    const payment = await create(data)
    if (payment) {
      if (defaultClientId) {
        router.push(`/clients/${defaultClientId}`)
      } else {
        router.push('/payments')
      }
    }
  }

  if (IS_DEMO_MODE) {
    return (
      <div className="max-w-2xl space-y-5 animate-fade-in">
        <div className="flex items-center gap-3">
          <Link href={defaultClientId ? `/clients/${defaultClientId}` : '/payments'}>
            <Button size="sm" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
              Volver
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader
            title="Registrar Pago"
            subtitle="Registra un pago de membresía"
            icon={<CreditCard size={18} />}
          />
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gold-400/10 flex items-center justify-center mb-4">
              <AlertCircle size={32} className="text-gold-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Modo Demo</h3>
            <p className="text-text-muted max-w-md">
              Las funciones de creación están deshabilitadas en el modo de demostración.
            </p>
            <Link href={defaultClientId ? `/clients/${defaultClientId}` : '/payments'} className="mt-4">
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
        <Link href={defaultClientId ? `/clients/${defaultClientId}` : '/payments'}>
          <Button size="sm" variant="ghost" leftIcon={<ArrowLeft size={14} />}>
            Volver
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader
          title="Registrar Pago"
          subtitle="Registra un pago de membresía"
          icon={<CreditCard size={18} />}
        />
        <PaymentForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          defaultClientId={defaultClientId}
          onCancel={() => router.back()}
        />
      </Card>
    </div>
  )
}
