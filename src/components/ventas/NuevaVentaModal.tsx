
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Cliente } from "@/types";

interface NuevaVentaModalProps {
  onNuevaVenta?: (venta: any) => void; // Callback opcional - solo para refrescar la lista
}

export const NuevaVentaModal: React.FC<NuevaVentaModalProps> = ({
  onNuevaVenta,
}) => {
  const [open, setOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [montoTotal, setMontoTotal] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    // Carga los clientes de Supabase
    const fetchClientes = async () => {
      setLoadingClientes(true);
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nombre_completo", { ascending: true });
      if (error) {
        toast.error("Error al cargar clientes");
      } else if (data) {
        setClientes(data);
      }
      setLoadingClientes(false);
    };
    if (open) fetchClientes();
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteSeleccionado || !montoTotal) {
      toast.error("Completa todos los campos");
      return;
    }
    setGuardando(true);

    // Inserta la nueva venta en Supabase
    const { data, error } = await supabase
      .from("ventas")
      .insert([
        {
          cliente_id: clienteSeleccionado,
          total: Number(montoTotal),
          estado: "reserva",
        },
      ])
      .select("*, cliente:cliente_id(*)")
      .single();

    if (error) {
      toast.error("No se pudo registrar la venta.");
      setGuardando(false);
      return;
    }

    toast.success("¡Venta registrada!");
    if (onNuevaVenta) onNuevaVenta(data);
    setClienteSeleccionado("");
    setMontoTotal("");
    setOpen(false);
    setGuardando(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Nueva Venta
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Venta</DialogTitle>
          <DialogDescription>
            Completa los datos mínimos para agregar una nueva venta.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clienteSelect">Cliente</Label>
            <select
              id="clienteSelect"
              value={clienteSeleccionado}
              onChange={e => setClienteSeleccionado(e.target.value)}
              className="w-full border rounded px-3 py-2 bg-white"
              required
              disabled={loadingClientes}
            >
              <option value="">
                {loadingClientes ? "Cargando clientes..." : "Seleccione un cliente"}
              </option>
              {clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nombre_completo}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="montoTotal">Monto Total (Bs)</Label>
            <Input
              id="montoTotal"
              type="number"
              min="0"
              step="0.01"
              value={montoTotal}
              onChange={e => setMontoTotal(e.target.value)}
              placeholder="Ej. 150.00"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={guardando}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Venta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
