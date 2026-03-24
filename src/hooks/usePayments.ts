'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { Payment, PaymentFilter, PaginatedResult, CreatePaymentInput } from '@/types/api'
import { listPayments, getPayment, createPayment, downloadReceipt, extractError } from '@/lib/api'
import { IS_DEMO_MODE } from '@/lib/demo'

export function usePayments() {
  const [payments, setPayments] = useState<PaginatedResult<Payment> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(async (filter: PaymentFilter = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listPayments(filter)
      setPayments(data)
    } catch (err) {
      const msg = extractError(err)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { payments, isLoading, error, fetchPayments }
}

export function useCreatePayment() {
  const [isLoading, setIsLoading] = useState(false)

  const create = useCallback(async (input: CreatePaymentInput): Promise<Payment | null> => {
    if (IS_DEMO_MODE) {
      toast.warning('Función deshabilitada en modo demo')
      return null
    }
    setIsLoading(true)
    try {
      const payment = await createPayment(input)
      toast.success('Pago registrado exitosamente')
      return payment
    } catch (err) {
      toast.error(extractError(err))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { create, isLoading }
}

export function useDownloadReceipt() {
  const [isLoading, setIsLoading] = useState(false)

  const download = useCallback(async (id: string, filename?: string): Promise<void> => {
    setIsLoading(true)
    try {
      const blob = await downloadReceipt(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename ?? `recibo-${id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Recibo descargado')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { download, isLoading }
}
