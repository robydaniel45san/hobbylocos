
import React from 'react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { Venta, EstadoVenta } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface VentasTableProps {
  ventas: Venta[];
}

const formatearFecha = (fecha: string) => (
  format(new Date(fecha), 'dd MMM yyyy', { locale: es })
);

const renderEstadoBadge = (estado: EstadoVenta) => {
  switch (estado) {
    case 'realizado':
      return <Badge className="bg-status-realizado">Realizado</Badge>;
    case 'espera':
      return <Badge className="bg-status-espera">En Espera</Badge>;
    case 'reserva':
      return <Badge className="bg-status-reserva">Reservado</Badge>;
    default:
      return <Badge>Desconocido</Badge>;
  }
};

export const VentasTable: React.FC<VentasTableProps> = ({ ventas }) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {ventas.length > 0 ? (
          ventas.map((venta) => (
            <TableRow key={venta.id}>
              <TableCell className="font-medium">#{venta.id.substring(0, 8)}</TableCell>
              <TableCell>
                {venta.cliente?.nombre_completo || 'Cliente eliminado'}
              </TableCell>
              <TableCell>{formatearFecha(venta.fecha)}</TableCell>
              <TableCell className="font-medium">Bs {venta.total.toFixed(2)}</TableCell>
              <TableCell>{renderEstadoBadge(venta.estado)}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost">
                  Ver detalles
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="h-24 text-center">
              No se encontraron ventas
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
