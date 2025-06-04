
import { useState, useEffect, useCallback } from 'react';
import { Producto } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useProductos = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtiene productos desde Supabase
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("productos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error al cargar productos:", error);
        setError("Error al cargar productos");
        toast({
          title: "Error",
          description: "No se pudieron cargar los productos",
          variant: "destructive",
        });
      } else if (data) {
        setProductos(data);
      }
    } catch (err) {
      console.error("Error inesperado al cargar productos:", err);
      setError("Error inesperado");
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al cargar los productos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Eliminar producto
  const eliminarProducto = useCallback(async (id: string) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { error } = await supabase
        .from("productos")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar producto:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el producto",
          variant: "destructive",
        });
        return false;
      } else {
        // Actualizar el estado local
        setProductos(prev => prev.filter(p => p.id !== id));
        toast({
          title: "Producto eliminado",
          description: "El producto se eliminó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al eliminar producto:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al eliminar el producto",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Actualizar producto
  const actualizarProducto = useCallback(async (id: string, datosActualizados: Partial<Producto>) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("productos")
        .update(datosActualizados)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error al actualizar producto:", error);
        toast({
          title: "Error",
          description: "No se pudo actualizar el producto",
          variant: "destructive",
        });
        return false;
      } else if (data) {
        // Actualizar el estado local
        setProductos(prev => prev.map(p => p.id === id ? data : p));
        toast({
          title: "Producto actualizado",
          description: "El producto se actualizó correctamente",
        });
        return true;
      }
    } catch (err) {
      console.error("Error inesperado al actualizar producto:", err);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al actualizar el producto",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  useEffect(() => {
    fetchProductos();
  }, [fetchProductos]);

  const productosFiltrados = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (producto.categoria && producto.categoria.toLowerCase().includes(filtro.toLowerCase())) ||
    String(producto.stock).includes(filtro) ||
    String(producto.precio_minorista).includes(filtro) ||
    String(producto.precio_mayorista).includes(filtro)
  );

  return {
    filtro,
    setFiltro,
    productos,
    setProductos,
    productosFiltrados,
    fetchProductos,
    eliminarProducto,
    actualizarProducto,
    loading,
    error
  };
};
