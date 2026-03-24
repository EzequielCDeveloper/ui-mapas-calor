import React from 'react'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: React.ReactNode
  trend?: {
    value: number
    label: string
    positive?: boolean
  }
  highlighted?: boolean
  className?: string
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlighted = false,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'relative bg-black-700 rounded-xl border p-5 overflow-hidden',
        'shadow-card transition-all duration-200 hover:shadow-card-hover',
        highlighted
          ? 'border-gold-400/40 shadow-gold'
          : 'border-border hover:border-black-400',
        className
      )}
    >
      {/* Background glow for highlighted */}
      {highlighted && (
        <div className="absolute inset-0 bg-gold-gradient opacity-[0.03] pointer-events-none" />
      )}

      <div className="flex items-start justify-between mb-4">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            highlighted
              ? 'bg-gold-400/20 border border-gold-400/30 text-gold-400'
              : 'bg-black-600 border border-border text-text-muted'
          )}
        >
          {icon}
        </div>
        {trend && (
          <div
            className={cn(
              'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full',
              trend.positive !== false
                ? 'text-success bg-success/10'
                : 'text-danger bg-danger/10'
            )}
          >
            {trend.positive !== false ? (
              <TrendingUp size={12} />
            ) : (
              <TrendingDown size={12} />
            )}
            {trend.value > 0 ? '+' : ''}{trend.value}
          </div>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-text-muted uppercase tracking-wider mb-1">{title}</p>
        <p
          className={cn(
            'text-3xl font-bold tabular-nums',
            highlighted ? 'text-gold-400' : 'text-white'
          )}
        >
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-text-muted mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className="text-xs text-text-muted mt-1">{trend.label}</p>
        )}
      </div>
    </div>
  )
}
