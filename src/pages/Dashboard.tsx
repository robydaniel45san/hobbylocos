import React from 'react';
import { FileText, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { VentasChart } from '@/components/dashboard/VentasChart';
import { TopProductos } from '@/components/dashboard/TopProductos';
import { VentasPorEstado } from '@/components/dashboard/VentasPorEstado';
import { ProductoMasVendido, VentasPorEstado as VentasPorEstadoType, VentasPorMes } from '@/types';
import { RussianRuble } from 'lucide-react';

// Datos de ejemplo para el dashboard
const ventasPorMes: VentasPorMes[] = [
  { mes: 'Ene', total: 4200 },  // Valores en Bs
  { mes: 'Feb', total: 3800 },
  { mes: 'Mar', total: 5100 },
  { mes: 'Abr', total: 4800 },
  { mes: 'May', total: 6200 },
  { mes: 'Jun', total: 5700 },
];

const ventasPorEstado: VentasPorEstadoType[] = [
  { estado: 'realizado', total: 24500, cantidad: 78 },
  { estado: 'espera', total: 8700, cantidad: 23 },
  { estado: 'reserva', total: 5300, cantidad: 14 },
];

const productosMasVendidos: ProductoMasVendido[] = [
  { id: '1', nombre: 'Smartphone Galaxy S21', cantidad: 42, total: 32900 },
  { id: '2', nombre: 'Laptop HP Pavilion', cantidad: 28, total: 28200 },
  { id: '3', nombre: 'Auriculares Sony WH-1000XM4', cantidad: 35, total: 12600 },
  { id: '4', nombre: 'Tablet iPad Pro', cantidad: 21, total: 21000 },
  { id: '5', nombre: 'Monitor LG 27"', cantidad: 19, total: 9500 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de ventas y estado del negocio
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ventas Totales" 
          value="Bs 38,500"  // Cambiar a Bs 
          trend={{ value: 12, isPositive: true }}
          icon={<RussianRuble className="h-5 w-5 text-app-blue" />}
        />
        <StatCard 
          title="Ventas Realizadas" 
          value="115" 
          trend={{ value: 8, isPositive: true }}
          icon={<FileText className="h-5 w-5 text-status-realizado" />}
        />
        <StatCard 
          title="Productos" 
          value="248" 
          description="12 con stock bajo"
          icon={<Package className="h-5 w-5 text-app-gray" />}
        />
        <StatCard 
          title="Pedidos Pendientes" 
          value="23" 
          trend={{ value: 5, isPositive: false }}
          icon={<ShoppingCart className="h-5 w-5 text-status-reserva" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <VentasChart data={ventasPorMes} />
        <VentasPorEstado datos={ventasPorEstado} />
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <TopProductos productos={productosMasVendidos} />
        <div className="md:col-span-2">
          {/* Espacio para componentes adicionales */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
