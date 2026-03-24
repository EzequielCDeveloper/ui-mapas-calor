'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import type { Client, MembershipPlan } from '@/types/api'
import { listClients, listMemberships, extractError } from '@/lib/api'
import { formatCurrency, todayISO } from '@/lib/utils'

const schema = z.object({
  client_id: z.string().min(1, 'Selecciona un cliente'),
  plan_id: z.string().min(1, 'Selecciona un plan'),
  price_type: z.enum(['standard', 'student']),
  start_date: z.string().min(1, 'Fecha de inicio requerida'),
})

type FormData = z.infer<typeof schema>

interface MembershipFormProps {
  onSubmit: (data: FormData) => Promise<void>
  isLoading: boolean
  onCancel?: () => void
  defaultClientId?: string
}

// Static plans until API endpoint is added
const STATIC_PLANS: MembershipPlan[] = [
  { id: 'plan-monthly', name: 'Mensual', duration_days: 30, price_standard: 500, price_student: 350, active: true },
  { id: 'plan-quarterly', name: 'Trimestral', duration_days: 90, price_standard: 1350, price_student: 900, active: true },
  { id: 'plan-annual', name: 'Anual', duration_days: 365, price_standard: 4800, price_student: 3200, active: true },
]

export function MembershipForm({ onSubmit, isLoading, onCancel, defaultClientId }: MembershipFormProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [plans] = useState<MembershipPlan[]>(STATIC_PLANS)
  const [selectedPlan, setSelectedPlan] = useState<MembershipPlan | null>(null)

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
      plan_id: '',
      price_type: 'standard',
      start_date: todayISO(),
    },
  })

  const planId = watch('plan_id')
  const priceType = watch('price_type')

  useEffect(() => {
    listClients({ limit: 200, active: true })
      .then((r) => setClients(r.items))
      .catch(() => setClients([]))
  }, [])

  useEffect(() => {
    if (planId) {
      const plan = plans.find((p) => p.id === planId)
      setSelectedPlan(plan ?? null)
    }
  }, [planId, plans])

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
        label="Plan"
        required
        placeholder="Seleccionar plan..."
        error={errors.plan_id?.message}
        options={plans.map((p) => ({
          value: p.id,
          label: `${p.name} (${p.duration_days} días)`,
        }))}
        {...register('plan_id')}
      />

      <Select
        label="Tipo de precio"
        required
        error={errors.price_type?.message}
        options={[
          { value: 'standard', label: 'Estándar' },
          { value: 'student', label: 'Estudiante' },
        ]}
        {...register('price_type')}
      />

      <Input
        label="Fecha de inicio"
        type="date"
        required
        error={errors.start_date?.message}
        {...register('start_date')}
      />

      {/* Price preview */}
      {selectedPlan && (
        <Card className="bg-black-800 border-gold-400/20 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">Precio a cobrar</p>
              <p className="text-2xl font-bold text-gold-400">
                {formatCurrency(
                  priceType === 'student'
                    ? selectedPlan.price_student
                    : selectedPlan.price_standard
                )}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-muted">Duración</p>
              <p className="text-white font-semibold">{selectedPlan.duration_days} días</p>
            </div>
          </div>
        </Card>
      )}

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1 sm:flex-none">
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} className="flex-1 sm:flex-none">
          Asignar Membresía
        </Button>
      </div>
    </form>
  )
}
