
import React, { useEffect, useState } from 'react';
import { Envio, EstadoEnvio } from '@/types';
import { EnviosResumenCards } from '@/components/envios/EnviosResumenCards';
import { EnviosFilterBar } from '@/components/envios/EnviosFilterBar';
import { EnviosTable } from '@/components/envios/EnviosTable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import { NuevoEnvioModal } from '@/components/envios/NuevoEnvioModal';

const Envios = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<EstadoEnvio | 'todos'>('todos');
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [nuevoEnvioOpen, setNuevoEnvioOpen] = useState(false);
  const [cargando, setCargando] = useState(false);

  const cargarEnvios = async () => {
    setCargando(true);
    const { data, error } = await supabase
      .from("envios")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast({ title: "Error", description: "No se pudieron cargar los envíos", variant: "destructive" });
    } else {
      setEnvios((data as Envio[]) || []);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarEnvios();
  }, []);

  // Filtrado
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

  // Formateo de fecha
  const formatearFecha = (fecha: string | null) => {
    if (!fecha) return '-';
    return format(new Date(fecha), 'dd MMM yyyy', { locale: es });
  };

  // Estadísticas
  const totalEnvios = envios.length;
  const enviosPendientes = envios.filter(e => e.estado === 'pendiente').length;
  const enviosEnviados = envios.filter(e => e.estado === 'enviado').length;
  const enviosEntregados = envios.filter(e => e.estado === 'entregado').length;

  // Badges de estado
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

  // Handler para agregar envío
  const handleEnvioCreado = () => {
    setNuevoEnvioOpen(false);
    cargarEnvios();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Envíos</h1>
          <p className="text-muted-foreground">
            Seguimiento de envíos y entregas
          </p>
        </div>
        <Button onClick={() => setNuevoEnvioOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Nuevo Envío
        </Button>
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
        cargando={cargando}
      />
      <NuevoEnvioModal
        open={nuevoEnvioOpen}
        setOpen={setNuevoEnvioOpen}
        onEnvioCreado={handleEnvioCreado}
      />
    </div>
  );
};

export default Envios;

