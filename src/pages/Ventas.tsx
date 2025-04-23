
import React, { useState } from 'react';
import { Venta, EstadoVenta } from '@/types';
import { cn } from '@/lib/utils';

import { VentasResumenCards } from '@/components/ventas/VentasResumenCards';
import { VentasFilterBar } from '@/components/ventas/VentasFilterBar';
import { VentasTable } from '@/components/ventas/VentasTable';
import { NuevaVentaModal } from '@/components/ventas/NuevaVentaModal'; // Nuevo import

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
      nombre_completo: 'María Quispe Mamani',
      celular: '71234567',
      correo: 'maria@example.com',
      direccion: 'Av. 16 de Julio #123',
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
      nombre_completo: 'Juan Condori Huanca',
      celular: '73456789',
      correo: 'juan@example.com',
      direccion: 'Calle Sagárnaga #456',
      departamento: 'Cochabamba',
      provincia: 'Cercado',
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
      nombre_completo: 'Ana Flores Choque',
      celular: '65432198',
      correo: 'ana@example.com',
      direccion: 'Av. América #789',
      departamento: 'Santa Cruz',
      provincia: 'Andrés Ibáñez',
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
      nombre_completo: 'Pedro Torrico Ledezma',
      celular: '76543219',
      correo: 'pedro@example.com',
      direccion: 'Calle Sucre #101',
      departamento: 'Tarija',
      provincia: 'Cercado',
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
      nombre_completo: 'Luisa Vargas Camacho',
      celular: '60123456',
      correo: 'luisa@example.com',
      direccion: 'Av. Villazón #202',
      departamento: 'Potosí',
      provincia: 'Tomás Frías',
      notas: 'Cliente VIP'
    }
  },
];

const Ventas = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | EstadoVenta>('todos');
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

  // Maneja el guardado simulado de una nueva venta
  const handleNuevaVenta = (nueva: { clienteNombre: string; montoTotal: string }) => {
    const nuevaVenta: Venta = {
      id: (ventas.length + 1).toString(),
      cliente_id: '', // Simulado
      fecha: new Date().toISOString(),
      total: parseFloat(nueva.montoTotal),
      estado: 'reserva', // Nuevo por default como reserva
      cliente: {
        id: '',
        nombre_completo: nueva.clienteNombre,
        celular: null,
        correo: null,
        direccion: null,
        departamento: null,
        provincia: null,
        notas: null,
      }
    };
    setVentas([nuevaVenta, ...ventas]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Icono removido porque no está en la lista permitida, para evitar error */}
          <h1 className="text-2xl font-bold tracking-tight">Ventas en Bolivianos (Bs)</h1>
        </div>
        {/* Modal de Nueva Venta */}
        <NuevaVentaModal onNuevaVenta={handleNuevaVenta} />
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
