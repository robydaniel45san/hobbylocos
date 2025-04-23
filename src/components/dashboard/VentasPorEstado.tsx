
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VentasPorEstado as VentasPorEstadoType } from '@/types';
import { cn } from '@/lib/utils';

interface VentasPorEstadoProps {
  datos: VentasPorEstadoType[];
}

export function VentasPorEstado({ datos }: VentasPorEstadoProps) {
  const total = datos.reduce((sum, item) => sum + item.total, 0);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Ventas por Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {datos.map((item) => {
            const porcentaje = total > 0 ? (item.total / total) * 100 : 0;
            
            return (
              <div key={item.estado} className="space-y-2">
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-3 h-3 rounded-full',
                      item.estado === 'reserva' && 'bg-status-reserva',
                      item.estado === 'espera' && 'bg-status-espera',
                      item.estado === 'realizado' && 'bg-status-realizado',
                    )} />
                    <span className="capitalize">{item.estado}</span>
                  </div>
                  <span className="text-sm font-medium">
                    Bs {item.total.toFixed(2)} ({item.cantidad})
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className={cn(
                      'h-full rounded-full',
                      item.estado === 'reserva' && 'bg-status-reserva',
                      item.estado === 'espera' && 'bg-status-espera',
                      item.estado === 'realizado' && 'bg-status-realizado',
                    )}
                    style={{ width: `${porcentaje}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        {datos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No hay datos de ventas disponibles
          </div>
        )}
      </CardContent>
    </Card>
  );
}
