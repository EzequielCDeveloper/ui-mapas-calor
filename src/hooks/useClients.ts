'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { Client, ClientFilter, PaginatedResult, CreateClientInput, UpdateClientInput } from '@/types/api'
import { listClients, getClient, createClient, updateClient, deactivateClient, extractError } from '@/lib/api'
import { IS_DEMO_MODE } from '@/lib/demo'

export function useClients() {
  const [clients, setClients] = useState<PaginatedResult<Client> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = useCallback(async (filter: ClientFilter = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listClients(filter)
      setClients(data)
    } catch (err) {
      const msg = extractError(err)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { clients, isLoading, error, fetchClients }
}

export function useClient(id: string) {
  const [client, setClient] = useState<Client | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClient = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getClient(id)
      setClient(data)
    } catch (err) {
      const msg = extractError(err)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  return { client, isLoading, error, fetchClient, setClient }
}

export function useCreateClient() {
  const [isLoading, setIsLoading] = useState(false)

  const create = useCallback(async (input: CreateClientInput): Promise<Client | null> => {
    if (IS_DEMO_MODE) {
      toast.warning('Función deshabilitada en modo demo')
      return null
    }
    setIsLoading(true)
    try {
      const client = await createClient(input)
      toast.success('Cliente creado exitosamente')
      return client
    } catch (err) {
      toast.error(extractError(err))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { create, isLoading }
}

export function useUpdateClient() {
  const [isLoading, setIsLoading] = useState(false)

  const update = useCallback(async (id: string, input: UpdateClientInput): Promise<Client | null> => {
    if (IS_DEMO_MODE) {
      toast.warning('Función deshabilitada en modo demo')
      return null
    }
    setIsLoading(true)
    try {
      const client = await updateClient(id, input)
      toast.success('Cliente actualizado')
      return client
    } catch (err) {
      toast.error(extractError(err))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { update, isLoading }
}

export function useDeactivateClient() {
  const [isLoading, setIsLoading] = useState(false)

  const deactivate = useCallback(async (id: string): Promise<boolean> => {
    if (IS_DEMO_MODE) {
      toast.warning('Función deshabilitada en modo demo')
      return false
    }
    setIsLoading(true)
    try {
      await deactivateClient(id)
      toast.success('Cliente desactivado')
      return true
    } catch (err) {
      toast.error(extractError(err))
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { deactivate, isLoading }
}
