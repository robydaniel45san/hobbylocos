
import React from 'react';
import { EnviosResumenCards } from '@/components/envios/EnviosResumenCards';
import { EnviosFilterBar } from '@/components/envios/EnviosFilterBar';
import { EnviosTable } from '@/components/envios/EnviosTable';
import { NuevoEnvioModal } from '@/components/envios/NuevoEnvioModal';
import { useEnvios } from '@/hooks/useEnvios';

const Envios = () => {
  const {
    filtro,
    setFiltro,
    estadoFiltro,
    setEstadoFiltro,
    enviosFiltrados,
    crearEnvio,
    actualizarEstadoEnvio,
    eliminarEnvio,
    loading,
    error,
    totalEnvios,
    enviosPendientes,
    enviosEnviados,
    enviosEntregados
  } = useEnvios();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Envíos</h1>
        <NuevoEnvioModal onNuevoEnvio={crearEnvio} />
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

      {error && (
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md">
          <p className="font-medium">Error al cargar envíos</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <EnviosTable 
        envios={enviosFiltrados} 
        loading={loading}
        onActualizarEstado={actualizarEstadoEnvio}
        onEliminar={eliminarEnvio}
      />
    </div>
  );
};

export default Envios;
