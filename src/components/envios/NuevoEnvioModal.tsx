
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Venta, EstadoEnvio } from "@/types";
import { ubicacionesBolivia } from "./ubicacionesBolivia";

interface NuevoEnvioModalProps {
  onNuevoEnvio: (envio: {
    venta_id: string;
    departamento?: string;
    provincia?: string;
    empresa_envio?: string;
    costo?: number;
    estado: EstadoEnvio;
  }) => Promise<boolean>;
}

export const NuevoEnvioModal: React.FC<NuevoEnvioModalProps> = ({
  onNuevoEnvio,
}) => {
  const [open, setOpen] = useState(false);
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [ventaId, setVentaId] = useState<string>("");
  const [departamento, setDepartamento] = useState<string>("");
  const [provincia, setProvincia] = useState<string>("");
  const [empresaEnvio, setEmpresaEnvio] = useState<string>("");
  const [costo, setCosto] = useState<string>("");
  const [estado, setEstado] = useState<EstadoEnvio>("pendiente");
  const [guardando, setGuardando] = useState(false);

  // Cargar ventas que no tienen envío al abrir el modal
  useEffect(() => {
    if (open) {
      cargarVentasSinEnvio();
    }
  }, [open]);

  const cargarVentasSinEnvio = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      
      // Primero obtenemos todas las ventas
      const { data: ventasData, error: ventasError } = await supabase
        .from("ventas")
        .select(`
          *,
          cliente:clientes(*)
        `)
        .order("created_at", { ascending: false });

      if (ventasError) {
        console.error("Error al cargar ventas:", ventasError);
        return;
      }

      // Luego obtenemos todos los envíos existentes
      const { data: enviosData, error: enviosError } = await supabase
        .from("envios")
        .select("venta_id");

      if (enviosError) {
        console.error("Error al cargar envíos:", enviosError);
        return;
      }

      // Filtrar ventas que no tienen envío
      const ventasConEnvio = new Set(enviosData?.map(e => e.venta_id) || []);
      const ventasSinEnvio = ventasData?.filter(v => !ventasConEnvio.has(v.id)) || [];
      
      setVentas(ventasSinEnvio);
    } catch (err) {
      console.error("Error al cargar ventas sin envío:", err);
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ventaId.trim()) {
      return;
    }

    setGuardando(true);
    const success = await onNuevoEnvio({
      venta_id: ventaId,
      departamento: departamento || undefined,
      provincia: provincia || undefined,
      empresa_envio: empresaEnvio || undefined,
      costo: costo ? Number(costo) : undefined,
      estado,
    });

    setGuardando(false);
    if (success) {
      setOpen(false);
      // Reset form
      setVentaId("");
      setDepartamento("");
      setProvincia("");
      setEmpresaEnvio("");
      setCosto("");
      setEstado("pendiente");
    }
  };

  const provinciasDelDepartamento = departamento 
    ? ubicacionesBolivia.find(d => d.departamento === departamento)?.provincias || []
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Nuevo Envío
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Nuevo Envío</DialogTitle>
          <DialogDescription>
            Registra un nuevo envío para una venta existente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <Label htmlFor="venta">Venta *</Label>
            <Select value={ventaId} onValueChange={setVentaId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar venta" />
              </SelectTrigger>
              <SelectContent>
                {ventas.map((venta) => (
                  <SelectItem key={venta.id} value={venta.id}>
                    #{venta.id.substring(0, 8)} - {venta.cliente?.nombre_completo || 'Sin cliente'} - Bs {venta.total}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="departamento">Departamento</Label>
              <Select value={departamento} onValueChange={(value) => {
                setDepartamento(value);
                setProvincia(""); // Reset provincia when departamento changes
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {ubicacionesBolivia.map((ubicacion) => (
                    <SelectItem key={ubicacion.departamento} value={ubicacion.departamento}>
                      {ubicacion.departamento}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="provincia">Provincia</Label>
              <Select value={provincia} onValueChange={setProvincia} disabled={!departamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {provinciasDelDepartamento.map((prov) => (
                    <SelectItem key={prov} value={prov}>
                      {prov}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="empresa">Empresa de Envío</Label>
            <Input
              id="empresa"
              value={empresaEnvio}
              onChange={e => setEmpresaEnvio(e.target.value)}
              placeholder="Ej. Viva, DHL, Expreso"
            />
          </div>

          <div>
            <Label htmlFor="costo">Costo de Envío (Bs)</Label>
            <Input
              id="costo"
              type="number"
              step="0.01"
              min="0"
              value={costo}
              onChange={e => setCosto(e.target.value)}
              placeholder="Ej. 25.00"
            />
          </div>

          <div>
            <Label htmlFor="estado">Estado *</Label>
            <Select value={estado} onValueChange={(value: EstadoEnvio) => setEstado(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="enviado">Enviado</SelectItem>
                <SelectItem value="entregado">Entregado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={guardando}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={guardando || !ventaId}>
              {guardando ? "Guardando..." : "Crear Envío"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
