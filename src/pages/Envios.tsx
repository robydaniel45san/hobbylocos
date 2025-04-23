
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
  Search, 
  Truck,
  MapPin,
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
import { Envio, EstadoEnvio } from '@/types';
import { cn } from '@/lib/utils';

// Envíos de ejemplo
const enviosDemoData: Envio[] = [
  {
    id: '1',
    venta_id: '1',
    fecha_envio: new Date(2025, 3, 23).toISOString(),
    departamento: 'Lima',
    provincia: 'Lima',
    empresa_envio: 'Olva Courier',
    costo: 15.00,
    estado: 'entregado'
  },
  {
    id: '2',
    venta_id: '2',
    fecha_envio: new Date(2025, 3, 22).toISOString(),
    departamento: 'Arequipa',
    provincia: 'Arequipa',
    empresa_envio: 'Olva Courier',
    costo: 25.00,
    estado: 'enviado'
  },
  {
    id: '3',
    venta_id: '3',
    fecha_envio: null,
    departamento: 'Cusco',
    provincia: 'Cusco',
    empresa_envio: 'Shalom',
    costo: 30.00,
    estado: 'pendiente'
  },
  {
    id: '4',
    venta_id: '4',
    fecha_envio: null,
    departamento: 'La Libertad',
    provincia: 'Trujillo',
    empresa_envio: 'Shalom',
    costo: 20.00,
    estado: 'pendiente'
  },
];

const Envios = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoEnvio | 'todos'>('todos');
  const [envios, setEnvios] = useState<Envio[]>(enviosDemoData);

  // Función para filtrar envíos
  const enviosFiltrados = envios.filter(envio => {
    const matchesFiltro = 
      (envio.departamento && envio.departamento.toLowerCase().includes(filtro.toLowerCase())) ||
      (envio.provincia && envio.provincia.toLowerCase().includes(filtro.toLowerCase())) ||
      (envio.empresa_envio && envio.empresa_envio.toLowerCase().includes(filtro.toLowerCase())) ||
      envio.id.includes(filtro) ||
      envio.venta_id.includes(filtro);
    
    const matchesEstado = estadoFiltro === 'todos' || envio.estado === estadoFiltro;
    
    return matchesFiltro && matchesEstado;
  });

  // Función para formatear fecha
  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return '-';
    return format(new Date(fecha), 'dd MMM yyyy', { locale: es });
  };

  // Obtener estadísticas de envíos
  const totalEnvios = envios.length;
  const enviosPendientes = envios.filter(e => e.estado === 'pendiente').length;
  const enviosEnviados = envios.filter(e => e.estado === 'enviado').length;
  const enviosEntregados = envios.filter(e => e.estado === 'entregado').length;

  // Función para renderizar el badge de estado
  const renderEstadoBadge = (estado: EstadoEnvio) => {
    switch (estado) {
      case 'entregado':
        return <Badge className="bg-status-entregado">Entregado</Badge>;
      case 'enviado':
        return <Badge className="bg-status-enviado">Enviado</Badge>;
      case 'pendiente':
        return <Badge className="bg-status-pendiente">Pendiente</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Envíos</h1>
        <p className="text-muted-foreground">
          Seguimiento de envíos y entregas
        </p>
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
              <p className="text-sm text-muted-foreground">Total Envíos</p>
              <p className="font-bold text-lg">{totalEnvios}</p>
            </div>
            <div className="bg-app-blue rounded-full p-2">
              <Truck className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "border-l-4 border-l-status-pendiente cursor-pointer transition-all hover:shadow-md",
            estadoFiltro === 'pendiente' ? "bg-orange-50" : ""
          )}
          onClick={() => setEstadoFiltro('pendiente')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Pendientes</p>
              <p className="font-bold text-lg">{enviosPendientes}</p>
            </div>
            <div className="bg-status-pendiente rounded-full p-2">
              <Truck className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "border-l-4 border-l-status-enviado cursor-pointer transition-all hover:shadow-md",
            estadoFiltro === 'enviado' ? "bg-purple-50" : ""
          )}
          onClick={() => setEstadoFiltro('enviado')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Enviados</p>
              <p className="font-bold text-lg">{enviosEnviados}</p>
            </div>
            <div className="bg-status-enviado rounded-full p-2">
              <Truck className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
        <Card 
          className={cn(
            "border-l-4 border-l-status-entregado cursor-pointer transition-all hover:shadow-md",
            estadoFiltro === 'entregado' ? "bg-green-50" : ""
          )}
          onClick={() => setEstadoFiltro('entregado')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Entregados</p>
              <p className="font-bold text-lg">{enviosEntregados}</p>
            </div>
            <div className="bg-status-entregado rounded-full p-2">
              <Truck className="h-5 w-5 text-white" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ubicación, empresa..."
            className="pl-9 w-full"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Venta</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Fecha Envío</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {enviosFiltrados.length > 0 ? (
              enviosFiltrados.map((envio) => (
                <TableRow key={envio.id}>
                  <TableCell className="font-medium">#{envio.venta_id.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>
                        {[envio.provincia, envio.departamento].filter(Boolean).join(', ')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{envio.empresa_envio || '-'}</TableCell>
                  <TableCell>{formatearFecha(envio.fecha_envio)}</TableCell>
                  <TableCell>${envio.costo?.toFixed(2) || '-'}</TableCell>
                  <TableCell>{renderEstadoBadge(envio.estado)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">
                      Actualizar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron envíos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Envios;
