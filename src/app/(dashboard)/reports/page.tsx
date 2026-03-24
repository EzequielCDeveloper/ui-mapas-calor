'use client'

import React, { useEffect, useState, useCallback } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Download, TrendingUp, AlertTriangle, RefreshCw } from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { MembershipTable } from '@/components/memberships/MembershipTable'
import { PaymentTable } from '@/components/payments/PaymentTable'
import { PageLoader } from '@/components/ui/LoadingSpinner'
import { ErrorState } from '@/components/ui/EmptyState'
import {
  getExpirationReport,
  getRevenueReport,
  downloadExpirationReportPDF,
  downloadRevenueReportPDF,
  extractError,
} from '@/lib/api'
import type { ExpirationReport, RevenueReport } from '@/types/api'
import { formatCurrency, firstDayOfMonthISO, todayISO } from '@/lib/utils'
import { toast } from 'sonner'

function buildRevenueChartData(report: RevenueReport | null) {
  if (!report || !report.payments.length) return []
  const byDay: Record<string, number> = {}
  report.payments.forEach((p) => {
    const day = p.paid_at.split('T')[0]
    byDay[day] = (byDay[day] ?? 0) + p.amount
  })
  return Object.entries(byDay)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, total]) => ({ date: date.slice(5), total }))
}

export default function ReportsPage() {
  const [fromDate, setFromDate] = useState(firstDayOfMonthISO())
  const [toDate, setToDate] = useState(todayISO())
  const [expirationReport, setExpirationReport] = useState<ExpirationReport | null>(null)
  const [revenueReport, setRevenueReport] = useState<RevenueReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState<string | null>(null)

  const loadReports = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [exp, rev] = await Promise.all([
        getExpirationReport(fromDate, toDate),
        getRevenueReport(fromDate, toDate),
      ])
      setExpirationReport(exp)
      setRevenueReport(rev)
    } catch (err) {
      setError(extractError(err))
    } finally {
      setIsLoading(false)
    }
  }, [fromDate, toDate])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  const handleDownloadExpirations = async () => {
    setIsDownloading('expirations')
    try {
      const blob = await downloadExpirationReportPDF(fromDate, toDate)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vencimientos-${fromDate}-${toDate}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Reporte descargado')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setIsDownloading(null)
    }
  }

  const handleDownloadRevenue = async () => {
    setIsDownloading('revenue')
    try {
      const blob = await downloadRevenueReportPDF(fromDate, toDate)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ingresos-${fromDate}-${toDate}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Reporte descargado')
    } catch (err) {
      toast.error(extractError(err))
    } finally {
      setIsDownloading(null)
    }
  }

  const chartData = buildRevenueChartData(revenueReport)

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-white">Reportes</h2>
          <p className="text-text-muted text-sm mt-0.5">Análisis del gimnasio</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="h-9 w-36 text-xs"
          />
          <span className="text-text-muted text-xs">—</span>
          <Input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="h-9 w-36 text-xs"
          />
          <Button size="sm" variant="secondary" leftIcon={<RefreshCw size={13} />} onClick={loadReports}>
            Actualizar
          </Button>
        </div>
      </div>

      {isLoading ? (
        <PageLoader />
      ) : error ? (
        <ErrorState message={error} onRetry={loadReports} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-black-700 rounded-xl border border-border p-5 shadow-card">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Total Ingresos</p>
              <p className="text-2xl font-bold text-gold-400 tabular-nums">
                {formatCurrency(revenueReport?.total ?? 0)}
              </p>
              <p className="text-xs text-text-muted mt-1">{revenueReport?.payments.length ?? 0} pagos</p>
            </div>
            <div className="bg-black-700 rounded-xl border border-border p-5 shadow-card">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Membresías por Vencer</p>
              <p className="text-2xl font-bold text-warning tabular-nums">
                {expirationReport?.total ?? 0}
              </p>
              <p className="text-xs text-text-muted mt-1">En el período seleccionado</p>
            </div>
            <div className="bg-black-700 rounded-xl border border-border p-5 shadow-card">
              <p className="text-xs text-text-muted uppercase tracking-wider mb-2">Promedio por Pago</p>
              <p className="text-2xl font-bold text-white tabular-nums">
                {revenueReport && revenueReport.payments.length > 0
                  ? formatCurrency(revenueReport.total / revenueReport.payments.length)
                  : '—'}
              </p>
              <p className="text-xs text-text-muted mt-1">Ticket promedio</p>
            </div>
          </div>

          {chartData.length > 0 && (
            <Card>
              <CardHeader
                title="Ingresos por Día"
                icon={<TrendingUp size={18} />}
                action={
                  <Button
                    size="sm"
                    variant="outline"
                    leftIcon={<Download size={13} />}
                    onClick={handleDownloadRevenue}
                    isLoading={isDownloading === 'revenue'}
                  >
                    Exportar PDF
                  </Button>
                }
              />
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2A2A2A" vertical={false} />
                    <XAxis
                      dataKey="date"
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
                    <Tooltip
                      contentStyle={{ background: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: 8 }}
                      labelStyle={{ color: '#9CA3AF', fontSize: 11 }}
                      formatter={(v: number) => [formatCurrency(v), 'Ingresos']}
                      cursor={{ fill: 'rgba(212, 175, 55, 0.05)' }}
                    />
                    <Bar dataKey="total" fill="#D4AF37" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          <Card>
            <CardHeader
              title="Detalle de Ingresos"
              subtitle={`${revenueReport?.payments.length ?? 0} pagos`}
              icon={<TrendingUp size={18} />}
              action={
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Download size={13} />}
                  onClick={handleDownloadRevenue}
                  isLoading={isDownloading === 'revenue'}
                >
                  PDF
                </Button>
              }
            />
            <PaymentTable
              payments={revenueReport?.payments.slice(0, 50) ?? []}
            />
          </Card>

          <Card>
            <CardHeader
              title="Membresías por Vencer"
              subtitle={`${expirationReport?.total ?? 0} membresías`}
              icon={<AlertTriangle size={18} />}
              action={
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Download size={13} />}
                  onClick={handleDownloadExpirations}
                  isLoading={isDownloading === 'expirations'}
                >
                  PDF
                </Button>
              }
            />
            <MembershipTable
              memberships={expirationReport?.memberships.slice(0, 50) ?? []}
            />
          </Card>
        </>
      )}
    </div>
  )
}
