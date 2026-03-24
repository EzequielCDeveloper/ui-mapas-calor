import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  goldBorder?: boolean
}

export function Card({ children, className, hover = false, goldBorder = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-black-700 rounded-xl border border-border p-6',
        'shadow-card',
        hover && 'hover:shadow-card-hover hover:border-black-400 transition-all duration-200',
        goldBorder && 'border-gold-400/30 shadow-gold',
        className
      )}
    >
      {children}
    </div>
  )
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-gold-400/10 border border-gold-400/20 flex items-center justify-center text-gold-400 flex-shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
