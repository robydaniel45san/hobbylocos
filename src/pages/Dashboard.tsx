
import React from 'react';
import { FileText, Package, ShoppingCart, RefreshCw } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { VentasChart } from '@/components/dashboard/VentasChart';
import { TopProductos } from '@/components/dashboard/TopProductos';
import { VentasPorEstado } from '@/components/dashboard/VentasPorEstado';
import { RussianRuble } from 'lucide-react';
import { useDashboard } from '@/hooks/useDashboard';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { 
    loading, 
    stats, 
    ventasPorMes, 
    ventasPorEstado, 
    productosMasVendidos, 
    refetch 
  } = useDashboard();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Cargando datos del sistema...</p>
          </div>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen de ventas de productos anime - Mayorista y Minorista
          </p>
        </div>
        <Button 
          onClick={refetch} 
          variant="outline" 
          size="sm"
          className="glass-effect hover:bg-white/10"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ventas Totales" 
          value={`Bs ${stats.ventasTotales.toFixed(0)}`}
          trend={{ value: Math.abs(stats.crecimientoVentas), isPositive: stats.crecimientoVentas > 0 }}
          icon={<RussianRuble className="h-5 w-5 text-app-blue" />}
        />
        <StatCard 
          title="Ventas Realizadas" 
          value={stats.ventasRealizadas.toString()} 
          description={`${stats.pedidosPendientes} pendientes`}
          icon={<FileText className="h-5 w-5 text-status-realizado" />}
        />
        <StatCard 
          title="Productos Activos" 
          value={stats.totalProductos.toString()} 
          description={stats.productosStockBajo > 0 ? `${stats.productosStockBajo} con stock bajo` : "Stock saludable"}
          icon={<Package className="h-5 w-5 text-app-gray" />}
        />
        <StatCard 
          title="Pedidos Pendientes" 
          value={stats.pedidosPendientes.toString()} 
          description="En espera y reserva"
          icon={<ShoppingCart className="h-5 w-5 text-status-reserva" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <VentasChart data={ventasPorMes} />
        <VentasPorEstado datos={ventasPorEstado} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <TopProductos productos={productosMasVendidos} />
        <div className="md:col-span-2 glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Análisis Rápido</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Productos con stock bajo:</span>
              <span className="font-medium">{stats.productosStockBajo}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Tasa de conversión:</span>
              <span className="font-medium">
                {stats.ventasRealizadas > 0 && (stats.ventasRealizadas + stats.pedidosPendientes) > 0
                  ? `${((stats.ventasRealizadas / (stats.ventasRealizadas + stats.pedidosPendientes)) * 100).toFixed(1)}%`
                  : 'N/A'
                }
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Promedio por venta:</span>
              <span className="font-medium">
                Bs {stats.ventasRealizadas > 0 ? (stats.ventasTotales / stats.ventasRealizadas).toFixed(2) : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
