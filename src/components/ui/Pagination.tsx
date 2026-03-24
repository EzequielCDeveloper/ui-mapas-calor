import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  page: number
  totalPages: number
  total: number
  limit: number
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const pages = React.useMemo(() => {
    const range: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i)
    } else {
      range.push(1)
      if (page > 3) range.push('...')
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
        range.push(i)
      }
      if (page < totalPages - 2) range.push('...')
      range.push(totalPages)
    }
    return range
  }, [page, totalPages])

  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="text-xs text-text-muted">
        Mostrando <span className="text-text-secondary font-medium">{start}–{end}</span>{' '}
        de <span className="text-text-secondary font-medium">{total}</span> registros
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            page === 1
              ? 'text-text-disabled cursor-not-allowed'
              : 'text-text-muted hover:text-white hover:bg-black-600'
          )}
        >
          <ChevronLeft size={16} />
        </button>

        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-text-disabled text-xs">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p as number)}
              className={cn(
                'min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-colors',
                p === page
                  ? 'bg-gold-400 text-black-900 font-semibold'
                  : 'text-text-muted hover:text-white hover:bg-black-600'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            page === totalPages
              ? 'text-text-disabled cursor-not-allowed'
              : 'text-text-muted hover:text-white hover:bg-black-600'
          )}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
