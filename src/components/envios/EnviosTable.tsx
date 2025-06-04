
import React from 'react';
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell
} from '@/components/ui/table';
import { Envio, EstadoEnvio } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Package } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EnviosTableProps {
  envios: Envio[];
  loading: boolean;
  onActualizarEstado: (id: string, nuevoEstado: EstadoEnvio) => Promise<boolean>;
  onEliminar: (id: string) => Promise<boolean>;
}

const formatearFecha = (fecha: string | null) => {
  if (!fecha) return 'No definida';
  return format(new Date(fecha), 'dd MMM yyyy', { locale: es });
};

const renderEstadoBadge = (estado: EstadoEnvio) => {
  switch (estado) {
    case 'entregado':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Entregado</Badge>;
    case 'enviado':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Enviado</Badge>;
    case 'pendiente':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendiente</Badge>;
    default:
      return <Badge>Desconocido</Badge>;
  }
};

export const EnviosTable: React.FC<EnviosTableProps> = ({ 
  envios, 
  loading, 
  onActualizarEstado, 
  onEliminar 
}) => {
  if (loading) {
    return (
      <div className="rounded-md border">
        <div className="p-8 text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p>Cargando envíos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Envío</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Venta ID</TableHead>
            <TableHead>Destino</TableHead>
            <TableHead>Empresa</TableHead>
            <TableHead>Costo</TableHead>
            <TableHead>Fecha Envío</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {envios.length > 0 ? (
            envios.map((envio) => (
              <TableRow key={envio.id}>
                <TableCell className="font-medium">#{envio.id.substring(0, 8)}</TableCell>
                <TableCell>
                  {envio.venta?.cliente?.nombre_completo || 'Sin cliente'}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  #{envio.venta_id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  {envio.departamento && envio.provincia 
                    ? `${envio.provincia}, ${envio.departamento}`
                    : 'No especificado'
                  }
                </TableCell>
                <TableCell>{envio.empresa_envio || 'No especificada'}</TableCell>
                <TableCell>
                  {envio.costo ? `Bs ${envio.costo.toFixed(2)}` : 'Sin costo'}
                </TableCell>
                <TableCell>{formatearFecha(envio.fecha_envio)}</TableCell>
                <TableCell>
                  <Select 
                    value={envio.estado || 'pendiente'} 
                    onValueChange={(nuevoEstado: EstadoEnvio) => onActualizarEstado(envio.id, nuevoEstado)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="entregado">Entregado</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-right">
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => onEliminar(envio.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                <p>No se encontraron envíos</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
