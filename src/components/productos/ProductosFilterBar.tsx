
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search, Package, AlertTriangle } from 'lucide-react';
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
  return (
    <div className="flex justify-between items-center flex-wrap gap-4">
      <div className="flex items-center relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar productos de anime..."
          className="pl-9 w-full"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4">
        <Card className="border-none shadow-none bg-blue-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-app-blue-light rounded-full p-2">
              <Package className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-app-blue-dark">Total Productos</p>
              <p className="font-bold text-lg">{productos.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-none bg-red-50">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-red-400 rounded-full p-2">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-red-700">Stock Bajo</p>
              <p className="font-bold text-lg">
                {productos.filter(p => p.stock <= 5).length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
