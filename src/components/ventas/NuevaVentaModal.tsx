
import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface NuevaVentaModalProps {
  onNuevaVenta: (venta: {
    clienteNombre: string;
    montoTotal: string;
  }) => void;
}

export const NuevaVentaModal: React.FC<NuevaVentaModalProps> = ({
  onNuevaVenta,
}) => {
  const [open, setOpen] = useState(false);
  const [clienteNombre, setClienteNombre] = useState("");
  const [montoTotal, setMontoTotal] = useState("");

  // Simula el guardado de la venta (por ahora solo demo)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clienteNombre && montoTotal) {
      onNuevaVenta({ clienteNombre, montoTotal });
      setClienteNombre("");
      setMontoTotal("");
      setOpen(false);
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Venta</DialogTitle>
          <DialogDescription>
            Completa los datos mínimos para agregar una nueva venta.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="clienteNombre">Cliente</Label>
            <Input
              id="clienteNombre"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
              placeholder="Ej. María Quispe Mamani"
              required
            />
          </div>
          <div>
            <Label htmlFor="montoTotal">Monto Total (Bs)</Label>
            <Input
              id="montoTotal"
              type="number"
              min="0"
              step="0.01"
              value={montoTotal}
              onChange={(e) => setMontoTotal(e.target.value)}
              placeholder="Ej. 150.00"
              required
            />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit">Guardar Venta</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
