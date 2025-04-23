
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Producto } from "@/types";

interface NuevoProductoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProductoCreado: (producto: Producto) => void;
}

export const NuevoProductoModal: React.FC<NuevoProductoModalProps> = ({
  open,
  onOpenChange,
  onProductoCreado,
}) => {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [stock, setStock] = useState(0);
  const [precio_minorista, setPrecioMinorista] = useState(0);
  const [precio_mayorista, setPrecioMayorista] = useState(0);
  const [descripcion, setDescripcion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Llama a la API de Supabase desde el cliente
      const { supabase } = await import("@/integrations/supabase/client");
      const { data, error } = await supabase
        .from("productos")
        .insert([
          {
            nombre,
            categoria,
            stock,
            precio_minorista,
            precio_mayorista,
            descripcion,
            activo: true
          },
        ])
        .select()
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "No se pudo crear el producto: " + error.message,
          variant: "destructive",
        });
      } else if (data) {
        toast({
          title: "Producto agregado",
          description: `Se agregó "${data.nombre}" correctamente.`,
        });
        onProductoCreado(data);
        onOpenChange(false);
        // Limpia el formulario
        setNombre("");
        setCategoria("");
        setStock(0);
        setPrecioMinorista(0);
        setPrecioMayorista(0);
        setDescripcion("");
      }
    } catch (err: any) {
      toast({
        title: "Error inesperado",
        description: err?.message || "Ocurrió un error desconocido.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Producto</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            required
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <Input
            placeholder="Categoría"
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Stock"
            value={stock}
            onChange={e => setStock(Number(e.target.value))}
            min={0}
            required
          />
          <Input
            type="number"
            placeholder="Precio minorista (Bs)"
            value={precio_minorista}
            onChange={e => setPrecioMinorista(Number(e.target.value))}
            min={0}
            step={0.01}
            required
          />
          <Input
            type="number"
            placeholder="Precio mayorista (Bs)"
            value={precio_mayorista}
            onChange={e => setPrecioMayorista(Number(e.target.value))}
            min={0}
            step={0.01}
            required
          />
          <Textarea
            placeholder="Descripción"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            rows={2}
          />
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
