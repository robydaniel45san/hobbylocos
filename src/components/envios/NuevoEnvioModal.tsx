
import React, { useState } from "react";
import {
  Dialog,
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { departamentos, provinciasPorDepartamento } from "./ubicacionesBolivia";

interface NuevoEnvioModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onEnvioCreado?: () => void;
}

export const NuevoEnvioModal: React.FC<NuevoEnvioModalProps> = ({
  open,
  setOpen,
  onEnvioCreado,
}) => {
  // Estados
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [empresaEnvio, setEmpresaEnvio] = useState("");
  const [costo, setCosto] = useState("");
  const [fechaEnvio, setFechaEnvio] = useState("");
  const [estado, setEstado] = useState<"pendiente" | "enviado" | "entregado">("pendiente");
  const [ventaId, setVentaId] = useState("");
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!departamento || !provincia || !empresaEnvio || !ventaId) {
      toast({
        title: "Campos incompletos",
        description: "Completa todos los campos obligatorios",
        variant: "destructive",
      });
      return;
    }
    setGuardando(true);
    const { error } = await supabase.from("envios").insert([{
      venta_id: ventaId,
      departamento,
      provincia,
      empresa_envio: empresaEnvio,
      costo: costo ? Number(costo) : null,
      estado,
      fecha_envio: fechaEnvio || null,
    }]);
    setGuardando(false);
    if (error) {
      toast({ title: "No se pudo crear el envío", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Envío creado exitosamente", variant: "success" });
      setOpen(false);
      if (onEnvioCreado) onEnvioCreado();
      // Reset form
      setDepartamento("");
      setProvincia("");
      setEmpresaEnvio("");
      setCosto("");
      setFechaEnvio("");
      setEstado("pendiente");
      setVentaId("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo Envío</DialogTitle>
          <DialogDescription>Completa la información para registrar un nuevo envío.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <Label htmlFor="ventaId">ID de Venta</Label>
            <Input
              id="ventaId"
              value={ventaId}
              onChange={e => setVentaId(e.target.value)}
              placeholder="ID de venta relacionado"
              required
            />
          </div>
          <div>
            <Label htmlFor="departamento">Departamento</Label>
            <select
              id="departamento"
              className="w-full border rounded px-3 py-2 bg-white"
              value={departamento}
              onChange={e => {
                setDepartamento(e.target.value);
                setProvincia("");
              }}
              required
            >
              <option value="">Seleccione departamento</option>
              {departamentos.map(dep => (
                <option key={dep} value={dep}>{dep}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="provincia">Provincia</Label>
            <select
              id="provincia"
              className="w-full border rounded px-3 py-2 bg-white"
              value={provincia}
              onChange={e => setProvincia(e.target.value)}
              required
              disabled={!departamento}
            >
              <option value="">Seleccione provincia</option>
              {departamento && provinciasPorDepartamento[departamento]?.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="empresaEnvio">Empresa de Envío</Label>
            <Input
              id="empresaEnvio"
              value={empresaEnvio}
              onChange={e => setEmpresaEnvio(e.target.value)}
              placeholder="Ejemplo: COTEMBOL"
              required
            />
          </div>
          <div>
            <Label htmlFor="costo">Costo (Bs)</Label>
            <Input
              id="costo"
              value={costo}
              onChange={e => setCosto(e.target.value)}
              type="number"
              min="0"
              placeholder="Ej. 20"
            />
          </div>
          <div>
            <Label htmlFor="fechaEnvio">Fecha de Envío</Label>
            <Input
              id="fechaEnvio"
              value={fechaEnvio}
              onChange={e => setFechaEnvio(e.target.value)}
              type="date"
            />
          </div>
          <div>
            <Label htmlFor="estado">Estado</Label>
            <select
              id="estado"
              className="w-full border rounded px-3 py-2 bg-white"
              value={estado}
              onChange={e => setEstado(e.target.value as any)}
            >
              <option value="pendiente">Pendiente</option>
              <option value="enviado">Enviado</option>
              <option value="entregado">Entregado</option>
            </select>
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={guardando}>Cancelar</Button>
            </DialogClose>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar Envío"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
