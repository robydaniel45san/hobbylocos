
import { useState, useEffect, useCallback } from 'react';
import { Venta, EstadoVenta } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useVentas = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todos' | EstadoVenta>('todos');
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtiene ventas desde Supabase con información del cliente
  const fetchVentas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("ventas")
        .select(`
          *,
          cliente:clientes(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar ventas:", error);
        setError("Error al cargar ventas");
        toast({
          title: "Error",
          description: "No se pudieron cargar las ventas",
          variant: "destructive",
        });
      } else if (data) {
        // Asegurar que el estado sea del tipo correcto
        const ventasTyped = data.map(venta => ({
          ...venta,
          estado: venta.estado as EstadoVenta
        })) as Venta[];
        setVentas(ventasTyped);
      }
    } catch (err) {
      console.error("Error inesperado al cargar ventas:", err);
      setError("Error inesperado");
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al cargar las ventas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva venta
  const crearVenta = useCallback(async (nuevaVenta: {
    cliente_id: string | null;
    total: number;
    estado: EstadoVenta;
  }) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("ventas")
        .insert([{
          cliente_id: nuevaVenta.cliente_id,
          total: nuevaVenta.total,
          estado: nuevaVenta.estado,
          fecha: new Date().toISOString(),
        }])
        .select(`
          *,
          cliente:clientes(*)
        `)
        .single();

      if (error) {
        console.error("Error al crear venta:", error);
        toast({
          title: "Error",
          description: "No se pudo crear la venta",
          variant: "destructive",
        });
        return false;
      } else if (data) {
        const ventaTyped = {
          ...data,
          estado: data.estado as EstadoVenta
        } as Venta;
        setVentas(prev => [ventaTyped, ...prev]);
        toast({
          title: "Venta creada",
          description: "La venta se creó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al crear venta:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al crear la venta",
        variant: "destructive",
      });
      return false;
    }
    return false;
  }, []);

  // Actualizar estado de venta
  const actualizarEstadoVenta = useCallback(async (id: string, nuevoEstado: EstadoVenta) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("ventas")
        .update({ estado: nuevoEstado })
        .eq("id", id)
        .select(`
          *,
          cliente:clientes(*)
        `)
        .single();

      if (error) {
        console.error("Error al actualizar venta:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar la venta",
          variant: "destructive",
        });
        return false;
      } else if (data) {
        const ventaTyped = {
          ...data,
          estado: data.estado as EstadoVenta
        } as Venta;
        setVentas(prev => prev.map(v => v.id === id ? ventaTyped : v));
        toast({
          title: "Venta actualizada",
          description: "El estado de la venta se actualizó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al actualizar venta:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al actualizar la venta",
        variant: "destructive",
      });
      return false;
    }
    return false;
  }, []);

  // Eliminar venta
  const eliminarVenta = useCallback(async (id: string) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("ventas")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar venta:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la venta",
          variant: "destructive",
        });
        return false;
      } else {
        setVentas(prev => prev.filter(v => v.id !== id));
        toast({
          title: "Venta eliminada",
          description: "La venta se eliminó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al eliminar venta:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al eliminar la venta",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  useEffect(() => {
    fetchVentas();
  }, [fetchVentas]);

  // Filtrar ventas
  const ventasFiltradas = ventas.filter(venta => {
    const matchesFiltro = 
      (venta.cliente?.nombre_completo && venta.cliente.nombre_completo.toLowerCase().includes(filtro.toLowerCase())) ||
      venta.id.includes(filtro) ||
      String(venta.total).includes(filtro);
    
    const matchesEstado = estadoFiltro === 'todos' || venta.estado === estadoFiltro;
    
    return matchesFiltro && matchesEstado;
  });

  // Estadísticas
  const totalVentas = ventas.length;
  const ventasRealizadas = ventas.filter(v => v.estado === 'realizado').length;
  const ventasEspera = ventas.filter(v => v.estado === 'espera').length;
  const ventasReserva = ventas.filter(v => v.estado === 'reserva').length;

  return {
    filtro,
    setFiltro,
    estadoFiltro,
    setEstadoFiltro,
    ventas,
    ventasFiltradas,
    fetchVentas,
    crearVenta,
    actualizarEstadoVenta,
    eliminarVenta,
    loading,
    error,
    totalVentas,
    ventasRealizadas,
    ventasEspera,
    ventasReserva
  };
};
