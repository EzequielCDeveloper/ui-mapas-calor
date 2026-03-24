'use client'

import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import type { Membership, MembershipFilter, PaginatedResult, CreateMembershipInput, MembershipStatus } from '@/types/api'
import { listMemberships, getMembership, createMembership, updateMembershipStatus, extractError } from '@/lib/api'
import { IS_DEMO_MODE } from '@/lib/demo'

export function useMemberships() {
  const [memberships, setMemberships] = useState<PaginatedResult<Membership> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMemberships = useCallback(async (filter: MembershipFilter = {}) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await listMemberships(filter)
      setMemberships(data)
    } catch (err) {
      const msg = extractError(err)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { memberships, isLoading, error, fetchMemberships }
}

export function useMembership(id: string) {
  const [membership, setMembership] = useState<Membership | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMembership = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMembership(id)
      setMembership(data)
    } catch (err) {
      const msg = extractError(err)
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }, [id])

  return { membership, isLoading, error, fetchMembership }
}

export function useCreateMembership() {
  const [isLoading, setIsLoading] = useState(false)

  const create = useCallback(async (input: CreateMembershipInput): Promise<Membership | null> => {
    if (IS_DEMO_MODE) {
      toast.warning('Función deshabilitada en modo demo')
      return null
    }
    setIsLoading(true)
    try {
      const membership = await createMembership(input)
      toast.success('Membresía asignada exitosamente')
      return membership
    } catch (err) {
      toast.error(extractError(err))
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { create, isLoading }
}

export function useUpdateMembershipStatus() {
  const [isLoading, setIsLoading] = useState(false)

  const updateStatus = useCallback(async (id: string, status: MembershipStatus): Promise<boolean> => {
    if (IS_DEMO_MODE) {
      toast.warning('Función deshabilitada en modo demo')
      return false
    }
    setIsLoading(true)
    try {
      await updateMembershipStatus(id, status)
      toast.success('Estado de membresía actualizado')
      return true
    } catch (err) {
      toast.error(extractError(err))
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { updateStatus, isLoading }
}
