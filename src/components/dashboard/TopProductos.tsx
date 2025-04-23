
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductoMasVendido } from '@/types';

interface TopProductosProps {
  productos: ProductoMasVendido[];
}

export function TopProductos({ productos }: TopProductosProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Productos Más Vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {productos.map((producto, index) => (
            <div key={producto.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded-full mr-3">
                  <span className="font-medium">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium">{producto.nombre}</p>
                  <p className="text-sm text-muted-foreground">Vendidos: {producto.cantidad}</p>
                </div>
              </div>
              <Badge variant="secondary">${producto.total.toFixed(2)}</Badge>
            </div>
          ))}
        </div>
        {productos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No hay datos de ventas disponibles
          </div>
        )}
      </CardContent>
    </Card>
  );
}
