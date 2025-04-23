import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  FileText, 
  Calendar 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Venta, EstadoVenta } from '@/types';
import { cn } from '@/lib/utils';
import { RussianRuble } from 'lucide-react';

// Ventas de ejemplo
const ventasDemoData: Venta[] = [
  {
    id: '1',
    cliente_id: '1',
    fecha: new Date(2025, 3, 22).toISOString(),
    total: 1299.98,
    estado: 'realizado',
    cliente: { 
      id: '1', 
      nombre_completo: 'María García Pérez',
      celular: '999-888-777',
      correo: 'maria@example.com',
      direccion: 'Av. Principal 123',
      departamento: 'La Paz',
      provincia: 'Murillo',
      notas: 'Cliente habitual'
    }
  },
  {
    id: '2',
    cliente_id: '2',
    fecha: new Date(2025, 3, 21).toISOString(),
    total: 899.99,
    estado: 'espera',
    cliente: {
      id: '2',
      nombre_completo: 'Juan Rodríguez Sánchez',
      celular: '888-777-666',
      correo: 'juan@example.com',
      direccion: 'Calle Secundaria 456',
      departamento: 'Arequipa',
      provincia: 'Arequipa',
      notas: null
    }
  },
  {
    id: '3',
    cliente_id: '3',
    fecha: new Date(2025, 3, 20).toISOString(),
    total: 349.99,
    estado: 'espera',
    cliente: {
      id: '3',
      nombre_completo: 'Ana López Martínez',
      celular: '777-666-555',
      correo: 'ana@example.com',
      direccion: 'Av. Central 789',
      departamento: 'Cusco',
      provincia: 'Cusco',
      notas: 'Prefiere entregas por la tarde'
    }
  },
  {
    id: '4',
    cliente_id: '4',
    fecha: new Date(2025, 3, 19).toISOString(),
    total: 599.97,
    estado: 'reserva',
    cliente: {
      id: '4',
      nombre_completo: 'Pedro González Díaz',
      celular: '666-555-444',
      correo: 'pedro@example.com',
      direccion: 'Jr. Lateral 101',
      departamento: 'Trujillo',
      provincia: 'La Libertad',
      notas: null
    }
  },
  {
    id: '5',
    cliente_id: '5',
    fecha: new Date(2025, 3, 18).toISOString(),
    total: 1229.98,
    estado: 'realizado',
    cliente: {
      id: '5',
      nombre_completo: 'Luisa Fernández Castro',
      celular: '555-444-333',
      correo: 'luisa@example.com',
      direccion: 'Pasaje Norte 202',
      departamento: 'Piura',
      provincia: 'Piura',
      notas: 'Cliente VIP'
    }
  },
];

const Ventas = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoVenta | 'todos'>('todos');
  const [ventas, setVentas] = useState<Venta[]>(ventasDemoData);

  const ventasFiltradas = ventas.filter(venta => {
    const matchesFiltro = 
      (venta.cliente?.nombre_completo && venta.cliente.nombre_completo.toLowerCase().includes(filtro.toLowerCase())) ||
      venta.id.includes(filtro) ||
      String(venta.total).includes(filtro);
    
    const matchesEstado = estadoFiltro === 'todos' || venta.estado === estadoFiltro;
    
    return matchesFiltro && matchesEstado;
  });

  const formatearFecha = (fecha: string) => {
    return format(new Date(fecha), 'dd MMM yyyy', { locale: es });
  };

  const totalVentas = ventas.length;
  const ventasRealizadas = ventas.filter(v => v.estado === 'realizado').length;
  const ventasEspera = ventas.filter(v => v.estado === 'espera').length;
  const ventasReserva = ventas.filter(v => v.estado === 'reserva').length;

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <RussianRuble className="h-5 w-5 mr-2 text-muted-foreground" />
          <h1 className="text-2xl font-bold tracking-tight">Ventas en Bolivianos (Bs)</h1>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Nueva Venta
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card 
          className={cn(
            "border-l-4 border-l-app-blue cursor-pointer transition-all hover:shadow-md", 
            estadoFiltro === 'todos' ? "bg-blue-50" : ""
          )}
          onClick={() => setEstadoFiltro('todos')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Ventas</p>
              <p className="font-bold text-lg">{totalVentas}</p>
            </div>
            <div className="bg-app-blue rounded-full p-2">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "border-l-4 border-l-status-realizado cursor-pointer transition-all hover:shadow-md",
            estadoFiltro === 'realizado' ? "bg-green-50" : ""
          )}
          onClick={() => setEstadoFiltro('realizado')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Realizadas</p>
              <p className="font-bold text-lg">{ventasRealizadas}</p>
            </div>
            <div className="bg-status-realizado rounded-full p-2">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "border-l-4 border-l-status-espera cursor-pointer transition-all hover:shadow-md",
            estadoFiltro === 'espera' ? "bg-blue-50" : ""
          )}
          onClick={() => setEstadoFiltro('espera')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">En Espera</p>
              <p className="font-bold text-lg">{ventasEspera}</p>
            </div>
            <div className="bg-status-espera rounded-full p-2">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "border-l-4 border-l-status-reserva cursor-pointer transition-all hover:shadow-md",
            estadoFiltro === 'reserva' ? "bg-yellow-50" : ""
          )}
          onClick={() => setEstadoFiltro('reserva')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Reservadas</p>
              <p className="font-bold text-lg">{ventasReserva}</p>
            </div>
            <div className="bg-status-reserva rounded-full p-2">
              <FileText className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar ventas..."
            className="pl-9 w-full"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
        <div className="flex gap-2 items-center">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Últimos 30 días
          </span>
        </div>
      </div>

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
            {ventasFiltradas.length > 0 ? (
              ventasFiltradas.map((venta) => (
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
    </div>
  );
};

export default Ventas;
