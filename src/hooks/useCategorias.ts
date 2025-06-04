
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  productos_count?: number;
  created_at?: string;
}

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');

  // Cargar categorías desde localStorage (en una app real sería desde BD)
  const cargarCategorias = useCallback(async () => {
    setLoading(true);
    try {
      // Simular categorías por defecto
      const categoriasDefault: Categoria[] = [
        { id: '1', nombre: 'Figuras', descripcion: 'Figuras de acción y coleccionables', activo: true, productos_count: 0 },
        { id: '2', nombre: 'Katanas', descripcion: 'Katanas decorativas y réplicas', activo: true, productos_count: 0 },
        { id: '3', nombre: 'Mochilas', descripcion: 'Mochilas temáticas de anime', activo: true, productos_count: 0 },
        { id: '4', nombre: 'Llaveros', descripcion: 'Llaveros y accesorios pequeños', activo: true, productos_count: 0 },
        { id: '5', nombre: 'Ropa', descripcion: 'Camisetas, sudaderas y ropa temática', activo: true, productos_count: 0 },
      ];

      const categoriasGuardadas = JSON.parse(localStorage.getItem('categorias') || JSON.stringify(categoriasDefault));
      
      // Contar productos por categoría
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: productos } = await supabase
        .from("productos")
        .select("categoria")
        .eq("activo", true);

      const categoriasConConteo = categoriasGuardadas.map((cat: Categoria) => ({
        ...cat,
        productos_count: productos?.filter(p => p.categoria === cat.nombre).length || 0
      }));

      setCategorias(categoriasConConteo);
    } catch (error) {
      console.error('Error cargando categorías:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear nueva categoría
  const crearCategoria = useCallback(async (categoria: Omit<Categoria, 'id' | 'created_at' | 'productos_count'>) => {
    try {
      const nuevaCategoria: Categoria = {
        id: Date.now().toString(),
        ...categoria,
        productos_count: 0,
        created_at: new Date().toISOString()
      };

      const categoriasActuales = JSON.parse(localStorage.getItem('categorias') || '[]');
      categoriasActuales.push(nuevaCategoria);
      localStorage.setItem('categorias', JSON.stringify(categoriasActuales));

      setCategorias(prev => [...prev, nuevaCategoria]);

      toast({
        title: "Categoría creada",
        description: `La categoría "${categoria.nombre}" se creó correctamente`,
      });

      return true;
    } catch (error) {
      console.error('Error creando categoría:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la categoría",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Eliminar categoría
  const eliminarCategoria = useCallback(async (id: string) => {
    try {
      const categoriasActuales = JSON.parse(localStorage.getItem('categorias') || '[]');
      const categoriasActualizadas = categoriasActuales.filter((cat: Categoria) => cat.id !== id);
      localStorage.setItem('categorias', JSON.stringify(categoriasActualizadas));

      setCategorias(prev => prev.filter(cat => cat.id !== id));

      toast({
        title: "Categoría eliminada",
        description: "La categoría se eliminó correctamente",
      });

      return true;
    } catch (error) {
      console.error('Error eliminando categoría:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  useEffect(() => {
    cargarCategorias();
  }, [cargarCategorias]);

  const categoriasFiltradas = categorias.filter(categoria =>
    categoria.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    (categoria.descripcion && categoria.descripcion.toLowerCase().includes(filtro.toLowerCase()))
  );

  return {
    categorias,
    categoriasFiltradas,
    loading,
    filtro,
    setFiltro,
    cargarCategorias,
    crearCategoria,
    eliminarCategoria
  };
};
