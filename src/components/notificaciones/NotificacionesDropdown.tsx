
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Eye, Trash2, CheckCheck } from 'lucide-react';
import { useNotificaciones } from '@/hooks/useNotificaciones';
import { ScrollArea } from '@/components/ui/scroll-area';

export function NotificacionesDropdown() {
  const { 
    notificaciones, 
    noLeidas, 
    marcarComoLeida, 
    marcarTodasComoLeidas, 
    eliminarNotificacion 
  } = useNotificaciones();

  const getIconoTipo = (tipo: string) => {
    switch (tipo) {
      case 'stock_bajo':
        return '📦';
      case 'nueva_venta':
        return '💰';
      case 'envio_pendiente':
        return '🚚';
      default:
        return '📢';
    }
  };

  const formatearFecha = (fecha: Date) => {
    return new Intl.DateTimeFormat('es-BO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(fecha);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {noLeidas > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {noLeidas > 99 ? '99+' : noLeidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificaciones</span>
          {noLeidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={marcarTodasComoLeidas}
              className="h-6 px-2 text-xs"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Marcar todas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notificaciones.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            No hay notificaciones
          </div>
        ) : (
          <ScrollArea className="h-64">
            {notificaciones.slice(0, 10).map((notificacion) => (
              <DropdownMenuItem 
                key={notificacion.id} 
                className={`flex flex-col items-start p-3 cursor-pointer ${
                  !notificacion.leida ? 'bg-muted/50' : ''
                }`}
                onClick={() => !notificacion.leida && marcarComoLeida(notificacion.id)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="text-lg">{getIconoTipo(notificacion.tipo)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-sm">{notificacion.titulo}</p>
                        {!notificacion.leida && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 break-words">
                        {notificacion.mensaje}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatearFecha(notificacion.fecha)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {!notificacion.leida && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          marcarComoLeida(notificacion.id);
                        }}
                        className="h-6 w-6 p-0"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        eliminarNotificacion(notificacion.id);
                      }}
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
