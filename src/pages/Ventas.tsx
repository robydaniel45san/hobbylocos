import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RussianRuble } from 'lucide-react';
import { Venta, EstadoVenta } from '@/types';
import { cn } from '@/lib/utils';

import { VentasResumenCards } from '@/components/ventas/VentasResumenCards';
import { VentasFilterBar } from '@/components/ventas/VentasFilterBar';
import { VentasTable } from '@/components/ventas/VentasTable';

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

  const totalVentas = ventas.length;
  const ventasRealizadas = ventas.filter(v => v.estado === 'realizado').length;
  const ventasEspera = ventas.filter(v => v.estado === 'espera').length;
  const ventasReserva = ventas.filter(v => v.estado === 'reserva').length;

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

      {/* Tarjetas de resumen */}
      <VentasResumenCards
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        totalVentas={totalVentas}
        ventasRealizadas={ventasRealizadas}
        ventasEspera={ventasEspera}
        ventasReserva={ventasReserva}
      />

      {/* Filtros superiores */}
      <VentasFilterBar
        filtro={filtro}
        setFiltro={setFiltro}
      />

      {/* Tabla de ventas */}
      <VentasTable ventas={ventasFiltradas} />
    </div>
  );
};

export default Ventas;
