
import { useState, useEffect, useCallback } from 'react';
import { Cliente } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useClientes = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtiene clientes desde Supabase
  const fetchClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar clientes:", error);
        setError("Error al cargar clientes");
        toast({
          title: "Error",
          description: "No se pudieron cargar los clientes",
          variant: "destructive",
        });
      } else if (data) {
        setClientes(data);
      }
    } catch (err) {
      console.error("Error inesperado al cargar clientes:", err);
      setError("Error inesperado");
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al cargar los clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar cliente
  const eliminarCliente = useCallback(async (id: string) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("clientes")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar cliente:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el cliente",
          variant: "destructive",
        });
        return false;
      } else {
        // Actualizar el estado local
        setClientes(prev => prev.filter(c => c.id !== id));
        toast({
          title: "Cliente eliminado",
          description: "El cliente se eliminó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al eliminar cliente:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al eliminar el cliente",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Actualizar cliente
  const actualizarCliente = useCallback(async (id: string, datosActualizados: Partial<Cliente>) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("clientes")
        .update(datosActualizados)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error al actualizar cliente:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el cliente",
          variant: "destructive",
        });
        return false;
      } else if (data) {
        // Actualizar el estado local
        setClientes(prev => prev.map(c => c.id === id ? data : c));
        toast({
          title: "Cliente actualizado",
          description: "El cliente se actualizó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al actualizar cliente:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al actualizar el cliente",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const clientesFiltrados = clientes.filter(cliente => 
    cliente.nombre_completo.toLowerCase().includes(filtro.toLowerCase()) ||
    (cliente.correo && cliente.correo.toLowerCase().includes(filtro.toLowerCase())) ||
    (cliente.celular && cliente.celular.includes(filtro)) ||
    (cliente.departamento && cliente.departamento.toLowerCase().includes(filtro.toLowerCase())) ||
    (cliente.provincia && cliente.provincia.toLowerCase().includes(filtro.toLowerCase()))
  );

  return {
    filtro,
    setFiltro,
    clientes,
    setClientes,
    clientesFiltrados,
    fetchClientes,
    eliminarCliente,
    actualizarCliente,
    loading,
    error
  };
};
