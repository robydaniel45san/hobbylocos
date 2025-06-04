
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotificaciones } from '@/hooks/useNotificaciones';
import { Bell, Package, ShoppingCart, Truck, CheckCircle, X, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export function NotificacionesPanel() {
  const { 
    notificaciones, 
    noLeidas, 
    marcarComoLeida, 
    marcarTodasComoLeidas, 
    eliminarNotificacion 
  } = useNotificaciones();

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'stock_bajo':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'nueva_venta':
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case 'envio_pendiente':
        return <Truck className="h-4 w-4 text-blue-500" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'stock_bajo':
        return 'bg-orange-500/15 text-orange-700 border-orange-200';
      case 'nueva_venta':
        return 'bg-green-500/15 text-green-700 border-green-200';
      case 'envio_pendiente':
        return 'bg-blue-500/15 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-500/15 text-gray-700 border-gray-200';
    }
  };

  return (
    <Card className="glass-card border-white/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notificaciones
            {noLeidas > 0 && (
              <Badge variant="destructive" className="ml-2">
                {noLeidas}
              </Badge>
            )}
          </CardTitle>
          {noLeidas > 0 && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={marcarTodasComoLeidas}
              className="glass-effect"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Marcar todas
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {notificaciones.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No hay notificaciones</p>
              </div>
            ) : (
              notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`p-3 rounded-lg border transition-all hover:bg-white/5 ${
                    notificacion.leida 
                      ? 'border-white/10 opacity-60' 
                      : 'border-purple-200 bg-purple-500/5'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="mt-1">
                        {getIcon(notificacion.tipo)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">
                            {notificacion.titulo}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={getBadgeColor(notificacion.tipo)}
                          >
                            {notificacion.tipo.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {notificacion.mensaje}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notificacion.fecha, { 
                            addSuffix: true, 
                            locale: es 
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!notificacion.leida && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => marcarComoLeida(notificacion.id)}
                          className="h-8 w-8 p-0 hover:bg-blue-500/10"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => eliminarNotificacion(notificacion.id)}
                        className="h-8 w-8 p-0 hover:bg-red-500/10"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
