
import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Cliente } from "@/types";
import { departamentos, provinciasPorDepartamento } from "../envios/ubicacionesBolivia";

interface EditarClienteModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  cliente: Cliente | null;
  onClienteActualizado: (id: string, datos: Partial<Cliente>) => Promise<boolean>;
}

export const EditarClienteModal: React.FC<EditarClienteModalProps> = ({
  open,
  setOpen,
  cliente,
  onClienteActualizado,
}) => {
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [celular, setCelular] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [notas, setNotas] = useState("");
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (cliente) {
      setNombreCompleto(cliente.nombre_completo);
      setCelular(cliente.celular || "");
      setCorreo(cliente.correo || "");
      setDireccion(cliente.direccion || "");
      setDepartamento(cliente.departamento || "");
      setProvincia(cliente.provincia || "");
      setNotas(cliente.notas || "");
    }
  }, [cliente]);

  const handleGuardar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !nombreCompleto.trim()) return;

    setGuardando(true);
    const success = await onClienteActualizado(cliente.id, {
      nombre_completo: nombreCompleto.trim(),
      celular: celular.trim() || null,
      correo: correo.trim() || null,
      direccion: direccion.trim() || null,
      departamento: departamento || null,
      provincia: provincia || null,
      notas: notas.trim() || null,
    });

    setGuardando(false);
    if (success) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Cliente</DialogTitle>
          <DialogDescription>
            Modifica la información del cliente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleGuardar} className="space-y-4">
          <div>
            <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
            <Input
              id="nombreCompleto"
              value={nombreCompleto}
              onChange={e => setNombreCompleto(e.target.value)}
              placeholder="Ej. María Quispe Mamani"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="celular">Celular</Label>
              <Input
                id="celular"
                value={celular}
                onChange={e => setCelular(e.target.value)}
                placeholder="Ej. 71234567"
              />
            </div>
            <div>
              <Label htmlFor="correo">Correo</Label>
              <Input
                id="correo"
                value={correo}
                onChange={e => setCorreo(e.target.value)}
                type="email"
                placeholder="Ej. maria@email.com"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              value={direccion}
              onChange={e => setDireccion(e.target.value)}
              placeholder="Ej. Av. 16 de Julio #123"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                disabled={!departamento}
              >
                <option value="">Seleccione provincia</option>
                {departamento && provinciasPorDepartamento[departamento]?.map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="notas">Notas</Label>
            <Textarea
              id="notas"
              value={notas}
              onChange={e => setNotas(e.target.value)}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
          </div>
          <DialogFooter className="pt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={guardando}>
                Cancelar
              </Button>
            </DialogClose>
            <Button type="submit" disabled={guardando}>
              {guardando ? "Guardando..." : "Actualizar Cliente"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
