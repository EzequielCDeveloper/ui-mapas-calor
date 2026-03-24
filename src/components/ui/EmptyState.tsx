import React from 'react'
import { SearchX, AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
}

export function EmptyState({
  title = 'Sin resultados',
  description = 'No se encontraron registros.',
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-black-600 border border-border flex items-center justify-center mb-4 text-text-muted">
        {icon ?? <SearchX size={28} />}
      </div>
      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-text-muted max-w-xs mb-4">{description}</p>
      {action && (
        <Button size="sm" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({ message = 'Ocurrió un error al cargar los datos.', onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center mb-4 text-danger">
        <AlertCircle size={28} />
      </div>
      <h3 className="text-base font-semibold text-white mb-1">Error</h3>
      <p className="text-sm text-text-muted max-w-xs mb-4">{message}</p>
      {onRetry && (
        <Button size="sm" variant="secondary" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  )
}
