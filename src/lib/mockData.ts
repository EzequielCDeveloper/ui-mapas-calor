import type {
  Client,
  MembershipPlan,
  Membership,
  Payment,
  DashboardMetrics,
  ExpirationReport,
  RevenueReport,
  MembershipStatus,
  PaymentMethod,
  PriceType,
} from '@/types/api'

const firstNames = [
  'Juan', 'Carlos', 'Luis', 'Miguel', 'Pedro', 'José', 'Antonio', 'Francisco', 'Javier', 'Alejandro',
  'María', 'Ana', 'Laura', 'Carmen', 'Patricia', 'Jennifer', 'Sofia', 'Isabel', 'Gabriela', 'Daniela',
  'Ricardo', 'Fernando', 'Eduardo', 'Marco', 'Gabriel', 'Diego', 'Oscar', 'Alberto', 'Raúl', 'Sergio',
  'Karen', 'Jessica', 'Melissa', 'Diana', 'Andrea', 'Natalie', 'Vanessa', 'Claudia', 'Esther', 'Silvia',
  'David', 'Víctor', 'Héctor', 'Gustavo', 'Mario', 'Arturo', 'Rafael', 'Enrique', 'Israel', 'Mauricio',
]

const lastNames = [
  'García', 'Rodríguez', 'Hernández', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez',
  'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Reyes', 'Morales', 'Ortiz', 'Gutiérrez',
  'Chávez', 'Ramos', 'Vargas', 'Campos', 'Delgado', 'Mendoza', 'Ruiz', 'Álvarez', 'Castillo', 'Jiménez',
]

const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com']

const streets = [
  'Av. Principal', 'Calle Juárez', 'Av. Insurgentes', 'Calle Morelos', 'Av. López Mateos',
  'Calle Hidalgo', 'Av. Universidad', 'Calle Zaragoza', 'Av. México', 'Calle Allende',
]

const neighborhoods = [
  'Centro', 'Colonia del Valle', 'San Ángel', 'Polanco', 'Roma', 'Condesa', 'Narvarte',
  'Del Valle', 'Nápoles', 'Portales', 'Coyoacán', 'Tlalpan', 'Iztapalapa', 'Gustavo A. Madero',
]

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toISOString()
}

function generatePhone(): string {
  const area = Math.floor(Math.random() * 900) + 100
  const first = Math.floor(Math.random() * 900) + 100
  const second = Math.floor(Math.random() * 9000) + 1000
  return `${area}-${first}-${second}`
}

export const membershipPlans: MembershipPlan[] = [
  { id: 'plan-basic', name: 'Básico', duration_days: 30, price_standard: 450, price_student: 350, active: true },
  { id: 'plan-standard', name: 'Estándar', duration_days: 30, price_standard: 650, price_student: 500, active: true },
  { id: 'plan-premium', name: 'Premium', duration_days: 30, price_standard: 950, price_student: 750, active: true },
  { id: 'plan-vip', name: 'VIP', duration_days: 30, price_standard: 1500, price_student: 1200, active: true },
]

