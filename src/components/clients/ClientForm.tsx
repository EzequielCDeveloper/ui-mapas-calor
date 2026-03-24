'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { Client } from '@/types/api'

const clientSchema = z.object({
  first_name: z.string().min(1, 'Nombre requerido').max(100),
  last_name: z.string().min(1, 'Apellido requerido').max(100),
  email: z.string().email('Email inválido'),
  phone: z.string().min(7, 'Teléfono requerido').max(20),
  birth_date: z.string().optional(),
  address: z.string().optional(),
})

type ClientFormData = z.infer<typeof clientSchema>

interface ClientFormProps {
  defaultValues?: Partial<Client>
  onSubmit: (data: ClientFormData) => Promise<void>
  isLoading: boolean
  submitLabel?: string
  onCancel?: () => void
}

export function ClientForm({
  defaultValues,
  onSubmit,
  isLoading,
  submitLabel = 'Guardar',
  onCancel,
}: ClientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      first_name: defaultValues?.first_name ?? '',
      last_name: defaultValues?.last_name ?? '',
      email: defaultValues?.email ?? '',
      phone: defaultValues?.phone ?? '',
      birth_date: defaultValues?.birth_date
        ? defaultValues.birth_date.split('T')[0]
        : '',
      address: defaultValues?.address ?? '',
    },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Nombre"
          required
          placeholder="Juan"
          error={errors.first_name?.message}
          {...register('first_name')}
        />
        <Input
          label="Apellido"
          required
          placeholder="García"
          error={errors.last_name?.message}
          {...register('last_name')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Email"
          type="email"
          required
          placeholder="juan@ejemplo.com"
          error={errors.email?.message}
          autoComplete="email"
          {...register('email')}
        />
        <Input
          label="Teléfono"
          type="tel"
          required
          placeholder="+52 55 1234 5678"
          error={errors.phone?.message}
          autoComplete="tel"
          {...register('phone')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input
          label="Fecha de Nacimiento"
          type="date"
          error={errors.birth_date?.message}
          {...register('birth_date')}
        />
        <Input
          label="Dirección"
          placeholder="Calle, Colonia, Ciudad"
          error={errors.address?.message}
          {...register('address')}
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1 sm:flex-none">
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading} className="flex-1 sm:flex-none">
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
