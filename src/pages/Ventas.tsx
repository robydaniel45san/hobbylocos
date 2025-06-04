
import React from 'react';
import { VentasResumenCards } from '@/components/ventas/VentasResumenCards';
import { VentasFilterBar } from '@/components/ventas/VentasFilterBar';
import { VentasTable } from '@/components/ventas/VentasTable';
import { NuevaVentaModal } from '@/components/ventas/NuevaVentaModal';
import { useVentas } from '@/hooks/useVentas';

const Ventas = () => {
  const {
    filtro,
    setFiltro,
    estadoFiltro,
    setEstadoFiltro,
    ventasFiltradas,
    crearVenta,
    actualizarEstadoVenta,
    eliminarVenta,
    loading,
    error,
    totalVentas,
    ventasRealizadas,
    ventasEspera,
    ventasReserva
  } = useVentas();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold tracking-tight">Ventas en Bolivianos (Bs)</h1>
        </div>
        <NuevaVentaModal onNuevaVenta={crearVenta} />
      </div>

      <VentasResumenCards
        estadoFiltro={estadoFiltro}
        setEstadoFiltro={setEstadoFiltro}
        totalVentas={totalVentas}
        ventasRealizadas={ventasRealizadas}
        ventasEspera={ventasEspera}
        ventasReserva={ventasReserva}
      />

      <VentasFilterBar
        filtro={filtro}
        setFiltro={setFiltro}
      />

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          <p className="font-medium">Error al cargar ventas</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <VentasTable 
        ventas={ventasFiltradas} 
        loading={loading}
        onActualizarEstado={actualizarEstadoVenta}
        onEliminar={eliminarVenta}
      />
    </div>
  );
};

export default Ventas;