function generateClients(count: number): Client[] {
  const clients: Client[] = []
  for (let i = 0; i < count; i++) {
    const firstName = randomItem(firstNames)
    const lastName = randomItem(lastNames)
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 99)}@${randomItem(domains)}`
    const createdAt = randomDate(new Date(2022, 0, 1), new Date(2025, 11, 31))
    
    clients.push({
      id: `client-${i + 1}`,
      first_name: firstName,
      last_name: lastName,
      birth_date: randomDate(new Date(1960, 0, 1), new Date(2006, 11, 31)).split('T')[0],
      phone: generatePhone(),
      email,
      address: `${randomItem(streets)} ${Math.floor(Math.random() * 500) + 1}, ${randomItem(neighborhoods)}`,
      active: Math.random() > 0.1,
      created_at: createdAt,
      updated_at: createdAt,
    })
  }
  return clients
}

function generateMemberships(clients: Client[], plans: MembershipPlan[]): Membership[] {
  const memberships: Membership[] = []
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
  
  for (let i = 0; i < 120; i++) {
    const client = randomItem(clients)
    const plan = randomItem(plans)
    const priceType: PriceType = Math.random() > 0.85 ? 'student' : 'standard'
    const price = priceType === 'student' ? plan.price_student : plan.price_standard
    
    const startDate = randomDate(sixMonthsAgo, now)
    const start = new Date(startDate)
    const end = new Date(start)
    end.setDate(end.getDate() + plan.duration_days)
    
    let status: MembershipStatus
    const daysUntilEnd = Math.floor((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilEnd < 0) {
      status = 'expired'
    } else if (Math.random() < 0.08) {
      status = 'cancelled'
    } else {
      status = 'active'
    }
    
    memberships.push({
      id: `membership-${i + 1}`,
      client_id: client.id,
      plan_id: plan.id,
      price_type: priceType,
      start_date: start.toISOString().split('T')[0],
      end_date: end.toISOString().split('T')[0],
      status,
      created_by: 'user-1',
      created_at: start.toISOString(),
      client,
      plan,
    })
  }
  
  return memberships
}

function generatePayments(memberships: Membership[]): Payment[] {
  const payments: Payment[] = []
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1)
  
  for (let i = 0; i < 220; i++) {
    const membership = randomItem(memberships)
    const methods: PaymentMethod[] = ['cash', 'card', 'bank_transfer']
    const methodWeights = [0.35, 0.45, 0.20]
    let method: PaymentMethod = 'cash'
    const rand = Math.random()
    if (rand < methodWeights[0]) method = 'cash'
    else if (rand < methodWeights[0] + methodWeights[1]) method = 'card'
    else method = 'bank_transfer'
    
    const paidAt = randomDate(sixMonthsAgo, now)
    
    payments.push({
      id: `payment-${i + 1}`,
      client_id: membership.client_id,
      membership_id: membership.id,
      amount: membership.plan 
        ? (membership.price_type === 'student' ? membership.plan.price_student : membership.plan.price_standard)
        : 650,
      payment_method: method,
      paid_at: paidAt,
      reference: method === 'bank_transfer' ? `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}` : undefined,
      created_by: 'user-1',
      client: membership.client,
      membership,
    })
  }
  
  return payments.sort((a, b) => a.paid_at.localeCompare(b.paid_at))
}

export const mockClients = generateClients(55)
export const mockMembershipPlans = membershipPlans
export const mockMemberships = generateMemberships(mockClients, mockMembershipPlans)
export const mockPayments = generatePayments(mockMemberships)

export function getMockDashboardMetrics(): DashboardMetrics {
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfWeek = new Date(now)
  endOfWeek.setDate(endOfWeek.getDate() + (7 - endOfWeek.getDay()))
  
  const activeMemberships = mockMemberships.filter(m => m.status === 'active')
  const expiringThisWeek = activeMemberships.filter(m => {
    const end = new Date(m.end_date)
    return end >= now && end <= endOfWeek
  }).length
  const newThisMonth = mockMemberships.filter(m => {
    const created = new Date(m.created_at)
    return created >= firstDayOfMonth
  }).length
  const monthPayments = mockPayments.filter(p => {
    const paid = new Date(p.paid_at)
    return paid >= firstDayOfMonth
  })
  
  return {
    active_members: activeMemberships.length,
    expiring_this_week: expiringThisWeek,
    revenue_this_month: monthPayments.reduce((sum, p) => sum + p.amount, 0),
    new_members_this_month: newThisMonth,
    total_clients: mockClients.filter(c => c.active).length,
  }
}

export function getMockExpirationReport(from: string, to: string): ExpirationReport {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  
  const memberships = mockMemberships.filter(m => {
    const endDate = new Date(m.end_date)
    return endDate >= fromDate && endDate <= toDate
  }).map(m => ({
    ...m,
    client: mockClients.find(c => c.id === m.client_id),
    plan: mockMembershipPlans.find(p => p.id === m.plan_id),
  }))
  
  return {
    memberships,
    total: memberships.length,
    from,
    to,
  }
}

export function getMockRevenueReport(from: string, to: string): RevenueReport {
  const fromDate = new Date(from)
  const toDate = new Date(to)
  
  const payments = mockPayments.filter(p => {
    const paidAt = new Date(p.paid_at)
    return paidAt >= fromDate && paidAt <= toDate
  }).map(p => ({
    ...p,
    client: mockClients.find(c => c.id === p.client_id),
    membership: mockMemberships.find(m => m.id === p.membership_id),
  }))
  
  return {
    payments,
    total: payments.reduce((sum, p) => sum + p.amount, 0),
    from,
    to,
  }
}