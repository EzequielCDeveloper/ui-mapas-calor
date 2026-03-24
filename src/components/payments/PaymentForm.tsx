'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Client, Membership } from '@/types/api'
import { listClients, listMemberships } from '@/lib/api'
import { formatCurrency } from '@/lib/utils'

const schema = z.object({
  client_id: z.string().min(1, 'Selecciona un cliente'),
  membership_id: z.string().min(1, 'Selecciona una membresía'),
  amount: z.coerce.number().positive('El monto debe ser positivo'),
  payment_method: z.enum(['cash', 'card', 'bank_transfer']),
  reference: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface PaymentFormProps {
  onSubmit: (data: FormData) => Promise<void>
  isLoading: boolean
  onCancel?: () => void
  defaultClientId?: string
}

export function PaymentForm({ onSubmit, isLoading, onCancel, defaultClientId }: PaymentFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [memberships, setMemberships] = useState<Membership[]>([])
  const [loadingMemberships, setLoadingMemberships] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      client_id: defaultClientId ?? '',
      membership_id: '',
      amount: 0,
      payment_method: 'cash',
      reference: '',
    },
  })

  const clientId = watch('client_id')
  const membershipId = watch('membership_id')

  useEffect(() => {
    listClients({ limit: 200, active: true })
      .then((r) => setClients(r.items))
      .catch(() => setClients([]))
  }, [])

  useEffect(() => {
    if (!clientId) {
      setMemberships([])
      setValue('membership_id', '')
      return
    }
    setLoadingMemberships(true)
    listMemberships({ client_id: clientId, status: 'active', limit: 50 })
      .then((r) => setMemberships(r.items))
      .catch(() => setMemberships([]))
      .finally(() => setLoadingMemberships(false))
  }, [clientId, setValue])

  // Auto-fill amount from selected membership plan
  useEffect(() => {
    if (membershipId) {
      const m = memberships.find((m) => m.id === membershipId)
      if (m?.plan) {
        const price =
          m.price_type === 'student' ? m.plan.price_student : m.plan.price_standard
        setValue('amount', price)
      }
    }
  }, [membershipId, memberships, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Select
        label="Cliente"
        required
        placeholder="Seleccionar cliente..."
        error={errors.client_id?.message}
        options={clients.map((c) => ({
          value: c.id,
          label: `${c.first_name} ${c.last_name}`,
        }))}
        {...register('client_id')}
      />

      <Select
        label="Membresía activa"
        required
        placeholder={loadingMemberships ? 'Cargando...' : 'Seleccionar membresía...'}
        error={errors.membership_id?.message}
        disabled={!clientId || loadingMemberships}
        options={memberships.map((m) => ({
          value: m.id,
          label: m.plan
            ? `${m.plan.name} — vence ${m.end_date.split('T')[0]}`
            : m.id,
        }))}
        {...register('membership_id')}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Monto"
          type="number"
          step="0.01"
          required
          placeholder="0.00"
          error={errors.amount?.message}
          leftIcon={<span className="text-text-muted text-sm">$</span>}
          {...register('amount')}
        />

        <Select
          label="Método de pago"
          required
          error={errors.payment_method?.message}
          options={[
            { value: 'cash', label: 'Efectivo' },
            { value: 'card', label: 'Tarjeta' },
            { value: 'bank_transfer', label: 'Transferencia bancaria' },
          ]}
          {...register('payment_method')}
        />
      </div>

      <Input
        label="Referencia"
        placeholder="Número de folio, transacción, etc. (opcional)"
        error={errors.reference?.message}
        {...register('reference')}
      />

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1 sm:flex-none">
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} className="flex-1 sm:flex-none">
          Registrar Pago
        </Button>
      </div>
    </form>
  )
}
