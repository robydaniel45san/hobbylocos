
import { useState, useEffect, useCallback } from 'react';
import { Producto } from '@/types';

export const useProductos = () => {
  const [filtro, setFiltro] = useState<string>('');
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);

  // Obtiene productos desde Supabase (automatizado)
  const fetchProductos = useCallback(async () => {
    setLoading(true);
    const { supabase } = await import("@/integrations/supabase/client");
    const { data, error } = await supabase
      .from("productos")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setProductos(data);
    setLoading(false);
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
    loading
  };
};
