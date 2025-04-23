
import React from 'react';
import { FileText, Package, ShoppingCart } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { VentasChart } from '@/components/dashboard/VentasChart';
import { TopProductos } from '@/components/dashboard/TopProductos';
import { VentasPorEstado } from '@/components/dashboard/VentasPorEstado';
import { ProductoMasVendido, VentasPorEstado as VentasPorEstadoType, VentasPorMes } from '@/types';
import { RussianRuble } from 'lucide-react';

// Datos de ejemplo actualizados para el dashboard de tienda de anime
const ventasPorMes: VentasPorMes[] = [
  { mes: 'Ene', total: 8200 },  // Valores en Bs
  { mes: 'Feb', total: 7500 },
  { mes: 'Mar', total: 9800 },
  { mes: 'Abr', total: 8700 },
  { mes: 'May', total: 10500 },
  { mes: 'Jun', total: 9200 },
];

const ventasPorEstado: VentasPorEstadoType[] = [
  { estado: 'realizado', total: 28500, cantidad: 82 },
  { estado: 'espera', total: 9700, cantidad: 25 },
  { estado: 'reserva', total: 5800, cantidad: 18 },
];

const productosMasVendidos: ProductoMasVendido[] = [
  { id: '1', nombre: 'Figura Naruto Uzumaki - 20cm', cantidad: 48, total: 6240 },
  { id: '2', nombre: 'Katana decorativa - Kimetsu no Yaiba', cantidad: 18, total: 4860 },
  { id: '3', nombre: 'Mochila Pokémon Eevee', cantidad: 32, total: 3520 },
  { id: '4', nombre: 'Llavero Akatsuki', cantidad: 95, total: 1900 },
  { id: '5', nombre: 'Figura Goku Super Saiyan - 18cm', cantidad: 25, total: 3125 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Resumen de ventas de productos anime - Mayorista y Minorista
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Ventas Totales" 
          value="Bs 44,000"
          trend={{ value: 15, isPositive: true }}
          icon={<RussianRuble className="h-5 w-5 text-app-blue" />}
        />
        <StatCard 
          title="Ventas Realizadas" 
          value="125" 
          trend={{ value: 10, isPositive: true }}
          icon={<FileText className="h-5 w-5 text-status-realizado" />}
        />
        <StatCard 
          title="Productos" 
          value="186" 
          description="8 con stock bajo"
          icon={<Package className="h-5 w-5 text-app-gray" />}
        />
        <StatCard 
          title="Pedidos Pendientes" 
          value="43" 
          trend={{ value: 8, isPositive: false }}
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
