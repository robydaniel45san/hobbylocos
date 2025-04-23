
import React from "react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Envio, EstadoEnvio } from "@/types";

interface EnviosTableProps {
  envios: Envio[];
  formatearFecha: (fecha: string | null) => string;
  renderEstadoBadge: (estado: EstadoEnvio) => React.ReactNode;
}

export const EnviosTable: React.FC<EnviosTableProps> = ({
  envios,
  formatearFecha,
  renderEstadoBadge
}) => (
  <div className="rounded-md border">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Venta</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Empresa</TableHead>
          <TableHead>Fecha Envío</TableHead>
          <TableHead>Costo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {envios.length > 0 ? (
          envios.map((envio) => (
            <TableRow key={envio.id}>
              <TableCell className="font-medium">#{envio.venta_id.substring(0, 8)}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>
                    {[envio.provincia, envio.departamento].filter(Boolean).join(', ')}
                  </span>
                </div>
              </TableCell>
              <TableCell>{envio.empresa_envio || '-'}</TableCell>
              <TableCell>{formatearFecha(envio.fecha_envio)}</TableCell>
              <TableCell>${envio.costo?.toFixed(2) || '-'}</TableCell>
              <TableCell>{renderEstadoBadge(envio.estado)}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost">
                  Actualizar
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={7} className="h-24 text-center">
              No se encontraron envíos
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
);
