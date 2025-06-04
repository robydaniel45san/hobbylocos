
import { useState, useCallback, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { VentasPorMes, VentasPorEstado, ProductoMasVendido } from '@/types';

export interface DashboardStats {
  ventasTotales: number;
  ventasRealizadas: number;
  totalProductos: number;
  pedidosPendientes: number;
  crecimientoVentas: number;
  productosStockBajo: number;
}

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    ventasTotales: 0,
    ventasRealizadas: 0,
    totalProductos: 0,
    pedidosPendientes: 0,
    crecimientoVentas: 0,
    productosStockBajo: 0
  });
  const [ventasPorMes, setVentasPorMes] = useState<VentasPorMes[]>([]);
  const [ventasPorEstado, setVentasPorEstado] = useState<VentasPorEstado[]>([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([]);

  // Obtener estadísticas generales
  const fetchStats = useCallback(async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Obtener total de ventas
      const { data: ventas, error: ventasError } = await supabase
        .from("ventas")
        .select("total, estado");

      if (ventasError) throw ventasError;

      // Obtener productos
      const { data: productos, error: productosError } = await supabase
        .from("productos")
        .select("stock, activo");

      if (productosError) throw productosError;

      // Calcular estadísticas
      const ventasTotales = ventas?.reduce((sum, v) => sum + Number(v.total), 0) || 0;
      const ventasRealizadas = ventas?.filter(v => v.estado === 'realizado').length || 0;
      const totalProductos = productos?.filter(p => p.activo).length || 0;
      const pedidosPendientes = ventas?.filter(v => v.estado !== 'realizado').length || 0;
      const productosStockBajo = productos?.filter(p => p.stock <= 5 && p.activo).length || 0;

      // Crecimiento simulado (puedes implementar lógica real)
      const crecimientoVentas = Math.random() * 20 - 10;

      setStats({
        ventasTotales,
        ventasRealizadas,
        totalProductos,
        pedidosPendientes,
        crecimientoVentas,
        productosStockBajo
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      });
    }
  }, []);

  // Obtener ventas por mes
  const fetchVentasPorMes = useCallback(async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase
        .from("ventas")
        .select("fecha, total")
        .gte("fecha", new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString());

      if (error) throw error;

      // Agrupar por mes
      const ventasPorMesMap = new Map<string, number>();
      const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      
      data?.forEach(venta => {
        const fecha = new Date(venta.fecha);
        const mesKey = meses[fecha.getMonth()];
        const current = ventasPorMesMap.get(mesKey) || 0;
        ventasPorMesMap.set(mesKey, current + Number(venta.total));
      });

      const resultado: VentasPorMes[] = [];
      for (let i = 0; i < 6; i++) {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - (5 - i));
        const mes = meses[fecha.getMonth()];
        resultado.push({
          mes,
          total: ventasPorMesMap.get(mes) || 0
        });
      }

      setVentasPorMes(resultado);
    } catch (error) {
      console.error('Error fetching ventas por mes:', error);
    }
  }, []);

  // Obtener ventas por estado
  const fetchVentasPorEstado = useCallback(async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase
        .from("ventas")
        .select("estado, total");

      if (error) throw error;

      // Agrupar por estado
      const estadosMap = new Map<string, { total: number; cantidad: number }>();
      
      data?.forEach(venta => {
        const estado = venta.estado;
        const current = estadosMap.get(estado) || { total: 0, cantidad: 0 };
        estadosMap.set(estado, {
          total: current.total + Number(venta.total),
          cantidad: current.cantidad + 1
        });
      });

      const resultado: VentasPorEstado[] = [];
      ['realizado', 'espera', 'reserva'].forEach(estado => {
        const data = estadosMap.get(estado) || { total: 0, cantidad: 0 };
        resultado.push({
          estado: estado as any,
          total: data.total,
          cantidad: data.cantidad
        });
      });

      setVentasPorEstado(resultado);
    } catch (error) {
      console.error('Error fetching ventas por estado:', error);
    }
  }, []);

  // Obtener productos más vendidos
  const fetchProductosMasVendidos = useCallback(async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase
        .from("detalles_venta")
        .select(`
          cantidad,
          subtotal,
          producto:productos(id, nombre)
        `);

      if (error) throw error;

      // Agrupar por producto
      const productosMap = new Map<string, { nombre: string; cantidad: number; total: number }>();
      
      data?.forEach(detalle => {
        if (detalle.producto) {
          const id = detalle.producto.id;
          const current = productosMap.get(id) || { 
            nombre: detalle.producto.nombre, 
            cantidad: 0, 
            total: 0 
          };
          productosMap.set(id, {
            nombre: current.nombre,
            cantidad: current.cantidad + detalle.cantidad,
            total: current.total + Number(detalle.subtotal)
          });
        }
      });

      const resultado: ProductoMasVendido[] = Array.from(productosMap.entries())
        .map(([id, data]) => ({
          id,
          nombre: data.nombre,
          cantidad: data.cantidad,
          total: data.total
        }))
        .sort((a, b) => b.cantidad - a.cantidad)
        .slice(0, 5);

      setProductosMasVendidos(resultado);
    } catch (error) {
      console.error('Error fetching productos más vendidos:', error);
    }
  }, []);

  // Cargar todos los datos
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchStats(),
        fetchVentasPorMes(),
        fetchVentasPorEstado(),
        fetchProductosMasVendidos()
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchVentasPorMes, fetchVentasPorEstado, fetchProductosMasVendidos]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    loading,
    stats,
    ventasPorMes,
    ventasPorEstado,
    productosMasVendidos,
    refetch: fetchDashboardData
  };
};
