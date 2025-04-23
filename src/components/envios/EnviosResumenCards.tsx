
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Truck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumenCardsProps {
  estadoFiltro: "todos" | "pendiente" | "enviado" | "entregado";
  setEstadoFiltro: (estado: "todos" | "pendiente" | "enviado" | "entregado") => void;
  totalEnvios: number;
  enviosPendientes: number;
  enviosEnviados: number;
  enviosEntregados: number;
}

export const EnviosResumenCards: React.FC<ResumenCardsProps> = ({
  estadoFiltro,
  setEstadoFiltro,
  totalEnvios,
  enviosPendientes,
  enviosEnviados,
  enviosEntregados
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
          <p className="text-sm text-muted-foreground">Total Envíos</p>
          <p className="font-bold text-lg">{totalEnvios}</p>
        </div>
        <div className="bg-app-blue rounded-full p-2">
          <Truck className="h-5 w-5 text-white" />
        </div>
      </CardContent>
    </Card>
    <Card 
      className={cn(
        "border-l-4 border-l-status-pendiente cursor-pointer transition-all hover:shadow-md",
        estadoFiltro === 'pendiente' ? "bg-orange-50" : ""
      )}
      onClick={() => setEstadoFiltro('pendiente')}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Pendientes</p>
          <p className="font-bold text-lg">{enviosPendientes}</p>
        </div>
        <div className="bg-status-pendiente rounded-full p-2">
          <Truck className="h-5 w-5 text-white" />
        </div>
      </CardContent>
    </Card>
    <Card 
      className={cn(
        "border-l-4 border-l-status-enviado cursor-pointer transition-all hover:shadow-md",
        estadoFiltro === 'enviado' ? "bg-purple-50" : ""
      )}
      onClick={() => setEstadoFiltro('enviado')}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Enviados</p>
          <p className="font-bold text-lg">{enviosEnviados}</p>
        </div>
        <div className="bg-status-enviado rounded-full p-2">
          <Truck className="h-5 w-5 text-white" />
        </div>
      </CardContent>
    </Card>
    <Card 
      className={cn(
        "border-l-4 border-l-status-entregado cursor-pointer transition-all hover:shadow-md",
        estadoFiltro === 'entregado' ? "bg-green-50" : ""
      )}
      onClick={() => setEstadoFiltro('entregado')}
    >
      <CardContent className="p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Entregados</p>
          <p className="font-bold text-lg">{enviosEntregados}</p>
        </div>
        <div className="bg-status-entregado rounded-full p-2">
          <Truck className="h-5 w-5 text-white" />
        </div>
      </CardContent>
    </Card>
  </div>
);
