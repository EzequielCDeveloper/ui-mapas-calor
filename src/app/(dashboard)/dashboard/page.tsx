'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, AlertTriangle, TrendingUp, UserPlus, Plus } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ExpirationList } from '@/components/dashboard/ExpirationList'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/EmptyState'
import type { DashboardMetrics, Membership } from '@/types/api'
import { getDashboardMetrics, getExpirationReport, extractError } from '@/lib/api'
import { formatCurrency, firstDayOfMonthISO, todayISO } from '@/lib/utils'

const MOCK_CHART_DATA = [
  { name: 'Lun', pagos: 1200, nuevos: 2 },
  { name: 'Mar', pagos: 2100, nuevos: 3 },
  { name: 'Mié', pagos: 900, nuevos: 1 },
  { name: 'Jue', pagos: 1800, nuevos: 4 },
  { name: 'Vie', pagos: 3200, nuevos: 5 },
  { name: 'Sáb', pagos: 4100, nuevos: 7 },
  { name: 'Dom', pagos: 1500, nuevos: 2 },
]

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black-700 border border-border rounded-lg px-3 py-2 shadow-card">
        <p className="text-xs text-text-muted mb-1">{label}</p>
        {payload.map((entry, i) => (
          <p key={i} className="text-sm font-semibold text-white">
            {entry.name === 'pagos' ? formatCurrency(entry.value) : entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [expirations, setExpirations] = useState<Membership[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [m, exp] = await Promise.all([
        getDashboardMetrics(),
        getExpirationReport(todayISO(), todayISO() + 'T23:59:59Z').then(r => r.memberships).catch(() => []),
      ])
      setMetrics(m)
      setExpirations(exp)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  if (isLoading) return <PageLoader />
  if (error) return <ErrorState message={error} onRetry={loadData} />
  if (!metrics) return null

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Panel Principal</h2>
          <p className="text-text-muted text-sm mt-0.5">Resumen del sistema</p>
        </div>
        <div className="flex gap-2">
          <Link href="/clients/new">
            <Button size="sm" variant="outline" leftIcon={<UserPlus size={14} />}>
              Nuevo Cliente
            </Button>
          </Link>
          <Link href="/payments/new">
            <Button size="sm" leftIcon={<Plus size={14} />}>
              Registrar Pago
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Miembros Activos"
          value={metrics.active_members}
          icon={<Users size={18} />}
          highlighted
          trend={{ value: metrics.new_members_this_month, label: 'nuevos este mes', positive: true }}
        />
        <MetricCard
          title="Por Vencer (7 días)"
          value={metrics.expiring_this_week}
          icon={<AlertTriangle size={18} />}
          subtitle="Requieren atención"
        />
        <MetricCard
          title="Ingresos del Mes"
          value={formatCurrency(metrics.revenue_this_month)}
          icon={<TrendingUp size={18} />}
          highlighted
          subtitle="Mes actual"
        />
        <MetricCard
          title="Clientes Totales"
          value={metrics.total_clients}
          icon={<UserPlus size={18} />}
          subtitle="Registrados en el sistema"
        />
      </div>

      {/* Charts + Expirations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Ingresos de la Semana"
              subtitle="Pagos registrados por día"
              icon={<TrendingUp size={18} />}
            />
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#9CA3AF', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }} />
                  <Bar dataKey="pagos" fill="#D4AF37" radius={[4, 4, 0, 0]} name="pagos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Expirations */}
        <div>
          <Card>
            <CardHeader
              title="Vencimientos Próximos"
              subtitle="Esta semana"
              icon={<AlertTriangle size={18} />}
              action={
                <Link href="/memberships">
                  <Button size="sm" variant="ghost" className="text-gold-400 text-xs">Ver todos</Button>
                </Link>
              }
            />
            <ExpirationList memberships={expirations.slice(0, 6)} />
          </Card>
        </div>
      </div>

      {/* Members trend */}
      <Card>
        <CardHeader
          title="Nuevos Miembros"
          subtitle="Alta de membresías por día"
          icon={<Users size={18} />}
        />
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={MOCK_CHART_DATA} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#9CA3AF', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(212,175,55,0.2)' }} />
              <Line
                type="monotone"
                dataKey="nuevos"
                stroke="#D4AF37"
                strokeWidth={2}
                dot={{ fill: '#D4AF37', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#FFD700' }}
                name="nuevos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
