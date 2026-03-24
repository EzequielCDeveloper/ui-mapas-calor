import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { getToken, removeToken } from './auth'
import type {
  ApiResponse,
  PaginatedResult,
  Client,
  CreateClientInput,
  UpdateClientInput,
  ClientFilter,
  Membership,
  MembershipPlan,
  CreateMembershipInput,
  MembershipFilter,
  Payment,
  CreatePaymentInput,
  PaymentFilter,
  DashboardMetrics,
  ExpirationReport,
  RevenueReport,
  LoginResponse,
} from '@/types/api'
import {
  mockClients,
  mockMembershipPlans,
  mockMemberships,
  mockPayments,
  getMockDashboardMetrics,
  getMockExpirationReport,
  getMockRevenueReport,
} from './mockData'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

let isBackendAvailable: boolean | null = null

async function checkBackend(): Promise<boolean> {
  if (isBackendAvailable !== null) return isBackendAvailable
  
  try {
    await axios.get(`${BASE_URL}/api/v1/health`, { timeout: 3000 })
    isBackendAvailable = true
    return true
  } catch {
    isBackendAvailable = false
    return false
  }
}

async function withMockFallback<T>(
  realCall: () => Promise<T>,
  mockCall: () => Promise<T>,
  fallbackEnabled: boolean = true
): Promise<T> {
  if (!fallbackEnabled) {
    return realCall()
  }
  
  try {
    return await realCall()
  } catch (error) {
    const isConnectionError = axios.isAxiosError(error) && 
      (error.code === 'ECONNREFUSED' || 
       error.code === 'ENOTFOUND' || 
       error.code === 'ETIMEDOUT' ||
       !error.response)
    
    if (isConnectionError) {
      console.warn('Backend no disponible, usando datos mock')
      return mockCall()
    }
    throw error
  }
}

function buildPaginatedResponse<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
  return {
    items,
    total,
    page,
    limit,
    total_pages: Math.ceil(total / limit),
  }
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeToken()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

function extractError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { error?: { message?: string } } | undefined
    return data?.error?.message ?? error.message ?? 'Error desconocido'
  }
  if (error instanceof Error) return error.message
  return 'Error desconocido'
}

// Mock user for development
const mockUser = {
  id: 'user-1',
  name: 'Admin Chapitos',
  email: 'admin@chapitosgym.com',
  role: 'admin' as const,
  active: true,
  created_at: new Date().toISOString(),
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<ApiResponse<LoginResponse>>('/auth/login', { email, password })
      return data.data
    },
    async () => {
      // Mock login - accept any email/password for development
      if (!email || !password) {
        throw new Error('Email y contraseña requeridos')
      }
      return {
        token: 'mock-jwt-token-123456',
        expires_in: 86400,
        user: mockUser,
      }
    }
  )
}

export async function logout(): Promise<void> {
  return withMockFallback(
    async () => {
      await api.post('/auth/logout')
    },
    async () => {
      // Mock logout - do nothing
      removeToken()
    }
  )
}

export async function getMe() {
  return withMockFallback(
    async () => {
      const { data } = await api.get<ApiResponse<{ id: string; name: string; email: string; role: string }>>('/auth/me')
      return data.data
    },
    async () => {
      return mockUser
    }
  )
}

export async function listClients(filter: ClientFilter = {}): Promise<PaginatedResult<Client>> {
  const page = filter.page ?? 1
  const limit = filter.limit ?? 10
  
  const mockFiltered = mockClients.filter(c => {
    if (filter.search) {
      const search = filter.search.toLowerCase()
      const fullName = `${c.first_name} ${c.last_name}`.toLowerCase()
      if (!fullName.includes(search) && !c.email.toLowerCase().includes(search)) return false
    }
    if (filter.active !== undefined) {
      if (c.active !== filter.active) return false
    }
    return true
  })
  
  const start = (page - 1) * limit
  const items = mockFiltered.slice(start, start + limit)
  
  return buildPaginatedResponse(items, mockFiltered.length, page, limit)
}

export async function getClient(id: string): Promise<Client> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<ApiResponse<Client>>(`/clients/${id}`)
      return data.data
    },
    async () => {
      const client = mockClients.find(c => c.id === id)
      if (!client) throw new Error('Cliente no encontrado')
      return client
    }
  )
}

export async function createClient(input: CreateClientInput): Promise<Client> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<ApiResponse<Client>>('/clients', input)
      return data.data
    },
    async () => {
      const newClient: Client = {
        id: `client-${Date.now()}`,
        ...input,
        address: input.address ?? '',
        active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      mockClients.push(newClient)
      return newClient
    }
  )
}

export async function updateClient(id: string, input: UpdateClientInput): Promise<Client> {
  return withMockFallback(
    async () => {
      const { data } = await api.put<ApiResponse<Client>>(`/clients/${id}`, input)
      return data.data
    },
    async () => {
      const idx = mockClients.findIndex(c => c.id === id)
      if (idx === -1) throw new Error('Cliente no encontrado')
      mockClients[idx] = { ...mockClients[idx], ...input, updated_at: new Date().toISOString() }
      return mockClients[idx]
    }
  )
}

export async function deactivateClient(id: string): Promise<void> {
  await withMockFallback(
    async () => {
      await api.patch(`/clients/${id}/deactivate`)
    },
    async () => {
      const idx = mockClients.findIndex(c => c.id === id)
      if (idx !== -1) {
        mockClients[idx].active = false
        mockClients[idx].updated_at = new Date().toISOString()
      }
    }
  )
}

export async function listMembershipPlans(): Promise<MembershipPlan[]> {
  return mockMembershipPlans
}

