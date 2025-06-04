
import { useState, useEffect, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';

export interface MovimientoStock {
  id: string;
  producto_id: string;
  tipo: 'entrada' | 'salida' | 'ajuste';
  cantidad: number;
  motivo: string;
  fecha: string;
  usuario?: string;
  producto?: {
    id: string;
    nombre: string;
    stock: number;
  };
}

export const useMovimientosStock = () => {
  const [movimientos, setMovimientos] = useState<MovimientoStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtro, setFiltro] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<'todos' | 'entrada' | 'salida' | 'ajuste'>('todos');

  // Crear movimiento de stock
  const crearMovimiento = useCallback(async (movimiento: {
    producto_id: string;
    tipo: 'entrada' | 'salida' | 'ajuste';
    cantidad: number;
    motivo: string;
  }) => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Obtener stock actual del producto
      const { data: producto, error: errorProducto } = await supabase
        .from("productos")
        .select("stock")
        .eq("id", movimiento.producto_id)
        .single();

      if (errorProducto) throw errorProducto;

      // Calcular nuevo stock
      let nuevoStock = producto.stock;
      if (movimiento.tipo === 'entrada') {
        nuevoStock += movimiento.cantidad;
      } else if (movimiento.tipo === 'salida') {
        nuevoStock -= movimiento.cantidad;
      } else if (movimiento.tipo === 'ajuste') {
        nuevoStock = movimiento.cantidad; // En ajuste, la cantidad es el nuevo stock total
      }

      // Validar que el stock no sea negativo
      if (nuevoStock < 0) {
        toast({
          title: "Error",
          description: "No se puede reducir el stock por debajo de 0",
          variant: "destructive",
        });
        return false;
      }

      // Actualizar stock del producto
      const { error: errorUpdate } = await supabase
        .from("productos")
        .update({ stock: nuevoStock })
        .eq("id", movimiento.producto_id);

      if (errorUpdate) throw errorUpdate;

      // Crear registro del movimiento (simulado en local storage por ahora)
      const nuevoMovimiento: MovimientoStock = {
        id: Date.now().toString(),
        ...movimiento,
        fecha: new Date().toISOString(),
        usuario: 'Usuario Actual' // En una app real, vendría del contexto de auth
      };

      // Guardar en localStorage (en una app real sería en BD)
      const movimientosGuardados = JSON.parse(localStorage.getItem('movimientos_stock') || '[]');
      movimientosGuardados.unshift(nuevoMovimiento);
      localStorage.setItem('movimientos_stock', JSON.stringify(movimientosGuardados));

      setMovimientos(prev => [nuevoMovimiento, ...prev]);

      toast({
        title: "Movimiento registrado",
        description: `Stock actualizado correctamente. Nuevo stock: ${nuevoStock}`,
      });

      return true;
    } catch (error) {
      console.error('Error creando movimiento:', error);
      toast({
        title: "Error",
        description: "No se pudo registrar el movimiento",
        variant: "destructive",
      });
      return false;
    }
  }, []);

  // Cargar movimientos
  const cargarMovimientos = useCallback(async () => {
    setLoading(true);
    try {
      // Cargar desde localStorage (en una app real sería desde BD)
      const movimientosGuardados = JSON.parse(localStorage.getItem('movimientos_stock') || '[]');
      
      // Obtener información de productos para los movimientos
      if (movimientosGuardados.length > 0) {
        const { supabase } = await import("@/integrations/supabase/client");
        const productosIds = [...new Set(movimientosGuardados.map((m: MovimientoStock) => m.producto_id))];
        
        const { data: productos } = await supabase
          .from("productos")
          .select("id, nombre, stock")
          .in("id", productosIds);

        const movimientosConProductos = movimientosGuardados.map((mov: MovimientoStock) => ({
          ...mov,
          producto: productos?.find(p => p.id === mov.producto_id)
        }));

        setMovimientos(movimientosConProductos);
      }
    } catch (error) {
      console.error('Error cargando movimientos:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarMovimientos();
  }, [cargarMovimientos]);

  // Filtrar movimientos
  const movimientosFiltrados = movimientos.filter(movimiento => {
    const matchesFiltro = 
      (movimiento.producto?.nombre && movimiento.producto.nombre.toLowerCase().includes(filtro.toLowerCase())) ||
      movimiento.motivo.toLowerCase().includes(filtro.toLowerCase()) ||
      movimiento.id.includes(filtro);
    
    const matchesTipo = tipoFiltro === 'todos' || movimiento.tipo === tipoFiltro;
    
    return matchesFiltro && matchesTipo;
  });

  return {
    movimientos,
    movimientosFiltrados,
    loading,
    filtro,
    setFiltro,
    tipoFiltro,
    setTipoFiltro,
    crearMovimiento,
    cargarMovimientos
  };
};
