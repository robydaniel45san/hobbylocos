
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ResumenCardsProps {
  estadoFiltro: string;
  setEstadoFiltro: (estado: string) => void;
  totalVentas: number;
  ventasRealizadas: number;
  ventasEspera: number;
  ventasReserva: number;
}

export const VentasResumenCards: React.FC<ResumenCardsProps> = ({
  estadoFiltro,
  setEstadoFiltro,
  totalVentas,
  ventasRealizadas,
  ventasEspera,
  ventasReserva
}) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    <Card 
      className={cn(
        "border-l-4 border-l-app-blue cursor-pointer transition-all hover:shadow-md", 
        estadoFiltro === 'todos' ? "bg-blue-50" : ""
      )}
      onClick={() => setEstadoFiltro('todos')}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Total Ventas</p>
          <p className="font-bold text-lg">{totalVentas}</p>
        </div>
        <div className="bg-app-blue rounded-full p-2">
          <FileText className="h-5 w-5 text-white" />
        </div>
      </CardContent>
    </Card>
    <Card 
      className={cn(
        "border-l-4 border-l-status-realizado cursor-pointer transition-all hover:shadow-md",
        estadoFiltro === 'realizado' ? "bg-green-50" : ""
      )}
      onClick={() => setEstadoFiltro('realizado')}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Realizadas</p>
          <p className="font-bold text-lg">{ventasRealizadas}</p>
        </div>
        <div className="bg-status-realizado rounded-full p-2">
          <FileText className="h-5 w-5 text-white" />
        </div>
      </CardContent>
    </Card>
    <Card 
      className={cn(
        "border-l-4 border-l-status-espera cursor-pointer transition-all hover:shadow-md",
        estadoFiltro === 'espera' ? "bg-blue-50" : ""
      )}
      onClick={() => setEstadoFiltro('espera')}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">En Espera</p>
          <p className="font-bold text-lg">{ventasEspera}</p>
        </div>
        <div className="bg-status-espera rounded-full p-2">
          <FileText className="h-5 w-5 text-white" />
        </div>
      </CardContent>
    </Card>
    <Card 
      className={cn(
        "border-l-4 border-l-status-reserva cursor-pointer transition-all hover:shadow-md",
        estadoFiltro === 'reserva' ? "bg-yellow-50" : ""
      )}
      onClick={() => setEstadoFiltro('reserva')}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Reservadas</p>
          <p className="font-bold text-lg">{ventasReserva}</p>
        </div>
        <div className="bg-status-reserva rounded-full p-2">
          <FileText className="h-5 w-5 text-white" />
        </div>
      </CardContent>
    </Card>
  </div>
);
