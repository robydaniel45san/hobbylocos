
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
import { Cliente, EstadoVenta } from "@/types";

interface NuevaVentaModalProps {
  onNuevaVenta: (venta: {
    cliente_id: string | null;
    total: number;
    estado: EstadoVenta;
  }) => Promise<boolean>;
}

export const NuevaVentaModal: React.FC<NuevaVentaModalProps> = ({
  onNuevaVenta,
}) => {
  const [open, setOpen] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteId, setClienteId] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [estado, setEstado] = useState<EstadoVenta>("reserva");
  const [guardando, setGuardando] = useState(false);

  // Cargar clientes al abrir el modal
  useEffect(() => {
    if (open) {
      cargarClientes();
    }
  }, [open]);

  const cargarClientes = async () => {
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("clientes")
        .select("*")
        .order("nombre_completo", { ascending: true });

      if (error) {
        console.error("Error al cargar clientes:", error);
      } else if (data) {
        setClientes(data);
      }
    } catch (err) {
      console.error("Error al cargar clientes:", err);
    }
  };

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!total.trim() || isNaN(Number(total)) || Number(total) <= 0) {
      return;
    }

    setGuardando(true);
    const success = await onNuevaVenta({
      cliente_id: clienteId || null,
      total: Number(total),
      estado,
    });

    setGuardando(false);
    if (success) {
      setOpen(false);
      // Reset form
      setClienteId("");
      setTotal("");
      setEstado("reserva");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Nueva Venta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva Venta</DialogTitle>
          <DialogDescription>
            Registra una nueva venta en el sistema.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <Label htmlFor="cliente">Cliente (Opcional)</Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar cliente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Sin cliente específico</SelectItem>
                {clientes.map((cliente) => (
                  <SelectItem key={cliente.id} value={cliente.id}>
                    {cliente.nombre_completo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="total">Total (Bs) *</Label>
            <Input
              id="total"
              type="number"
              step="0.01"
              min="0"
              value={total}
              onChange={e => setTotal(e.target.value)}
              placeholder="Ej. 150.50"
              required
            />
          </div>

          <div>
            <Label htmlFor="estado">Estado *</Label>
            <Select value={estado} onValueChange={(value: EstadoVenta) => setEstado(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reserva">Reserva</SelectItem>
                <SelectItem value="espera">En Espera</SelectItem>
                <SelectItem value="realizado">Realizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={guardando}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Crear Venta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
