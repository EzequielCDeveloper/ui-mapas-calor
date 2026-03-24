import React from 'react'
import Link from 'next/link'
import { Eye, Edit, UserX } from 'lucide-react'
import { Table, TableHead, Th, TableBody, Tr, Td } from '@/components/ui/Table'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Client } from '@/types/api'
import { formatDate } from '@/lib/utils'

interface ClientTableProps {
  clients: Client[]
  onDeactivate?: (client: Client) => void
}

export function ClientTable({ clients, onDeactivate }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <EmptyState
        title="Sin clientes"
        description="No se encontraron clientes. Crea uno nuevo para comenzar."
      />
    )
  }

  return (
    <Table>
      <TableHead>
        <Th>Cliente</Th>
        <Th>Email</Th>
        <Th>Teléfono</Th>
        <Th>Estado</Th>
        <Th>Registrado</Th>
        <Th className="text-right">Acciones</Th>
      </TableHead>
      <TableBody>
        {clients.map((client) => (
          <Tr key={client.id}>
            <Td>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-xs font-bold text-black-900 flex-shrink-0">
                  {client.first_name[0]}{client.last_name[0]}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">
                    {client.first_name} {client.last_name}
                  </p>
                </div>
              </div>
            </Td>
            <Td>
              <span className="text-text-secondary text-sm">{client.email}</span>
            </Td>
            <Td>
              <span className="text-text-secondary text-sm">{client.phone}</span>
            </Td>
            <Td>
              <Badge variant={client.active ? 'success' : 'muted'} dot>
                {client.active ? 'Activo' : 'Inactivo'}
              </Badge>
            </Td>
            <Td>
              <span className="text-text-muted text-sm">{formatDate(client.created_at)}</span>
            </Td>
            <Td className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Link href={`/clients/${client.id}`}>
                  <Button size="sm" variant="ghost" leftIcon={<Eye size={14} />}>
                    Ver
                  </Button>
                </Link>
                <Link href={`/clients/${client.id}/edit`}>
                  <Button size="sm" variant="ghost" leftIcon={<Edit size={14} />}>
                    Editar
                  </Button>
                </Link>
                {client.active && onDeactivate && (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<UserX size={14} />}
                    className="text-danger hover:text-danger hover:bg-danger/10"
                    onClick={() => onDeactivate(client)}
                  >
                    Desactivar
                  </Button>
                )}
              </div>
            </Td>
          </Tr>
        ))}
      </TableBody>
    </Table>
  )
}
