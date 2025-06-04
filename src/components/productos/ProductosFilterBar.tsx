
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Package, AlertTriangle, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Producto } from '@/types';

interface ProductosFilterBarProps {
  filtro: string;
  setFiltro: (filtro: string) => void;
  productos: Producto[];
}

export const ProductosFilterBar: React.FC<ProductosFilterBarProps> = ({ 
  filtro, 
  setFiltro, 
  productos 
}) => {
  const totalProductos = productos.length;
  const stockBajo = productos.filter(p => p.stock <= 5).length;
  const valorTotal = productos.reduce((total, p) => total + (p.precio_mayorista * p.stock), 0);

  return (
    <div className="space-y-6 mb-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos de anime..."
            className="pl-10 w-full border-gray-200 focus:border-purple-500 focus:ring-purple-500/20"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-effect hover-lift border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Productos</p>
                <p className="text-3xl font-bold text-blue-600">{totalProductos}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stock Bajo</p>
                <p className="text-3xl font-bold text-red-600">{stockBajo}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-effect hover-lift border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Valor Inventario</p>
                <p className="text-3xl font-bold text-green-600">Bs. {valorTotal.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
