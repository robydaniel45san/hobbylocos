
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductoMasVendido } from '@/types';
import { Package } from 'lucide-react';

interface TopProductosProps {
  productos: ProductoMasVendido[];
}

export function TopProductos({ productos }: TopProductosProps) {
  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <CardTitle className="text-foreground">Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productos.map((producto, index) => (
            <div key={producto.id} className="flex items-center justify-between p-3 rounded-lg glass-effect hover:bg-white/5 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full mr-3">
                  <span className="font-semibold text-sm text-purple-600">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">{producto.nombre}</p>
                  <p className="text-sm text-muted-foreground">Vendidos: {producto.cantidad}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/15 text-green-700 border-green-200">
                Bs {producto.total.toFixed(2)}
              </Badge>
            </div>
          ))}
        </div>
        {productos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No hay datos de ventas disponibles</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
