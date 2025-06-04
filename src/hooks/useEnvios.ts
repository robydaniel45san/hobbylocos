
import { useState, useEffect, useCallback } from 'react';
import { Envio, EstadoEnvio } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useEnvios = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | EstadoEnvio>('todos');
  const [envios, setEnvios] = useState<Envio[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtiene envíos desde Supabase con información de la venta y cliente
  const fetchEnvios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("envios")
        .select(`
          *,
          venta:ventas(
            *,
            cliente:clientes(*)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar envíos:", error);
        setError("Error al cargar envíos");
        toast({
          title: "Error",
          description: "No se pudieron cargar los envíos",
          variant: "destructive",
        });
      } else if (data) {
        const enviosTyped = data.map(envio => ({
          ...envio,
          estado: envio.estado as EstadoEnvio
        })) as Envio[];
        setEnvios(enviosTyped);
      }
    } catch (err) {
      console.error("Error inesperado al cargar envíos:", err);
      setError("Error inesperado");
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al cargar los envíos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nuevo envío
  const crearEnvio = useCallback(async (nuevoEnvio: {
    venta_id: string;
    departamento?: string;
    provincia?: string;
    empresa_envio?: string;
    costo?: number;
    estado: EstadoEnvio;
  }) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("envios")
        .insert([{
          venta_id: nuevoEnvio.venta_id,
          departamento: nuevoEnvio.departamento,
          provincia: nuevoEnvio.provincia,
          empresa_envio: nuevoEnvio.empresa_envio,
          costo: nuevoEnvio.costo,
          estado: nuevoEnvio.estado,
          fecha_envio: nuevoEnvio.estado === 'enviado' ? new Date().toISOString() : null,
        }])
        .select(`
          *,
          venta:ventas(
            *,
            cliente:clientes(*)
          )
        `)
        .single();

      if (error) {
        console.error("Error al crear envío:", error);
        toast({
          title: "Error",
          description: "No se pudo crear el envío",
          variant: "destructive",
        });
        return false;
      } else if (data) {
        const envioTyped = {
          ...data,
          estado: data.estado as EstadoEnvio
        } as Envio;
        setEnvios(prev => [envioTyped, ...prev]);
        toast({
          title: "Envío creado",
          description: "El envío se creó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al crear envío:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al crear el envío",
        variant: "destructive",
      });
      return false;
    }
    return false;
  }, []);

  // Actualizar estado de envío
  const actualizarEstadoEnvio = useCallback(async (id: string, nuevoEstado: EstadoEnvio) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const updateData: any = { estado: nuevoEstado };
      
      // Si el estado cambia a 'enviado' y no tenía fecha de envío, establecerla
      if (nuevoEstado === 'enviado') {
        updateData.fecha_envio = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("envios")
        .update(updateData)
        .eq("id", id)
        .select(`
          *,
          venta:ventas(
            *,
            cliente:clientes(*)
          )
        `)
        .single();

      if (error) {
        console.error("Error al actualizar envío:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el envío",
          variant: "destructive",
        });
        return false;
      } else if (data) {
        const envioTyped = {
          ...data,
          estado: data.estado as EstadoEnvio
        } as Envio;
        setEnvios(prev => prev.map(e => e.id === id ? envioTyped : e));
        toast({
          title: "Envío actualizado",
          description: "El estado del envío se actualizó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al actualizar envío:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al actualizar el envío",
        variant: "destructive",
      });
      return false;
    }
    return false;
  }, []);

  // Eliminar envío
  const eliminarEnvio = useCallback(async (id: string) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("envios")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar envío:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el envío",
          variant: "destructive",
        });
        return false;
      } else {
        setEnvios(prev => prev.filter(e => e.id !== id));
        toast({
          title: "Envío eliminado",
          description: "El envío se eliminó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al eliminar envío:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al eliminar el envío",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  useEffect(() => {
    fetchEnvios();
  }, [fetchEnvios]);

  // Filtrar envíos
  const enviosFiltrados = envios.filter(envio => {
    const matchesFiltro = 
      (envio.venta?.cliente?.nombre_completo && envio.venta.cliente.nombre_completo.toLowerCase().includes(filtro.toLowerCase())) ||
      envio.id.includes(filtro) ||
      (envio.departamento && envio.departamento.toLowerCase().includes(filtro.toLowerCase())) ||
      (envio.provincia && envio.provincia.toLowerCase().includes(filtro.toLowerCase())) ||
      (envio.empresa_envio && envio.empresa_envio.toLowerCase().includes(filtro.toLowerCase()));
    
    const matchesEstado = estadoFiltro === 'todos' || envio.estado === estadoFiltro;
    
    return matchesFiltro && matchesEstado;
  });

  // Estadísticas
  const totalEnvios = envios.length;
  const enviosPendientes = envios.filter(e => e.estado === 'pendiente').length;
  const enviosEnviados = envios.filter(e => e.estado === 'enviado').length;
  const enviosEntregados = envios.filter(e => e.estado === 'entregado').length;

  return {
    filtro,
    setFiltro,
    estadoFiltro,
    setEstadoFiltro,
    envios,
    enviosFiltrados,
    fetchEnvios,
    crearEnvio,
    actualizarEstadoEnvio,
    eliminarEnvio,
    loading,
    error,
    totalEnvios,
    enviosPendientes,
    enviosEnviados,
    enviosEntregados
  };
};
