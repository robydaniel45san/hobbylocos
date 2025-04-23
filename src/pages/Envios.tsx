
import React, { useState } from 'react';
import { Envio, EstadoEnvio } from '@/types';
import { EnviosResumenCards } from '@/components/envios/EnviosResumenCards';
import { EnviosFilterBar } from '@/components/envios/EnviosFilterBar';
import { EnviosTable } from '@/components/envios/EnviosTable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

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

      <EnviosResumenCards
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        totalEnvios={totalEnvios}
        enviosPendientes={enviosPendientes}
        enviosEnviados={enviosEnviados}
        enviosEntregados={enviosEntregados}
      />

      <EnviosFilterBar
        filtro={filtro}
        setFiltro={setFiltro}
      />

      <EnviosTable
        envios={enviosFiltrados}
        formatearFecha={formatearFecha}
        renderEstadoBadge={renderEstadoBadge}
      />
    </div>
  );
};

export default Envios;
