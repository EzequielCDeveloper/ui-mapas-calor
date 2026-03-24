// API Response envelope
export interface ApiResponse<T> {
  success: boolean
  data: T
  meta: {
    requestId: string
    timestamp: string
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: Array<{ field?: string; message: string }>
  }
  meta: {
    requestId: string
    timestamp: string
  }
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}

// Auth
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'billing'
  active: boolean
  created_at: string
}

export interface LoginResponse {
  token: string
  expires_in: number
  user: User
}

// Client
export interface Client {
  id: string
  first_name: string
  last_name: string
  birth_date?: string
  phone: string
  email: string
  address: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface CreateClientInput {
  first_name: string
  last_name: string
  birth_date?: string
  phone: string
  email: string
  address?: string
}

export interface UpdateClientInput {
  first_name?: string
  last_name?: string
  birth_date?: string
  phone?: string
  email?: string
  address?: string
}

// Membership Plan
export interface MembershipPlan {
  id: string
  name: string
  duration_days: number
  price_standard: number
  price_student: number
  active: boolean
}

// Membership
export type MembershipStatus = 'active' | 'expired' | 'cancelled'
export type PriceType = 'standard' | 'student'

export interface Membership {
  id: string
  client_id: string
  plan_id: string
  price_type: PriceType
  start_date: string
  end_date: string
  status: MembershipStatus
  created_by: string
  created_at: string
  client?: Client
  plan?: MembershipPlan
}

export interface CreateMembershipInput {
  client_id: string
  plan_id: string
  price_type: PriceType
  start_date: string
}

// Payment
export type PaymentMethod = 'cash' | 'card' | 'bank_transfer'

export interface Payment {
  id: string
  client_id: string
  membership_id: string
  amount: number
  payment_method: PaymentMethod
  paid_at: string
  reference?: string
  created_by: string
  client?: Client
  membership?: Membership
}

export interface CreatePaymentInput {
  client_id: string
  membership_id: string
  amount: number
  payment_method: PaymentMethod
  reference?: string
}

// Dashboard
export interface DashboardMetrics {
  active_members: number
  expiring_this_week: number
  revenue_this_month: number
  new_members_this_month: number
  total_clients: number
}

// Reports
export interface ExpirationReport {
  memberships: Membership[]
  total: number
  from: string
  to: string
}

export interface RevenueReport {
  payments: Payment[]
  total: number
  from: string
  to: string
}

// Query filters
export interface ClientFilter {
  page?: number
  limit?: number
  search?: string
  active?: boolean
}

export interface MembershipFilter {
  page?: number
  limit?: number
  client_id?: string
  status?: MembershipStatus
}

export interface PaymentFilter {
  page?: number
  limit?: number
  client_id?: string
  from?: string
  to?: string
}
