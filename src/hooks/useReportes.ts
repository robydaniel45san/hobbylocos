
import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { VentasPorMes, VentasPorEstado, ProductoMasVendido } from '@/types';

export interface ReporteVentas {
  totalVentas: number;
  totalIngresos: number;
  ventasRealizadas: number;
  ventasPendientes: number;
  promedioVentaDiaria: number;
  crecimientoMensual: number;
}

export interface ReporteProductos {
  totalProductos: number;
  stockTotal: number;
  productosActivos: number;
  productosBajoStock: number;
  valorInventario: number;
}

export const useReportes = () => {
  const [loading, setLoading] = useState(false);

  // Generar reporte de ventas por período
  const generarReporteVentas = useCallback(async (fechaInicio: string, fechaFin: string): Promise<ReporteVentas | null> => {
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data: ventas, error } = await supabase
        .from("ventas")
        .select("*")
        .gte("fecha", fechaInicio)
        .lte("fecha", fechaFin);

      if (error) throw error;

      if (!ventas) return null;

      const totalVentas = ventas.length;
      const totalIngresos = ventas.reduce((sum, v) => sum + Number(v.total), 0);
      const ventasRealizadas = ventas.filter(v => v.estado === 'realizado').length;
      const ventasPendientes = ventas.filter(v => v.estado !== 'realizado').length;
      
      const diasPeriodo = Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24));
      const promedioVentaDiaria = totalVentas / diasPeriodo;

      // Calcular crecimiento mensual (simulado)
      const crecimientoMensual = Math.random() * 20 - 10; // Placeholder

      return {
        totalVentas,
        totalIngresos,
        ventasRealizadas,
        ventasPendientes,
        promedioVentaDiaria,
        crecimientoMensual
      };
    } catch (error) {
      console.error('Error generando reporte de ventas:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el reporte de ventas",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Generar reporte de productos
  const generarReporteProductos = useCallback(async (): Promise<ReporteProductos | null> => {
    setLoading(true);
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data: productos, error } = await supabase
        .from("productos")
        .select("*");

      if (error) throw error;

      if (!productos) return null;

      const totalProductos = productos.length;
      const stockTotal = productos.reduce((sum, p) => sum + p.stock, 0);
      const productosActivos = productos.filter(p => p.activo).length;
      const productosBajoStock = productos.filter(p => p.stock <= 5 && p.activo).length;
      const valorInventario = productos.reduce((sum, p) => sum + (p.stock * Number(p.precio_minorista)), 0);

      return {
        totalProductos,
        stockTotal,
        productosActivos,
        productosBajoStock,
        valorInventario
      };
    } catch (error) {
      console.error('Error generando reporte de productos:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el reporte de productos",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener productos más vendidos
  const obtenerProductosMasVendidos = useCallback(async (limite: number = 10): Promise<ProductoMasVendido[]> => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      const { data, error } = await supabase
        .from("detalles_venta")
        .select(`
          cantidad,
          precio_unitario,
          subtotal,
          producto:productos(id, nombre)
        `);

      if (error) throw error;

      if (!data) return [];

      // Agrupar por producto
      const productosVendidos = data.reduce((acc: any, detalle: any) => {
        if (detalle.producto) {
          const id = detalle.producto.id;
          if (!acc[id]) {
            acc[id] = {
              id,
              nombre: detalle.producto.nombre,
              cantidad: 0,
              total: 0
            };
          }
          acc[id].cantidad += detalle.cantidad;
          acc[id].total += Number(detalle.subtotal);
        }
        return acc;
      }, {});

      return Object.values(productosVendidos)
        .sort((a: any, b: any) => b.cantidad - a.cantidad)
        .slice(0, limite) as ProductoMasVendido[];
    } catch (error) {
      console.error('Error obteniendo productos más vendidos:', error);
      return [];
    }
  }, []);

  // Exportar datos a CSV (simulado)
  const exportarCSV = useCallback((datos: any[], nombre: string) => {
    try {
      const csv = convertirACSV(datos);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${nombre}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Éxito",
        description: `Reporte ${nombre} exportado correctamente`,
      });
    } catch (error) {
      console.error('Error exportando CSV:', error);
      toast({
        title: "Error",
        description: "No se pudo exportar el archivo",
        variant: "destructive",
      });
    }
  }, []);

  const convertirACSV = (datos: any[]): string => {
    if (datos.length === 0) return '';
    
    const headers = Object.keys(datos[0]).join(',');
    const rows = datos.map(obj => 
      Object.values(obj).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    ).join('\n');
    
    return `${headers}\n${rows}`;
  };

  return {
    loading,
    generarReporteVentas,
    generarReporteProductos,
    obtenerProductosMasVendidos,
    exportarCSV
  };
};
