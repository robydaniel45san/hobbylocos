
import { useState, useEffect, useCallback } from 'react';
import { Producto } from '@/types';
import { toast } from '@/hooks/use-toast';

export interface Notificacion {
  id: string;
  tipo: 'stock_bajo' | 'nueva_venta' | 'envio_pendiente';
  titulo: string;
  mensaje: string;
  fecha: Date;
  leida: boolean;
  link?: string;
}

export const useNotificaciones = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [noLeidas, setNoLeidas] = useState(0);

  // Verificar stock bajo
  const verificarStockBajo = useCallback(async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data: productos } = await supabase
        .from("productos")
        .select("*")
        .lte("stock", 5)
        .eq("activo", true);

      if (productos && productos.length > 0) {
        productos.forEach((producto: Producto) => {
          const notificacionExiste = notificaciones.some(
            n => n.tipo === 'stock_bajo' && n.mensaje.includes(producto.nombre)
          );

          if (!notificacionExiste) {
            const nuevaNotificacion: Notificacion = {
              id: `stock-${producto.id}`,
              tipo: 'stock_bajo',
              titulo: 'Stock Bajo',
              mensaje: `El producto "${producto.nombre}" tiene solo ${producto.stock} unidades`,
              fecha: new Date(),
              leida: false,
              link: '/productos'
            };

            setNotificaciones(prev => [nuevaNotificacion, ...prev]);
            
            if (producto.stock <= 2) {
              toast({
                title: "⚠️ Stock Crítico",
                description: `${producto.nombre} tiene solo ${producto.stock} unidades`,
                variant: "destructive",
              });
            }
          }
        });
      }
    } catch (error) {
      console.error('Error verificando stock:', error);
    }
  }, [notificaciones]);

  // Marcar notificación como leída
  const marcarComoLeida = useCallback((id: string) => {
    setNotificaciones(prev => 
      prev.map(n => n.id === id ? { ...n, leida: true } : n)
    );
  }, []);

  // Marcar todas como leídas
  const marcarTodasComoLeidas = useCallback(() => {
    setNotificaciones(prev => 
      prev.map(n => ({ ...n, leida: true }))
    );
  }, []);

  // Eliminar notificación
  const eliminarNotificacion = useCallback((id: string) => {
    setNotificaciones(prev => prev.filter(n => n.id !== id));
  }, []);

  useEffect(() => {
    verificarStockBajo();
    
    // Verificar cada 5 minutos
    const interval = setInterval(verificarStockBajo, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [verificarStockBajo]);

  useEffect(() => {
    setNoLeidas(notificaciones.filter(n => !n.leida).length);
  }, [notificaciones]);

  return {
    notificaciones,
    noLeidas,
    marcarComoLeida,
    marcarTodasComoLeidas,
    eliminarNotificacion,
    verificarStockBajo
  };
};
