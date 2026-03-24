import React from 'react'
import { cn } from '@/lib/utils'

interface TableProps {
  children: React.ReactNode
  className?: string
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className={cn('w-full text-sm', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="border-b border-border">
        {children}
      </tr>
    </thead>
  )
}

interface ThProps {
  children: React.ReactNode
  className?: string
  sortable?: boolean
  sorted?: 'asc' | 'desc' | false
  onSort?: () => void
}

export function Th({ children, className, sortable, sorted, onSort }: ThProps) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wider whitespace-nowrap',
        sortable && 'cursor-pointer hover:text-gold-400 transition-colors select-none',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && (
          <span className="text-text-disabled">
            {sorted === 'asc' ? '↑' : sorted === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </span>
    </th>
  )
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border/50">{children}</tbody>
}

interface TrProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function Tr({ children, onClick, className }: TrProps) {
  return (
    <tr
      className={cn(
        'transition-colors duration-100',
        onClick
          ? 'cursor-pointer hover:bg-black-600/50'
          : 'hover:bg-black-800/30',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  )
}

interface TdProps {
  children: React.ReactNode
  className?: string
  colSpan?: number
}

export function Td({ children, className, colSpan }: TdProps) {
  return (
    <td className={cn('px-4 py-3 text-text-secondary', className)} colSpan={colSpan}>
      {children}
    </td>
  )
}