export async function listMemberships(filter: MembershipFilter = {}): Promise<PaginatedResult<Membership>> {
  const page = filter.page ?? 1
  const limit = filter.limit ?? 10
  
  const enrichedMemberships = mockMemberships.map(m => ({
    ...m,
    client: mockClients.find(c => c.id === m.client_id),
    plan: mockMembershipPlans.find(p => p.id === m.plan_id),
  }))
  
  const mockFiltered = enrichedMemberships.filter(m => {
    if (filter.client_id && m.client_id !== filter.client_id) return false
    if (filter.status && m.status !== filter.status) return false
    return true
  })
  
  const start = (page - 1) * limit
  const items = mockFiltered.slice(start, start + limit)
  
  return buildPaginatedResponse(items, mockFiltered.length, page, limit)
}

export async function getMembership(id: string): Promise<Membership> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<ApiResponse<Membership>>(`/memberships/${id}`)
      return data.data
    },
    async () => {
      const membership = mockMemberships.find(m => m.id === id)
      if (!membership) throw new Error('Membresía no encontrada')
      return {
        ...membership,
        client: mockClients.find(c => c.id === membership.client_id),
        plan: mockMembershipPlans.find(p => p.id === membership.plan_id),
      }
    }
  )
}

export async function createMembership(input: CreateMembershipInput): Promise<Membership> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<ApiResponse<Membership>>('/memberships', input)
      return data.data
    },
    async () => {
      const plan = mockMembershipPlans.find(p => p.id === input.plan_id)
      if (!plan) throw new Error('Plan no encontrado')
      
      const startDate = new Date(input.start_date)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + plan.duration_days)
      
      const client = mockClients.find(c => c.id === input.client_id)
      
      const newMembership: Membership = {
        id: `membership-${Date.now()}`,
        client_id: input.client_id,
        plan_id: input.plan_id,
        price_type: input.price_type,
        start_date: input.start_date,
        end_date: endDate.toISOString().split('T')[0],
        status: 'active',
        created_by: 'user-1',
        created_at: new Date().toISOString(),
        client,
        plan,
      }
      
      mockMemberships.push(newMembership)
      return newMembership
    }
  )
}

export async function updateMembershipStatus(id: string, status: string): Promise<Membership> {
  return withMockFallback(
    async () => {
      const { data } = await api.patch<ApiResponse<Membership>>(`/memberships/${id}/status`, { status })
      return data.data
    },
    async () => {
      const idx = mockMemberships.findIndex(m => m.id === id)
      if (idx === -1) throw new Error('Membresía no encontrada')
      mockMemberships[idx].status = status as Membership['status']
      return mockMemberships[idx]
    }
  )
}

export async function listPayments(filter: PaymentFilter = {}): Promise<PaginatedResult<Payment>> {
  const page = filter.page ?? 1
  const limit = filter.limit ?? 10
  
  const enrichedPayments = mockPayments.map(p => ({
    ...p,
    client: mockClients.find(c => c.id === p.client_id),
    membership: mockMemberships.find(m => m.id === p.membership_id),
  }))
  
  const mockFiltered = enrichedPayments.filter(p => {
    if (filter.client_id && p.client_id !== filter.client_id) return false
    if (filter.from) {
      const paidDate = new Date(p.paid_at)
      const fromDate = new Date(filter.from)
      if (paidDate < fromDate) return false
    }
    if (filter.to) {
      const paidDate = new Date(p.paid_at)
      const toDate = new Date(filter.to)
      if (paidDate > toDate) return false
    }
    return true
  })
  
  const start = (page - 1) * limit
  const items = mockFiltered.slice(start, start + limit)
  
  return buildPaginatedResponse(items, mockFiltered.length, page, limit)
}

export async function getPayment(id: string): Promise<Payment> {
  return withMockFallback(
    async () => {
      const { data } = await api.get<ApiResponse<Payment>>(`/payments/${id}`)
      return data.data
    },
    async () => {
      const payment = mockPayments.find(p => p.id === id)
      if (!payment) throw new Error('Pago no encontrado')
      return {
        ...payment,
        client: mockClients.find(c => c.id === payment.client_id),
        membership: mockMemberships.find(m => m.id === payment.membership_id),
      }
    }
  )
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  return withMockFallback(
    async () => {
      const { data } = await api.post<ApiResponse<Payment>>('/payments', input)
      return data.data
    },
    async () => {
      const membership = mockMemberships.find(m => m.id === input.membership_id)
      const client = membership ? mockClients.find(c => c.id === membership.client_id) : undefined
      
      const newPayment: Payment = {
        id: `payment-${Date.now()}`,
        ...input,
        paid_at: new Date().toISOString(),
        created_by: 'user-1',
        client,
        membership,
      }
      
      mockPayments.push(newPayment)
      return newPayment
    }
  )
}

export async function downloadReceipt(id: string): Promise<Blob> {
  return withMockFallback(
    async () => {
      const response = await api.get(`/payments/${id}/receipt`, {
        responseType: 'blob',
      })
      return response.data as Blob
    },
    async () => {
      const content = 'Mock receipt content'
      return new Blob([content], { type: 'application/pdf' })
    }
  )
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  return getMockDashboardMetrics()
}

export async function getExpirationReport(from: string, to: string): Promise<ExpirationReport> {
  return getMockExpirationReport(from, to)
}

export async function getRevenueReport(from: string, to: string): Promise<RevenueReport> {
  return getMockRevenueReport(from, to)
}

export async function downloadExpirationReportPDF(from: string, to: string): Promise<Blob> {
  const content = `Mock expiration report ${from} - ${to}`
  return new Blob([content], { type: 'application/pdf' })
}

export async function downloadRevenueReportPDF(from: string, to: string): Promise<Blob> {
  const content = `Mock revenue report ${from} - ${to}`
  return new Blob([content], { type: 'application/pdf' })
}

export { extractError }
export default api